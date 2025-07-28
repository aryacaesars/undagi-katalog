import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/invoices - Get all invoices
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page')) || 1
    const limit = parseInt(searchParams.get('limit')) || 10
    const status = searchParams.get('status')
    const search = searchParams.get('search')

    const skip = (page - 1) * limit
    
    // Build where clause
    const where = {}
    if (status) {
      where.status = status
    }
    if (search) {
      where.OR = [
        { invoiceNumber: { contains: search, mode: 'insensitive' } },
        { customer: { name: { contains: search, mode: 'insensitive' } } },
        { company: { name: { contains: search, mode: 'insensitive' } } }
      ]
    }

    const [invoices, total] = await Promise.all([
      prisma.invoice.findMany({
        where,
        include: {
          company: true,
          customer: true,
          items: {
            orderBy: { sortOrder: 'asc' }
          }
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit
      }),
      prisma.invoice.count({ where })
    ])

    return NextResponse.json({
      success: true,
      data: invoices,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error('Error fetching invoices:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch invoices' },
      { status: 500 }
    )
  }
}

// POST /api/invoices - Create new invoice
export async function POST(request) {
  try {
    const body = await request.json()
    const {
      companyId,
      customerId,
      dueDate,
      items,
      tax = 0,
      serviceCharge = 0,
      notes
    } = body

    // Validate required fields
    if (!companyId || !customerId || !items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Generate invoice number
    const lastInvoice = await prisma.invoice.findFirst({
      orderBy: { createdAt: 'desc' },
      select: { invoiceNumber: true }
    })
    
    let invoiceNumber
    if (lastInvoice) {
      const lastNumber = parseInt(lastInvoice.invoiceNumber.split('-')[1])
      invoiceNumber = `INV-${String(lastNumber + 1).padStart(6, '0')}`
    } else {
      invoiceNumber = 'INV-000001'
    }

    // Calculate totals
    let subtotal = 0
    const processedItems = items.map((item, index) => {
      const itemTotal = item.quantity * item.unitPrice
      subtotal += itemTotal
      return {
        name: item.name,
        specification: item.specification || '',
        quantity: item.quantity,
        unit: item.unit,
        unitPrice: item.unitPrice,
        total: itemTotal,
        sortOrder: index
      }
    })

    const total = subtotal + tax + serviceCharge

    // Create invoice with items
    const invoice = await prisma.invoice.create({
      data: {
        invoiceNumber,
        companyId,
        customerId,
        dueDate: new Date(dueDate),
        subtotal,
        tax,
        serviceCharge,
        total,
        notes,
        items: {
          create: processedItems
        }
      },
      include: {
        company: true,
        customer: true,
        items: {
          orderBy: { sortOrder: 'asc' }
        }
      }
    })

    return NextResponse.json({
      success: true,
      data: invoice
    }, { status: 201 })
  } catch (error) {
    console.error('Error creating invoice:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create invoice' },
      { status: 500 }
    )
  }
}
