import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { parseCSV, csvToPricingPlans } from '@/lib/csv-parser'

// POST - Import pricing plans from CSV
export async function POST(request) {
  try {
    const formData = await request.formData()
    const file = formData.get('file')
    const replaceExisting = formData.get('replaceExisting') === 'true'

    if (!file) {
      return NextResponse.json(
        { success: false, error: 'No file provided' },
        { status: 400 }
      )
    }

    // Read file content
    const text = await file.text()
    
    if (!text.trim()) {
      return NextResponse.json(
        { success: false, error: 'File is empty' },
        { status: 400 }
      )
    }

    // Parse CSV
    let parsedData
    try {
      const { data } = parseCSV(text)
      parsedData = csvToPricingPlans(data)
    } catch (parseError) {
      return NextResponse.json(
        { success: false, error: `CSV parsing error: ${parseError.message}` },
        { status: 400 }
      )
    }

    // Validate data
    if (parsedData.length === 0) {
      return NextResponse.json(
        { success: false, error: 'No valid data rows found in CSV' },
        { status: 400 }
      )
    }

    // Database transaction
    const result = await prisma.$transaction(async (tx) => {
      // If replace existing, delete all current plans
      if (replaceExisting) {
        await tx.pricingPlan.deleteMany({})
      }

      // Handle popular plan logic - only one can be popular
      const popularPlans = parsedData.filter(plan => plan.popular)
      if (popularPlans.length > 1) {
        // Keep only the first popular plan
        parsedData.forEach((plan, index) => {
          if (plan.popular && index > parsedData.findIndex(p => p.popular)) {
            plan.popular = false
          }
        })
      }

      // If replacing and no popular plan in CSV, or if there's a popular plan in CSV
      // make sure no existing plans are marked as popular
      if (popularPlans.length > 0) {
        await tx.pricingPlan.updateMany({
          where: { popular: true },
          data: { popular: false }
        })
      }

      // Create new plans
      const createdPlans = []
      for (const planData of parsedData) {
        const plan = await tx.pricingPlan.create({
          data: planData
        })
        createdPlans.push(plan)
      }

      return createdPlans
    })

    return NextResponse.json({
      success: true,
      message: `Successfully imported ${result.length} pricing plans`,
      data: result
    })

  } catch (error) {
    console.error('Error importing CSV:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to import CSV data' },
      { status: 500 }
    )
  }
}
