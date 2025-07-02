// API utility functions
export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message)
    this.name = 'ApiError'
  }
}

export async function apiRequest(
  endpoint: string, 
  options: RequestInit = {}
): Promise<any> {
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
  getStats: () => apiRequest('/dashboard/stats'),
  getActivities: () => apiRequest('/dashboard/activities'),
}

// Companies API functions
export const companiesApi = {
  getAll: (params?: URLSearchParams) => 
    apiRequest(`/companies${params ? `?${params}` : ''}`),
  create: (data: any) => 
    apiRequest('/companies', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: string, data: any) => 
    apiRequest(`/companies/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: string) => 
    apiRequest(`/companies/${id}`, { method: 'DELETE' }),
}

// Jobs API functions
export const jobsApi = {
  getAll: (params?: URLSearchParams) => 
    apiRequest(`/jobs${params ? `?${params}` : ''}`),
  create: (data: any) => 
    apiRequest('/jobs', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: string, data: any) => 
    apiRequest(`/jobs/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: string) => 
    apiRequest(`/jobs/${id}`, { method: 'DELETE' }),
}

// Students API functions
export const studentsApi = {
  getAll: (params?: URLSearchParams) => 
    apiRequest(`/students${params ? `?${params}` : ''}`),
  create: (data: any) => 
    apiRequest('/students', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: string, data: any) => 
    apiRequest(`/students/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: string) => 
    apiRequest(`/students/${id}`, { method: 'DELETE' }),
}

// Applications API functions
export const applicationsApi = {
  getAll: (params?: URLSearchParams) => 
    apiRequest(`/applications${params ? `?${params}` : ''}`),
  create: (data: any) => 
    apiRequest('/applications', { method: 'POST', body: JSON.stringify(data) }),
  updateStatus: (id: string, status: string) => 
    apiRequest(`/applications/${id}/status`, { 
      method: 'PUT', 
      body: JSON.stringify({ status }) 
    }),
}