// Test script untuk verifikasi Prisma Client
const { PrismaClient } = require('@prisma/client')

async function testPrisma() {
  const prisma = new PrismaClient()
  
  try {
    console.log('Testing Prisma connection...')
    
    // Test connection
    await prisma.$connect()
    console.log('✓ Database connected successfully')
    
    // Test simple query
    const userCount = await prisma.user.count()
    console.log(`✓ User count: ${userCount}`)
    
    // Test if invoice model exists and can be queried
    const invoiceCount = await prisma.invoice.count()
    console.log(`✓ Invoice count: ${invoiceCount}`)
    
    // Test if company model exists and can be queried
    const companyCount = await prisma.company.count()
    console.log(`✓ Company count: ${companyCount}`)
    
    // Test if customer model exists and can be queried
    const customerCount = await prisma.customer.count()
    console.log(`✓ Customer count: ${customerCount}`)
    
    console.log('All tests passed!')
    
  } catch (error) {
    console.error('❌ Test failed:', error)
  } finally {
    await prisma.$disconnect()
  }
}

testPrisma()
