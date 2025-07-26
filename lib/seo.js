// SEO Metadata Configuration untuk PT. Gurita Bisnis Undagi

export const siteConfig = {
  name: "PT. Gurita Bisnis Undagi",
  description: "Spesialis jasa konstruksi dapur industri, renovasi dapur sehat MBG, pengadaan peralatan dapur komersial, instalasi utilitas lengkap (listrik, gas, air, ventilasi), dan pendampingan sertifikasi laik higiene sanitasi (SLHS). Berpengalaman dalam mengerjakan proyek dapur sehat skala besar dengan jaminan mutu pekerjaan, waktu pelaksanaan yang terukur, dan layanan purna jual yang responsif.",
  url: "https://undagi-katalog.vercel.app",
  ogImage: "/Logo.svg",
  keywords: [
    // Primary Keywords
    "jasa konstruksi dapur",
    "renovasi dapur industri",
    "peralatan dapur industri",
    "dapur sehat MBG",
    "sertifikasi SLHS",
    "instalasi utilitas dapur",
    
    // Secondary Keywords
    "konstruksi dapur restoran",
    "kitchen equipment supplier",
    "dapur komersial",
    "peralatan dapur komersial",
    "jasa renovasi dapur",
    "instalasi listrik dapur",
    "instalasi gas dapur",
    "instalasi ventilasi dapur",
    
    // Brand Keywords
    "undagi",
    "PT Gurita Bisnis Undagi",
    "Gurita Bisnis Undagi",
    
    // Location-based Keywords
    "jasa konstruksi dapur Jakarta",
    "renovasi dapur industri Indonesia",
    "supplier peralatan dapur Indonesia",
    
    // Service-based Keywords
    "sertifikasi laik higiene sanitasi",
    "SLHS certification",
    "dapur sehat construction",
    "industrial kitchen renovation",
    "commercial kitchen equipment",
    "kitchen utility installation"
  ],
  author: "PT. Gurita Bisnis Undagi",
  creator: "PT. Gurita Bisnis Undagi",
  openGraph: {
    type: "website",
    locale: "id_ID",
    url: "https://undagi-katalog.vercel.app",
    siteName: "PT. Gurita Bisnis Undagi",
  },
  twitter: {
    card: "summary_large_image",
    creator: "@undagi",
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
};

export const businessInfo = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "PT. Gurita Bisnis Undagi",
  "alternateName": "Undagi",
  "description": "Layanan jasa konstruksi dan pengadaan peralatan dapur industri terpercaya",
  "url": "https://undagi-katalog.vercel.app",
  "logo": "https://undagi-katalog.vercel.app/Logo.svg",
  "foundingDate": "2020",
  "legalName": "PT. Gurita Bisnis Undagi",
  "contactPoint": {
    "@type": "ContactPoint",
    "contactType": "Customer Service",
    "areaServed": "ID",
    "availableLanguage": ["Indonesian", "English"]
  },
  "address": {
    "@type": "PostalAddress",
    "addressCountry": "Indonesia",
    "addressRegion": "Indonesia"
  },
  "sameAs": [],
  "hasOfferCatalog": {
    "@type": "OfferCatalog",
    "name": "Katalog Layanan Konstruksi Dapur",
    "itemListElement": [
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": "Konstruksi Dapur Industri",
          "description": "Layanan konstruksi dapur untuk industri makanan dan komersial",
          "category": "Construction Services",
          "serviceType": "Industrial Kitchen Construction"
        }
      },
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": "Renovasi Dapur Sehat MBG",
          "description": "Renovasi dapur sehat sesuai standar MBG dengan kualitas terjamin",
          "category": "Renovation Services",
          "serviceType": "Healthy Kitchen Renovation"
        }
      },
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Product",
          "name": "Peralatan Dapur Industri",
          "description": "Pengadaan peralatan dapur lengkap untuk kebutuhan industri dan komersial",
          "category": "Kitchen Equipment",
          "brand": "Various"
        }
      },
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": "Instalasi Utilitas Dapur",
          "description": "Instalasi lengkap listrik, gas, air, dan ventilasi untuk dapur industri",
          "category": "Installation Services",
          "serviceType": "Kitchen Utility Installation"
        }
      },
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": "Pendampingan Sertifikasi SLHS",
          "description": "Pendampingan untuk mendapatkan sertifikat laik higiene dan sanitasi",
          "category": "Certification Services",
          "serviceType": "SLHS Certification Assistance"
        }
      }
    ]
  },
  "knowsAbout": [
    "Kitchen Construction",
    "Industrial Kitchen Design",
    "Commercial Kitchen Equipment",
    "Food Safety Certification",
    "Kitchen Utility Installation",
    "Restaurant Kitchen Renovation",
    "SLHS Certification",
    "Kitchen Hygiene Standards",
    "Commercial Food Service Equipment"
  ],
  "serviceArea": {
    "@type": "Country",
    "name": "Indonesia"
  },
  "areaServed": "Indonesia"
};

