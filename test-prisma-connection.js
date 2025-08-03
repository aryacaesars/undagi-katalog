// Test script to check Prisma connection
import { prisma } from './lib/prisma.js'

async function testConnection() {
  try {
    console.log('Testing Prisma connection...')
    
    // Test connection
    await prisma.$connect()
    console.log('✅ Database connected successfully')
    
    // Test query
    const plans = await prisma.pricingPlan.findMany({
      where: { isActive: true },
      take: 1
    })
    
    console.log('✅ Query executed successfully')
    console.log('Number of plans found:', plans.length)
    
    await prisma.$disconnect()
    console.log('✅ Database disconnected')
    
  } catch (error) {
    console.error('❌ Error:', error.message)
    process.exit(1)
  }
}

testConnection()
