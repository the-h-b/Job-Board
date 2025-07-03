// API types
export interface ApiResponse<T = unknown> {
  data?: T
  message?: string
  error?: string
}

export interface DashboardStats {
  totalJobs: number
  totalCompanies: number
  totalStudents: number
  totalApplications: number
}

export interface DashboardActivity {
  id: string
  type: string
  description: string
  timestamp: Date
  user?: string
}

export interface CompanyData {
  _id: string
  name: string
  email: string
  website?: string
  description?: string
  industry: string
  location: string
  logoUrl?: string
  contactPerson: {
    name: string
    email: string
    phone?: string
  }
  isActive?: boolean
  createdAt?: Date
  updatedAt?: Date
}

export interface CompaniesApiResponse {
  companies: CompanyData[]
  pagination: {
    page: number
    limit: number
    total: number
    pages: number
  }
}

export interface JobData {
  _id: string
  title: string
  company: {
    _id: string
    name: string
    location: string
    logoUrl?: string
  }
  description: string
  requirements: string[]
  location: string
  jobType: 'Full-time' | 'Part-time' | 'Contract' | 'Internship'
  experienceLevel: 'Entry Level' | 'Mid Level' | 'Senior Level' | 'Executive'
  salary?: {
    min: number
    max: number
    currency: string
    period: 'Hourly' | 'Monthly' | 'Yearly'
  }
  skills: string[]
  benefits?: string[]
  applicationDeadline?: Date
  isActive: boolean
  applicationsCount: number
  createdBy: {
    _id: string
    name: string
    email: string
  }
  createdAt: Date
  updatedAt: Date
}

export interface JobsApiResponse {
  jobs: JobData[]
  pagination: {
    page: number
    limit: number
    total: number
    pages: number
  }
}

export interface StudentData {
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
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

export interface StudentsApiResponse {
  students: (StudentData & { applicationCount: number })[]
  pagination: {
    page: number
    limit: number
    total: number
    pages: number
  }
  stats: {
    totalApplications: number
    averageCGPA: number
  }
}

export interface ApplicationData {
  jobId: string
  studentId: string
  coverLetter?: string
  resumeUrl?: string
}

// API utility functions
export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message)
    this.name = 'ApiError'
  }
}

export async function apiRequest<T = unknown>(
  endpoint: string, 
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const token = localStorage.getItem('taiyari24_token')
  
  const config: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  }

  const response = await fetch(`/api${endpoint}`, config)
  const data = await response.json()

  if (!response.ok) {
    throw new ApiError(response.status, data.error || 'An error occurred')
  }

  return data
}

// Dashboard API functions
export const dashboardApi = {
  getStats: () => apiRequest<DashboardStats>('/dashboard/stats'),
  getActivities: () => apiRequest<DashboardActivity[]>('/dashboard/activities'),
}

// Companies API functions
export const companiesApi = {
  getAll: async (params?: URLSearchParams): Promise<CompaniesApiResponse> => {
    const response = await apiRequest<CompaniesApiResponse>(`/companies${params ? `?${params}` : ''}`)
    return response.data as CompaniesApiResponse
  },
  create: (data: Partial<CompanyData>) => 
    apiRequest('/companies', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: string, data: Partial<CompanyData>) => 
    apiRequest(`/companies/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: string) => 
    apiRequest(`/companies/${id}`, { method: 'DELETE' }),
}

// Jobs API functions
export const jobsApi = {
  getAll: async (params?: URLSearchParams): Promise<JobsApiResponse> => {
    const response = await apiRequest<JobsApiResponse>(`/jobs${params ? `?${params}` : ''}`)
    return response.data as JobsApiResponse
  },
  create: (data: Record<string, unknown>) => 
    apiRequest('/jobs', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: string, data: Partial<JobData>) => 
    apiRequest(`/jobs/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: string) => 
    apiRequest(`/jobs/${id}`, { method: 'DELETE' }),
}

// Students API functions
export const studentsApi = {
  getAll: (params?: URLSearchParams): Promise<StudentsApiResponse> => 
    fetch(`/api/students${params ? `?${params}` : ''}`)
      .then(response => response.json()),
  getById: (id: string) => 
    apiRequest(`/students/${id}`),
  getApplications: (id: string) => 
    apiRequest(`/students/${id}/applications`),
  create: (data: StudentData) => 
    apiRequest('/students', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: string, data: Partial<StudentData>) => 
    apiRequest(`/students/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: string) => 
    apiRequest(`/students/${id}`, { method: 'DELETE' }),
}

// Applications API functions
export const applicationsApi = {
  getAll: (params?: URLSearchParams) => 
    apiRequest(`/applications${params ? `?${params}` : ''}`),
  create: (data: ApplicationData) => 
    apiRequest('/applications', { method: 'POST', body: JSON.stringify(data) }),
  updateStatus: (id: string, status: string) => 
    apiRequest(`/applications/${id}/status`, { 
      method: 'PUT', 
      body: JSON.stringify({ status }) 
    }),
}
