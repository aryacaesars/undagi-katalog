const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting seed...')

  // Seed Company (Default)
  console.log('Seeding default company...')
  const defaultCompany = await prisma.company.create({
    data: {
      name: 'UNDAGI',
      address: 'Jl. Raya No. 123, Jakarta Selatan 12345',
      phone: '+62 21 1234 5678',
      email: 'info@undagi.com',
      website: 'www.undagi.com',
      logo: '/Logo.svg',
      isDefault: true
    }
  })

  // Seed Sample Customers
  console.log('Seeding sample customers...')
  const customers = await Promise.all([
    prisma.customer.create({
      data: {
        name: 'PT. Maju Bersama',
        company: 'PT. Maju Bersama',
        address: 'Jl. Sudirman No. 45, Jakarta Pusat 10210',
        phone: '+62 21 5555 1234',
        email: 'purchasing@majubersama.co.id',
        notes: 'Customer corporate dengan order volume besar'
      }
    }),
    prisma.customer.create({
      data: {
        name: 'Budi Santoso',
        company: 'Toko Bangunan Santoso',
        address: 'Jl. Raya Bogor No. 88, Depok 16411',
        phone: '+62 21 8765 4321',
        email: 'budi.santoso@gmail.com',
        notes: 'Customer retail, sering order furniture kantor'
      }
    }),
    prisma.customer.create({
      data: {
        name: 'Sari Dewi',
        address: 'Jl. Melati No. 12, Bekasi 17111',
        phone: '+62 812 3456 7890',
        email: 'sari.dewi@yahoo.com',
        notes: 'Customer individual, fokus pada produk rumah tangga'
      }
    })
  ])

  // Seed Sample Invoice
  console.log('Seeding sample invoice...')
  const sampleInvoice = await prisma.invoice.create({
    data: {
      invoiceNumber: 'INV-000001',
      companyId: defaultCompany.id,
      customerId: customers[0].id,
      dueDate: new Date(Date.now() + (30 * 24 * 60 * 60 * 1000)), // 30 days from now
      subtotal: 5000000,
      tax: 550000, // 11%
      serviceCharge: 100000,
      total: 5650000,
      status: 'SENT',
      notes: 'Invoice contoh untuk testing system',
      items: {
        create: [
          {
            name: 'Kitchen Set Minimalis',
            specification: '3 meter, finishing HPL, include sink',
            quantity: 1,
            unit: 'Set',
            unitPrice: 3500000,
            total: 3500000,
            sortOrder: 1
          },
          {
            name: 'Granite Countertop',
            specification: 'Granite hitam premium, ketebalan 3cm',
            quantity: 3,
            unit: 'M2',
            unitPrice: 500000,
            total: 1500000,
            sortOrder: 2
          }
        ]
      }
    },
    include: {
      items: true
    }
  })

  // Seed Banners
  console.log('Seeding banners...')
  await prisma.banner.createMany({
    data: [
      {
        title: "Renovasi Dapur Modern",
        subtitle: "Desain Contemporary & Minimalis",
        description: "Transformasi dapur Anda dengan desain modern yang menggabungkan fungsi dan estetika terkini",
        image: "https://images.unsplash.com/photo-1556912167-f556f1f39fdf?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80",
        price: "Mulai dari Rp 25 juta",
        rating: 4.9,
        features: ["Kitchen Set Custom", "Granite Countertop", "Built-in Appliances", "LED Lighting"],
        badge: "Paling Populer",
        isActive: true
      },
      {
        title: "Renovasi Dapur Klasik",
        subtitle: "Elegant & Timeless Design",
        description: "Ciptakan suasana hangat dan elegan dengan sentuhan klasik yang tak lekang waktu",
        image: "https://images.unsplash.com/photo-1565538810643-b5bdb714032a?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80",
        price: "Mulai dari Rp 30 juta",
        rating: 4.8,
        features: ["Solid Wood Cabinet", "Marble Countertop", "Vintage Hardware", "Crown Molding"],
        badge: "Premium",
        isActive: true
      },
      {
        title: "Renovasi Dapur Kompak",
        subtitle: "Solusi untuk Ruang Terbatas",
        description: "Maksimalkan fungsi dapur kecil dengan desain cerdas dan storage yang optimal",
        image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80",
        price: "Mulai dari Rp 18 juta",
        rating: 4.7,
        features: ["Space Saving Design", "Multi-functional Storage", "Compact Appliances", "Smart Layout"],
        badge: "Ekonomis",
        isActive: true
      }
    ]
  })

  // Seed Catalogues
  console.log('Seeding catalogues...')
  await prisma.catalogue.createMany({
    data: [
      {
        jenis: 'Elektronik',
        namaBarang: 'Laptop Lenovo ThinkPad',
        spesifikasi: 'Intel Core i5, 8GB RAM, 256GB SSD',
        qty: 10,
        satuan: 'Unit',
        hargaSatuan: 12000000,
        jumlah: 120000000,
        foto: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&h=300&fit=crop'
      },
      {
        jenis: 'Elektronik',
        namaBarang: 'Mouse Wireless Logitech',
        spesifikasi: 'Optical, 2.4GHz, USB Receiver',
        qty: 25,
        satuan: 'Pcs',
        hargaSatuan: 350000,
        jumlah: 8750000,
        foto: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400&h=300&fit=crop'
      },
      {
        jenis: 'Furniture',
        namaBarang: 'Meja Kerja Kayu',
        spesifikasi: '120x60x75 cm, Kayu Jati',
        qty: 5,
        satuan: 'Unit',
        hargaSatuan: 2500000,
        jumlah: 12500000,
        foto: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop'
      },
      {
        jenis: 'Furniture',
        namaBarang: 'Kursi Kantor Ergonomis',
        spesifikasi: 'Adjustable Height, Mesh Back',
        qty: 15,
        satuan: 'Unit',
        hargaSatuan: 1800000,
        jumlah: 27000000,
        foto: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&h=300&fit=crop'
      },
      {
        jenis: 'ATK',
        namaBarang: 'Kertas A4 70gsm',
        spesifikasi: 'White Paper, 500 sheets/ream',
        qty: 50,
        satuan: 'Rim',
        hargaSatuan: 55000,
        jumlah: 2750000,
        foto: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=400&h=300&fit=crop'
      },
      {
        jenis: 'ATK',
        namaBarang: 'Pulpen Pilot',
        spesifikasi: 'Blue Ink, 0.7mm tip',
        qty: 100,
        satuan: 'Pcs',
        hargaSatuan: 3500,
        jumlah: 350000,
        foto: 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=400&h=300&fit=crop'
      },
      {
        jenis: 'Elektronik',
        namaBarang: 'Monitor LED 24 inch',
        spesifikasi: 'Full HD 1920x1080, IPS Panel',
        qty: 8,
        satuan: 'Unit',
        hargaSatuan: 2200000,
        jumlah: 17600000,
        foto: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=400&h=300&fit=crop'
      },
      {
        jenis: 'Furniture',
        namaBarang: 'Lemari Arsip 4 Laci',
        spesifikasi: '40x60x132 cm, Besi dengan Powder Coating',
        qty: 3,
        satuan: 'Unit',
        hargaSatuan: 3200000,
        jumlah: 9600000,
        foto: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop'
      }
    ]
  })

  // Seed default admin user
  console.log('Seeding admin user...')
  await prisma.user.create({
    data: {
      email: 'admin@undagi.com',
      name: 'Admin UNDAGI',
      password: '$2a$10$YourHashedPasswordHere', // You should hash this properly
      role: 'ADMIN'
    }
  })

  // Seed some default settings
  console.log('Seeding settings...')
  await prisma.setting.createMany({
    data: [
      {
        key: 'site_name',
        value: 'UNDAGI Katalog',
        description: 'Nama website'
      },
      {
        key: 'site_description',
        value: 'Platform katalog produk UNDAGI',
        description: 'Deskripsi website'
      },
      {
        key: 'contact_email',
        value: 'info@undagi.com',
        description: 'Email kontak'
      },
      {
        key: 'contact_phone',
        value: '+62 XXX XXXX XXXX',
        description: 'Nomor telepon kontak'
      }
    ]
  })

  console.log('✅ Seed completed successfully!')
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:')
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
