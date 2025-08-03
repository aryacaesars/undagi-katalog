const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  // Clear existing data
  console.log('🧹 Cleaning existing data...');
  await prisma.invoiceItem.deleteMany();
  await prisma.invoice.deleteMany();
  await prisma.customer.deleteMany();
  await prisma.company.deleteMany();
  await prisma.cartItem.deleteMany();
  await prisma.cart.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.catalogue.deleteMany();
  await prisma.banner.deleteMany();
  await prisma.user.deleteMany();
  await prisma.setting.deleteMany();
  await prisma.pricingPlan.deleteMany();

  // Seed Companies
  console.log('🏢 Seeding companies...');
  const companies = await prisma.company.createMany({
    data: [
      {
        name: 'UNDAGI Solutions',
        address: 'Jl. Teknologi No. 123, Jakarta Selatan 12345',
        phone: '+62 21 1234 5678',
        email: 'info@undagi.com',
        website: 'https://undagi.com',
        logo: '/logos/undagi-logo.png',
        isDefault: true,
      },
      {
        name: 'PT Mitra Konstruksi',
        address: 'Jl. Pembangunan No. 456, Bandung 40123',
        phone: '+62 22 9876 5432',
        email: 'contact@mitrakonstruksi.co.id',
        website: 'https://mitrakonstruksi.co.id',
        logo: '/logos/mitra-logo.png',
        isDefault: false,
      },
    ],
  });

  // Seed Customers
  console.log('👥 Seeding customers...');
  const customers = await prisma.customer.createMany({
    data: [
      {
        name: 'Budi Santoso',
        company: 'PT Karya Mandiri',
        address: 'Jl. Mawar No. 789, Surabaya 60123',
        phone: '+62 31 1111 2222',
        email: 'budi.santoso@karyamandiri.co.id',
        notes: 'Pelanggan VIP - prioritas tinggi',
      },
      {
        name: 'Siti Nurhaliza',
        company: 'CV Berkah Jaya',
        address: 'Jl. Melati No. 321, Yogyakarta 55123',
        phone: '+62 274 3333 4444',
        email: 'siti@berkahjaya.com',
        notes: 'Repeat customer, pembayaran selalu tepat waktu',
      },
      {
        name: 'Ahmad Wijaya',
        company: null,
        address: 'Jl. Kenanga No. 654, Medan 20123',
        phone: '+62 61 5555 6666',
        email: 'ahmad.wijaya@gmail.com',
        notes: 'Pelanggan individu',
      },
    ],
  });

  // Seed Users
  console.log('👤 Seeding users...');
  const users = await prisma.user.createMany({
    data: [
      {
        email: 'admin@undagi.com',
        name: 'Admin UNDAGI',
        password: '$2a$10$example.hash.for.admin', // In real app, use proper bcrypt hash
        role: 'SUPER_ADMIN',
      },
      {
        email: 'operator@undagi.com',
        name: 'Operator',
        password: '$2a$10$example.hash.for.operator',
        role: 'ADMIN',
      },
      {
        email: 'user@undagi.com',
        name: 'Regular User',
        password: '$2a$10$example.hash.for.user',
        role: 'USER',
      },
    ],
  });

  // Seed Banners
  console.log('🎯 Seeding banners...');
  const banners = await prisma.banner.createMany({
    data: [
      {
        title: 'Solusi Konstruksi Terpercaya',
        subtitle: 'Katalog Lengkap untuk Kebutuhan Proyek Anda',
        description: 'Temukan berbagai produk berkualitas tinggi untuk mendukung proyek konstruksi dan renovasi Anda. Dari alat elektronik hingga furniture, semua tersedia dengan harga kompetitif.',
        image: '/banners/hero-construction.jpg',
        price: 'Mulai dari Rp 50.000',
        rating: 4.8,
        features: ['Kualitas Terjamin', 'Harga Kompetitif', 'Pengiriman Cepat', 'Garansi Resmi'],
        badge: 'Best Seller',
        isActive: true,
      },
      {
        title: 'Promo Spesial Akhir Tahun',
        subtitle: 'Diskon hingga 30% untuk Semua Kategori',
        description: 'Jangan lewatkan kesempatan emas ini! Dapatkan diskon fantastis untuk semua produk di katalog kami.',
        image: '/banners/promo-banner.jpg',
        price: 'Hemat hingga Rp 500.000',
        rating: 4.9,
        features: ['Diskon 30%', 'Gratis Ongkir', 'Bonus Hadiah', 'Cicilan 0%'],
        badge: 'Limited Time',
        isActive: true,
      },
    ],
  });

  // Seed Catalogues
  console.log('📦 Seeding catalogues...');
  const catalogues = await prisma.catalogue.createMany({
    data: [
      // Elektronik
      {
        jenis: 'Elektronik',
        namaBarang: 'Laptop Gaming ASUS ROG',
        spesifikasi: 'Intel Core i7, RAM 16GB, SSD 1TB, RTX 3060',
        qty: 25,
        satuan: 'Unit',
        hargaSatuan: 18500000,
        jumlah: 462500000,
        foto: '/products/laptop-asus-rog.jpg',
      },
      {
        jenis: 'Elektronik',
        namaBarang: 'Smartphone Samsung Galaxy S24',
        spesifikasi: 'RAM 8GB, Storage 256GB, Camera 108MP',
        qty: 50,
        satuan: 'Unit',
        hargaSatuan: 12000000,
        jumlah: 600000000,
        foto: '/products/samsung-s24.jpg',
      },
      {
        jenis: 'Elektronik',
        namaBarang: 'Monitor LG UltraWide 34"',
        spesifikasi: '3440x1440, IPS Panel, 144Hz, HDR10',
        qty: 15,
        satuan: 'Unit',
        hargaSatuan: 8500000,
        jumlah: 127500000,
        foto: '/products/lg-ultrawide.jpg',
      },
      
      // Furniture
      {
        jenis: 'Furniture',
        namaBarang: 'Meja Kerja Ergonomis',
        spesifikasi: 'Bahan kayu jati, tinggi adjustable, lebar 120cm',
        qty: 30,
        satuan: 'Unit',
        hargaSatuan: 2500000,
        jumlah: 75000000,
        foto: '/products/meja-kerja.jpg',
      },
      {
        jenis: 'Furniture',
        namaBarang: 'Kursi Gaming DXRacer',
        spesifikasi: 'Ergonomic design, PU leather, lumbar support',
        qty: 40,
        satuan: 'Unit',
        hargaSatuan: 3200000,
        jumlah: 128000000,
        foto: '/products/kursi-gaming.jpg',
      },
      {
        jenis: 'Furniture',
        namaBarang: 'Lemari Arsip 4 Laci',
        spesifikasi: 'Besi tebal, sistem kunci, anti karat',
        qty: 20,
        satuan: 'Unit',
        hargaSatuan: 1800000,
        jumlah: 36000000,
        foto: '/products/lemari-arsip.jpg',
      },

      // ATK (Alat Tulis Kantor)
      {
        jenis: 'ATK',
        namaBarang: 'Kertas A4 80gsm',
        spesifikasi: 'Kertas putih berkualitas tinggi, 500 lembar per rim',
        qty: 100,
        satuan: 'Rim',
        hargaSatuan: 65000,
        jumlah: 6500000,
        foto: '/products/kertas-a4.jpg',
      },
      {
        jenis: 'ATK',
        namaBarang: 'Pulpen Pilot G2',
        spesifikasi: 'Tinta gel hitam, grip nyaman, retractable',
        qty: 500,
        satuan: 'Pcs',
        hargaSatuan: 15000,
        jumlah: 7500000,
        foto: '/products/pulpen-pilot.jpg',
      },
      {
        jenis: 'ATK',
        namaBarang: 'Stapler Joyko HD-50',
        spesifikasi: 'Heavy duty, kapasitas 50 lembar, anti jam',
        qty: 75,
        satuan: 'Unit',
        hargaSatuan: 85000,
        jumlah: 6375000,
        foto: '/products/stapler-joyko.jpg',
      },

      // Alat Konstruksi
      {
        jenis: 'Alat Konstruksi',
        namaBarang: 'Bor Listrik Bosch GSB 550',
        spesifikasi: '550W, Chuck 13mm, Hammer function',
        qty: 35,
        satuan: 'Unit',
        hargaSatuan: 1200000,
        jumlah: 42000000,
        foto: '/products/bor-bosch.jpg',
      },
      {
        jenis: 'Alat Konstruksi',
        namaBarang: 'Gergaji Mesin Circular Makita',
        spesifikasi: '1200W, blade 185mm, laser guide',
        qty: 20,
        satuan: 'Unit',
        hargaSatuan: 2800000,
        jumlah: 56000000,
        foto: '/products/gergaji-makita.jpg',
      },
      {
        jenis: 'Alat Konstruksi',
        namaBarang: 'Tang Kombinasi Stanley',
        spesifikasi: '8 inch, chrome vanadium steel, comfort grip',
        qty: 60,
        satuan: 'Pcs',
        hargaSatuan: 150000,
        jumlah: 9000000,
        foto: '/products/tang-stanley.jpg',
      },
    ],
  });

  // Get created records for foreign keys
  const companyRecords = await prisma.company.findMany();
  const customerRecords = await prisma.customer.findMany();
  const catalogueRecords = await prisma.catalogue.findMany();

  // Seed Settings
  console.log('⚙️ Seeding settings...');
  const settings = await prisma.setting.createMany({
    data: [
      {
        key: 'site_name',
        value: 'UNDAGI Katalog',
        description: 'Nama website',
      },
      {
        key: 'site_description',
        value: 'Platform katalog produk untuk kebutuhan konstruksi dan kantor',
        description: 'Deskripsi website',
      },
      {
        key: 'contact_email',
        value: 'info@undagi.com',
        description: 'Email kontak utama',
      },
      {
        key: 'contact_phone',
        value: '+62 21 1234 5678',
        description: 'Nomor telepon kontak',
      },
      {
        key: 'whatsapp_number',
        value: '6281234567890',
        description: 'Nomor WhatsApp untuk floating button',
      },
      {
        key: 'invoice_prefix',
        value: 'INV',
        description: 'Prefix untuk nomor invoice',
      },
      {
        key: 'default_tax_rate',
        value: '11',
        description: 'Rate pajak default (PPN 11%)',
      },
    ],
  });

  // Seed Sample Invoices
  console.log('📄 Seeding sample invoices...');
  const invoices = await prisma.invoice.createMany({
    data: [
      {
        invoiceNumber: 'INV-2025-001',
        companyId: companyRecords[0].id,
        customerId: customerRecords[0].id,
        date: new Date('2025-01-15'),
        dueDate: new Date('2025-02-14'),
        subtotal: 21000000,
        tax: 2310000,
        serviceCharge: 0,
        total: 23310000,
        status: 'SENT',
        notes: 'Pembayaran dapat dilakukan melalui transfer bank',
      },
      {
        invoiceNumber: 'INV-2025-002',
        companyId: companyRecords[0].id,
        customerId: customerRecords[1].id,
        date: new Date('2025-01-20'),
        dueDate: new Date('2025-02-19'),
        subtotal: 5700000,
        tax: 627000,
        serviceCharge: 100000,
        total: 6427000,
        status: 'PAID',
        notes: 'Terima kasih atas pembayaran yang tepat waktu',
      },
    ],
  });

  // Get invoice records for invoice items
  const invoiceRecords = await prisma.invoice.findMany();

  // Seed Invoice Items
  console.log('📋 Seeding invoice items...');
  await prisma.invoiceItem.createMany({
    data: [
      // Items for first invoice
      {
        invoiceId: invoiceRecords[0].id,
        name: 'Laptop Gaming ASUS ROG',
        specification: 'Intel Core i7, RAM 16GB, SSD 1TB, RTX 3060',
        quantity: 1,
        unit: 'Unit',
        unitPrice: 18500000,
        total: 18500000,
        sortOrder: 1,
      },
      {
        invoiceId: invoiceRecords[0].id,
        name: 'Meja Kerja Ergonomis',
        specification: 'Bahan kayu jati, tinggi adjustable, lebar 120cm',
        quantity: 1,
        unit: 'Unit',
        unitPrice: 2500000,
        total: 2500000,
        sortOrder: 2,
      },
      // Items for second invoice
      {
        invoiceId: invoiceRecords[1].id,
        name: 'Kursi Gaming DXRacer',
        specification: 'Ergonomic design, PU leather, lumbar support',
        quantity: 1,
        unit: 'Unit',
        unitPrice: 3200000,
        total: 3200000,
        sortOrder: 1,
      },
      {
        invoiceId: invoiceRecords[1].id,
        name: 'Monitor LG UltraWide 34"',
        specification: '3440x1440, IPS Panel, 144Hz, HDR10',
        quantity: 1,
        unit: 'Unit',
        unitPrice: 2500000,
        total: 2500000,
        sortOrder: 2,
      },
    ],
  });

  // Seed Pricing Plans
  console.log('💰 Seeding pricing plans...');
  const pricingPlans = await prisma.pricingPlan.createMany({
    data: [
      {
        name: 'Basic',
        subtitle: 'Solusi Dasar Terjangkau',
        price: '15 juta',
        originalPrice: '20 juta',
        discount: '25%',
        description: 'Paket dasar untuk renovasi dapur kecil dengan kualitas standar yang baik',
        features: [
          'Kitchen set standar (HPL finish)',
          'Countertop granite lokal',
          'Sink stainless steel 1 bowl',
          'Kran air standar',
          'Instalasi listrik dasar',
          'Cat tembok anti jamur',
          'Garansi 1 tahun'
        ],
        limitations: [
          'Maksimal 3 meter linear',
          'Tidak termasuk appliances',
          'Desain template'
        ],
        popular: false,
        color: 'blue',
        sortOrder: 1,
        isActive: true
      },
      {
        name: 'Regular',
        subtitle: 'Pilihan Terpopuler',
        price: '35 juta',
        originalPrice: '45 juta',
        discount: '22%',
        description: 'Paket lengkap dengan kualitas premium dan fitur tambahan yang optimal',
        features: [
          'Kitchen set custom (Polyurethane finish)',
          'Countertop granite import/quartz',
          'Sink stainless steel double bowl',
          'Kran air dengan spray',
          'Instalasi listrik + under cabinet LED',
          'Backsplash keramik premium',
          'Exhaust fan powerful',
          'Cat anti jamur & mudah dibersihkan',
          'Soft closing drawer & door',
          'Garansi 2 tahun'
        ],
        limitations: [
          'Maksimal 5 meter linear',
          '1 appliance included'
        ],
        popular: true,
        color: 'red',
        sortOrder: 2,
        isActive: true
      },
      {
        name: 'Premium',
        subtitle: 'Luxury & Exclusive',
        price: '65 juta',
        originalPrice: '85 juta',
        discount: '24%',
        description: 'Paket premium dengan material terbaik dan desain eksklusif sesuai keinginan',
        features: [
          'Kitchen set full custom (Lacquer finish)',
          'Countertop marble/engineered stone',
          'Sink granite/ceramic premium',
          'Kran pull-out dengan filter',
          'Smart lighting system',
          'Backsplash natural stone/mosaic',
          'Range hood stainless steel',
          'Kitchen island (opsional)',
          'Built-in appliances premium',
          'Soft close full extension',
          'Smart storage solutions',
          'Konsultasi desainer',
          'Garansi 3 tahun'
        ],
        limitations: [],
        popular: false,
        color: 'purple',
        sortOrder: 3,
        isActive: true
      }
    ]
  });

  console.log('✅ Database seeding completed successfully!');
  console.log('📊 Summary:');
  console.log(`   - Companies: ${companyRecords.length}`);
  console.log(`   - Customers: ${customerRecords.length}`);
  console.log(`   - Catalogues: ${catalogueRecords.length}`);
  console.log(`   - Invoices: ${invoiceRecords.length}`);
  console.log(`   - Banners: 2`);
  console.log(`   - Users: 3`);
  console.log(`   - Settings: 7`);
  console.log(`   - Pricing Plans: 3`);
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
