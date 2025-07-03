import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import { requireAuth } from '@/lib/auth'
import Job from '@/models/Job'
import Company from '@/models/Company'

export const GET = requireAuth()(async (request: NextRequest) => {
  try {
    await dbConnect()

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const search = searchParams.get('search') || ''
    const location = searchParams.get('location') || ''
    const jobType = searchParams.get('jobType') || ''
    const experienceLevel = searchParams.get('experienceLevel') || ''

    // Build query
    const query: Record<string, unknown> = { isActive: true }
    
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { skills: { $in: [new RegExp(search, 'i')] } }
      ]
    }
    
    if (location) {
      query.location = { $regex: location, $options: 'i' }
    }
    
    if (jobType) {
      query.jobType = jobType
    }
    
    if (experienceLevel) {
      query.experienceLevel = experienceLevel
    }

    // Get total count for pagination
    const total = await Job.countDocuments(query)
    
    // Get jobs with pagination
    const jobs = await Job.find(query)
      .populate('company', 'name location logoUrl')
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)

    return NextResponse.json({
      jobs,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    })

  } catch (error) {
    console.error('Get jobs error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
})

export const POST = requireAuth(['admin'])(async (request: NextRequest, user) => {
  try {
    await dbConnect()

    const jobData = await request.json()
    
    // Validate required fields
    const requiredFields = ['title', 'company', 'description', 'location', 'jobType', 'experienceLevel']
    for (const field of requiredFields) {
      if (!jobData[field]) {
        return NextResponse.json(
          { error: `${field} is required` },
          { status: 400 }
        )
      }
    }

    // Verify company exists
    const company = await Company.findById(jobData.company)
    if (!company) {
      return NextResponse.json(
        { error: 'Company not found' },
        { status: 404 }
      )
    }

    // Create new job
    const job = new Job({
      ...jobData,
      createdBy: user.userId
    })

    await job.save()

    // Populate the created job
    const populatedJob = await Job.findById(job._id)
      .populate('company', 'name location logoUrl')
      .populate('createdBy', 'name email')

    return NextResponse.json({
      message: 'Job created successfully',
      job: populatedJob
    }, { status: 201 })

  } catch (error) {
    console.error('Create job error:', error)
    
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