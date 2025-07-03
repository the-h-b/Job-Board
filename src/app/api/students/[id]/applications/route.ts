import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import { requireAuth } from '@/lib/auth'
import Application from '@/models/Application'

export const GET = requireAuth(['admin'])(async (request: NextRequest) => {
  try {
    await dbConnect()

    const url = new URL(request.url)
    const studentId = url.pathname.split('/').slice(-2)[0]

    if (!studentId) {
      return NextResponse.json(
        { error: 'Student ID is required' },
        { status: 400 }
      )
    }

    // Get all applications for this student
    const applications = await Application.find({ student: studentId })
      .populate({
        path: 'job',
        populate: {
          path: 'company',
          model: 'Company',
          select: 'name industry location'
        }
      })
      .sort({ appliedAt: -1 })

    return NextResponse.json({
      applications,
      total: applications.length
    })

  } catch (error) {
    console.error('Get student applications error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
})