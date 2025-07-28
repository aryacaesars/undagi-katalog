import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/companies/[id] - Get specific company
export async function GET(request, { params }) {
  try {
    const { id } = params
    
    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Company ID is required' },
        { status: 400 }
      )
    }
    
    const company = await prisma.company.findUnique({
      where: { id: parseInt(id) }
    })
    
    if (!company) {
      return NextResponse.json(
        { success: false, error: 'Company not found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json({ 
      success: true, 
      data: company 
    })
  } catch (error) {
    console.error('Error retrieving company:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to retrieve company' },
      { status: 500 }
    )
  }
}

// PUT /api/companies/[id] - Update company
export async function PUT(request, { params }) {
  try {
    const { id } = params
    const body = await request.json()
    const { name, address, phone, email, website, logo, isDefault } = body
    
    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Company ID is required' },
        { status: 400 }
      )
    }

    // Validate required fields
    if (!name || !address || !phone || !email) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Check if company exists
    const existingCompany = await prisma.company.findUnique({
      where: { id: parseInt(id) }
    })

    if (!existingCompany) {
      return NextResponse.json(
        { success: false, error: 'Company not found' },
        { status: 404 }
      )
    }

    // If setting as default, remove default from other companies
    if (isDefault) {
      await prisma.company.updateMany({
        where: { 
          id: { not: parseInt(id) },
          isDefault: true 
        },
        data: { isDefault: false }
      })
    }

    const updatedCompany = await prisma.company.update({
      where: { id: parseInt(id) },
      data: {
        name,
        address,
        phone,
        email,
        website,
        logo,
        isDefault: isDefault || false
      }
    })
    
    return NextResponse.json({ 
      success: true, 
      data: updatedCompany 
    })
  } catch (error) {
    console.error('Error updating company:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update company' },
      { status: 500 }
    )
  }
}

// DELETE /api/companies/[id] - Delete company
export async function DELETE(request, { params }) {
  try {
    const { id } = params
    
    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Company ID is required' },
        { status: 400 }
      )
    }

    // Check if company exists
    const existingCompany = await prisma.company.findUnique({
      where: { id: parseInt(id) }
    })

    if (!existingCompany) {
      return NextResponse.json(
        { success: false, error: 'Company not found' },
        { status: 404 }
      )
    }

    // Check if company has invoices
    const invoiceCount = await prisma.invoice.count({
      where: { companyId: parseInt(id) }
    })

    if (invoiceCount > 0) {
      return NextResponse.json(
        { success: false, error: 'Cannot delete company with existing invoices' },
        { status: 400 }
      )
    }

    // Delete company
    await prisma.company.delete({
      where: { id: parseInt(id) }
    })
    
    return NextResponse.json({ 
      success: true, 
      message: 'Company deleted successfully' 
    })
  } catch (error) {
    console.error('Error deleting company:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete company' },
      { status: 500 }
    )
  }
}
