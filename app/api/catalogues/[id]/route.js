import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/catalogues/[id] - Get single catalogue
export async function GET(request, { params }) {
  try {
    const id = parseInt(params.id)
    
    const catalogue = await prisma.catalogue.findUnique({
      where: { id }
    })

    if (!catalogue) {
      return NextResponse.json(
        {
          success: false,
          error: 'Catalogue not found'
        },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: catalogue
    })
  } catch (error) {
    console.error('Error fetching catalogue:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch catalogue'
      },
      { status: 500 }
    )
  }
}

// PUT /api/catalogues/[id] - Update catalogue
export async function PUT(request, { params }) {
  try {
    const id = parseInt(params.id)
    const body = await request.json()
    
    const qty = parseInt(body.qty) || 0
    const hargaSatuan = parseFloat(body.hargaSatuan) || 0
    
    const catalogue = await prisma.catalogue.update({
      where: { id },
      data: {
        jenis: body.jenis,
        namaBarang: body.namaBarang,
        spesifikasi: body.spesifikasi,
        qty,
        satuan: body.satuan,
        hargaSatuan,
        jumlah: qty * hargaSatuan,
        foto: body.foto
      }
    })

    return NextResponse.json({
      success: true,
      data: catalogue
    })
  } catch (error) {
    console.error('Error updating catalogue:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to update catalogue'
      },
      { status: 500 }
    )
  }
}

// DELETE /api/catalogues/[id] - Delete catalogue
export async function DELETE(request, { params }) {
  try {
    const id = parseInt(params.id)
    
    await prisma.catalogue.delete({
      where: { id }
    })

    return NextResponse.json({
      success: true,
      message: 'Catalogue deleted successfully'
    })
  } catch (error) {
    console.error('Error deleting catalogue:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to delete catalogue'
      },
      { status: 500 }
    )
  }
}
