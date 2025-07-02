'use client'

import DashboardLayout from '@/components/DashboardLayout'
import { useState } from 'react'
import Calendar from 'react-calendar'
import 'react-calendar/dist/Calendar.css'
import { 
  Calendar as CalendarIcon, 
  Plus, 
  Edit, 
  Trash2, 
  Clock,
  MapPin,
  Users,
  Briefcase,
  AlertCircle
} from 'lucide-react'
import toast from 'react-hot-toast'

type ValuePiece = Date | null
type Value = ValuePiece | [ValuePiece, ValuePiece]

interface Event {
  id: number
  title: string
  date: string
  time: string
  type: 'interview' | 'deadline' | 'meeting' | 'webinar'
  description: string
  location?: string
  attendees?: number
  company?: string
  status: 'upcoming' | 'completed' | 'cancelled'
}

const eventsData: Event[] = [
  {
    id: 1,
    title: 'Technical Interview - TechCorp',
    date: '2024-01-25',
    time: '10:00 AM',
    type: 'interview',
    description: 'Technical interview for Software Engineer position',
    location: 'Online - Google Meet',
    attendees: 5,
    company: 'TechCorp Solutions',
    status: 'upcoming'
  },
  {
    id: 2,
    title: 'Job Application Deadline',
    date: '2024-01-30',
    time: '11:59 PM',
    type: 'deadline',
    description: 'Application deadline for Data Scientist position',
    company: 'Innovation Labs',
    status: 'upcoming'
  },
  {
    id: 3,
    title: 'Career Fair Planning Meeting',
    date: '2024-01-28',
    time: '2:00 PM',
    type: 'meeting',
    description: 'Planning meeting for upcoming career fair',
    location: 'Conference Room A',
    attendees: 8,
    status: 'upcoming'
  },
  {
    id: 4,
    title: 'AI/ML Webinar',
    date: '2024-02-02',
    time: '4:00 PM',
    type: 'webinar',
    description: 'Webinar on latest trends in AI and Machine Learning',
    location: 'Online - Zoom',
    attendees: 150,
    status: 'upcoming'
  },
  {
    id: 5,
    title: 'HR Interview - FinanceMax',
    date: '2024-01-22',
    time: '3:00 PM',
    type: 'interview',
    description: 'HR interview for Finance Analyst position',
    location: 'Office - Room 201',
    company: 'FinanceMax',
    status: 'completed'
  }
]

