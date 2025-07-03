import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import { requireAuth } from '@/lib/auth'
import Student from '@/models/Student'
import Application from '@/models/Application'

export const GET = requireAuth(['admin'])(async (request: NextRequest) => {
  try {
    await dbConnect()

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const search = searchParams.get('search') || ''
    const course = searchParams.get('course') || ''
    const graduationYear = searchParams.get('graduationYear') || ''

    // Build query
    const query: Record<string, unknown> = { isActive: true }
    
    if (search) {
      query.$or = [
        { 'personalInfo.firstName': { $regex: search, $options: 'i' } },
        { 'personalInfo.lastName': { $regex: search, $options: 'i' } },
        { 'personalInfo.email': { $regex: search, $options: 'i' } },
        { skills: { $in: [new RegExp(search, 'i')] } }
      ]
    }
    
    if (course) {
      query['academicInfo.course'] = { $regex: course, $options: 'i' }
    }
    
    if (graduationYear) {
      query['academicInfo.graduationYear'] = parseInt(graduationYear)
    }

    // Get total count for pagination
    const total = await Student.countDocuments(query)
    
    // Get students with pagination
    const students = await Student.find(query)
      .populate('userId', 'name email createdAt')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)

    // Get application counts for each student
    const studentsWithApplications = await Promise.all(
      students.map(async (student) => {
        const applicationCount = await Application.countDocuments({ student: student._id })
        return {
          ...student.toObject(),
          applicationCount
        }
      })
    )

    // Get overall statistics
    const [totalApplications, averageCGPA] = await Promise.all([
      Application.countDocuments(),
      Student.aggregate([
        { $match: { isActive: true, 'academicInfo.cgpa': { $exists: true } } },
        { $group: { _id: null, avgCGPA: { $avg: '$academicInfo.cgpa' } } }
      ])
    ])

    return NextResponse.json({
      students: studentsWithApplications,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      },
      stats: {
        totalApplications,
        averageCGPA: averageCGPA.length > 0 ? averageCGPA[0].avgCGPA : 0
      }
    })

  } catch (error) {
    console.error('Get students error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
})

export const POST = requireAuth(['admin', 'student'])(async (request: NextRequest, user) => {
  try {
    await dbConnect()

    const studentData = await request.json()
    
    // Validate required fields
    const requiredFields = ['personalInfo', 'academicInfo']
    for (const field of requiredFields) {
      if (!studentData[field]) {
        return NextResponse.json(
          { error: `${field} is required` },
          { status: 400 }
        )
      }
    }

    // Check if student profile already exists for this user
    const existingStudent = await Student.findOne({ userId: user.userId })
    if (existingStudent) {
      return NextResponse.json(
        { error: 'Student profile already exists for this user' },
        { status: 400 }
      )
    }

    // Create new student profile
    const student = new Student({
      ...studentData,
      userId: user.userId
    })

    await student.save()

    // Populate the created student
    const populatedStudent = await Student.findById(student._id)
      .populate('userId', 'name email createdAt')

    return NextResponse.json({
      message: 'Student profile created successfully',
      student: populatedStudent
    }, { status: 201 })

  } catch (error) {
    console.error('Create student error:', error)
    
    // Handle mongoose validation errors
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