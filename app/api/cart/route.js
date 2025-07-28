import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/cart - Get cart items by session ID
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const sessionId = searchParams.get('sessionId')

    if (!sessionId) {
      return NextResponse.json(
        { success: false, error: 'Session ID is required' },
        { status: 400 }
      )
    }

    // Find or create cart for this session
    let cart = await prisma.cart.findFirst({
      where: { sessionId },
      include: {
        items: {
          include: {
            catalogue: true
          }
        }
      }
    })

    if (!cart) {
      cart = await prisma.cart.create({
        data: {
          sessionId,
          items: {}
        },
        include: {
          items: {
            include: {
              catalogue: true
            }
          }
        }
      })
    }

    // Transform data to match frontend format
    const cartItems = cart.items.map(item => ({
      id: item.catalogue.id,
      namaBarang: item.catalogue.namaBarang,
      spesifikasi: item.catalogue.spesifikasi,
      hargaSatuan: item.catalogue.hargaSatuan,
      jumlah: item.catalogue.jumlah, // Use actual jumlah from catalogues table
      satuan: item.catalogue.satuan,
      foto: item.catalogue.foto,
      jenis: item.catalogue.jenis,
      quantity: item.quantity
    }))

    return NextResponse.json({
      success: true,
      data: {
        cartId: cart.id,
        items: cartItems
      }
    })
  } catch (error) {
    console.error('Error fetching cart:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch cart' },
      { status: 500 }
    )
  }
}

// POST /api/cart - Add item to cart
export async function POST(request) {
  try {
    const body = await request.json()
    const { sessionId, catalogueId, quantity = 1 } = body

    if (!sessionId || !catalogueId) {
      return NextResponse.json(
        { success: false, error: 'Session ID and catalogue ID are required' },
        { status: 400 }
      )
    }

    // Get catalogue item
    const catalogue = await prisma.catalogue.findUnique({
      where: { id: parseInt(catalogueId) }
    })

    if (!catalogue) {
      return NextResponse.json(
        { success: false, error: 'Product not found' },
        { status: 404 }
      )
    }

    // Find or create cart
    let cart = await prisma.cart.findFirst({
      where: { sessionId }
    })

    if (!cart) {
      cart = await prisma.cart.create({
        data: { sessionId }
      })
    }

    // Check if item already exists in cart
    const existingItem = await prisma.cartItem.findUnique({
      where: {
        cartId_catalogueId: {
          cartId: cart.id,
          catalogueId: parseInt(catalogueId)
        }
      }
    })

    if (existingItem) {
      // Update quantity
      await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: {
          quantity: existingItem.quantity + quantity,
          price: catalogue.hargaSatuan
        }
      })
    } else {
      // Add new item
      await prisma.cartItem.create({
        data: {
          cartId: cart.id,
          catalogueId: parseInt(catalogueId),
          quantity,
          price: catalogue.hargaSatuan
        }
      })
    }

    // Return updated cart data
    const updatedCart = await prisma.cart.findFirst({
      where: { sessionId },
      include: {
        items: {
          include: {
            catalogue: true
          }
        }
      }
    })

    // Transform data to match frontend format
    const cartItems = updatedCart.items.map(item => ({
      id: item.catalogue.id,
      namaBarang: item.catalogue.namaBarang,
      spesifikasi: item.catalogue.spesifikasi,
      hargaSatuan: item.catalogue.hargaSatuan,
      jumlah: item.catalogue.jumlah, // Use actual jumlah from catalogues table
      satuan: item.catalogue.satuan,
      foto: item.catalogue.foto,
      jenis: item.catalogue.jenis,
      quantity: item.quantity
    }))

    return NextResponse.json({
      success: true,
      message: 'Item added to cart',
      data: {
        id: updatedCart.id,
        sessionId: updatedCart.sessionId,
        items: cartItems
      }
    })
  } catch (error) {
    console.error('Error adding to cart:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to add item to cart' },
      { status: 500 }
    )
  }
}

