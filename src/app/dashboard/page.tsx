'use client'

import { useEffect, useState } from 'react'
import DashboardLayout from '@/components/DashboardLayout'
import { dashboardApi } from '@/lib/api'
import { 
  Users, 
  Building2, 
  GraduationCap, 
  Briefcase, 
  TrendingUp, 
  Clock,
  CheckCircle,
  AlertCircle
} from 'lucide-react'

interface DashboardStats {
  totalStudents: { count: number; growth: number }
  activeCompanies: { count: number; growth: number }
  totalJobs: { count: number; growth: number }
  totalApplications: { count: number; growth: number }
}

interface Activity {
  id: string
  action: string
  company: string
  time: string
  icon: string
  color: string
}

const quickActions = [
  {
    title: 'Create Job Posting',
    description: 'Add a new job opportunity',
    href: '/dashboard/job-upload',
    icon: Briefcase,
    color: 'bg-blue-600 hover:bg-blue-700'
  },
  {
    title: 'Add Company',
    description: 'Register a new company',
    href: '/dashboard/create-company',
    icon: Building2,
    color: 'bg-green-600 hover:bg-green-700'
  },
  {
    title: 'Bulk Upload',
    description: 'Upload multiple records',
    href: '/dashboard/bulk-upload',
    icon: TrendingUp,
    color: 'bg-purple-600 hover:bg-purple-700'
  },
  {
    title: 'View Calendar',
    description: 'Check upcoming events',
    href: '/dashboard/calendar',
    icon: Clock,
    color: 'bg-orange-600 hover:bg-orange-700'
  }
]

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [activities, setActivities] = useState<Activity[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      const [statsResponse, activitiesResponse] = await Promise.all([
        dashboardApi.getStats(),
        dashboardApi.getActivities()
      ])
      
      setStats(statsResponse.stats)
      setActivities(activitiesResponse.activities)
    } catch (err: any) {
      setError(err.message || 'Failed to fetch dashboard data')
    } finally {
      setLoading(false)
    }
  }

  const getIconComponent = (iconName: string) => {
    const icons: Record<string, any> = {
      Building2,
      Briefcase,
      GraduationCap,
      CheckCircle,
      Users
    }
    return icons[iconName] || Users
  }

  const statsConfig = [
    {
      key: 'totalStudents',
      name: 'Total Students',
      icon: GraduationCap,
      color: 'bg-blue-500'
    },
    {
      key: 'activeCompanies',
      name: 'Active Companies',
      icon: Building2,
      color: 'bg-green-500'
    },
    {
      key: 'totalJobs',
      name: 'Job Postings',
      icon: Briefcase,
      color: 'bg-purple-500'
    },
    {
      key: 'totalApplications',
      name: 'Applications',
      icon: Users,
      color: 'bg-orange-500'
    }
  ]

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
        </div>
      </DashboardLayout>
    )
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <AlertCircle className="mx-auto h-12 w-12 text-red-500" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">Error loading dashboard</h3>
          <p className="mt-1 text-sm text-gray-500">{error}</p>
          <button
            onClick={fetchDashboardData}
            className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">Welcome to Taiyari24 Job Board Admin Panel</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {statsConfig.map((config) => {
            const statData = stats?.[config.key as keyof DashboardStats]
            return (
              <div
                key={config.name}
                className="bg-white overflow-hidden shadow rounded-lg"
              >
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className={`${config.color} p-3 rounded-lg`}>
                        <config.icon className="h-6 w-6 text-white" />
                      </div>
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">
                          {config.name}
                        </dt>
                        <dd className="flex items-baseline">
                          <div className="text-2xl font-semibold text-gray-900">
                            {statData?.count || 0}
                          </div>
                          <div className="ml-2 flex items-baseline text-sm font-semibold text-green-600">
                            +{statData?.growth || 0}%
                          </div>
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Recent Activities */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Recent Activities</h3>
            </div>
            <div className="p-6">
              {activities.length === 0 ? (
                <p className="text-gray-500 text-center py-4">No recent activities</p>
              ) : (
                <div className="flow-root">
                  <ul className="-mb-8">
                    {activities.map((activity, activityIdx) => {
                      const IconComponent = getIconComponent(activity.icon)
                      return (
                        <li key={activity.id}>
                          <div className="relative pb-8">
                            {activityIdx !== activities.length - 1 ? (
                              <span
                                className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200"
                                aria-hidden="true"
                              />
                            ) : null}
                            <div className="relative flex space-x-3">
                              <div>
                                <span className={`${activity.color} bg-gray-100 h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white`}>
                                  <IconComponent className="h-4 w-4" />
                                </span>
                              </div>
                              <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                                <div>
                                  <p className="text-sm text-gray-900">
                                    {activity.action}
                                  </p>
                                  <p className="text-sm text-gray-500">
                                    {activity.company}
                                  </p>
                                </div>
                                <div className="text-right text-sm whitespace-nowrap text-gray-500">
                                  <time>{activity.time}</time>
                                </div>
                              </div>
                            </div>
                          </div>
                        </li>
                      )
                    })}
                  </ul>
                </div>
              )}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Quick Actions</h3>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {quickActions.map((action) => (
                  <a
                    key={action.title}
                    href={action.href}
                    className={`${action.color} text-white p-4 rounded-lg transition-colors block`}
                  >
                    <div className="flex items-center">
                      <action.icon className="h-6 w-6 mr-3" />
                      <div>
                        <h4 className="font-medium">{action.title}</h4>
                        <p className="text-sm opacity-90">{action.description}</p>
                      </div>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* System Status */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">System Status</h3>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div className="flex items-center">
                <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                <span className="text-sm text-gray-900">Database: Online</span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                <span className="text-sm text-gray-900">Email Service: Active</span>
              </div>
              <div className="flex items-center">
                <AlertCircle className="h-5 w-5 text-yellow-500 mr-2" />
                <span className="text-sm text-gray-900">Storage: 78% Used</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}