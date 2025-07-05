import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import { requireAuth } from '@/lib/auth'
import Student from '@/models/Student'
import Application from '@/models/Application'
import User from '@/models/User'

export const GET = requireAuth(['admin'])(async (request: NextRequest) => {
  try {
    await dbConnect()

    const url = new URL(request.url)
    const studentId = url.pathname.split('/').slice(-1)[0]

    if (!studentId) {
      return NextResponse.json(
        { error: 'Student ID is required' },
        { status: 400 }
      )
    }

    // Get student details
    const student = await Student.findById(studentId)
      .populate('userId', 'name email createdAt')

    if (!student) {
      return NextResponse.json(
        { error: 'Student not found' },
        { status: 404 }
      )
    }

    // Get application statistics
    const applicationStats = await Application.aggregate([
      { $match: { student: student._id } },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ])

    const stats = {
      total: 0,
      applied: 0,
      underReview: 0,
      shortlisted: 0,
      interviewed: 0,
      offered: 0,
      rejected: 0
    }

    applicationStats.forEach(stat => {
      stats.total += stat.count
      switch (stat._id) {
        case 'Applied':
          stats.applied = stat.count
          break
        case 'Under Review':
          stats.underReview = stat.count
          break
        case 'Shortlisted':
          stats.shortlisted = stat.count
          break
        case 'Interviewed':
          stats.interviewed = stat.count
          break
        case 'Offered':
          stats.offered = stat.count
          break
        case 'Rejected':
          stats.rejected = stat.count
          break
      }
    })

    return NextResponse.json({
      student,
      applicationStats: stats
    })

  } catch (error) {
    console.error('Get student details error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
})

export const PUT = requireAuth(['admin'])(async (request: NextRequest) => {
  try {
    await dbConnect()

    const url = new URL(request.url)
    const studentId = url.pathname.split('/').slice(-1)[0]
    const updateData = await request.json()

    if (!studentId) {
      return NextResponse.json(
        { error: 'Student ID is required' },
        { status: 400 }
      )
    }

    const student = await Student.findByIdAndUpdate(
      studentId,
      updateData,
      { new: true, runValidators: true }
    ).populate('userId', 'name email createdAt')

    if (!student) {
      return NextResponse.json(
        { error: 'Student not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      message: 'Student updated successfully',
      student
    })

  } catch (error) {
    console.error('Update student error:', error)
    
    if (error instanceof Error && 'name' in error && error.name === 'ValidationError') {
      const validationError = error as unknown as { errors: Record<string, { message: string }> }
      const errors = Object.values(validationError.errors).map((err) => err.message)
      return NextResponse.json(
        { error: errors.join(', ') },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
})

export const DELETE = requireAuth(['admin'])(async (request: NextRequest) => {
  try {
    await dbConnect()

    const url = new URL(request.url)
    const studentId = url.pathname.split('/').slice(-1)[0]

    if (!studentId) {
      return NextResponse.json(
        { error: 'Student ID is required' },
        { status: 400 }
      )
    }

    const student = await Student.findByIdAndDelete(studentId)

    if (!student) {
      return NextResponse.json(
        { error: 'Student not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      message: 'Student deleted successfully'
    })

  } catch (error) {
    console.error('Delete student error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
})