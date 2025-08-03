import { NextResponse } from 'next/server'
import { seedPricingPlans } from '@/lib/seed-pricing-plans'

// POST - Seed pricing plans data
export async function POST() {
  try {
    const plans = await seedPricingPlans()
    
    return NextResponse.json({
      success: true,
      message: 'Pricing plans seeded successfully',
      data: plans
    })
  } catch (error) {
    console.error('Error seeding pricing plans:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to seed pricing plans' },
      { status: 500 }
    )
  }
}
