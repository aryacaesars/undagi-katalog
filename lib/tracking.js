// User behavior tracking untuk optimasi SEO dan conversion

let userSession = {
  startTime: Date.now(),
  pageViews: 0,
  interactions: [],
  source: null,
  deviceType: null,
}

// Initialize user session
export function initializeSession() {
  if (typeof window === 'undefined') return
  
  // Detect device type
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
  userSession.deviceType = isMobile ? 'mobile' : 'desktop'
  
  // Detect traffic source
  const referrer = document.referrer
  if (referrer.includes('google.com')) {
    userSession.source = 'google_organic'
  } else if (referrer.includes('facebook.com')) {
    userSession.source = 'facebook'
  } else if (referrer.includes('instagram.com')) {
    userSession.source = 'instagram'
  } else if (referrer) {
    userSession.source = 'referral'
  } else {
    userSession.source = 'direct'
  }
  
  // Track session start
  trackEvent('session_start', {
    deviceType: userSession.deviceType,
    source: userSession.source
  })
}

// Track page view
export function trackPageView(page) {
  userSession.pageViews++
  userSession.interactions.push({
    type: 'page_view',
    page,
    timestamp: Date.now()
  })
  
  trackEvent('page_view', { page, pageViews: userSession.pageViews })
}

// Track user interactions
export function trackInteraction(type, data = {}) {
  userSession.interactions.push({
    type,
    data,
    timestamp: Date.now()
  })
  
  trackEvent(`interaction_${type}`, data)
}

// Track scroll depth untuk engagement
export function initializeScrollTracking() {
  if (typeof window === 'undefined') return
  
  let maxScroll = 0
  const scrollMilestones = [25, 50, 75, 90]
  const trackedMilestones = new Set()
  
  const handleScroll = () => {
    const scrollTop = window.scrollY
    const documentHeight = document.documentElement.scrollHeight
    const windowHeight = window.innerHeight
    const scrollPercent = Math.round((scrollTop / (documentHeight - windowHeight)) * 100)
    
    if (scrollPercent > maxScroll) {
      maxScroll = scrollPercent
      
      scrollMilestones.forEach(milestone => {
        if (scrollPercent >= milestone && !trackedMilestones.has(milestone)) {
          trackedMilestones.add(milestone)
          trackEvent('scroll_depth', { 
            percent: milestone,
            deviceType: userSession.deviceType 
          })
        }
      })
    }
  }
  
  window.addEventListener('scroll', handleScroll, { passive: true })
}

// Track time on page
export function trackTimeOnPage() {
  const startTime = Date.now()
  
  const handleBeforeUnload = () => {
    const timeSpent = Math.round((Date.now() - startTime) / 1000)
    trackEvent('time_on_page', { 
      seconds: timeSpent,
      page: window.location.pathname 
    })
  }
  
  window.addEventListener('beforeunload', handleBeforeUnload)
  
  // Also track at intervals
  const intervals = [30, 60, 120, 300] // 30s, 1m, 2m, 5m
  intervals.forEach(interval => {
    setTimeout(() => {
      if (document.hasFocus()) {
        trackEvent('time_milestone', { 
          seconds: interval,
          page: window.location.pathname 
        })
      }
    }, interval * 1000)
  })
}

// Track form interactions
export function trackFormInteraction(formName, action, fieldName = null) {
  const data = { formName, action }
  if (fieldName) data.fieldName = fieldName
  
  trackInteraction('form', data)
}

// Track CTA clicks
export function trackCTAClick(ctaName, location) {
  trackInteraction('cta_click', { ctaName, location })
}

// Track search behavior
export function trackSearch(query, results = 0) {
  trackInteraction('search', { query, results })
}

// Track catalogue interactions
export function trackCatalogueInteraction(action, itemName, category = null) {
  const data = { action, itemName }
  if (category) data.category = category
  
  trackInteraction('catalogue', data)
}

// Track conversion events
export function trackConversion(type, value = null) {
  const data = { type }
  if (value) data.value = value
  
  trackEvent('conversion', data)
}

// Send analytics event
function trackEvent(eventName, data = {}) {
  // Send to Google Analytics if available
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', eventName, {
      custom_parameter_1: JSON.stringify(data),
      custom_parameter_2: userSession.source,
      custom_parameter_3: userSession.deviceType
    })
  }
  
  // Log for debugging in development
  if (process.env.NODE_ENV === 'development') {
    console.log('Track Event:', eventName, data)
  }
}

// Get user session data
export function getUserSession() {
  return {
    ...userSession,
    sessionDuration: Date.now() - userSession.startTime
  }
}

// Track specific SEO events
export function trackSEOEvent(type, data = {}) {
  trackEvent(`seo_${type}`, data)
}

// Track business-specific events
export function trackBusinessEvent(eventType, serviceType, value = null) {
  const data = { eventType, serviceType }
  if (value) data.value = value
  
  trackEvent('business_event', data)
  
  // Also track specific business conversions
  if (eventType === 'quote_request') {
    trackConversion('quote_request', serviceType)
  } else if (eventType === 'contact_form') {
    trackConversion('contact_form', serviceType)
  } else if (eventType === 'whatsapp_click') {
    trackConversion('whatsapp_contact', serviceType)
  }
}

const trackingService = {
  initializeSession,
  trackPageView,
  trackInteraction,
  initializeScrollTracking,
  trackTimeOnPage,
  trackFormInteraction,
  trackCTAClick,
  trackSearch,
  trackCatalogueInteraction,
  trackConversion,
  trackSEOEvent,
  trackBusinessEvent,
  getUserSession
}

export default trackingService
