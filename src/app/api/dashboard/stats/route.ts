import { NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import { requireAuth } from '@/lib/auth'
import Company from '@/models/Company'
import Job from '@/models/Job'
import Student from '@/models/Student'
import Application from '@/models/Application'

export const GET = requireAuth(['admin'])(async () => {
  try {
    await dbConnect()

    // Get counts
    const [
      totalStudents,
      activeCompanies,
      totalJobs,
      totalApplications,
      recentStudents,
      recentCompanies,
      recentJobs,
      recentApplications
    ] = await Promise.all([
      Student.countDocuments({ isActive: true }),
      Company.countDocuments({ isActive: true }),
      Job.countDocuments({ isActive: true }),
      Application.countDocuments(),
      
      // Get counts from last month for growth calculation
      Student.countDocuments({ 
        isActive: true,
        createdAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }
      }),
      Company.countDocuments({ 
        isActive: true,
        createdAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }
      }),
      Job.countDocuments({ 
        isActive: true,
        createdAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }
      }),
      Application.countDocuments({ 
        createdAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }
      })
    ])

    // Calculate growth percentages (simplified)
    const stats = {
      totalStudents: {
        count: totalStudents,
        growth: recentStudents > 0 ? Math.round((recentStudents / Math.max(totalStudents - recentStudents, 1)) * 100) : 0
      },
      activeCompanies: {
        count: activeCompanies,
        growth: recentCompanies > 0 ? Math.round((recentCompanies / Math.max(activeCompanies - recentCompanies, 1)) * 100) : 0
      },
      totalJobs: {
        count: totalJobs,
        growth: recentJobs > 0 ? Math.round((recentJobs / Math.max(totalJobs - recentJobs, 1)) * 100) : 0
      },
      totalApplications: {
        count: totalApplications,
        growth: recentApplications > 0 ? Math.round((recentApplications / Math.max(totalApplications - recentApplications, 1)) * 100) : 0
      }
    }

    return NextResponse.json({ stats })

  } catch (error) {
    console.error('Dashboard stats error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
})