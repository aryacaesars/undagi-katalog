'use client'

import { useState, useEffect } from 'react'

// Import komponen yang dipecah
import Sidebar from './components/sidebar/Sidebar'
import Header from './components/Header'
import ContentRouter from './components/content/ContentRouter'
import ManagementRouter from './components/management/ManagementRouter'
import { useDashboardData } from './hooks/useDashboardData'
import { useNavigation } from './hooks/useNavigation'

// Komponen Greetings
const DashboardGreeting = () => (
  <div className="max-w-4xl mx-auto">
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
      <div className="text-center">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <img src="/Logo.svg" alt="UNDAGI" className="w-8 h-8" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Selamat Datang di Dashboard UNDAGI
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          Kelola banner, katalog, pricing, dan pengaturan bisnis Anda dengan mudah
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
          <div className="p-4 bg-red-50 rounded-lg border border-red-100">
            <h3 className="font-semibold text-red-900 mb-2">Kelola Banner</h3>
            <p className="text-sm text-red-700">Atur banner promosi dan tampilan utama</p>
          </div>
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
            <h3 className="font-semibold text-blue-900 mb-2">Kelola Katalog</h3>
            <p className="text-sm text-blue-700">Manajemen produk dan kategori</p>
          </div>
          <div className="p-4 bg-green-50 rounded-lg border border-green-100">
            <h3 className="font-semibold text-green-900 mb-2">Kelola Pricing</h3>
            <p className="text-sm text-green-700">Atur harga dan paket layanan</p>
          </div>
          <div className="p-4 bg-purple-50 rounded-lg border border-purple-100">
            <h3 className="font-semibold text-purple-900 mb-2">Pengaturan</h3>
            <p className="text-sm text-purple-700">Konfigurasi invoice dan company</p>
          </div>
        </div>
      </div>
    </div>
  </div>
)

export default function Dashboard() {
  // Custom hooks
  const { sidebarOpen, setSidebarOpen, activeTab, setActiveTab } = useNavigation()
  const {
    bannerItems,
    catalogueItems,
    pricingPlans,
    companyData,
    invoiceCounter,
    isLoading,
    isSubmitting,
    isEditingCompany,
    setBannerItems,
    setCatalogueItems,
    setPricingPlans,
    setCompanyData,
    setInvoiceCounterState,
    setIsSubmitting,
    setIsEditingCompany,
    loadData,
    loadInvoiceSettings,
    saveCompanySettings,
    updateInvoiceCounterHandler,
    handleCompanyInputChange
  } = useDashboardData()

  // Check if current tab is a management tab
  const isManagementTab = ['banners', 'catalogues', 'pricing', 'settings'].includes(activeTab)

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <Sidebar 
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />

      {/* Main Content */}
      <div className="flex-1 lg:ml-0">
        {/* Header */}
        <Header 
          activeTab={activeTab}
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
        />

        {/* Page Content */}
        <main className="flex-1 overflow-auto">
          <div className="p-4 sm:p-6 lg:p-8">
            {!activeTab || activeTab === 'dashboard' ? (
              <DashboardGreeting />
            ) : isManagementTab ? (
              <ManagementRouter 
                activeTab={activeTab}
                bannerItems={bannerItems}
                catalogueItems={catalogueItems}
                pricingPlans={pricingPlans}
                companyData={companyData}
                invoiceCounter={invoiceCounter}
                setBannerItems={setBannerItems}
                setCatalogueItems={setCatalogueItems}
                setPricingPlans={setPricingPlans}
                isSubmitting={isSubmitting}
                setIsSubmitting={setIsSubmitting}
                isEditingCompany={isEditingCompany}
                setIsEditingCompany={setIsEditingCompany}
                saveCompanySettings={saveCompanySettings}
                updateInvoiceCounterHandler={updateInvoiceCounterHandler}
                handleCompanyInputChange={handleCompanyInputChange}
              />
            ) : (
              <ContentRouter 
                activeTab={activeTab}
                isLoading={isLoading}
                bannerItems={bannerItems}
                catalogueItems={catalogueItems}
                pricingPlans={pricingPlans}
                setActiveTab={setActiveTab}
                setIsAddingBanner={() => {}}
              />
            )}
          </div>
        </main>
      </div>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  )
}
