import BannerManagement from './BannerManagement'
import CatalogueManagement from './CatalogueManagement'
import PricingManagement from './PricingManagement'
import CompanySettings from './CompanySettings'

export default function ManagementRouter({ 
  activeTab,
  // Data states
  bannerItems,
  catalogueItems,
  pricingPlans,
  companyData,
  invoiceCounter,
  setBannerItems,
  setCatalogueItems,
  setPricingPlans,
  // Loading states
  isSubmitting,
  setIsSubmitting,
  isEditingCompany,
  setIsEditingCompany,
  // Functions
  saveCompanySettings,
  updateInvoiceCounterHandler,
  handleCompanyInputChange
}) {
  
  switch (activeTab) {
    case 'banners':
      return (
        <BannerManagement
          bannerItems={bannerItems}
          setBannerItems={setBannerItems}
          isSubmitting={isSubmitting}
          setIsSubmitting={setIsSubmitting}
        />
      )
    
    case 'catalogues':
      return (
        <CatalogueManagement
          catalogueItems={catalogueItems}
          setCatalogueItems={setCatalogueItems}
          isSubmitting={isSubmitting}
          setIsSubmitting={setIsSubmitting}
        />
      )
    
    case 'pricing':
      return (
        <PricingManagement
          pricingPlans={pricingPlans}
          setPricingPlans={setPricingPlans}
          isSubmitting={isSubmitting}
          setIsSubmitting={setIsSubmitting}
        />
      )
    
    case 'settings':
      return (
        <CompanySettings
          companyData={companyData}
          invoiceCounter={invoiceCounter}
          isEditingCompany={isEditingCompany}
          setIsEditingCompany={setIsEditingCompany}
          isSubmitting={isSubmitting}
          saveCompanySettings={saveCompanySettings}
          updateInvoiceCounterHandler={updateInvoiceCounterHandler}
          handleCompanyInputChange={handleCompanyInputChange}
        />
      )
    
    default:
      return <div>Pilih menu untuk memulai</div>
  }
}