// PUT /api/cart - Update cart item quantity
export async function PUT(request) {
  try {
    const body = await request.json()
    const { sessionId, catalogueId, quantity } = body

    if (!sessionId || !catalogueId || quantity < 0) {
      return NextResponse.json(
        { success: false, error: 'Invalid parameters' },
        { status: 400 }
      )
    }

    // Find cart
    const cart = await prisma.cart.findFirst({
      where: { sessionId }
    })

    if (!cart) {
      return NextResponse.json(
        { success: false, error: 'Cart not found' },
        { status: 404 }
      )
    }

    if (quantity === 0) {
      // Remove item
      await prisma.cartItem.deleteMany({
        where: {
          cartId: cart.id,
          catalogueId: parseInt(catalogueId)
        }
      })
    } else {
      // Update quantity
      await prisma.cartItem.updateMany({
        where: {
          cartId: cart.id,
          catalogueId: parseInt(catalogueId)
        },
        data: { quantity }
      })
    }

    // Return updated cart data
    const updatedCart = await prisma.cart.findFirst({
      where: { sessionId },
      include: {
        items: {
          include: {
            catalogue: true
          }
        }
      }
    })

    // Transform data to match frontend format
    const cartItems = updatedCart.items.map(item => ({
      id: item.catalogue.id,
      namaBarang: item.catalogue.namaBarang,
      spesifikasi: item.catalogue.spesifikasi,
      hargaSatuan: item.catalogue.hargaSatuan,
      jumlah: item.catalogue.jumlah, // Use actual jumlah from catalogues table
      satuan: item.catalogue.satuan,
      foto: item.catalogue.foto,
      jenis: item.catalogue.jenis,
      quantity: item.quantity
    }))

    return NextResponse.json({
      success: true,
      message: 'Cart updated successfully',
      data: {
        id: updatedCart.id,
        sessionId: updatedCart.sessionId,
        items: cartItems
      }
    })
  } catch (error) {
    console.error('Error updating cart:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update cart' },
      { status: 500 }
    )
  }
}

// DELETE /api/cart - Remove item from cart or clear cart
export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url)
    const sessionId = searchParams.get('sessionId')
    const catalogueId = searchParams.get('catalogueId')
    const clearAll = searchParams.get('clearAll') === 'true'

    if (!sessionId) {
      return NextResponse.json(
        { success: false, error: 'Session ID is required' },
        { status: 400 }
      )
    }

    // Find cart
    const cart = await prisma.cart.findFirst({
      where: { sessionId }
    })

    if (!cart) {
      return NextResponse.json(
        { success: false, error: 'Cart not found' },
        { status: 404 }
      )
    }

    if (clearAll) {
      // Clear all items
      await prisma.cartItem.deleteMany({
        where: { cartId: cart.id }
      })
    } else if (catalogueId) {
      // Remove specific item
      await prisma.cartItem.deleteMany({
        where: {
          cartId: cart.id,
          catalogueId: parseInt(catalogueId)
        }
      })
    } else {
      return NextResponse.json(
        { success: false, error: 'Either catalogueId or clearAll must be specified' },
        { status: 400 }
      )
    }

    // Return updated cart data
    const updatedCart = await prisma.cart.findFirst({
      where: { sessionId },
      include: {
        items: {
          include: {
            catalogue: true
          }
        }
      }
    })

    // Transform data to match frontend format
    const cartItems = updatedCart.items.map(item => ({
      id: item.catalogue.id,
      namaBarang: item.catalogue.namaBarang,
      spesifikasi: item.catalogue.spesifikasi,
      hargaSatuan: item.catalogue.hargaSatuan,
      jumlah: item.catalogue.jumlah, // Use actual jumlah from catalogues table
      satuan: item.catalogue.satuan,
      foto: item.catalogue.foto,
      jenis: item.catalogue.jenis,
      quantity: item.quantity
    }))

    return NextResponse.json({
      success: true,
      message: 'Item(s) removed from cart',
      data: {
        id: updatedCart.id,
        sessionId: updatedCart.sessionId,
        items: cartItems
      }
    })
  } catch (error) {
    console.error('Error removing from cart:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to remove from cart' },
      { status: 500 }
    )
  }
}
