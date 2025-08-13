'use client'

import DashboardGreeting from './DashboardGreeting'
import BannerContent from './BannerContent'
import CatalogueContent from './CatalogueContent'
import PricingContent from './PricingContent'
import InvoiceContent from './InvoiceContent'
import AnalyticsContent from './AnalyticsContent'
import CustomersContent from './CustomersContent'

// Dashboard Greeting Component


export default function ContentRouter({ 
  activeTab, 
  isLoading,
  bannerItems,
  catalogueItems,
  pricingPlans,
  setActiveTab,
  setIsAddingBanner
}) {
  switch (activeTab) {
    case 'dashboard':
      return <DashboardGreeting />
    case 'banner':
      return <BannerContent setIsAddingBanner={setIsAddingBanner} />
    case 'catalogue':
      return <CatalogueContent items={catalogueItems || []} />
    case 'pricing':
      return <PricingContent />
    case 'invoice':
      return <InvoiceContent />
    case 'analytics':
      return <AnalyticsContent />
    case 'customers':
      return <CustomersContent />
    default:
      return <DashboardGreeting />
  }
}
