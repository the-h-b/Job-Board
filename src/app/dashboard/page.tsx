'use client'

import DashboardLayout from '@/components/DashboardLayout'
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

const stats = [
  {
    name: 'Total Students',
    value: '2,847',
    change: '+12%',
    changeType: 'increase',
    icon: GraduationCap,
    color: 'bg-blue-500'
  },
  {
    name: 'Active Companies',
    value: '156',
    change: '+8%',
    changeType: 'increase',
    icon: Building2,
    color: 'bg-green-500'
  },
  {
    name: 'Job Postings',
    value: '324',
    change: '+15%',
    changeType: 'increase',
    icon: Briefcase,
    color: 'bg-purple-500'
  },
  {
    name: 'Applications',
    value: '1,923',
    change: '+20%',
    changeType: 'increase',
    icon: Users,
    color: 'bg-orange-500'
  }
]

const recentActivities = [
  {
    id: 1,
    action: 'New company registered',
    company: 'TechCorp Solutions',
    time: '2 hours ago',
    icon: Building2,
    color: 'text-green-600'
  },
  {
    id: 2,
    action: 'Job posting created',
    company: 'Innovation Labs',
    time: '4 hours ago',
    icon: Briefcase,
    color: 'text-blue-600'
  },
  {
    id: 3,
    action: 'Student registered',
    company: 'John Doe - Computer Science',
    time: '6 hours ago',
    icon: GraduationCap,
    color: 'text-purple-600'
  },
  {
    id: 4,
    action: 'Application submitted',
    company: 'Software Engineer at DevCorp',
    time: '8 hours ago',
    icon: CheckCircle,
    color: 'text-orange-600'
  }
]

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
          {stats.map((item) => (
            <div
              key={item.name}
              className="bg-white overflow-hidden shadow rounded-lg"
            >
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className={`${item.color} p-3 rounded-lg`}>
                      <item.icon className="h-6 w-6 text-white" />
                    </div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        {item.name}
                      </dt>
                      <dd className="flex items-baseline">
                        <div className="text-2xl font-semibold text-gray-900">
                          {item.value}
                        </div>
                        <div className="ml-2 flex items-baseline text-sm font-semibold text-green-600">
                          {item.change}
                        </div>
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Recent Activities */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Recent Activities</h3>
            </div>
            <div className="p-6">
              <div className="flow-root">
                <ul className="-mb-8">
                  {recentActivities.map((activity, activityIdx) => (
                    <li key={activity.id}>
                      <div className="relative pb-8">
                        {activityIdx !== recentActivities.length - 1 ? (
                          <span
                            className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200"
                            aria-hidden="true"
                          />
                        ) : null}
                        <div className="relative flex space-x-3">
                          <div>
                            <span className={`${activity.color} bg-gray-100 h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white`}>
                              <activity.icon className="h-4 w-4" />
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
                  ))}
                </ul>
              </div>
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