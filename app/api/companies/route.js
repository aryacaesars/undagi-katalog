import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/companies - Get all companies
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page')) || 1
    const limit = parseInt(searchParams.get('limit')) || 10
    const search = searchParams.get('search')

    const skip = (page - 1) * limit
    
    // Build where clause
    const where = {}
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } }
      ]
    }

    const [companies, total] = await Promise.all([
      prisma.company.findMany({
        where,
        orderBy: { isDefault: 'desc' }, // Default company first
        skip,
        take: limit
      }),
      prisma.company.count({ where })
    ])

    return NextResponse.json({
      success: true,
      data: companies,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error('Error fetching companies:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch companies' },
      { status: 500 }
    )
  }
}

// POST /api/companies - Create new company
export async function POST(request) {
  try {
    const body = await request.json()
    const { name, address, phone, email, website, logo, isDefault } = body

    // Validate required fields
    if (!name || !address || !phone || !email) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // If setting as default, remove default from other companies
    if (isDefault) {
      await prisma.company.updateMany({
        where: { isDefault: true },
        data: { isDefault: false }
      })
    }

    const company = await prisma.company.create({
      data: {
        name,
        address,
        phone,
        email,
        website,
        logo,
        isDefault: isDefault || false
      }
    })

    return NextResponse.json({
      success: true,
      data: company
    }, { status: 201 })
  } catch (error) {
    console.error('Error creating company:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create company' },
      { status: 500 }
    )
  }
}