export default function CalendarPage() {
  const [date, setDate] = useState<Value>(new Date())
  const [events, setEvents] = useState<Event[]>(eventsData)
  const [selectedDate, setSelectedDate] = useState<string>('')
  const [showEventForm, setShowEventForm] = useState(false)
  const [editingEvent, setEditingEvent] = useState<Event | null>(null)

  const [eventForm, setEventForm] = useState({
    title: '',
    date: '',
    time: '',
    type: 'meeting' as Event['type'],
    description: '',
    location: '',
    company: ''
  })

  // Get events for selected date
  const getEventsForDate = (dateStr: string) => {
    return events.filter(event => event.date === dateStr)
  }

  // Get upcoming events
  const upcomingEvents = events
    .filter(event => event.status === 'upcoming')
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 5)

  const handleDateClick = (value: Value) => {
    setDate(value)
    if (value instanceof Date) {
      const dateStr = value.toISOString().split('T')[0]
      setSelectedDate(dateStr)
    }
  }

  const handleEventSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (editingEvent) {
      // Update existing event
      setEvents(events.map(event => 
        event.id === editingEvent.id 
          ? { ...event, ...eventForm, id: editingEvent.id, status: 'upcoming' as const }
          : event
      ))
      toast.success('Event updated successfully!')
    } else {
      // Create new event
      const newEvent: Event = {
        id: Date.now(),
        ...eventForm,
        attendees: 0,
        status: 'upcoming'
      }
      setEvents([...events, newEvent])
      toast.success('Event created successfully!')
    }

    // Reset form
    setEventForm({
      title: '',
      date: '',
      time: '',
      type: 'meeting',
      description: '',
      location: '',
      company: ''
    })
    setShowEventForm(false)
    setEditingEvent(null)
  }

  const handleEditEvent = (event: Event) => {
    setEditingEvent(event)
    setEventForm({
      title: event.title,
      date: event.date,
      time: event.time,
      type: event.type,
      description: event.description,
      location: event.location || '',
      company: event.company || ''
    })
    setShowEventForm(true)
  }

  const handleDeleteEvent = (eventId: number) => {
    if (confirm('Are you sure you want to delete this event?')) {
      setEvents(events.filter(event => event.id !== eventId))
      toast.success('Event deleted successfully!')
    }
  }

  const getEventTypeColor = (type: Event['type']) => {
    switch (type) {
      case 'interview': return 'bg-blue-100 text-blue-800'
      case 'deadline': return 'bg-red-100 text-red-800'
      case 'meeting': return 'bg-green-100 text-green-800'
      case 'webinar': return 'bg-purple-100 text-purple-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getEventTypeIcon = (type: Event['type']) => {
    switch (type) {
      case 'interview': return <Users className="h-4 w-4" />
      case 'deadline': return <AlertCircle className="h-4 w-4" />
      case 'meeting': return <Users className="h-4 w-4" />
      case 'webinar': return <Briefcase className="h-4 w-4" />
      default: return <CalendarIcon className="h-4 w-4" />
    }
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center">
              <CalendarIcon className="mr-3 h-8 w-8" />
              Calendar
            </h1>
            <p className="text-gray-600">Manage events, interviews, and deadlines</p>
          </div>
          <button 
            onClick={() => setShowEventForm(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Event
          </button>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Calendar */}
          <div className="lg:col-span-2">
            <div className="bg-white shadow rounded-lg p-6">
              <div className="calendar-container">
                <Calendar
                  onChange={handleDateClick}
                  value={date}
                  className="w-full"
                  tileContent={({ date: tileDate, view }) => {
                    if (view === 'month') {
                      const dateStr = tileDate.toISOString().split('T')[0]
                      const dayEvents = getEventsForDate(dateStr)
                      if (dayEvents.length > 0) {
                        return (
                          <div className="flex justify-center mt-1">
                            <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                          </div>
                        )
                      }
                    }
                    return null
                  }}
                />
              </div>
            </div>

            {/* Events for Selected Date */}
            {selectedDate && (
              <div className="bg-white shadow rounded-lg p-6 mt-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Events for {new Date(selectedDate).toLocaleDateString()}
                </h3>
                <div className="space-y-3">
                  {getEventsForDate(selectedDate).map((event) => (
                    <div key={event.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900">{event.title}</h4>
                          <div className="flex items-center text-sm text-gray-500 mt-1">
                            <Clock className="mr-1 h-4 w-4" />
                            {event.time}
                            {event.location && (
                              <>
                                <MapPin className="ml-3 mr-1 h-4 w-4" />
                                {event.location}
                              </>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getEventTypeColor(event.type)}`}>
                            {getEventTypeIcon(event.type)}
                            <span className="ml-1 capitalize">{event.type}</span>
                          </span>
                          <button 
                            onClick={() => handleEditEvent(event)}
                            className="text-blue-600 hover:text-blue-900"
                            title="Edit Event"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button 
                            onClick={() => handleDeleteEvent(event.id)}
                            className="text-red-600 hover:text-red-900"
                            title="Delete Event"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600">{event.description}</p>
                    </div>
                  ))}
                  {getEventsForDate(selectedDate).length === 0 && (
                    <p className="text-gray-500 text-center py-4">No events scheduled for this date</p>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Upcoming Events */}
            <div className="bg-white shadow rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Upcoming Events</h3>
              <div className="space-y-3">
                {upcomingEvents.map((event) => (
                  <div key={event.id} className="border-l-4 border-blue-500 pl-4 py-2">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900 text-sm">{event.title}</h4>
                        <div className="flex items-center text-xs text-gray-500 mt-1">
                          <CalendarIcon className="mr-1 h-3 w-3" />
                          {new Date(event.date).toLocaleDateString()}
                          <Clock className="ml-2 mr-1 h-3 w-3" />
                          {event.time}
                        </div>
                      </div>
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getEventTypeColor(event.type)}`}>
                        {event.type}
                      </span>
                    </div>
                  </div>
                ))}
                {upcomingEvents.length === 0 && (
                  <p className="text-gray-500 text-sm">No upcoming events</p>
                )}
              </div>
            </div>

            {/* Event Statistics */}
            <div className="bg-white shadow rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Event Statistics</h3>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Total Events</span>
                  <span className="font-medium">{events.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Interviews</span>
                  <span className="font-medium">{events.filter(e => e.type === 'interview').length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Deadlines</span>
                  <span className="font-medium">{events.filter(e => e.type === 'deadline').length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Meetings</span>
                  <span className="font-medium">{events.filter(e => e.type === 'meeting').length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Webinars</span>
                  <span className="font-medium">{events.filter(e => e.type === 'webinar').length}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Event Form Modal */}
        {showEventForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                {editingEvent ? 'Edit Event' : 'Create New Event'}
              </h3>
              <form onSubmit={handleEventSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                  <input
                    type="text"
                    required
                    value={eventForm.title}
                    onChange={(e) => setEventForm(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Enter event title"
                    title="Event Title"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                    <input
                      type="date"
                      required
                      value={eventForm.date}
                      onChange={(e) => setEventForm(prev => ({ ...prev, date: e.target.value }))}
                      placeholder="Select date"
                      title="Event Date"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
                    <input
                      type="text"
                      required
                      value={eventForm.time}
                      onChange={(e) => setEventForm(prev => ({ ...prev, time: e.target.value }))}
                      placeholder="10:00 AM"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="event-type" className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                  <select
                    id="event-type"
                    value={eventForm.type}
                    onChange={(e) => setEventForm(prev => ({ ...prev, type: e.target.value as Event['type'] }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="meeting">Meeting</option>
                    <option value="interview">Interview</option>
                    <option value="deadline">Deadline</option>
                    <option value="webinar">Webinar</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                  <input
                    type="text"
                    value={eventForm.location}
                    onChange={(e) => setEventForm(prev => ({ ...prev, location: e.target.value }))}
                    placeholder="Enter location"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Company</label>
                  <input
                    type="text"
                    value={eventForm.company}
                    onChange={(e) => setEventForm(prev => ({ ...prev, company: e.target.value }))}
                    placeholder="Enter company"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    rows={3}
                    value={eventForm.description}
                    onChange={(e) => setEventForm(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Enter event description"
                    title="Event Description"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowEventForm(false)
                      setEditingEvent(null)
                      setEventForm({
                        title: '',
                        date: '',
                        time: '',
                        type: 'meeting',
                        description: '',
                        location: '',
                        company: ''
                      })
                    }}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    {editingEvent ? 'Update' : 'Create'} Event
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>

      <style jsx global>{`
        .react-calendar {
          width: 100% !important;
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          font-family: inherit;
        }
        
        .react-calendar__tile {
          background: none;
          border: none;
          padding: 0.75rem 0.5rem;
        }
        
        .react-calendar__tile:enabled:hover,
        .react-calendar__tile:enabled:focus {
          background-color: #f3f4f6;
        }
        
        .react-calendar__tile--active {
          background: #3b82f6 !important;
          color: white;
        }
        
        .react-calendar__tile--now {
          background: #dbeafe;
        }
        
        .react-calendar__navigation button {
          color: #374151;
          min-width: 44px;
          background: none;
          font-size: 16px;
          margin-top: 8px;
        }
        
        .react-calendar__navigation button:enabled:hover,
        .react-calendar__navigation button:enabled:focus {
          background-color: #f3f4f6;
        }
      `}</style>
    </DashboardLayout>
  )
}