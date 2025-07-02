import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import { requireAuth } from '@/lib/auth'
import Company from '@/models/Company'

export const GET = requireAuth(['admin'])(async (request: NextRequest) => {
  try {
    await dbConnect()

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const search = searchParams.get('search') || ''
    const industry = searchParams.get('industry') || ''
    const location = searchParams.get('location') || ''

    // Build query
    const query: any = { isActive: true }
    
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { 'contactPerson.name': { $regex: search, $options: 'i' } }
      ]
    }
    
    if (industry) {
      query.industry = { $regex: industry, $options: 'i' }
    }
    
    if (location) {
      query.location = { $regex: location, $options: 'i' }
    }

    // Get total count for pagination
    const total = await Company.countDocuments(query)
    
    // Get companies with pagination
    const companies = await Company.find(query)
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)

    return NextResponse.json({
      companies,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    })

  } catch (error) {
    console.error('Get companies error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
})

export const POST = requireAuth(['admin'])(async (request: NextRequest, user) => {
  try {
    await dbConnect()

    const companyData = await request.json()
    
    // Validate required fields
    const requiredFields = ['name', 'email', 'industry', 'location', 'contactPerson']
    for (const field of requiredFields) {
      if (!companyData[field]) {
        return NextResponse.json(
          { error: `${field} is required` },
          { status: 400 }
        )
      }
    }

    // Check if company with this email already exists
    const existingCompany = await Company.findOne({ email: companyData.email })
    if (existingCompany) {
      return NextResponse.json(
        { error: 'Company with this email already exists' },
        { status: 400 }
      )
    }

    // Create new company
    const company = new Company({
      ...companyData,
      createdBy: user.userId
    })

    await company.save()

    // Populate the created company
    const populatedCompany = await Company.findById(company._id)
      .populate('createdBy', 'name email')

    return NextResponse.json({
      message: 'Company created successfully',
      company: populatedCompany
    }, { status: 201 })

  } catch (error) {
    console.error('Create company error:', error)
    
    // Handle mongoose validation errors
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map((err: any) => err.message)
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