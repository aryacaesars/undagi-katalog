import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET - Fetch single pricing plan
export async function GET(request, { params }) {
  try {
    const { id } = params
    
    const plan = await prisma.pricingPlan.findUnique({
      where: { id: parseInt(id) }
    })

    if (!plan) {
      return NextResponse.json(
        { success: false, error: 'Pricing plan not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: plan
    })
  } catch (error) {
    console.error('Error fetching pricing plan:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch pricing plan' },
      { status: 500 }
    )
  }
}

// PUT - Update pricing plan
export async function PUT(request, { params }) {
  try {
    const { id } = params
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
      sortOrder,
      isActive
    } = body

    // If this plan is marked as popular, remove popular from others
    if (popular) {
      await prisma.pricingPlan.updateMany({
        where: { 
          popular: true,
          id: { not: parseInt(id) }
        },
        data: { popular: false }
      })
    }

    const plan = await prisma.pricingPlan.update({
      where: { id: parseInt(id) },
      data: {
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
        sortOrder,
        isActive
      }
    })

    return NextResponse.json({
      success: true,
      data: plan
    })
  } catch (error) {
    console.error('Error updating pricing plan:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update pricing plan' },
      { status: 500 }
    )
  }
}

// DELETE - Delete pricing plan
export async function DELETE(request, { params }) {
  try {
    const { id } = params
    
    await prisma.pricingPlan.delete({
      where: { id: parseInt(id) }
    })

    return NextResponse.json({
      success: true,
      message: 'Pricing plan deleted successfully'
    })
  } catch (error) {
    console.error('Error deleting pricing plan:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete pricing plan' },
      { status: 500 }
    )
  }
}
