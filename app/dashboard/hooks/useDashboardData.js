'use client'

import { useState, useEffect } from 'react'
import { bannerApi, catalogueApi } from '@/lib/api'
import { 
  getCurrentInvoiceCounter, 
  updateInvoiceCounter,
  setInvoiceCounter, 
  getCompanyData, 
  saveCompanyData 
} from '@/lib/invoice-utils'

export function useDashboardData() {
  // State untuk data utama
  const [bannerItems, setBannerItems] = useState([])
  const [catalogueItems, setCatalogueItems] = useState([])
  const [pricingPlans, setPricingPlans] = useState([])
  
  // Loading states
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Invoice settings state
  const [companyData, setCompanyData] = useState({
    id: null,
    name: '',
    address: '', 
    phone: '',
    email: '',
    website: '',
    logo: '',
    signature: '',
    description: '',
    totalInvoices: 0,
    totalProducts: 0,
    totalCustomers: 0
  })
  const [invoiceCounter, setInvoiceCounterState] = useState(1)
  const [isEditingCompany, setIsEditingCompany] = useState(false)

  // Load data on component mount
  useEffect(() => {
    loadData()
    loadInvoiceSettings()
  }, [])

  // Load invoice settings
  const loadInvoiceSettings = async () => {
    try {
      // Get company data from API first
      const response = await fetch('/api/companies?limit=10')
      const result = await response.json()
      
      if (result.success && result.data && result.data.length > 0) {
        // Find default company or use first one
        const defaultCompany = result.data.find(company => company.isDefault) || result.data[0]
        
        // Get company statistics
        const [invoicesResponse, cataloguesResponse, customersResponse] = await Promise.all([
          fetch('/api/invoices?limit=1'),
          fetch('/api/catalogues?limit=1'), 
          fetch('/api/customers?limit=1')
        ])
        
        const [invoicesData, cataloguesData, customersData] = await Promise.all([
          invoicesResponse.json(),
          cataloguesResponse.json(),
          customersResponse.json()
        ])
        
        setCompanyData({
          id: defaultCompany.id,
          name: defaultCompany.name || '',
          address: defaultCompany.address || '',
          phone: defaultCompany.phone || '',
          email: defaultCompany.email || '',
          website: defaultCompany.website || '',
          logo: defaultCompany.logo || '',
          signature: defaultCompany.signature || '',
          description: defaultCompany.description || '',
          totalInvoices: invoicesData.success ? invoicesData.pagination?.total || 0 : 0,
          totalProducts: cataloguesData.success ? cataloguesData.pagination?.total || 0 : 0,
          totalCustomers: customersData.success ? customersData.pagination?.total || 0 : 0
        })
      } else {
        // Fallback to getCompanyData for compatibility
        const company = await getCompanyData()
        setCompanyData({
          ...company,
          signature: '',
          description: '',
          totalInvoices: 0,
          totalProducts: 0,
          totalCustomers: 0
        })
      }
      
      const counter = await getCurrentInvoiceCounter()
      setInvoiceCounterState(counter)
    } catch (error) {
      console.error('Error loading invoice settings:', error)
      // Use fallback data
      const fallbackCompany = {
        name: 'UNDAGI',
        address: 'Jl. Raya No. 123, Jakarta Selatan 12345',
        phone: '+62 21 1234 5678',
        email: 'info@undagi.com',
        website: 'www.undagi.com',
        logo: '/Logo.svg',
        signature: '',
        description: '',
        totalInvoices: 0,
        totalProducts: 0,
        totalCustomers: 0
      }
      setCompanyData(fallbackCompany)
      setInvoiceCounterState(1)
    }
  }

  const loadData = async () => {
    try {
      setIsLoading(true)
      console.log('Loading dashboard data...')
      const [bannersData, cataloguesData, pricingData] = await Promise.all([
        bannerApi.getAll(),
        catalogueApi.getAllForDashboard(),
        fetch('/api/pricing-plans').then(res => res.json())
      ])
      console.log('Banners data received:', bannersData)
      console.log('Catalogues data received:', cataloguesData)
      console.log('Pricing data received:', pricingData)
      
      setBannerItems(bannersData)
      setCatalogueItems(cataloguesData.data)
      if (pricingData.success) {
        setPricingPlans(pricingData.data || [])
      }
    } catch (error) {
      console.error('Error loading data:', error)
      alert('Gagal memuat data. Silakan refresh halaman.')
    } finally {
      setIsLoading(false)
    }
  }

  // Save company data
  const saveCompanySettings = async () => {
    try {
      setIsSubmitting(true)
      
      if (companyData.id) {
        // Update existing company
        const response = await fetch(`/api/companies/${companyData.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: companyData.name,
            address: companyData.address,
            phone: companyData.phone,
            email: companyData.email,
            website: companyData.website,
            logo: companyData.logo,
            signature: companyData.signature,
            description: companyData.description,
            isDefault: true
          })
        })
        
        const result = await response.json()
        if (!result.success) {
          throw new Error(result.error || 'Failed to update company')
        }
        
        setCompanyData(prev => ({ ...prev, ...result.data }))
      } else {
        // Create new company
        const response = await fetch('/api/companies', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: companyData.name,
            address: companyData.address,
            phone: companyData.phone,
            email: companyData.email,
            website: companyData.website,
            logo: companyData.logo,
            signature: companyData.signature,
            description: companyData.description,
            isDefault: true
          })
        })
        
        const result = await response.json()
        if (!result.success) {
          throw new Error(result.error || 'Failed to create company')
        }
        
        setCompanyData(prev => ({ ...prev, id: result.data.id, ...result.data }))
      }
      
      alert('Data perusahaan berhasil disimpan!')
      setIsEditingCompany(false)
      
      // Reload settings to get updated data
      await loadInvoiceSettings()
    } catch (error) {
      console.error('Error saving company data:', error)
      alert('Gagal menyimpan data perusahaan: ' + error.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  // Update invoice counter
  const updateInvoiceCounterHandler = async (newCounter) => {
    try {
      setInvoiceCounterState(newCounter)
      alert(`Nomor invoice berikutnya akan dimulai dari ${newCounter}!`)
    } catch (error) {
      console.error('Error updating invoice counter:', error)
      alert('Gagal mengupdate nomor invoice')
    }
  }

  // Handle company data input change
  const handleCompanyInputChange = (e) => {
    const { name, value } = e.target
    setCompanyData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  return {
    // Data
    bannerItems,
    catalogueItems,
    pricingPlans,
    companyData,
    invoiceCounter,
    
    // Loading states
    isLoading,
    isSubmitting,
    isEditingCompany,
    
    // Setters
    setBannerItems,
    setCatalogueItems,
    setPricingPlans,
    setCompanyData,
    setInvoiceCounterState,
    setIsSubmitting,
    setIsEditingCompany,
    
    // Functions
    loadData,
    loadInvoiceSettings,
    saveCompanySettings,
    updateInvoiceCounterHandler,
    handleCompanyInputChange
  }
}
