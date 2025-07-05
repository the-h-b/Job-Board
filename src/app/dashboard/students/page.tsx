'use client'

import DashboardLayout from '@/components/DashboardLayout'
import { useState, useEffect, useCallback } from 'react'
import {
  GraduationCap,
  Search,
  Mail,
  Phone,
  Calendar,
  BookOpen,
  Award,
  Eye,
  Edit,
  Trash2,
  Download,
  FileText,
  AlertCircle,
  Loader
} from 'lucide-react'
import toast from 'react-hot-toast'
import { studentsApi } from '@/lib/api'

interface Student {
  _id: string
  personalInfo: {
    firstName: string
    lastName: string
    email: string
    phone?: string
    dateOfBirth?: Date
    gender?: 'Male' | 'Female' | 'Other'
  }
  academicInfo: {
    course: string
    specialization?: string
    year: number
    cgpa?: number
    university: string
    graduationYear: number
  }
  skills: string[]
  experience?: {
    company: string
    position: string
    duration: string
    description?: string
  }[]
  resume?: {
    filename: string
    url: string
    uploadedAt: Date
  }
  isActive: boolean
  createdAt: Date
  updatedAt: Date
  applicationCount: number
}

export default function StudentsPage() {
  const [students, setStudents] = useState<Student[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterCourse, setFilterCourse] = useState('all')
  const [filterYear, setFilterYear] = useState('all')
  const [filterStatus, setFilterStatus] = useState('all')
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, pages: 0 })
  const [stats, setStats] = useState({ totalApplications: 0, averageCGPA: 0 })

  const fetchStudents = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      const params = new URLSearchParams({
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
        ...(searchTerm && { search: searchTerm }),
        ...(filterCourse !== 'all' && { course: filterCourse }),
        ...(filterYear !== 'all' && { graduationYear: filterYear })
      })

      if (filterStatus !== 'all') {
        params.append('isActive', (filterStatus === 'active').toString())
      }

      const response = await studentsApi.getAll(params)
      setStudents(response.students || [])
      setPagination(response.pagination || { page: 1, limit: 10, total: 0, pages: 0 })
      setStats(response.stats || { totalApplications: 0, averageCGPA: 0 })
    } catch (err) {
      const error = err as Error
      setError(error.message || 'Failed to fetch students')
      toast.error('Failed to load students')
    } finally {
      setLoading(false)
    }
  }, [searchTerm, filterCourse, filterYear, filterStatus, pagination.page, pagination.limit])

  useEffect(() => {
    fetchStudents()
  }, [fetchStudents])

  const courses = [...new Set(students.map(student => student.academicInfo.course))]
  const years = [...new Set(students.map(student => student.academicInfo.graduationYear))]

  const handleStatusToggle = async (studentId: string) => {
    try {
      const student = students.find(s => s._id === studentId)
      if (!student) return

      await studentsApi.update(studentId, { isActive: !student.isActive })
      setStudents(students.map(s =>
        s._id === studentId ? { ...s, isActive: !s.isActive } : s
      ))
      toast.success('Student status updated successfully!')
    } catch {
      toast.error('Failed to update student status')
    }
  }

  const handleDeleteStudent = async (studentId: string) => {
    if (!confirm('Are you sure you want to delete this student?')) return

    try {
      await studentsApi.delete(studentId)
      setStudents(students.filter(student => student._id !== studentId))
      toast.success('Student deleted successfully!')
    } catch {
      toast.error('Failed to delete student')
    }
  }

  const handleDownloadProfile = (student: Student) => {
    const fullName = `${student.personalInfo.firstName} ${student.personalInfo.lastName}`
    toast.success(`Downloading ${fullName}'s profile...`)
  }

  const getExperienceLevel = (student: Student) => {
    if (!student.experience || student.experience.length === 0) return 'Fresher'
    return `${student.experience.length} Year${student.experience.length > 1 ? 's' : ''}`
  }

  const getTotalApplications = () => {
    return stats.totalApplications
  }

  const getAverageCGPA = () => {
    return stats.averageCGPA.toFixed(1)
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
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
                    <dd className="text-2xl font-semibold text-gray-900">{pagination.total}</dd>
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
                      {students.filter(student => student.isActive).length}
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
                      {getTotalApplications()}
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
                      {getAverageCGPA()}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>

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

        {loading && (
          <div className="flex justify-center items-center py-12">
            <Loader className="h-8 w-8 animate-spin text-blue-600" />
            <span className="ml-2 text-gray-600">Loading students...</span>
          </div>
        )}

        {error && (
          <div className="text-center py-12">
            <AlertCircle className="mx-auto h-12 w-12 text-red-500" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">Error loading students</h3>
            <p className="mt-1 text-sm text-gray-500">{error}</p>
            <button
              onClick={fetchStudents}
              className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
            >
              Try Again
            </button>
          </div>
        )}

        {!loading && !error && (
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {students.map((student) => {
              const fullName = `${student.personalInfo.firstName} ${student.personalInfo.lastName}`
              const initials = `${student.personalInfo.firstName[0]}${student.personalInfo.lastName[0]}`

              return (
                <div key={student._id} className="bg-white shadow rounded-lg overflow-hidden">
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-lg font-semibold text-blue-600">
                            {initials}
                          </span>
                        </div>
                        <div className="ml-3">
                          <h3 className="text-lg font-medium text-gray-900">{fullName}</h3>
                          <p className="text-sm text-gray-500">{student.academicInfo.course}</p>
                        </div>
                      </div>
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        student.isActive
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {student.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>

                    <div className="space-y-2 mb-4">
                      <div className="flex items-center text-sm text-gray-600">
                        <Mail className="mr-2 h-4 w-4" />
                        {student.personalInfo.email}
                      </div>
                      {student.personalInfo.phone && (
                        <div className="flex items-center text-sm text-gray-600">
                          <Phone className="mr-2 h-4 w-4" />
                          {student.personalInfo.phone}
                        </div>
                      )}
                      <div className="flex items-center text-sm text-gray-600">
                        <BookOpen className="mr-2 h-4 w-4" />
                        {student.academicInfo.university}
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <Calendar className="mr-2 h-4 w-4" />
                        Year {student.academicInfo.year}
                        {student.academicInfo.cgpa && ` • CGPA: ${student.academicInfo.cgpa}`}
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <GraduationCap className="mr-2 h-4 w-4" />
                        Graduation: {student.academicInfo.graduationYear}
                      </div>
                    </div>

                    {student.skills.length > 0 && (
                      <div className="mb-4">
                        <h4 className="text-sm font-medium text-gray-900 mb-2">Skills</h4>
                        <div className="flex flex-wrap gap-1">
                          {student.skills.slice(0, 6).map((skill, index) => (
                            <span
                              key={index}
                              className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                            >
                              {skill}
                            </span>
                          ))}
                          {student.skills.length > 6 && (
                            <span className="text-xs text-gray-500">+{student.skills.length - 6} more</span>
                          )}
                        </div>
                      </div>
                    )}

                    <div className="grid grid-cols-2 gap-4 mb-4 pt-4 border-t border-gray-200">
                      <div className="text-center">
                        <div className="text-xl font-semibold text-gray-900">{student.applicationCount || 0}</div>
                        <div className="text-xs text-gray-500">Applications</div>
                      </div>
                      <div className="text-center">
                        <div className="text-xl font-semibold text-gray-900">{getExperienceLevel(student)}</div>
                        <div className="text-xs text-gray-500">Experience</div>
                      </div>
                    </div>

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
                          onClick={() => handleDeleteStudent(student._id)}
                          className="text-red-600 hover:text-red-900 p-1"
                          title="Delete"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>

                      <button
                        onClick={() => handleStatusToggle(student._id)}
                        className={`px-3 py-1 text-xs font-medium rounded ${
                          student.isActive
                            ? 'bg-red-100 text-red-700 hover:bg-red-200'
                            : 'bg-green-100 text-green-700 hover:bg-green-200'
                        }`}
                      >
                        {student.isActive ? 'Deactivate' : 'Activate'}
                      </button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {students.length === 0 && !loading && !error && (
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