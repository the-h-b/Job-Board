'use client'

import DashboardLayout from '@/components/DashboardLayout'
import { useState } from 'react'
import { 
  GraduationCap, 
  Search, 
  Filter, 
  Mail, 
  Phone, 
  MapPin,
  Calendar,
  BookOpen,
  Award,
  Eye,
  Edit,
  Trash2,
  Download,
  FileText
} from 'lucide-react'
import toast from 'react-hot-toast'

const studentsData = [
  {
    id: 1,
    name: 'Rahul Sharma',
    email: 'rahul.sharma@email.com',
    phone: '+91 9876543210',
    location: 'Mumbai, India',
    college: 'IIT Mumbai',
    course: 'Computer Science Engineering',
    year: '4th Year',
    cgpa: '8.5',
    skills: ['JavaScript', 'React', 'Node.js', 'Python'],
    experience: 'Fresher',
    appliedJobs: 12,
    status: 'Active',
    registrationDate: '2024-01-15',
    lastLogin: '2024-01-20'
  },
  {
    id: 2,
    name: 'Priya Patel',
    email: 'priya.patel@email.com',
    phone: '+91 9876543211',
    location: 'Bangalore, India',
    college: 'BITS Pilani',
    course: 'Information Technology',
    year: '3rd Year',
    cgpa: '9.2',
    skills: ['Java', 'Spring Boot', 'MySQL', 'AWS'],
    experience: 'Fresher',
    appliedJobs: 8,
    status: 'Active',
    registrationDate: '2024-01-12',
    lastLogin: '2024-01-19'
  },
  {
    id: 3,
    name: 'Amit Kumar',
    email: 'amit.kumar@email.com',
    phone: '+91 9876543212',
    location: 'Delhi, India',
    college: 'DTU Delhi',
    course: 'Electronics Engineering',
    year: 'Graduate',
    cgpa: '7.8',
    skills: ['C++', 'Embedded Systems', 'IoT', 'Arduino'],
    experience: '1 Year',
    appliedJobs: 15,
    status: 'Active',
    registrationDate: '2024-01-10',
    lastLogin: '2024-01-18'
  },
  {
    id: 4,
    name: 'Sneha Reddy',
    email: 'sneha.reddy@email.com',
    phone: '+91 9876543213',
    location: 'Hyderabad, India',
    college: 'IIIT Hyderabad',
    course: 'Data Science',
    year: '2nd Year',
    cgpa: '9.0',
    skills: ['Python', 'Machine Learning', 'TensorFlow', 'R'],
    experience: 'Fresher',
    appliedJobs: 6,
    status: 'Active',
    registrationDate: '2024-01-08',
    lastLogin: '2024-01-20'
  },
  {
    id: 5,
    name: 'Vikram Singh',
    email: 'vikram.singh@email.com',
    phone: '+91 9876543214',
    location: 'Pune, India',
    college: 'Pune University',
    course: 'Mechanical Engineering',
    year: '4th Year',
    cgpa: '8.2',
    skills: ['AutoCAD', 'SolidWorks', 'MATLAB', 'Design'],
    experience: 'Fresher',
    appliedJobs: 10,
    status: 'Inactive',
    registrationDate: '2024-01-05',
    lastLogin: '2024-01-15'
  }
]

