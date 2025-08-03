# PT. Gurita Bisnis Undagi - Website Katalog & Layanan

Website resmi PT. Gurita Bisnis Undagi yang bergerak di bidang layanan jasa konstruksi dan pengadaan peralatan dapur industri. Website ini menyediakan katalog lengkap peralatan dapur industri dan informasi layanan konstruksi dapur sehat MBG.

## 🏢 Tentang Perusahaan

PT. Gurita Bisnis Undagi adalah perusahaan yang bergerak di bidang:
- **Jasa Konstruksi Dapur Industri** - Pembangunan dan renovasi dapur untuk industri makanan
- **Pengadaan Peralatan Dapur** - Supplier peralatan dapur industri dan komersial lengkap
- **Instalasi Utilitas** - Instalasi listrik, gas, air, dan ventilasi untuk dapur industri
- **Pendampingan Sertifikasi SLHS** - Bantuan mendapatkan Sertifikat Laik Higiene dan Sanitasi

### Keunggulan Kami:
✅ Berpengalaman dalam proyek dapur sehat skala besar  
✅ Jaminan mutu pekerjaan terpercaya  
✅ Waktu pelaksanaan yang terukur dan tepat waktu  
✅ Layanan purna jual yang responsif  
✅ Tim ahli berpengalaman di bidang konstruksi dapur industri  

## 🚀 Fitur Website

### Untuk Pengunjung:
- **Katalog Peralatan Dapur** - Browsing dan pencarian peralatan dapur industri
- **Banner Layanan** - Informasi layanan konstruksi dan renovasi dapur
- **Keranjang Belanja** - Sistem keranjang untuk inquiry produk
- **WhatsApp Integration** - Kontak langsung via WhatsApp floating button
- **Responsive Design** - Optimized untuk desktop dan mobile

### Untuk Admin (Dashboard):
- **Manajemen Katalog** - CRUD operations untuk produk katalog
- **Manajemen Banner** - CRUD operations untuk banner layanan
- **Pricing Plans Management** - CRUD pricing plans dengan CSV import/export
- **Bulk Operations** - Import/export data katalog dan pricing plans
- **Media Management** - Upload dan manajemen gambar produk
- **CSV Import/Export** - Import data dalam jumlah banyak menggunakan CSV

## 🛠 Teknologi yang Digunakan

- **Framework**: Next.js 15.4.4 (App Router)
- **UI Library**: React 19.1.0
- **Styling**: Tailwind CSS 4.0
- **Database**: PostgreSQL dengan Prisma ORM
- **Components**: Radix UI + Custom Components
- **Icons**: Lucide React + Tabler Icons
- **Image Optimization**: Next.js Image dengan AVIF/WebP
- **SEO**: Structured Data (JSON-LD), Meta Tags, Sitemap

## 📱 SEO & Performance

Website ini telah dioptimasi untuk SEO dengan:
- **Structured Data** - Schema.org markup untuk Organization, LocalBusiness, Product, Service
- **Meta Tags** - Comprehensive meta tags untuk setiap halaman
- **Sitemap.xml** - Automated sitemap generation
- **Robots.txt** - Search engine crawling guidelines
- **Open Graph** - Social media sharing optimization
- **Performance** - Image optimization, code splitting, compression

### Target Keywords:
- Jasa konstruksi dapur industri
- Renovasi dapur sehat MBG
- Peralatan dapur industri
- Kitchen equipment supplier Indonesia
- Sertifikasi SLHS
- Instalasi utilitas dapur

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- PostgreSQL database
- Git

### Installation

1. **Clone repository**
```bash
git clone https://github.com/aryacaesars/undagi-katalog.git
cd undagi-katalog
```

2. **Install dependencies**
```bash
npm install
```

3. **Setup environment variables**
```bash
cp .env.example .env.local
```

Edit `.env.local` dengan konfigurasi database:
```env
DATABASE_URL="postgresql://username:password@localhost:5432/undagi_katalog"
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://localhost:3000"
NEXT_PUBLIC_GA_ID="your-google-analytics-id"
```

4. **Setup database**
```bash
# Generate Prisma client
npm run db:generate

# Run migrations
npm run db:migrate

# Seed initial data
npm run db:seed
```

5. **Run development server**
```bash
npm run dev
```

Website akan tersedia di [http://localhost:3000](http://localhost:3000)

## 📊 Database Schema

### Tables:
- **Banner** - Layanan konstruksi dan renovasi
  - id, title, subtitle, description, image, price, rating, features, badge, isActive
- **Catalogue** - Produk peralatan dapur
  - id, namaBarang, jenis, deskripsi, harga, gambar, stok

### API Endpoints:
- `GET/POST /api/banners` - Banner management
- `GET/PUT/DELETE /api/banners/[id]` - Individual banner
- `GET/POST /api/catalogues` - Catalogue management  
- `GET/PUT/DELETE /api/catalogues/[id]` - Individual product
- `POST /api/catalogues/bulk` - Bulk operations

## 🎯 SEO Strategy

### On-Page SEO:
- Optimized title tags and meta descriptions
- Structured data markup (JSON-LD)
- Header tag hierarchy (H1, H2, H3)  
- Internal linking structure
- Image alt text optimization
- URL structure optimization

### Technical SEO:
- Core Web Vitals optimization
- Mobile-first responsive design
- Page speed optimization
- XML sitemap
- Robots.txt configuration
- Canonical URLs
- Open Graph and Twitter Card tags

### Content Strategy:
- Industry-focused keywords
- Local SEO for Indonesian market
- Service-based content optimization
- Product catalog SEO
- Business information structured data

## 📈 Analytics & Tracking

- Google Analytics 4 integration
- User behavior tracking
- Conversion tracking
- Form submission tracking
- WhatsApp click tracking
- Scroll depth monitoring
- Session duration analysis

## 🚀 Deployment

### Production Build:
```bash
npm run build
npm start
```

### Environment Setup:
- Set production DATABASE_URL
- Configure Google Analytics ID
- Set up domain-specific environment variables
- Enable HTTPS and security headers

### Recommended Hosting:
- **Vercel** (Recommended) - Automatic deployments dari Git
- **Netlify** - JAMstack optimized hosting  
- **Railway** - Full-stack dengan database
- **DigitalOcean** - VPS dengan custom configuration

## 📞 Kontak & Layanan

Untuk informasi lebih lanjut mengenai layanan konstruksi dapur industri:

- **Website**: [undagi-katalog.vercel.app](https://undagi-katalog.vercel.app)
- **Email**: Tersedia melalui website
- **WhatsApp**: Floating button di website
- **Layanan**: Konstruksi, Renovasi, Pengadaan Peralatan, Sertifikasi SLHS

---

## 🤝 Contributing

Kontribusi untuk pengembangan website ini sangat diterima. Silakan:

1. Fork repository
2. Buat feature branch (`git checkout -b feature/amazing-feature`)
3. Commit perubahan (`git commit -m 'Add amazing feature'`)
4. Push ke branch (`git push origin feature/amazing-feature`)
5. Buka Pull Request

## 📄 License

Website ini dikembangkan untuk PT. Gurita Bisnis Undagi. All rights reserved.

---

**PT. Gurita Bisnis Undagi**  
*Spesialis Jasa Konstruksi & Peralatan Dapur Industri*
