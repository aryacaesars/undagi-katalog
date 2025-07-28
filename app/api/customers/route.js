import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/customers - Get all customers
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
        { email: { contains: search, mode: 'insensitive' } },
        { company: { contains: search, mode: 'insensitive' } }
      ]
    }

    const [customers, total] = await Promise.all([
      prisma.customer.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit
      }),
      prisma.customer.count({ where })
    ])

    return NextResponse.json({
      success: true,
      data: customers,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error('Error fetching customers:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch customers' },
      { status: 500 }
    )
  }
}

// POST /api/customers - Create new customer
export async function POST(request) {
  try {
    const body = await request.json()
    const { name, company, address, phone, email, notes } = body

    // Validate required fields
    if (!name || !address || !phone || !email) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const customer = await prisma.customer.create({
      data: {
        name,
        company,
        address,
        phone,
        email,
        notes
      }
    })

    return NextResponse.json({
      success: true,
      data: customer
    }, { status: 201 })
  } catch (error) {
    console.error('Error creating customer:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create customer' },
      { status: 500 }
    )
  }
}
