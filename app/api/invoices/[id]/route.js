import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/invoices/[id] - Get specific invoice
export async function GET(request, { params }) {
  try {
    const { id } = params
    
    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Invoice ID is required' },
        { status: 400 }
      )
    }
    
    const invoice = await prisma.invoice.findUnique({
      where: { id: parseInt(id) },
      include: {
        company: true,
        customer: true,
        items: {
          orderBy: { sortOrder: 'asc' }
        }
      }
    })
    
    if (!invoice) {
      return NextResponse.json(
        { success: false, error: 'Invoice not found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json({ 
      success: true, 
      data: invoice 
    })
  } catch (error) {
    console.error('Error retrieving invoice:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to retrieve invoice' },
      { status: 500 }
    )
  }
}

// PUT /api/invoices/[id] - Update invoice
export async function PUT(request, { params }) {
  try {
    const { id } = params
    const body = await request.json()
    const {
      companyId,
      customerId,
      dueDate,
      items,
      tax = 0,
      serviceCharge = 0,
      status,
      notes
    } = body
    
    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Invoice ID is required' },
        { status: 400 }
      )
    }

    // Check if invoice exists
    const existingInvoice = await prisma.invoice.findUnique({
      where: { id: parseInt(id) }
    })

    if (!existingInvoice) {
      return NextResponse.json(
        { success: false, error: 'Invoice not found' },
        { status: 404 }
      )
    }

    // Prepare update data
    const updateData = {}
    
    if (companyId) updateData.companyId = companyId
    if (customerId) updateData.customerId = customerId
    if (dueDate) updateData.dueDate = new Date(dueDate)
    if (status) updateData.status = status
    if (notes !== undefined) updateData.notes = notes

    // If items are provided, recalculate totals
    if (items && Array.isArray(items)) {
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

      updateData.subtotal = subtotal
      updateData.tax = tax
      updateData.serviceCharge = serviceCharge
      updateData.total = subtotal + tax + serviceCharge

      // Delete existing items and create new ones
      await prisma.invoiceItem.deleteMany({
        where: { invoiceId: parseInt(id) }
      })

      updateData.items = {
        create: processedItems
      }
    }

    const updatedInvoice = await prisma.invoice.update({
      where: { id: parseInt(id) },
      data: updateData,
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
      data: updatedInvoice 
    })
  } catch (error) {
    console.error('Error updating invoice:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update invoice' },
      { status: 500 }
    )
  }
}

// DELETE /api/invoices/[id] - Delete invoice
export async function DELETE(request, { params }) {
  try {
    const { id } = params
    
    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Invoice ID is required' },
        { status: 400 }
      )
    }

    // Check if invoice exists
    const existingInvoice = await prisma.invoice.findUnique({
      where: { id: parseInt(id) }
    })

    if (!existingInvoice) {
      return NextResponse.json(
        { success: false, error: 'Invoice not found' },
        { status: 404 }
      )
    }

    // Delete invoice (items will be deleted automatically due to cascade)
    await prisma.invoice.delete({
      where: { id: parseInt(id) }
    })
    
    return NextResponse.json({ 
      success: true, 
      message: 'Invoice deleted successfully' 
    })
  } catch (error) {
    console.error('Error deleting invoice:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete invoice' },
      { status: 500 }
    )
  }
}
