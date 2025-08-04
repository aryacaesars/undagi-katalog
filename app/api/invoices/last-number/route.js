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

export async function POST(request) {
  try {
    const { counter } = await request.json()

    if (typeof counter !== 'number' || counter < 1) {
      return NextResponse.json(
        { success: false, error: 'Invalid counter value' },
        { status: 400 }
      )
    }

    // Find the default company to update its invoice counter
    const defaultCompany = await prisma.company.findFirst({
      where: { isDefault: true }
    })

    if (!defaultCompany) {
      return NextResponse.json(
        { success: false, error: 'Default company not found' },
        { status: 404 }
      )
    }

    // Update the invoice counter for the default company
    await prisma.company.update({
      where: { id: defaultCompany.id },
      data: { invoiceCounter: counter }
    })

    return NextResponse.json({ success: true, newCounter: counter })
  } catch (error) {
    console.error('Error updating invoice counter:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update invoice counter' },
      { status: 500 }
    )
  }
}
