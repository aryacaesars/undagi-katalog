// Script untuk menambahkan data banner dummy untuk testing
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function seedBanners() {
  try {
    console.log('Adding dummy banner data...')
    
    // Data banner dummy
    const bannerData = [
      {
        title: 'Jasa Pembuatan Dapur Modern',
        subtitle: 'Solusi Dapur Impian Anda',
        description: 'Kami menyediakan jasa pembuatan dapur modern dengan design terkini dan material berkualitas tinggi. Garansi 5 tahun untuk semua produk.',
        image: '/image.png',
        price: 'Mulai dari Rp 15.000.000',
        rating: 4.8,
        features: ['Design Custom', 'Material Premium', 'Garansi 5 Tahun', 'Free Konsultasi'],
        badge: 'POPULER',
        isActive: true
      },
      {
        title: 'Kitchen Set Minimalis',
        subtitle: 'Elegan dan Fungsional', 
        description: 'Kitchen set dengan design minimalis yang cocok untuk rumah modern. Dilengkapi dengan storage yang optimal dan finishing premium.',
        image: '/image.png',
        price: 'Mulai dari Rp 8.500.000',
        rating: 4.6,
        features: ['Design Minimalis', 'Storage Optimal', 'Finishing Premium', 'Mudah Dibersihkan'],
        badge: 'PROMO',
        isActive: true
      },
      {
        title: 'Renovasi Dapur Tradisional',
        subtitle: 'Sentuhan Klasik Modern',
        description: 'Transformasi dapur tradisional menjadi modern tanpa kehilangan nilai klasiknya. Dengan perpaduan material kayu dan teknologi terkini.',
        image: '/image.png', 
        price: 'Mulai dari Rp 12.000.000',
        rating: 4.7,
        features: ['Perpaduan Klasik-Modern', 'Material Kayu Berkualitas', 'Teknologi Terkini', 'Konsep Unik'],
        badge: 'NEW',
        isActive: true
      }
    ]

    // Insert data
    for (const banner of bannerData) {
      await prisma.banner.create({
        data: banner
      })
    }

    console.log('✅ Dummy banner data added successfully!')
    
    // Check hasil
    const allBanners = await prisma.banner.findMany()
    console.log(`Total banners in database: ${allBanners.length}`)
    
  } catch (error) {
    console.error('❌ Error adding banner data:', error)
  } finally {
    await prisma.$disconnect()
  }
}

seedBanners()
