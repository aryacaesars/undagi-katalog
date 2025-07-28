import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    // Get the last invoice ordered by creation date
    const lastInvoice = await prisma.invoice.findFirst({
      orderBy: {
        createdAt: 'desc'
      },
      select: {
        invoiceNumber: true
      }
    })

    return NextResponse.json({
      success: true,
      lastNumber: lastInvoice?.invoiceNumber || null
    })
  } catch (error) {
    console.error('Error fetching last invoice number:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch last invoice number' },
      { status: 500 }
    )
  }
}
