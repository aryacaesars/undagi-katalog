import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET - Fetch all pricing plans
export async function GET() {
  try {
    const plans = await prisma.pricingPlan.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: 'asc' }
    })

    return NextResponse.json({
      success: true,
      data: plans
    })
  } catch (error) {
    console.error('Error fetching pricing plans:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch pricing plans' },
      { status: 500 }
    )
  }
}

// POST - Create new pricing plan
export async function POST(request) {
  try {
    const body = await request.json()
    
    const {
      name,
      subtitle,
      price,
      originalPrice,
      discount,
      description,
      features,
      limitations,
      popular,
      color,
      sortOrder
    } = body

    // Validation
    if (!name || !subtitle || !price || !originalPrice) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // If this plan is marked as popular, remove popular from others
    if (popular) {
      await prisma.pricingPlan.updateMany({
        where: { popular: true },
        data: { popular: false }
      })
    }

    const plan = await prisma.pricingPlan.create({
      data: {
        name,
        subtitle,
        price,
        originalPrice,
        discount: discount || "0%",
        description,
        features: features || [],
        limitations: limitations || [],
        popular: popular || false,
        color: color || "blue",
        sortOrder: sortOrder || 0
      }
    })

    return NextResponse.json({
      success: true,
      data: plan
    })
  } catch (error) {
    console.error('Error creating pricing plan:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create pricing plan' },
      { status: 500 }
    )
  }
}
