import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    // Test database connection
    await prisma.$connect()
    
    // Test simple query
    const count = await prisma.user.count()
    
    return NextResponse.json({
      success: true,
      message: 'Database connection successful',
      userCount: count
    })
  } catch (error) {
    console.error('Database connection error:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: error.message,
        stack: error.stack 
      },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}
