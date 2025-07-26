import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/banners - Get all banners
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const activeOnly = searchParams.get('active') === 'true'

    const banners = await prisma.banner.findMany({
      where: activeOnly ? { isActive: true } : {},
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json({
      success: true,
      data: banners
    })
  } catch (error) {
    console.error('Error fetching banners:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch banners'
      },
      { status: 500 }
    )
  }
}

// POST /api/banners - Create new banner
export async function POST(request) {
  try {
    const body = await request.json()
    
    const banner = await prisma.banner.create({
      data: {
        title: body.title,
        subtitle: body.subtitle,
        description: body.description,
        image: body.image,
        price: body.price,
        rating: body.rating ? parseFloat(body.rating) : null,
        features: body.features || [],
        badge: body.badge,
        isActive: body.isActive !== undefined ? body.isActive : true
      }
    })

    return NextResponse.json({
      success: true,
      data: banner
    }, { status: 201 })
  } catch (error) {
    console.error('Error creating banner:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to create banner'
      },
      { status: 500 }
    )
  }
}
