'use client'

// Custom hook untuk form handling di Dashboard
import { useState, useEffect } from 'react'
import { bannerApi, catalogueApi } from '@/lib/api'

export function useFormHandlers(bannerItems, setBannerItems, catalogueItems, setCatalogueItems, pricingPlans, setPricingPlans) {
  // State untuk form editing
  const [editingBanner, setEditingBanner] = useState(null)
  const [editingCatalogue, setCatalogueEditing] = useState(null)
  const [isAddingBanner, setIsAddingBanner] = useState(false)
  const [isAddingCatalogue, setIsAddingCatalogue] = useState(false)
  const [isUploadingCSV, setIsUploadingCSV] = useState(false)
  const [csvFile, setCsvFile] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

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

  // Form state untuk banner
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

  // Form state untuk catalogue
  const [catalogueForm, setCatalogueForm] = useState({
    jenis: '',
    namaBarang: '',
    spesifikasi: '',
    qty: '',
    satuan: '',
    hargaSatuan: '',
    foto: ''
  })

  // Auto clear pricing messages after 5 seconds
  useEffect(() => {
    if (pricingError || pricingSuccess) {
      const timer = setTimeout(() => {
        setPricingError(null)
        setPricingSuccess(null)
      }, 5000)
      return () => clearTimeout(timer)
    }
  }, [pricingError, pricingSuccess])

  // Get unique categories from catalogue data
  const jenisOptions = ['Semua', ...new Set(catalogueItems.map(item => item.jenis))]

  // Filter and search catalogue items
  const filteredCatalogueItems = catalogueItems.filter(item => {
    const matchesSearch = searchTerm === '' || 
      item.namaBarang.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.spesifikasi.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.jenis.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesJenis = selectedJenis === 'Semua' || item.jenis === selectedJenis
    
    return matchesSearch && matchesJenis
  })

  // Pagination calculations
  const totalPages = Math.ceil(filteredCatalogueItems.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentCatalogueItems = filteredCatalogueItems.slice(startIndex, endIndex)

  // Reset pagination when search or filter changes
  useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm, selectedJenis])

  // Filter pricing plans based on search
  const filteredPricingPlans = pricingPlans.filter(plan => {
    if (!pricingSearchTerm) return true
    
    const searchLower = pricingSearchTerm.toLowerCase()
    return (
      plan.name.toLowerCase().includes(searchLower) ||
      plan.subtitle.toLowerCase().includes(searchLower) ||
      plan.description.toLowerCase().includes(searchLower) ||
      plan.features.some(feature => feature.toLowerCase().includes(searchLower)) ||
      plan.limitations.some(limitation => limitation.toLowerCase().includes(searchLower))
    )
  })

  // Handler untuk edit banner
  const handleEditBanner = (item) => {
    setEditingBanner(item.id)
    setBannerForm({
      ...item,
      features: item.features.join(', ')
    })
  }

  // Handler untuk edit catalogue
  const handleEditCatalogue = (item) => {
    setCatalogueEditing(item.id)
    setCatalogueForm({
      ...item,
      qty: item.qty.toString(),
      hargaSatuan: item.hargaSatuan.toString()
    })
  }

  // Handler untuk save banner
  const handleSaveBanner = async () => {
    try {
      setIsSubmitting(true)
      const updatedItem = {
        ...bannerForm,
        features: bannerForm.features.split(',').map(f => f.trim()),
        rating: parseFloat(bannerForm.rating)
      }

      if (isAddingBanner) {
        const newBanner = await bannerApi.create(updatedItem)
        setBannerItems([...bannerItems, newBanner])
        setIsAddingBanner(false)
        alert('Banner berhasil ditambahkan!')
      } else {
        const updatedBanner = await bannerApi.update(editingBanner, updatedItem)
        setBannerItems(bannerItems.map(item => 
          item.id === editingBanner ? updatedBanner : item
        ))
        setEditingBanner(null)
        alert('Banner berhasil diperbarui!')
      }
      
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
    } catch (error) {
      console.error('Error saving banner:', error)
      alert('Gagal menyimpan banner: ' + error.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  // Handler untuk save catalogue
  const handleSaveCatalogue = async () => {
    try {
      setIsSubmitting(true)
      const updatedItem = {
        ...catalogueForm,
        qty: parseInt(catalogueForm.qty),
        hargaSatuan: parseFloat(catalogueForm.hargaSatuan),
        jumlah: parseInt(catalogueForm.qty) * parseFloat(catalogueForm.hargaSatuan)
      }

      if (isAddingCatalogue) {
        const newCatalogue = await catalogueApi.create(updatedItem)
        setCatalogueItems([...catalogueItems, newCatalogue])
        setIsAddingCatalogue(false)
        alert('Produk berhasil ditambahkan!')
      } else {
        const updatedCatalogue = await catalogueApi.update(editingCatalogue, updatedItem)
        setCatalogueItems(catalogueItems.map(item => 
          item.id === editingCatalogue ? updatedCatalogue : item
        ))
        setCatalogueEditing(null)
        alert('Produk berhasil diperbarui!')
      }
      
      setCatalogueForm({
        jenis: '',
        namaBarang: '',
        spesifikasi: '',
        qty: '',
        satuan: '',
        hargaSatuan: '',
        foto: ''
      })
    } catch (error) {
      console.error('Error saving catalogue:', error)
      alert('Gagal menyimpan produk: ' + error.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  // Handler untuk cancel editing
  const handleCancel = () => {
    setEditingBanner(null)
    setCatalogueEditing(null)
    setIsAddingBanner(false)
    setIsAddingCatalogue(false)
    setIsUploadingCSV(false)
    setCsvFile(null)
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

  // Handler untuk delete
  const handleDeleteBanner = async (id) => {
    if (confirm('Apakah Anda yakin ingin menghapus banner ini?')) {
      try {
        await bannerApi.delete(id)
        setBannerItems(bannerItems.filter(item => item.id !== id))
        alert('Banner berhasil dihapus!')
      } catch (error) {
        console.error('Error deleting banner:', error)
        alert('Gagal menghapus banner: ' + error.message)
      }
    }
  }

  const handleDeleteCatalogue = async (id) => {
    if (confirm('Apakah Anda yakin ingin menghapus produk ini?')) {
      try {
        await catalogueApi.delete(id)
        setCatalogueItems(catalogueItems.filter(item => item.id !== id))
        alert('Produk berhasil dihapus!')
      } catch (error) {
        console.error('Error deleting catalogue:', error)
        alert('Gagal menghapus produk: ' + error.message)
      }
    }
  }

  // Handler untuk toggle active status
  const toggleBannerActive = async (id) => {
    try {
      const banner = bannerItems.find(item => item.id === id)
      const updatedBanner = await bannerApi.update(id, { 
        ...banner, 
        isActive: !banner.isActive 
      })
      setBannerItems(bannerItems.map(item => 
        item.id === id ? updatedBanner : item
      ))
    } catch (error) {
      console.error('Error toggling banner status:', error)
      alert('Gagal mengubah status banner: ' + error.message)
    }
  }

  // Return all states and handlers
  return {
    // States
    editingBanner,
    editingCatalogue,
    isAddingBanner,
    isAddingCatalogue,
    isUploadingCSV,
    csvFile,
    isSubmitting,
    isUploadingPricingCSV,
    pricingCsvFile,
    pricingActionLoading,
    pricingError,
    pricingSuccess,
    expandedFeatures,
    expandedLimitations,
    viewingPlan,
    pricingSearchTerm,
    isAddingPricingPlan,
    editingPricingPlan,
    pricingPlanForm,
    featuresCSV,
    limitationsCSV,
    currentPage,
    itemsPerPage,
    searchTerm,
    selectedJenis,
    bannerForm,
    catalogueForm,
    jenisOptions,
    filteredCatalogueItems,
    totalPages,
    currentCatalogueItems,
    filteredPricingPlans,
    
    // Setters
    setEditingBanner,
    setCatalogueEditing,
    setIsAddingBanner,
    setIsAddingCatalogue,
    setIsUploadingCSV,
    setCsvFile,
    setIsSubmitting,
    setIsUploadingPricingCSV,
    setPricingCsvFile,
    setPricingActionLoading,
    setPricingError,
    setPricingSuccess,
    setExpandedFeatures,
    setExpandedLimitations,
    setViewingPlan,
    setPricingSearchTerm,
    setIsAddingPricingPlan,
    setEditingPricingPlan,
    setPricingPlanForm,
    setFeaturesCSV,
    setLimitationsCSV,
    setCurrentPage,
    setSearchTerm,
    setSelectedJenis,
    setBannerForm,
    setCatalogueForm,
    
    // Handlers
    handleEditBanner,
    handleEditCatalogue,
    handleSaveBanner,
    handleSaveCatalogue,
    handleCancel,
    handleDeleteBanner,
    handleDeleteCatalogue,
    toggleBannerActive
  }
}
