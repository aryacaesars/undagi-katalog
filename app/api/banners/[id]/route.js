import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/banners/[id] - Get single banner
export async function GET(request, { params }) {
  try {
    const id = parseInt(params.id)
    
    const banner = await prisma.banner.findUnique({
      where: { id }
    })

    if (!banner) {
      return NextResponse.json(
        {
          success: false,
          error: 'Banner not found'
        },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: banner
    })
  } catch (error) {
    console.error('Error fetching banner:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch banner'
      },
      { status: 500 }
    )
  }
}

// PUT /api/banners/[id] - Update banner
export async function PUT(request, { params }) {
  try {
    const id = parseInt(params.id)
    const body = await request.json()
    
    const banner = await prisma.banner.update({
      where: { id },
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
    })
  } catch (error) {
    console.error('Error updating banner:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to update banner'
      },
      { status: 500 }
    )
  }
}

// DELETE /api/banners/[id] - Delete banner
export async function DELETE(request, { params }) {
  try {
    const id = parseInt(params.id)
    
    await prisma.banner.delete({
      where: { id }
    })

    return NextResponse.json({
      success: true,
      message: 'Banner deleted successfully'
    })
  } catch (error) {
    console.error('Error deleting banner:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to delete banner'
      },
      { status: 500 }
    )
  }
}
