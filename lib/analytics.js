// Google Analytics dan tracking untuk SEO

export const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GA_ID

// https://developers.google.com/analytics/devguides/collection/gtagjs/pages
export const pageview = (url) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('config', GA_TRACKING_ID, {
      page_location: url,
    })
  }
}

// https://developers.google.com/analytics/devguides/collection/gtagjs/events
export const event = ({ action, category, label, value }) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
    })
  }
}

// Tracking events untuk SEO dan conversion
export const trackCatalogueView = (itemName) => {
  event({
    action: 'view_item',
    category: 'Catalogue',
    label: itemName,
  })
}

export const trackCatalogueAddToCart = (itemName, itemPrice) => {
  event({
    action: 'add_to_cart',
    category: 'E-commerce',
    label: itemName,
    value: itemPrice,
  })
}

export const trackServiceInquiry = (serviceType) => {
  event({
    action: 'service_inquiry',
    category: 'Lead Generation',
    label: serviceType,
  })
}

export const trackWhatsAppClick = () => {
  event({
    action: 'whatsapp_click',
    category: 'Contact',
    label: 'Floating WhatsApp Button',
  })
}

export const trackBannerClick = (bannerTitle) => {
  event({
    action: 'banner_click',
    category: 'Engagement',
    label: bannerTitle,
  })
}

// Schema.org event tracking
export const trackSchemaInteraction = (schemaType) => {
  event({
    action: 'schema_interaction',
    category: 'SEO',
    label: schemaType,
  })
}
