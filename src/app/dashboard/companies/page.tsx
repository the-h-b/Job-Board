'use client'

import DashboardLayout from '@/components/DashboardLayout'
import { useState } from 'react'
import { 
  Building2, 
  Search, 
  MapPin, 
  Users, 
  Briefcase, 
  Globe, 
  Phone, 
  Mail,
  Edit,
  Trash2,
  Eye,
  Plus
} from 'lucide-react'
import toast from 'react-hot-toast'

const companiesData = [
  {
    id: 1,
    name: 'TechCorp Solutions',
    logo: '',
    industry: 'Technology',
    location: 'Mumbai, India',
    employees: '500-1000',
    website: 'https://techcorp.com',
    email: 'hr@techcorp.com',
    phone: '+91 22 1234 5678',
    jobsPosted: 12,
    activeJobs: 8,
    status: 'Active',
    joinDate: '2024-01-10'
  },
  {
    id: 2,
    name: 'Innovation Labs',
    logo: '',
    industry: 'Software',
    location: 'Bangalore, India',
    employees: '100-500',
    website: 'https://innovationlabs.com',
    email: 'careers@innovationlabs.com',
    phone: '+91 80 9876 5432',
    jobsPosted: 8,
    activeJobs: 5,
    status: 'Active',
    joinDate: '2024-01-08'
  },
  {
    id: 3,
    name: 'DataFlow Systems',
    logo: '',
    industry: 'Data Analytics',
    location: 'Pune, India',
    employees: '50-100',
    website: 'https://dataflow.com',
    email: 'jobs@dataflow.com',
    phone: '+91 20 5555 4444',
    jobsPosted: 5,
    activeJobs: 3,
    status: 'Active',
    joinDate: '2024-01-12'
  },
  {
    id: 4,
    name: 'CloudTech Inc',
    logo: '',
    industry: 'Cloud Services',
    location: 'Hyderabad, India',
    employees: '200-500',
    website: 'https://cloudtech.com',
    email: 'recruitment@cloudtech.com',
    phone: '+91 40 7777 8888',
    jobsPosted: 15,
    activeJobs: 10,
    status: 'Pending',
    joinDate: '2024-01-15'
  },
  {
    id: 5,
    name: 'FinanceMax',
    logo: '',
    industry: 'Fintech',
    location: 'Delhi, India',
    employees: '1000+',
    website: 'https://financemax.com',
    email: 'hr@financemax.com',
    phone: '+91 11 9999 0000',
    jobsPosted: 20,
    activeJobs: 12,
    status: 'Active',
    joinDate: '2024-01-05'
  }
]

