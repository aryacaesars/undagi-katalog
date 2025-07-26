// Dynamic meta tag generation berdasarkan konten

export function generateCatalogueMetadata(item) {
  const title = `${item.namaBarang} - Peralatan Dapur Industri | PT. Gurita Bisnis Undagi`
  const description = `${item.namaBarang} berkualitas untuk dapur industri dan komersial. ${item.deskripsi} Harga ${item.harga}. Tersedia di PT. Gurita Bisnis Undagi - Spesialis peralatan dapur industri.`
  
  return {
    title,
    description,
    keywords: [
      item.namaBarang,
      item.jenis,
      'peralatan dapur industri',
      'kitchen equipment',
      'dapur komersial',
      'undagi',
      'PT Gurita Bisnis Undagi'
    ].join(', '),
    openGraph: {
      title,
      description,
      images: [
        {
          url: item.gambar || '/Logo.svg',
          width: 1200,
          height: 630,
          alt: item.namaBarang,
        },
      ],
      type: 'product',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [item.gambar || '/Logo.svg'],
    },
  }
}

export function generateServiceMetadata(service) {
  const title = `${service.title} - Layanan Konstruksi Dapur | PT. Gurita Bisnis Undagi`
  const description = `${service.description} ${service.price}. Layanan konstruksi dan renovasi dapur industri terpercaya dengan pengalaman proyek skala besar.`
  
  return {
    title,
    description,
    keywords: [
      service.title,
      'jasa konstruksi dapur',
      'renovasi dapur industri',
      'dapur sehat MBG',
      'undagi',
      'PT Gurita Bisnis Undagi'
    ].join(', '),
    openGraph: {
      title,
      description,
      images: [
        {
          url: service.image || '/Logo.svg',
          width: 1200,
          height: 630,
          alt: service.title,
        },
      ],
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [service.image || '/Logo.svg'],
    },
  }
}

export function generateCategoryMetadata(category) {
  const title = `${category} - Kategori Peralatan Dapur | PT. Gurita Bisnis Undagi`
  const description = `Jelajahi koleksi ${category} terlengkap untuk dapur industri dan komersial. Kualitas terjamin dari PT. Gurita Bisnis Undagi - Spesialis peralatan dapur industri.`
  
  return {
    title,
    description,
    keywords: [
      category,
      'peralatan dapur industri',
      'kitchen equipment',
      'dapur komersial',
      'undagi',
      'PT Gurita Bisnis Undagi'
    ].join(', '),
    openGraph: {
      title,
      description,
      type: 'website',
    },
  }
}

export function generatePageMetadata(pageName, pageDescription, additionalKeywords = []) {
  const title = `${pageName} | UNDAGI | KATALOG`
  const description = `${pageDescription} PT. Gurita Bisnis Undagi - Spesialis jasa konstruksi dan peralatan dapur industri.`
  
  const keywords = [
    ...additionalKeywords,
    'undagi',
    'PT Gurita Bisnis Undagi',
    'jasa konstruksi dapur',
    'peralatan dapur industri'
  ].join(', ')
  
  return {
    title,
    description,
    keywords,
    openGraph: {
      title,
      description,
      type: 'website',
    },
    twitter: {
      card: 'summary',
      title,
      description,
    },
  }
}

// Generate breadcrumb data
export function generateBreadcrumbs(path, params = {}) {
  const baseUrl = 'https://katalog.undagicorp.com'
  const breadcrumbs = [
    { name: 'Beranda', url: baseUrl }
  ]
  
  switch (path) {
    case '/dashboard':
      breadcrumbs.push({ name: 'Dashboard', url: `${baseUrl}/dashboard` })
      break
    case '/keranjang':
      breadcrumbs.push({ name: 'Keranjang', url: `${baseUrl}/keranjang` })
      break
    case '/catalogue':
      breadcrumbs.push({ name: 'Katalog', url: `${baseUrl}#catalogue` })
      if (params.category) {
        breadcrumbs.push({ 
          name: params.category, 
          url: `${baseUrl}#catalogue?category=${params.category}` 
        })
      }
      break
    default:
      break
  }
  
  return breadcrumbs
}

// Generate JSON-LD untuk produk
export function generateProductSchema(item) {
  return {
    "@context": "https://schema.org/",
    "@type": "Product",
    "name": item.namaBarang,
    "description": item.deskripsi,
    "image": item.gambar,
    "sku": item.id.toString(),
    "category": item.jenis,
    "brand": {
      "@type": "Brand",
      "name": "PT. Gurita Bisnis Undagi"
    },
    "manufacturer": {
      "@type": "Organization",
      "name": "PT. Gurita Bisnis Undagi"
    },
    "offers": {
      "@type": "Offer",
      "price": item.harga,
      "priceCurrency": "IDR",
      "availability": "https://schema.org/InStock",
      "seller": {
        "@type": "Organization",
        "name": "PT. Gurita Bisnis Undagi"
      }
    }
  }
}

// Generate JSON-LD untuk service
export function generateServiceSchema(service) {
  return {
    "@context": "https://schema.org/",
    "@type": "Service",
    "name": service.title,
    "description": service.description,
    "image": service.image,
    "provider": {
      "@type": "Organization",
      "name": "PT. Gurita Bisnis Undagi"
    },
    "serviceType": service.subtitle,
    "category": "Construction Services",
    "areaServed": "Indonesia",
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": service.title,
      "itemListElement": service.features?.map(feature => ({
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": feature
        }
      })) || []
    }
  }
}
