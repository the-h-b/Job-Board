import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import { requireAuth } from '@/lib/auth'
import Company from '@/models/Company'
import Job from '@/models/Job'
import Student from '@/models/Student'
import Application from '@/models/Application'

export const GET = requireAuth(['admin'])(async (request: NextRequest) => {
  try {
    await dbConnect()

    // Get recent activities
    const [recentCompanies, recentJobs, recentStudents, recentApplications] = await Promise.all([
      Company.find({ isActive: true })
        .sort({ createdAt: -1 })
        .limit(5)
        .select('name createdAt'),
        
      Job.find({ isActive: true })
        .populate('company', 'name')
        .sort({ createdAt: -1 })
        .limit(5)
        .select('title company createdAt'),
        
      Student.find({ isActive: true })
        .sort({ createdAt: -1 })
        .limit(5)
        .select('personalInfo.firstName personalInfo.lastName academicInfo.course createdAt'),
        
      Application.find()
        .populate({
          path: 'job',
          select: 'title',
          populate: {
            path: 'company',
            select: 'name'
          }
        })
        .sort({ createdAt: -1 })
        .limit(5)
        .select('job createdAt')
    ])

    // Format activities
    const activities = []

    // Add company registrations
    recentCompanies.forEach(company => {
      activities.push({
        id: company._id,
        type: 'company_registered',
        action: 'New company registered',
        company: company.name,
        time: company.createdAt,
        icon: 'Building2',
        color: 'text-green-600'
      })
    })

    // Add job postings
    recentJobs.forEach(job => {
      activities.push({
        id: job._id,
        type: 'job_posted',
        action: 'Job posting created',
        company: job.company?.name || 'Unknown Company',
        description: job.title,
        time: job.createdAt,
        icon: 'Briefcase',
        color: 'text-blue-600'
      })
    })

    // Add student registrations
    recentStudents.forEach(student => {
      activities.push({
        id: student._id,
        type: 'student_registered',
        action: 'Student registered',
        company: `${student.personalInfo.firstName} ${student.personalInfo.lastName} - ${student.academicInfo.course}`,
        time: student.createdAt,
        icon: 'GraduationCap',
        color: 'text-purple-600'
      })
    })

    // Add applications
    recentApplications.forEach(application => {
      if (application.job) {
        activities.push({
          id: application._id,
          type: 'application_submitted',
          action: 'Application submitted',
          company: `${application.job.title} at ${application.job.company?.name || 'Unknown Company'}`,
          time: application.createdAt,
          icon: 'CheckCircle',
          color: 'text-orange-600'
        })
      }
    })

    // Sort by time and limit to 10 most recent
    activities.sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime())
    const recentActivities = activities.slice(0, 10).map(activity => ({
      ...activity,
      time: formatTimeAgo(activity.time)
    }))

    return NextResponse.json({ activities: recentActivities })

  } catch (error) {
    console.error('Dashboard activities error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
})

function formatTimeAgo(date: Date): string {
  const now = new Date()
  const diffInMinutes = Math.floor((now.getTime() - new Date(date).getTime()) / (1000 * 60))
  
  if (diffInMinutes < 60) {
    return `${diffInMinutes} minute${diffInMinutes !== 1 ? 's' : ''} ago`
  }
  
  const diffInHours = Math.floor(diffInMinutes / 60)
  if (diffInHours < 24) {
    return `${diffInHours} hour${diffInHours !== 1 ? 's' : ''} ago`
  }
  
  const diffInDays = Math.floor(diffInHours / 24)
  return `${diffInDays} day${diffInDays !== 1 ? 's' : ''} ago`
}