export const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "name": "PT. Gurita Bisnis Undagi",
  "image": "https://undagi-katalog.vercel.app/Logo.svg",
  "description": "Spesialis jasa konstruksi dapur industri, renovasi dapur sehat, dan pengadaan peralatan dapur komersial dengan sertifikasi SLHS",
  "address": {
    "@type": "PostalAddress",
    "addressCountry": "Indonesia"
  },
  "geo": {
    "@type": "GeoCoordinates"
  },
  "url": "https://undagi-katalog.vercel.app",
  "telephone": "+62",
  "priceRange": "$$",
  "openingHoursSpecification": {
    "@type": "OpeningHoursSpecification",
    "dayOfWeek": [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday"
    ],
    "opens": "08:00",
    "closes": "17:00"
  },
  "paymentAccepted": "Cash, Credit Card, Bank Transfer",
  "currenciesAccepted": "IDR",
  "serviceArea": {
    "@type": "Country",
    "name": "Indonesia"
  },
  "areaServed": "Indonesia"
};

// FAQ Schema untuk halaman utama
export const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "Apa saja layanan yang disediakan PT. Gurita Bisnis Undagi?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "PT. Gurita Bisnis Undagi menyediakan layanan jasa konstruksi dapur industri, renovasi dapur sehat MBG, pengadaan peralatan dapur komersial, instalasi utilitas lengkap (listrik, gas, air, ventilasi), dan pendampingan sertifikasi laik higiene sanitasi (SLHS)."
      }
    },
    {
      "@type": "Question",
      "name": "Apakah PT. Gurita Bisnis Undagi berpengalaman dalam proyek skala besar?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Ya, kami memiliki pengalaman dalam mengerjakan proyek dapur sehat skala besar dengan jaminan mutu pekerjaan, waktu pelaksanaan yang terukur, dan layanan purna jual yang responsif."
      }
    },
    {
      "@type": "Question",
      "name": "Apa itu sertifikasi SLHS dan mengapa penting?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "SLHS (Sertifikat Laik Higiene dan Sanitasi) adalah sertifikat yang menunjukkan bahwa dapur atau fasilitas pengolahan makanan telah memenuhi standar higiene dan sanitasi yang ditetapkan. Kami menyediakan pendampingan untuk mendapatkan sertifikasi ini."
      }
    },
    {
      "@type": "Question",
      "name": "Apakah tersedia layanan purna jual?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Ya, kami menyediakan layanan purna jual yang responsif untuk memastikan kepuasan pelanggan dan kelancaran operasional dapur yang telah kami bangun atau renovasi."
      }
    }
  ]
};

// Service Schema
export const serviceSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  "name": "Jasa Konstruksi dan Renovasi Dapur Industri",
  "description": "Layanan komprehensif untuk konstruksi, renovasi, dan pengadaan peralatan dapur industri",
  "provider": {
    "@type": "Organization",
    "name": "PT. Gurita Bisnis Undagi"
  },
  "serviceType": "Construction and Renovation Services",
  "category": "Industrial Kitchen Services",
  "areaServed": "Indonesia",
  "hasOfferCatalog": {
    "@type": "OfferCatalog",
    "name": "Layanan Dapur Industri",
    "itemListElement": [
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": "Konstruksi Dapur Industri"
        }
      },
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": "Renovasi Dapur Sehat MBG"
        }
      }
    ]
  }
};

export default siteConfig;
