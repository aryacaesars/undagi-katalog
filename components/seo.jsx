import Head from 'next/head'
import { businessInfo, localBusinessSchema, faqSchema, serviceSchema } from '@/lib/seo'

export function BusinessSchema() {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(businessInfo)
      }}
    />
  )
}

export function LocalBusinessSchema() {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(localBusinessSchema)
      }}
    />
  )
}

export function FAQSchema() {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(faqSchema)
      }}
    />
  )
}

export function ServiceSchema() {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(serviceSchema)
      }}
    />
  )
}

export function BreadcrumbSchema({ items }) {
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      "item": item.url
    }))
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(breadcrumbSchema)
      }}
    />
  )
}

export function ProductSchema({ product }) {
  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": product.name,
    "description": product.description,
    "image": product.image,
    "sku": product.sku,
    "category": product.category,
    "brand": {
      "@type": "Brand",
      "name": "PT. Gurita Bisnis Undagi"
    },
    "offers": {
      "@type": "Offer",
      "price": product.price,
      "priceCurrency": "IDR",
      "availability": "https://schema.org/InStock",
      "seller": {
        "@type": "Organization",
        "name": "PT. Gurita Bisnis Undagi"
      }
    }
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(productSchema)
      }}
    />
  )
}

// Component untuk meta tags dasar
export function SEOHead({ 
  title, 
  description, 
  keywords, 
  canonical, 
  ogImage,
  noIndex = false 
}) {
  const fullTitle = title ? `${title} | PT. Gurita Bisnis Undagi` : 'PT. Gurita Bisnis Undagi - Jasa Konstruksi Dapur Industri'
  
  return (
    <Head>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      {keywords && <meta name="keywords" content={keywords} />}
      
      {noIndex ? (
        <meta name="robots" content="noindex, nofollow" />
      ) : (
        <meta name="robots" content="index, follow" />
      )}
      
      {canonical && <link rel="canonical" href={canonical} />}
      
      {/* Open Graph */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content="website" />
      <meta property="og:locale" content="id_ID" />
      <meta property="og:site_name" content="PT. Gurita Bisnis Undagi" />
      {ogImage && <meta property="og:image" content={ogImage} />}
      {canonical && <meta property="og:url" content={canonical} />}
      
      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      {ogImage && <meta name="twitter:image" content={ogImage} />}
      
      {/* Additional SEO tags */}
      <meta name="author" content="PT. Gurita Bisnis Undagi" />
      <meta name="geo.region" content="ID" />
      <meta name="geo.country" content="Indonesia" />
      <meta name="DC.language" content="id" />
    </Head>
  )
}

export default SEOHead;
