import { useState } from 'react'

export const useManagementData = () => {
  // State untuk form editing
  const [editingBanner, setEditingBanner] = useState(null)
  const [editingCatalogue, setCatalogueEditing] = useState(null)
  const [isAddingBanner, setIsAddingBanner] = useState(false)
  const [isAddingCatalogue, setIsAddingCatalogue] = useState(false)
  const [isUploadingCSV, setIsUploadingCSV] = useState(false)
  const [csvFile, setCsvFile] = useState(null)

  // Pricing plans states
  const [isUploadingPricingCSV, setIsUploadingPricingCSV] = useState(false)
  const [pricingCsvFile, setPricingCsvFile] = useState(null)
  const [pricingActionLoading, setPricingActionLoading] = useState({})
  const [pricingError, setPricingError] = useState(null)
  const [pricingSuccess, setPricingSuccess] = useState(null)
  const [expandedFeatures, setExpandedFeatures] = useState({})
  const [expandedLimitations, setExpandedLimitations] = useState({})
  const [viewingPlan, setViewingPlan] = useState(null)
  const [pricingSearchTerm, setPricingSearchTerm] = useState('')
  const [isAddingPricingPlan, setIsAddingPricingPlan] = useState(false)
  const [editingPricingPlan, setEditingPricingPlan] = useState(null)
  const [pricingPlanForm, setPricingPlanForm] = useState({
    name: '',
    subtitle: '',
    price: '',
    originalPrice: '',
    discount: '',
    description: '',
    features: [],
    limitations: [],
    popular: false,
    color: 'blue',
    sortOrder: 1,
    isActive: true
  })
  const [featuresCSV, setFeaturesCSV] = useState(null)
  const [limitationsCSV, setLimitationsCSV] = useState(null)

  // Pagination and search states for catalogue
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(6)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedJenis, setSelectedJenis] = useState('Semua')

  // Form states
  const [bannerForm, setBannerForm] = useState({
    title: '',
    subtitle: '',
    description: '',
    image: '',
    price: '',
    rating: '',
    features: '',
    badge: '',
    isActive: true
  })

  const [catalogueForm, setCatalogueForm] = useState({
    jenis: '',
    namaBarang: '',
    spesifikasi: '',
    qty: '',
    satuan: '',
    hargaSatuan: '',
    foto: ''
  })

  // Reset functions
  const resetBannerForm = () => {
    setBannerForm({
      title: '',
      subtitle: '',
      description: '',
      image: '',
      price: '',
      rating: '',
      features: '',
      badge: '',
      isActive: true
    })
  }

  const resetCatalogueForm = () => {
    setCatalogueForm({
      jenis: '',
      namaBarang: '',
      spesifikasi: '',
      qty: '',
      satuan: '',
      hargaSatuan: '',
      foto: ''
    })
  }

  const resetPricingForm = () => {
    setPricingPlanForm({
      name: '',
      subtitle: '',
      price: '',
      originalPrice: '',
      discount: '',
      description: '',
      features: [],
      limitations: [],
      popular: false,
      color: 'blue',
      sortOrder: 1,
      isActive: true
    })
    setFeaturesCSV(null)
    setLimitationsCSV(null)
    setIsAddingPricingPlan(false)
    setEditingPricingPlan(null)
  }

  return {
    // Banner states
    editingBanner,
    setEditingBanner,
    isAddingBanner,
    setIsAddingBanner,
    bannerForm,
    setBannerForm,
    resetBannerForm,

    // Catalogue states
    editingCatalogue,
    setCatalogueEditing,
    isAddingCatalogue,
    setIsAddingCatalogue,
    isUploadingCSV,
    setIsUploadingCSV,
    csvFile,
    setCsvFile,
    catalogueForm,
    setCatalogueForm,
    resetCatalogueForm,
    currentPage,
    setCurrentPage,
    itemsPerPage,
    searchTerm,
    setSearchTerm,
    selectedJenis,
    setSelectedJenis,

    // Pricing states
    isUploadingPricingCSV,
    setIsUploadingPricingCSV,
    pricingCsvFile,
    setPricingCsvFile,
    pricingActionLoading,
    setPricingActionLoading,
    pricingError,
    setPricingError,
    pricingSuccess,
    setPricingSuccess,
    expandedFeatures,
    setExpandedFeatures,
    expandedLimitations,
    setExpandedLimitations,
    viewingPlan,
    setViewingPlan,
    pricingSearchTerm,
    setPricingSearchTerm,
    isAddingPricingPlan,
    setIsAddingPricingPlan,
    editingPricingPlan,
    setEditingPricingPlan,
    pricingPlanForm,
    setPricingPlanForm,
    featuresCSV,
    setFeaturesCSV,
    limitationsCSV,
    setLimitationsCSV,
    resetPricingForm
  }
}
