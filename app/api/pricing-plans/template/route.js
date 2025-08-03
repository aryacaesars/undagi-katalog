import { NextResponse } from 'next/server'
import { generateCSVTemplate } from '@/lib/csv-parser'

// GET - Download CSV template
export async function GET() {
  try {
    const csvContent = generateCSVTemplate()
    
    return new NextResponse(csvContent, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': 'attachment; filename="pricing-plans-template.csv"'
      }
    })
  } catch (error) {
    console.error('Error generating CSV template:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to generate CSV template' },
      { status: 500 }
    )
  }
}