export default function CompaniesPage() {
  const [companies, setCompanies] = useState(companiesData)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterIndustry, setFilterIndustry] = useState('all')
  const [filterStatus, setFilterStatus] = useState('all')

  // Get unique industries for filter
  const industries = [...new Set(companies.map(company => company.industry))]

  // Filter companies
  const filteredCompanies = companies.filter(company => {
    const matchesSearch = company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         company.location.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesIndustry = filterIndustry === 'all' || company.industry === filterIndustry
    const matchesStatus = filterStatus === 'all' || company.status.toLowerCase() === filterStatus.toLowerCase()
    
    return matchesSearch && matchesIndustry && matchesStatus
  })

  const handleStatusChange = (companyId: number, newStatus: string) => {
    setCompanies(companies.map(company => 
      company.id === companyId 
        ? { ...company, status: newStatus }
        : company
    ))
    toast.success(`Company status updated to ${newStatus}!`)
  }

  const handleDeleteCompany = (companyId: number) => {
    if (confirm('Are you sure you want to delete this company?')) {
      setCompanies(companies.filter(company => company.id !== companyId))
      toast.success('Company deleted successfully!')
    }
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center">
              <Building2 className="mr-3 h-8 w-8" />
              Companies Management
            </h1>
            <p className="text-gray-600">Manage all registered companies</p>
          </div>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center">
            <Plus className="mr-2 h-4 w-4" />
            Add Company
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-4">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Building2 className="h-6 w-6 text-blue-600" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Total Companies</dt>
                    <dd className="text-2xl font-semibold text-gray-900">{companies.length}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Building2 className="h-6 w-6 text-green-600" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Active Companies</dt>
                    <dd className="text-2xl font-semibold text-gray-900">
                      {companies.filter(company => company.status === 'Active').length}
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
                  <Briefcase className="h-6 w-6 text-purple-600" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Total Jobs</dt>
                    <dd className="text-2xl font-semibold text-gray-900">
                      {companies.reduce((sum, company) => sum + company.jobsPosted, 0)}
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
                  <Briefcase className="h-6 w-6 text-orange-600" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Active Jobs</dt>
                    <dd className="text-2xl font-semibold text-gray-900">
                      {companies.reduce((sum, company) => sum + company.activeJobs, 0)}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white shadow rounded-lg p-6">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
            <div className="md:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder="Search companies..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            
            <div>
              <select
                value={filterIndustry}
                onChange={(e) => setFilterIndustry(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Industries</option>
                {industries.map(industry => (
                  <option key={industry} value={industry}>{industry}</option>
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
                <option value="pending">Pending</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>
        </div>

        {/* Companies Grid */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredCompanies.map((company) => (
            <div key={company.id} className="bg-white shadow rounded-lg overflow-hidden">
              <div className="p-6">
                {/* Company Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Building2 className="h-6 w-6 text-blue-600" />
                    </div>
                    <div className="ml-3">
                      <h3 className="text-lg font-medium text-gray-900">{company.name}</h3>
                      <p className="text-sm text-gray-500">{company.industry}</p>
                    </div>
                  </div>
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    company.status === 'Active' 
                      ? 'bg-green-100 text-green-800'
                      : company.status === 'Pending'
                      ? 'bg-yellow-100 text-yellow-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {company.status}
                  </span>
                </div>

                {/* Company Details */}
                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <MapPin className="mr-2 h-4 w-4" />
                    {company.location}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Users className="mr-2 h-4 w-4" />
                    {company.employees} employees
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Globe className="mr-2 h-4 w-4" />
                    <a href={company.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                      {company.website}
                    </a>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Mail className="mr-2 h-4 w-4" />
                    {company.email}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Phone className="mr-2 h-4 w-4" />
                    {company.phone}
                  </div>
                </div>

                {/* Job Stats */}
                <div className="grid grid-cols-2 gap-4 mb-4 pt-4 border-t border-gray-200">
                  <div className="text-center">
                    <div className="text-2xl font-semibold text-gray-900">{company.jobsPosted}</div>
                    <div className="text-sm text-gray-500">Jobs Posted</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-semibold text-gray-900">{company.activeJobs}</div>
                    <div className="text-sm text-gray-500">Active Jobs</div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                  <div className="flex space-x-2">
                    <button className="text-blue-600 hover:text-blue-900 p-1">
                      <Eye className="h-4 w-4" />
                    </button>
                    <button className="text-indigo-600 hover:text-indigo-900 p-1">
                      <Edit className="h-4 w-4" />
                    </button>
                    <button 
                      onClick={() => handleDeleteCompany(company.id)}
                      className="text-red-600 hover:text-red-900 p-1"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                  
                  {company.status === 'Pending' && (
                    <div className="flex space-x-1">
                      <button 
                        onClick={() => handleStatusChange(company.id, 'Active')}
                        className="px-3 py-1 text-xs bg-green-600 text-white rounded hover:bg-green-700"
                      >
                        Approve
                      </button>
                      <button 
                        onClick={() => handleStatusChange(company.id, 'Inactive')}
                        className="px-3 py-1 text-xs bg-red-600 text-white rounded hover:bg-red-700"
                      >
                        Reject
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredCompanies.length === 0 && (
          <div className="text-center py-12">
            <Building2 className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No companies found</h3>
            <p className="mt-1 text-sm text-gray-500">
              Try adjusting your search or filter criteria.
            </p>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}