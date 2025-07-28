import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { GoogleAnalytics } from "@/components/analytics";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata = {
  metadataBase: new URL('https://katalog.undagicorp.com'),
  title: "UNDAGI | KATALOG",
  description: "PT. Gurita Bisnis Undagi menyediakan layanan jasa konstruksi, renovasi dapur sehat, pengadaan peralatan dapur industri, instalasi utilitas, dan pendampingan sertifikasi SLHS. Berpengalaman dalam proyek dapur sehat skala besar dengan jaminan mutu.",
  keywords: [
    "jasa konstruksi dapur",
    "renovasi dapur industri", 
    "peralatan dapur industri",
    "dapur sehat MBG",
    "sertifikasi SLHS",
    "instalasi utilitas dapur",
    "konstruksi dapur restoran",
    "kitchen equipment supplier",
    "dapur komersial",
    "undagi"
  ].join(", "),
  author: "PT. Gurita Bisnis Undagi",
  robots: "index, follow",
  openGraph: {
    title: "UNDAGI | KATALOG",
    description: "Layanan konstruksi dan renovasi dapur industri terpercaya. Spesialis peralatan dapur komersial, instalasi utilitas, dan sertifikasi SLHS.",
    type: "website",
    locale: "id_ID",
    siteName: "PT. Gurita Bisnis Undagi",
  },
  twitter: {
    card: "summary_large_image",
    title: "UNDAGI | KATALOG",
    description: "Spesialis konstruksi, renovasi dapur sehat, dan pengadaan peralatan dapur industri dengan jaminan mutu terpercaya.",
  },
  charset: "utf-8",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="canonical" href="https://katalog.undagicorp.com" />
        <meta name="geo.region" content="ID" />
        <meta name="geo.country" content="Indonesia" />
        <meta name="DC.language" content="id" />
        <meta name="google-site-verification" content="" />
        
        {/* Preconnect untuk performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://images.unsplash.com" />
        
        {/* DNS prefetch untuk external resources */}
        <link rel="dns-prefetch" href="//www.google-analytics.com" />
        <link rel="dns-prefetch" href="//www.googletagmanager.com" />
        
        {/* Structured Data untuk Business */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "PT. Gurita Bisnis Undagi",
              "description": "Layanan jasa konstruksi dan pengadaan peralatan dapur industri",
              "url": "https://katalog.undagicorp.com",
              "logo": "https://katalog.undagicorp.com/Logo.svg",
              "contactPoint": {
                "@type": "ContactPoint",
                "contactType": "Customer Service",
                "areaServed": "ID",
                "availableLanguage": "Indonesian"
              },
              "address": {
                "@type": "PostalAddress",
                "addressCountry": "ID"
              },
              "sameAs": [],
              "hasOfferCatalog": {
                "@type": "OfferCatalog",
                "name": "Katalog Peralatan Dapur Industri",
                "itemListElement": [
                  {
                    "@type": "Offer",
                    "itemOffered": {
                      "@type": "Service",
                      "name": "Renovasi Dapur Industri",
                      "description": "Layanan renovasi dan konstruksi dapur untuk industri makanan"
                    }
                  },
                  {
                    "@type": "Offer", 
                    "itemOffered": {
                      "@type": "Product",
                      "name": "Peralatan Dapur Industri",
                      "description": "Pengadaan peralatan dapur lengkap untuk kebutuhan industri"
                    }
                  }
                ]
              }
            })
          }}
        />

        {/* Structured Data untuk LocalBusiness */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "LocalBusiness",
              "name": "PT. Gurita Bisnis Undagi",
              "image": "https://katalog.undagicorp.com/Logo.svg",
              "description": "Spesialis jasa konstruksi dapur industri, renovasi dapur sehat, dan pengadaan peralatan dapur komersial dengan sertifikasi SLHS",
              "address": {
                "@type": "PostalAddress",
                "addressCountry": "Indonesia"
              },
              "geo": {
                "@type": "GeoCoordinates"
              },
              "url": "https://katalog.undagicorp.com",
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
              "serviceArea": {
                "@type": "Country",
                "name": "Indonesia"
              },
              "areaServed": "Indonesia",
              "hasOfferCatalog": {
                "@type": "OfferCatalog",
                "name": "Layanan Konstruksi Dapur",
                "itemListElement": [
                  {
                    "@type": "Offer",
                    "itemOffered": {
                      "@type": "Service",
                      "name": "Konstruksi Dapur Industri",
                      "category": "Construction Services"
                    }
                  },
                  {
                    "@type": "Offer",
                    "itemOffered": {
                      "@type": "Service", 
                      "name": "Instalasi Utilitas Dapur",
                      "category": "Installation Services"
                    }
                  },
                  {
                    "@type": "Offer",
                    "itemOffered": {
                      "@type": "Service",
                      "name": "Sertifikasi SLHS",
                      "category": "Certification Services"
                    }
                  }
                ]
              }
            })
          }}
        />
        
        {/* Google Analytics */}
        <GoogleAnalytics GA_TRACKING_ID={process.env.NEXT_PUBLIC_GA_ID} />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
