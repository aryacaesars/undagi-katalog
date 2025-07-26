import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/catalogues - Get all catalogues
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const jenis = searchParams.get('jenis')
    const search = searchParams.get('search')
    const page = parseInt(searchParams.get('page')) || 1
    const limit = parseInt(searchParams.get('limit')) || 10

    const where = {}
    
    if (jenis) {
      where.jenis = {
        contains: jenis,
        mode: 'insensitive'
      }
    }
    
    if (search) {
      where.OR = [
        {
          namaBarang: {
            contains: search,
            mode: 'insensitive'
          }
        },
        {
          spesifikasi: {
            contains: search,
            mode: 'insensitive'
          }
        }
      ]
    }

    const [catalogues, total] = await Promise.all([
      prisma.catalogue.findMany({
        where,
        orderBy: {
          createdAt: 'desc'
        },
        skip: (page - 1) * limit,
        take: limit
      }),
      prisma.catalogue.count({ where })
    ])

    return NextResponse.json({
      success: true,
      data: catalogues,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error('Error fetching catalogues:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch catalogues'
      },
      { status: 500 }
    )
  }
}

// POST /api/catalogues - Create new catalogue
export async function POST(request) {
  try {
    const body = await request.json()
    
    const qty = parseInt(body.qty) || 0
    const hargaSatuan = parseFloat(body.hargaSatuan) || 0
    
    const catalogue = await prisma.catalogue.create({
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
    }, { status: 201 })
  } catch (error) {
    console.error('Error creating catalogue:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to create catalogue'
      },
      { status: 500 }
    )
  }
}