export default function StudentsPage() {
  const [students, setStudents] = useState(studentsData)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterCourse, setFilterCourse] = useState('all')
  const [filterYear, setFilterYear] = useState('all')
  const [filterStatus, setFilterStatus] = useState('all')

  // Get unique courses and years for filters
  const courses = [...new Set(students.map(student => student.course))]
  const years = [...new Set(students.map(student => student.year))]

  // Filter students
  const filteredStudents = students.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.college.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCourse = filterCourse === 'all' || student.course === filterCourse
    const matchesYear = filterYear === 'all' || student.year === filterYear
    const matchesStatus = filterStatus === 'all' || student.status.toLowerCase() === filterStatus.toLowerCase()
    
    return matchesSearch && matchesCourse && matchesYear && matchesStatus
  })

  const handleStatusToggle = (studentId: number) => {
    setStudents(students.map(student => 
      student.id === studentId 
        ? { ...student, status: student.status === 'Active' ? 'Inactive' : 'Active' }
        : student
    ))
    toast.success('Student status updated successfully!')
  }

  const handleDeleteStudent = (studentId: number) => {
    if (confirm('Are you sure you want to delete this student?')) {
      setStudents(students.filter(student => student.id !== studentId))
      toast.success('Student deleted successfully!')
    }
  }

  const handleDownloadProfile = (student: any) => {
    toast.success(`Downloading ${student.name}'s profile...`)
    // Here you would implement the actual download logic
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center">
              <GraduationCap className="mr-3 h-8 w-8" />
              Students Management
            </h1>
            <p className="text-gray-600">Manage all registered students</p>
          </div>
          <div className="flex space-x-3">
            <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 flex items-center">
              <Download className="mr-2 h-4 w-4" />
              Export All
            </button>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
              Add Student
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-4">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <GraduationCap className="h-6 w-6 text-blue-600" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Total Students</dt>
                    <dd className="text-2xl font-semibold text-gray-900">{students.length}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <GraduationCap className="h-6 w-6 text-green-600" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Active Students</dt>
                    <dd className="text-2xl font-semibold text-gray-900">
                      {students.filter(student => student.status === 'Active').length}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <FileText className="h-6 w-6 text-purple-600" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Total Applications</dt>
                    <dd className="text-2xl font-semibold text-gray-900">
                      {students.reduce((sum, student) => sum + student.appliedJobs, 0)}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Award className="h-6 w-6 text-orange-600" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Avg CGPA</dt>
                    <dd className="text-2xl font-semibold text-gray-900">
                      {(students.reduce((sum, student) => sum + parseFloat(student.cgpa), 0) / students.length).toFixed(1)}
                    </dd>
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
                  placeholder="Search students..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            
            <div>
              <select
                value={filterCourse}
                onChange={(e) => setFilterCourse(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Courses</option>
                {courses.map(course => (
                  <option key={course} value={course}>{course}</option>
                ))}
              </select>
            </div>

            <div>
              <select
                value={filterYear}
                onChange={(e) => setFilterYear(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Years</option>
                {years.map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </div>

            <div>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>
        </div>

        {/* Students Grid */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {filteredStudents.map((student) => (
            <div key={student.id} className="bg-white shadow rounded-lg overflow-hidden">
              <div className="p-6">
                {/* Student Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-lg font-semibold text-blue-600">
                        {student.name.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <div className="ml-3">
                      <h3 className="text-lg font-medium text-gray-900">{student.name}</h3>
                      <p className="text-sm text-gray-500">{student.course}</p>
                    </div>
                  </div>
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    student.status === 'Active' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {student.status}
                  </span>
                </div>

                {/* Student Details */}
                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <Mail className="mr-2 h-4 w-4" />
                    {student.email}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Phone className="mr-2 h-4 w-4" />
                    {student.phone}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <MapPin className="mr-2 h-4 w-4" />
                    {student.location}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <BookOpen className="mr-2 h-4 w-4" />
                    {student.college}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Calendar className="mr-2 h-4 w-4" />
                    {student.year} • CGPA: {student.cgpa}
                  </div>
                </div>

                {/* Skills */}
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-900 mb-2">Skills</h4>
                  <div className="flex flex-wrap gap-1">
                    {student.skills.map((skill, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4 mb-4 pt-4 border-t border-gray-200">
                  <div className="text-center">
                    <div className="text-xl font-semibold text-gray-900">{student.appliedJobs}</div>
                    <div className="text-xs text-gray-500">Applications</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xl font-semibold text-gray-900">{student.experience}</div>
                    <div className="text-xs text-gray-500">Experience</div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                  <div className="flex space-x-2">
                    <button 
                      onClick={() => handleDownloadProfile(student)}
                      className="text-green-600 hover:text-green-900 p-1"
                      title="Download Profile"
                    >
                      <Download className="h-4 w-4" />
                    </button>
                    <button className="text-blue-600 hover:text-blue-900 p-1" title="View Details">
                      <Eye className="h-4 w-4" />
                    </button>
                    <button className="text-indigo-600 hover:text-indigo-900 p-1" title="Edit">
                      <Edit className="h-4 w-4" />
                    </button>
                    <button 
                      onClick={() => handleDeleteStudent(student.id)}
                      className="text-red-600 hover:text-red-900 p-1"
                      title="Delete"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                  
                  <button 
                    onClick={() => handleStatusToggle(student.id)}
                    className={`px-3 py-1 text-xs font-medium rounded ${
                      student.status === 'Active'
                        ? 'bg-red-100 text-red-700 hover:bg-red-200'
                        : 'bg-green-100 text-green-700 hover:bg-green-200'
                    }`}
                  >
                    {student.status === 'Active' ? 'Deactivate' : 'Activate'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredStudents.length === 0 && (
          <div className="text-center py-12">
            <GraduationCap className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No students found</h3>
            <p className="mt-1 text-sm text-gray-500">
              Try adjusting your search or filter criteria.
            </p>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}