import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// POST /api/catalogues/bulk - Bulk import catalogues
export async function POST(request) {
  try {
    const body = await request.json()
    const { catalogues } = body

    if (!Array.isArray(catalogues) || catalogues.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid catalogues data'
        },
        { status: 400 }
      )
    }

    // Validate and transform data
    const validCatalogues = catalogues
      .filter(item => item.namaBarang && item.namaBarang.trim())
      .map(item => {
        const qty = parseInt(item.qty) || 0
        const hargaSatuan = parseFloat(item.hargaSatuan) || 0
        
        return {
          jenis: item.jenis || '',
          namaBarang: item.namaBarang.trim(),
          spesifikasi: item.spesifikasi || '',
          qty,
          satuan: item.satuan || 'Unit',
          hargaSatuan,
          jumlah: qty * hargaSatuan,
          foto: item.foto || 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=400&h=300&fit=crop'
        }
      })

    if (validCatalogues.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: 'No valid catalogue items found'
        },
        { status: 400 }
      )
    }

    // Bulk create catalogues
    const result = await prisma.catalogue.createMany({
      data: validCatalogues,
      skipDuplicates: true
    })

    return NextResponse.json({
      success: true,
      data: {
        created: result.count,
        total: catalogues.length,
        skipped: catalogues.length - result.count
      },
      message: `Successfully created ${result.count} catalogue items`
    }, { status: 201 })
  } catch (error) {
    console.error('Error bulk creating catalogues:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to bulk create catalogues'
      },
      { status: 500 }
    )
  }
}

// DELETE /api/catalogues/bulk - Bulk delete catalogues
export async function DELETE(request) {
  try {
    const body = await request.json()
    const { ids } = body

    if (!Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid IDs data'
        },
        { status: 400 }
      )
    }

    const result = await prisma.catalogue.deleteMany({
      where: {
        id: {
          in: ids.map(id => parseInt(id))
        }
      }
    })

    return NextResponse.json({
      success: true,
      data: {
        deleted: result.count
      },
      message: `Successfully deleted ${result.count} catalogue items`
    })
  } catch (error) {
    console.error('Error bulk deleting catalogues:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to bulk delete catalogues'
      },
      { status: 500 }
    )
  }
}
