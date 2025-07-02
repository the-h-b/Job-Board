'use client'

import DashboardLayout from '@/components/DashboardLayout'
import { useState } from 'react'
import { 
  Bell, 
  Search, 
  Filter, 
  Trash2, 
  Eye, 
  EyeOff,
  CheckCircle,
  AlertCircle,
  Info,
  MessageSquare,
  Users,
  Building2,
  Briefcase,
  Calendar,
  Plus
} from 'lucide-react'
import toast from 'react-hot-toast'

interface Notification {
  id: number
  title: string
  message: string
  type: 'info' | 'success' | 'warning' | 'error'
  category: 'application' | 'interview' | 'company' | 'system' | 'deadline'
  isRead: boolean
  timestamp: string
  sender?: string
  actionRequired?: boolean
}

const notificationsData: Notification[] = [
  {
    id: 1,
    title: 'New Job Application',
    message: 'Rahul Sharma has applied for Software Engineer position at TechCorp Solutions',
    type: 'info',
    category: 'application',
    isRead: false,
    timestamp: '2024-01-20T14:30:00Z',
    sender: 'TechCorp Solutions',
    actionRequired: true
  },
  {
    id: 2,
    title: 'Interview Scheduled',
    message: 'Interview scheduled for Software Engineer position on Jan 25, 2024 at 10:00 AM',
    type: 'success',
    category: 'interview',
    isRead: false,
    timestamp: '2024-01-20T13:15:00Z',
    sender: 'System',
    actionRequired: false
  },
  {
    id: 3,
    title: 'Application Deadline Approaching',
    message: 'Application deadline for Data Scientist position at Innovation Labs is in 2 days',
    type: 'warning',
    category: 'deadline',
    isRead: true,
    timestamp: '2024-01-20T12:00:00Z',
    sender: 'System',
    actionRequired: true
  },
  {
    id: 4,
    title: 'New Company Registration',
    message: 'CloudTech Inc has registered and is pending approval',
    type: 'info',
    category: 'company',
    isRead: false,
    timestamp: '2024-01-20T11:45:00Z',
    sender: 'System',
    actionRequired: true
  },
  {
    id: 5,
    title: 'System Maintenance',
    message: 'Scheduled system maintenance will occur on Jan 22, 2024 from 2:00 AM to 4:00 AM',
    type: 'warning',
    category: 'system',
    isRead: true,
    timestamp: '2024-01-20T10:30:00Z',
    sender: 'System Admin',
    actionRequired: false
  },
  {
    id: 6,
    title: 'Bulk Upload Completed',
    message: 'Student data bulk upload has been completed successfully. 156 records processed.',
    type: 'success',
    category: 'system',
    isRead: true,
    timestamp: '2024-01-20T09:15:00Z',
    sender: 'System',
    actionRequired: false
  },
  {
    id: 7,
    title: 'Interview Cancelled',
    message: 'Interview for Marketing Manager position has been cancelled by DataFlow Systems',
    type: 'error',
    category: 'interview',
    isRead: false,
    timestamp: '2024-01-20T08:00:00Z',
    sender: 'DataFlow Systems',
    actionRequired: true
  }
]

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>(notificationsData)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState('all')
  const [filterCategory, setFilterCategory] = useState('all')
  const [filterRead, setFilterRead] = useState('all')
  const [showCreateForm, setShowCreateForm] = useState(false)

  const [newNotification, setNewNotification] = useState({
    title: '',
    message: '',
    type: 'info' as Notification['type'],
    category: 'system' as Notification['category'],
    actionRequired: false
  })

  // Filter notifications
  const filteredNotifications = notifications.filter(notification => {
    const matchesSearch = notification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         notification.message.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = filterType === 'all' || notification.type === filterType
    const matchesCategory = filterCategory === 'all' || notification.category === filterCategory
    const matchesRead = filterRead === 'all' || 
                       (filterRead === 'read' && notification.isRead) ||
                       (filterRead === 'unread' && !notification.isRead)
    
    return matchesSearch && matchesType && matchesCategory && matchesRead
  })

  // Get notification counts
  const unreadCount = notifications.filter(n => !n.isRead).length
  const actionRequiredCount = notifications.filter(n => n.actionRequired && !n.isRead).length

  const handleMarkAsRead = (notificationId: number) => {
    setNotifications(notifications.map(notification => 
      notification.id === notificationId 
        ? { ...notification, isRead: true }
        : notification
    ))
    toast.success('Notification marked as read')
  }

  const handleMarkAsUnread = (notificationId: number) => {
    setNotifications(notifications.map(notification => 
      notification.id === notificationId 
        ? { ...notification, isRead: false }
        : notification
    ))
    toast.success('Notification marked as unread')
  }

  const handleDelete = (notificationId: number) => {
    if (confirm('Are you sure you want to delete this notification?')) {
      setNotifications(notifications.filter(notification => notification.id !== notificationId))
      toast.success('Notification deleted')
    }
  }

  const handleMarkAllAsRead = () => {
    setNotifications(notifications.map(notification => ({ ...notification, isRead: true })))
    toast.success('All notifications marked as read')
  }

  const handleDeleteAll = () => {
    if (confirm('Are you sure you want to delete all notifications?')) {
      setNotifications([])
      toast.success('All notifications deleted')
    }
  }

  const handleCreateNotification = (e: React.FormEvent) => {
    e.preventDefault()
    
    const notification: Notification = {
      id: Date.now(),
      ...newNotification,
      isRead: false,
      timestamp: new Date().toISOString(),
      sender: 'Admin'
    }

    setNotifications([notification, ...notifications])
    toast.success('Notification created successfully!')
    
    // Reset form
    setNewNotification({
      title: '',
      message: '',
      type: 'info',
      category: 'system',
      actionRequired: false
    })
    setShowCreateForm(false)
  }

  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'success': return <CheckCircle className="h-5 w-5 text-green-500" />
      case 'warning': return <AlertCircle className="h-5 w-5 text-yellow-500" />
      case 'error': return <AlertCircle className="h-5 w-5 text-red-500" />
      default: return <Info className="h-5 w-5 text-blue-500" />
    }
  }

  const getCategoryIcon = (category: Notification['category']) => {
    switch (category) {
      case 'application': return <Briefcase className="h-4 w-4" />
      case 'interview': return <Users className="h-4 w-4" />
      case 'company': return <Building2 className="h-4 w-4" />
      case 'deadline': return <Calendar className="h-4 w-4" />
      default: return <MessageSquare className="h-4 w-4" />
    }
  }

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))

    if (diffInMinutes < 60) {
      return `${diffInMinutes} minutes ago`
    } else if (diffInMinutes < 1440) {
      return `${Math.floor(diffInMinutes / 60)} hours ago`
    } else {
      return date.toLocaleDateString()
    }
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center">
              <Bell className="mr-3 h-8 w-8" />
              Notifications
            </h1>
            <p className="text-gray-600">Manage all system notifications and alerts</p>
          </div>
          <div className="flex space-x-3">
            <button 
              onClick={handleMarkAllAsRead}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Mark All Read
            </button>
            <button 
              onClick={() => setShowCreateForm(true)}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 flex items-center"
            >
              <Plus className="mr-2 h-4 w-4" />
              Create Notification
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-4">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Bell className="h-6 w-6 text-blue-600" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Total Notifications</dt>
                    <dd className="text-2xl font-semibold text-gray-900">{notifications.length}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <EyeOff className="h-6 w-6 text-red-600" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Unread</dt>
                    <dd className="text-2xl font-semibold text-gray-900">{unreadCount}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <AlertCircle className="h-6 w-6 text-orange-600" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Action Required</dt>
                    <dd className="text-2xl font-semibold text-gray-900">{actionRequiredCount}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Read</dt>
                    <dd className="text-2xl font-semibold text-gray-900">{notifications.length - unreadCount}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white shadow rounded-lg p-6">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-5">
            <div className="md:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder="Search notifications..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            
            <div>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Types</option>
                <option value="info">Info</option>
                <option value="success">Success</option>
                <option value="warning">Warning</option>
                <option value="error">Error</option>
              </select>
            </div>

            <div>
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Categories</option>
                <option value="application">Applications</option>
                <option value="interview">Interviews</option>
                <option value="company">Companies</option>
                <option value="deadline">Deadlines</option>
                <option value="system">System</option>
              </select>
            </div>

            <div>
              <select
                value={filterRead}
                onChange={(e) => setFilterRead(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All</option>
                <option value="unread">Unread</option>
                <option value="read">Read</option>
              </select>
            </div>
          </div>
        </div>

        {/* Notifications List */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
            <h3 className="text-lg font-medium text-gray-900">
              Notifications ({filteredNotifications.length})
            </h3>
            {notifications.length > 0 && (
              <button 
                onClick={handleDeleteAll}
                className="text-red-600 hover:text-red-900 text-sm"
              >
                Delete All
              </button>
            )}
          </div>
          
          <div className="divide-y divide-gray-200">
            {filteredNotifications.map((notification) => (
              <div 
                key={notification.id} 
                className={`p-6 hover:bg-gray-50 ${!notification.isRead ? 'bg-blue-50' : ''}`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3 flex-1">
                    <div className="flex-shrink-0 pt-1">
                      {getNotificationIcon(notification.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-1">
                        <h4 className={`text-sm font-medium ${!notification.isRead ? 'text-gray-900' : 'text-gray-700'}`}>
                          {notification.title}
                        </h4>
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                          {getCategoryIcon(notification.category)}
                          <span className="ml-1 capitalize">{notification.category}</span>
                        </span>
                        {notification.actionRequired && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                            Action Required
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{notification.message}</p>
                      <div className="flex items-center text-xs text-gray-500 space-x-4">
                        <span>{formatTimestamp(notification.timestamp)}</span>
                        {notification.sender && <span>From: {notification.sender}</span>}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2 ml-4">
                    <button
                      onClick={() => notification.isRead ? handleMarkAsUnread(notification.id) : handleMarkAsRead(notification.id)}
                      className="text-blue-600 hover:text-blue-900 p-1"
                      title={notification.isRead ? 'Mark as unread' : 'Mark as read'}
                    >
                      {notification.isRead ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                    <button
                      onClick={() => handleDelete(notification.id)}
                      className="text-red-600 hover:text-red-900 p-1"
                      title="Delete notification"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredNotifications.length === 0 && (
            <div className="text-center py-12">
              <Bell className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No notifications found</h3>
              <p className="mt-1 text-sm text-gray-500">Try adjusting your search or filter criteria.</p>
            </div>
          )}
        </div>

        {/* Create Notification Modal */}
        {showCreateForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Create New Notification</h3>
              <form onSubmit={handleCreateNotification} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                  <input
                    type="text"
                    required
                    value={newNotification.title}
                    onChange={(e) => setNewNotification(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                  <textarea
                    required
                    rows={3}
                    value={newNotification.message}
                    onChange={(e) => setNewNotification(prev => ({ ...prev, message: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                    <select
                      value={newNotification.type}
                      onChange={(e) => setNewNotification(prev => ({ ...prev, type: e.target.value as Notification['type'] }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="info">Info</option>
                      <option value="success">Success</option>
                      <option value="warning">Warning</option>
                      <option value="error">Error</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                    <select
                      value={newNotification.category}
                      onChange={(e) => setNewNotification(prev => ({ ...prev, category: e.target.value as Notification['category'] }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="system">System</option>
                      <option value="application">Application</option>
                      <option value="interview">Interview</option>
                      <option value="company">Company</option>
                      <option value="deadline">Deadline</option>
                    </select>
                  </div>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="actionRequired"
                    checked={newNotification.actionRequired}
                    onChange={(e) => setNewNotification(prev => ({ ...prev, actionRequired: e.target.checked }))}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="actionRequired" className="ml-2 block text-sm text-gray-900">
                    Action Required
                  </label>
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowCreateForm(false)}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Create Notification
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}