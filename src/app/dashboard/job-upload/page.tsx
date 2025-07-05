'use client'

import DashboardLayout from '@/components/DashboardLayout'
import { useState, useEffect, useCallback } from 'react'
import { 
  Briefcase, 
  Building2, 
  MapPin, 
  Calendar, 
  Search,
  Plus,
  Eye,
  Trash2,
  AlertCircle,
  Loader,
  Users,
  CalendarDays
} from 'lucide-react'
import toast from 'react-hot-toast'
import { jobsApi, companiesApi } from '@/lib/api'
import AuthDebugger from '@/components/AuthDebugger'

import { CompanyData, JobData } from '@/lib/api'

export default function JobUploadPage() {
  const [activeTab, setActiveTab] = useState<'create' | 'manage'>('create')
  const [companies, setCompanies] = useState<CompanyData[]>([])
  const [jobs, setJobs] = useState<JobData[]>([])
  const [loading, setLoading] = useState(false)
  const [jobsLoading, setJobsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState('all')
  const [filterLocation, setFilterLocation] = useState('all')
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, pages: 0 })
  
  const [formData, setFormData] = useState({
    title: '',
    company: '',
    description: '',
    requirements: '',
    location: '',
    jobType: 'Full-time' as const,
    experienceLevel: 'Entry Level' as const,
    salary: {
      min: '',
      max: '',
      currency: 'INR',
      period: 'Yearly' as const
    },
    skills: '',
    benefits: '',
    applicationDeadline: ''
  })

  // Fetch companies for dropdown
  const fetchCompanies = useCallback(async () => {
    try {
      const response = await companiesApi.getAll()
      setCompanies(response.companies || [])
    } catch (err) {
      console.error('Error fetching companies:', err)
    }
  }, [])

  // Fetch jobs for management
  const fetchJobs = useCallback(async () => {
    try {
      setJobsLoading(true)
      setError(null)
      
      const params = new URLSearchParams({
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
        ...(searchTerm && { search: searchTerm }),
        ...(filterType !== 'all' && { jobType: filterType }),
        ...(filterLocation !== 'all' && { location: filterLocation })
      })
      
      const response = await jobsApi.getAll(params)
      setJobs(response.jobs || [])
      setPagination(response.pagination || { page: 1, limit: 10, total: 0, pages: 0 })
    } catch (err) {
      const error = err as Error
      setError(error.message || 'Failed to fetch jobs')
      toast.error('Failed to load jobs')
    } finally {
      setJobsLoading(false)
    }
  }, [searchTerm, filterType, filterLocation, pagination.page, pagination.limit])

  useEffect(() => {
    fetchCompanies()
  }, [fetchCompanies])

  useEffect(() => {
    if (activeTab === 'manage') {
      fetchJobs()
    }
  }, [activeTab, fetchJobs])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    
    if (name.startsWith('salary.')) {
      const salaryField = name.split('.')[1]
      setFormData(prev => ({
        ...prev,
        salary: {
          ...prev.salary,
          [salaryField]: value
        }
      }))
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      setLoading(true)
      
      // Prepare job data
      const jobData = {
        title: formData.title,
        company: formData.company, // This should be the company ID from the form
        description: formData.description,
        requirements: formData.requirements.split('\n').filter(req => req.trim() !== ''),
        location: formData.location,
        jobType: formData.jobType,
        experienceLevel: formData.experienceLevel,
        skills: formData.skills.split(',').map(skill => skill.trim()).filter(skill => skill !== ''),
        benefits: formData.benefits ? formData.benefits.split('\n').filter(benefit => benefit.trim() !== '') : [],
        applicationDeadline: formData.applicationDeadline ? new Date(formData.applicationDeadline) : undefined,
        salary: formData.salary.min && formData.salary.max ? {
          min: parseInt(formData.salary.min),
          max: parseInt(formData.salary.max),
          currency: formData.salary.currency,
          period: formData.salary.period
        } : undefined
      }
      
      await jobsApi.create(jobData)
      toast.success('Job posted successfully!')
      
      // Reset form
      setFormData({
        title: '',
        company: '',
        description: '',
        requirements: '',
        location: '',
        jobType: 'Full-time',
        experienceLevel: 'Entry Level',
        salary: {
          min: '',
          max: '',
          currency: 'INR',
          period: 'Yearly'
        },
        skills: '',
        benefits: '',
        applicationDeadline: ''
      })
      
      // Switch to manage tab to see the new job
      setActiveTab('manage')
    } catch (err) {
      const error = err as Error
      toast.error(error.message || 'Failed to create job')
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteJob = async (jobId: string) => {
    if (!confirm('Are you sure you want to delete this job?')) return
    
    try {
      await jobsApi.delete(jobId)
      setJobs(jobs.filter(job => job._id !== jobId))
      toast.success('Job deleted successfully!')
    } catch {
      toast.error('Failed to delete job')
    }
  }

  const handleToggleJobStatus = async (jobId: string) => {
    try {
      const job = jobs.find(j => j._id === jobId)
      if (!job) return
      
      await jobsApi.update(jobId, { isActive: !job.isActive })
      setJobs(jobs.map(j => 
        j._id === jobId ? { ...j, isActive: !j.isActive } : j
      ))
      toast.success('Job status updated successfully!')
    } catch {
      toast.error('Failed to update job status')
    }
  }

  const formatSalary = (salary: JobData['salary']) => {
    if (!salary) return 'Not specified'
    return `${salary.currency} ${salary.min.toLocaleString()} - ${salary.max.toLocaleString()} ${salary.period}`
  }

  const getJobTypeColor = (type: string) => {
    switch (type) {
      case 'Full-time': return 'bg-blue-100 text-blue-800'
      case 'Part-time': return 'bg-green-100 text-green-800'
      case 'Contract': return 'bg-orange-100 text-orange-800'
      case 'Internship': return 'bg-purple-100 text-purple-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getExperienceLevelColor = (level: string) => {
    switch (level) {
      case 'Entry Level': return 'bg-emerald-100 text-emerald-800'
      case 'Mid Level': return 'bg-yellow-100 text-yellow-800'
      case 'Senior Level': return 'bg-red-100 text-red-800'
      case 'Executive': return 'bg-purple-100 text-purple-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <DashboardLayout>
      <AuthDebugger />
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center">
              <Briefcase className="mr-3 h-8 w-8" />
              Job Management
            </h1>
            <p className="text-gray-600">Create and manage job postings</p>
          </div>
          
          {/* Tab Navigation */}
          <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
            <button
              onClick={() => setActiveTab('create')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'create'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Plus className="w-4 h-4 mr-2 inline" />
              Create Job
            </button>
            <button
              onClick={() => setActiveTab('manage')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'manage'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Eye className="w-4 h-4 mr-2 inline" />
              Manage Jobs
            </button>
          </div>
        </div>

        {/* Create Job Tab */}
        {activeTab === 'create' && (
          <div className="bg-white shadow rounded-lg">
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* Basic Information */}
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                    Job Title *
                  </label>
                  <input
                    type="text"
                    name="title"
                    id="title"
                    required
                    value={formData.title}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g. Senior Software Engineer"
                  />
                </div>

                <div>
                  <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-1">
                    Company *
                  </label>
                  <div className="relative">
                    <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <select
                      name="company"
                      id="company"
                      required
                      value={formData.company}
                      onChange={handleChange}
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Select a company</option>
                      {companies.map(company => (
                        <option key={company._id} value={company._id}>
                          {company.name} - {company.location}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
                    Location *
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <input
                      type="text"
                      name="location"
                      id="location"
                      required
                      value={formData.location}
                      onChange={handleChange}
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="e.g. Mumbai, India"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="jobType" className="block text-sm font-medium text-gray-700 mb-1">
                    Job Type *
                  </label>
                  <select
                    name="jobType"
                    id="jobType"
                    required
                    value={formData.jobType}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="Full-time">Full-time</option>
                    <option value="Part-time">Part-time</option>
                    <option value="Contract">Contract</option>
                    <option value="Internship">Internship</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="experienceLevel" className="block text-sm font-medium text-gray-700 mb-1">
                    Experience Level *
                  </label>
                  <select
                    name="experienceLevel"
                    id="experienceLevel"
                    required
                    value={formData.experienceLevel}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="Entry Level">Entry Level</option>
                    <option value="Mid Level">Mid Level</option>
                    <option value="Senior Level">Senior Level</option>
                    <option value="Executive">Executive</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="applicationDeadline" className="block text-sm font-medium text-gray-700 mb-1">
                    Application Deadline
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <input
                      type="date"
                      name="applicationDeadline"
                      id="applicationDeadline"
                      value={formData.applicationDeadline}
                      onChange={handleChange}
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>

              {/* Salary Information */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Salary Range (Optional)
                </label>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
                  <div>
                    <label htmlFor="salary.min" className="block text-xs font-medium text-gray-500 mb-1">
                      Minimum
                    </label>
                    <input
                      type="number"
                      name="salary.min"
                      id="salary.min"
                      value={formData.salary.min}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="50000"
                    />
                  </div>
                  <div>
                    <label htmlFor="salary.max" className="block text-xs font-medium text-gray-500 mb-1">
                      Maximum
                    </label>
                    <input
                      type="number"
                      name="salary.max"
                      id="salary.max"
                      value={formData.salary.max}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="80000"
                    />
                  </div>
                  <div>
                    <label htmlFor="salary.currency" className="block text-xs font-medium text-gray-500 mb-1">
                      Currency
                    </label>
                    <select
                      name="salary.currency"
                      id="salary.currency"
                      value={formData.salary.currency}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="INR">INR</option>
                      <option value="USD">USD</option>
                      <option value="EUR">EUR</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="salary.period" className="block text-xs font-medium text-gray-500 mb-1">
                      Period
                    </label>
                    <select
                      name="salary.period"
                      id="salary.period"
                      value={formData.salary.period}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="Yearly">Yearly</option>
                      <option value="Monthly">Monthly</option>
                      <option value="Hourly">Hourly</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Skills */}
              <div>
                <label htmlFor="skills" className="block text-sm font-medium text-gray-700 mb-1">
                  Required Skills
                </label>
                <input
                  type="text"
                  name="skills"
                  id="skills"
                  value={formData.skills}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g. JavaScript, React, Node.js (comma-separated)"
                />
              </div>

              {/* Description */}
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                  Job Description *
                </label>
                <textarea
                  name="description"
                  id="description"
                  required
                  rows={4}
                  value={formData.description}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Describe the role, responsibilities, and what you're looking for..."
                />
              </div>

              {/* Requirements */}
              <div>
                <label htmlFor="requirements" className="block text-sm font-medium text-gray-700 mb-1">
                  Requirements *
                </label>
                <textarea
                  name="requirements"
                  id="requirements"
                  required
                  rows={4}
                  value={formData.requirements}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="List the skills, qualifications, and experience required (one per line)..."
                />
              </div>

              {/* Benefits */}
              <div>
                <label htmlFor="benefits" className="block text-sm font-medium text-gray-700 mb-1">
                  Benefits & Perks
                </label>
                <textarea
                  name="benefits"
                  id="benefits"
                  rows={3}
                  value={formData.benefits}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="List the benefits, perks, and company culture highlights (one per line)..."
                />
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end space-x-3 pt-6 border-t">
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                >
                  {loading ? (
                    <>
                      <Loader className="animate-spin mr-2 h-4 w-4" />
                      Posting...
                    </>
                  ) : (
                    <>
                      <Plus className="mr-2 h-4 w-4" />
                      Post Job
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Manage Jobs Tab */}
        {activeTab === 'manage' && (
          <div className="space-y-6">
            {/* Filters */}
            <div className="bg-white shadow rounded-lg p-6">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <div>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <input
                      type="text"
                      placeholder="Search jobs..."
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
                    <option value="all">All Job Types</option>
                    <option value="Full-time">Full-time</option>
                    <option value="Part-time">Part-time</option>
                    <option value="Contract">Contract</option>
                    <option value="Internship">Internship</option>
                  </select>
                </div>

                <div>
                  <select
                    value={filterLocation}
                    onChange={(e) => setFilterLocation(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="all">All Locations</option>
                    {/* Dynamic locations would go here */}
                  </select>
                </div>
              </div>
            </div>

            {/* Loading State */}
            {jobsLoading && (
              <div className="flex justify-center items-center py-12">
                <Loader className="h-8 w-8 animate-spin text-blue-600" />
                <span className="ml-2 text-gray-600">Loading jobs...</span>
              </div>
            )}

            {/* Error State */}
            {error && (
              <div className="text-center py-12">
                <AlertCircle className="mx-auto h-12 w-12 text-red-500" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">Error loading jobs</h3>
                <p className="mt-1 text-sm text-gray-500">{error}</p>
                <button
                  onClick={fetchJobs}
                  className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
                >
                  Try Again
                </button>
              </div>
            )}

            {/* Jobs List */}
            {!jobsLoading && !error && (
              <div className="space-y-4">
                {jobs.length === 0 ? (
                  <div className="text-center py-12">
                    <Briefcase className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900">No jobs found</h3>
                    <p className="mt-1 text-sm text-gray-500">Get started by creating a new job posting.</p>
                  </div>
                ) : (
                  jobs.map((job) => (
                    <div key={job._id} className="bg-white shadow rounded-lg p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3">
                            <h3 className="text-lg font-medium text-gray-900">{job.title}</h3>
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              job.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                            }`}>
                              {job.isActive ? 'Active' : 'Inactive'}
                            </span>
                          </div>
                          
                          <div className="mt-2 flex items-center space-x-4 text-sm text-gray-500">
                            <div className="flex items-center">
                              <Building2 className="h-4 w-4 mr-1" />
                              {job.company.name}
                            </div>
                            <div className="flex items-center">
                              <MapPin className="h-4 w-4 mr-1" />
                              {job.location}
                            </div>
                            <div className="flex items-center">
                              <CalendarDays className="h-4 w-4 mr-1" />
                              {new Date(job.createdAt).toLocaleDateString()}
                            </div>
                            <div className="flex items-center">
                              <Users className="h-4 w-4 mr-1" />
                              {job.applicationsCount} applicants
                            </div>
                          </div>

                          <div className="mt-3 flex items-center space-x-2">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getJobTypeColor(job.jobType)}`}>
                              {job.jobType}
                            </span>
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getExperienceLevelColor(job.experienceLevel)}`}>
                              {job.experienceLevel}
                            </span>
                            {job.salary && (
                              <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">
                                {formatSalary(job.salary)}
                              </span>
                            )}
                          </div>

                          <p className="mt-3 text-sm text-gray-600 line-clamp-2">
                            {job.description}
                          </p>
                        </div>

                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleToggleJobStatus(job._id)}
                            className={`px-3 py-1 text-xs font-medium rounded-lg ${
                              job.isActive 
                                ? 'bg-red-100 text-red-700 hover:bg-red-200' 
                                : 'bg-green-100 text-green-700 hover:bg-green-200'
                            }`}
                          >
                            {job.isActive ? 'Deactivate' : 'Activate'}
                          </button>
                          <button
                            onClick={() => handleDeleteJob(job._id)}
                            className="px-3 py-1 text-xs font-medium text-red-700 bg-red-100 rounded-lg hover:bg-red-200"
                          >
                            <Trash2 className="h-3 w-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}