'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { bannerApi, catalogueApi } from '@/lib/api'
import { 
  getCurrentInvoiceCounter, 
  updateInvoiceCounter,
  setInvoiceCounter, 
  getCompanyData, 
  saveCompanyData 
} from '@/lib/invoice-utils'
import { 
  Edit, 
  Plus, 
  Trash2, 
  Save, 
  X, 
  Upload,
  Eye,
  EyeOff,
  FileSpreadsheet,
  Download,
  Search,
  Settings,
  FileText,
  Building2,
  DollarSign,
  Star,
  CheckCircle,
  AlertCircle,
  Loader2
} from 'lucide-react'

export default function Dashboard() {
  // State untuk banner items
  const [bannerItems, setBannerItems] = useState([])
  
  // State untuk catalogue items
  const [catalogueItems, setCatalogueItems] = useState([])
  
  // State untuk pricing plans
  const [pricingPlans, setPricingPlans] = useState([])
  
  // Loading states
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)

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
  const [itemsPerPage] = useState(6) // 6 items per halaman
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedJenis, setSelectedJenis] = useState('Semua')

  // Invoice settings state
  const [companyData, setCompanyData] = useState({
    name: '',
    address: '', 
    phone: '',
    email: '',
    website: '',
    logo: ''
  })
  const [invoiceCounter, setInvoiceCounterState] = useState(1)
  const [isEditingCompany, setIsEditingCompany] = useState(false)

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

  // Load data on component mount
  useEffect(() => {
    loadData()
    loadInvoiceSettings()
  }, [])

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

  // Load invoice settings
  const loadInvoiceSettings = async () => {
    try {
      const company = await getCompanyData()
      setCompanyData(company)
      
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
        logo: '/Logo.svg'
      }
      setCompanyData(fallbackCompany)
      setInvoiceCounterState(1)
    }
  }

  // Save company data
  const saveCompanySettings = async () => {
    try {
      await saveCompanyData(companyData)
      alert('Data perusahaan berhasil disimpan!')
      setIsEditingCompany(false)
    } catch (error) {
      console.error('Error saving company data:', error)
      alert('Gagal menyimpan data perusahaan')
    }
  }

  // Update invoice counter
  const updateInvoiceCounterHandler = async () => {
    try {
      await updateInvoiceCounter(invoiceCounter)
      alert(`Nomor invoice berhasil diupdate ke ${invoiceCounter}!`)
    } catch (error) {
      console.error('Error updating invoice counter:', error)
      alert('Gagal mengupdate nomor invoice')
    }
  }

  // Handle company data input change
  const handleCompanyInputChange = (field, value) => {
    setCompanyData(prev => ({
      ...prev,
      [field]: value
    }))
  }

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

  const loadData = async () => {
    try {
      setIsLoading(true)
      const [bannersData, cataloguesData, pricingData] = await Promise.all([
        bannerApi.getAll(),
        catalogueApi.getAllForDashboard(), // Menggunakan fungsi khusus untuk dashboard
        fetch('/api/pricing-plans').then(res => res.json())
      ])
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
  const handleSaveCompanyData = () => {
    saveCompanyData(companyData)
    setIsEditingCompany(false)
    alert('Data perusahaan berhasil disimpan!')
  }

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

  // Handler untuk CSV upload
  const handleCSVFileChange = (event) => {
    const file = event.target.files[0]
    if (file && file.type === 'text/csv') {
      setCsvFile(file)
    } else {
      alert('Harap pilih file CSV yang valid')
    }
  }

  // Fungsi untuk parse CSV dengan penanganan yang lebih baik
  const parseCSV = (csvText) => {
    const lines = csvText.split('\n')
    const headers = lines[0].split(',').map(header => header.trim().replace(/"/g, '').toLowerCase())
    const data = []

    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim()
      if (line) {
        // Handle CSV dengan quotes dan commas di dalam nilai
        const values = []
        let currentValue = ''
        let insideQuotes = false
        
        for (let j = 0; j < line.length; j++) {
          const char = line[j]
          if (char === '"') {
            insideQuotes = !insideQuotes
          } else if (char === ',' && !insideQuotes) {
            values.push(currentValue.trim().replace(/^"|"$/g, ''))
            currentValue = ''
          } else {
            currentValue += char
          }
        }
        values.push(currentValue.trim().replace(/^"|"$/g, ''))

        const item = {}
        headers.forEach((header, index) => {
          item[header] = values[index] || ''
        })
        data.push(item)
      }
    }
    return data
  }

  // Handler untuk upload CSV
  const handleUploadCSV = async () => {
    if (!csvFile) {
      alert('Harap pilih file CSV terlebih dahulu')
      return
    }

    const reader = new FileReader()
    reader.onload = async (e) => {
      try {
        setIsSubmitting(true)
        const csvText = e.target.result
        const parsedData = parseCSV(csvText)
        
        // Mapping header yang lebih fleksibel
        const newCatalogueItems = parsedData.map((row, index) => {
          // Fungsi helper untuk mencari nilai dari berbagai kemungkinan nama kolom
          const getValue = (possibleKeys) => {
            for (let key of possibleKeys) {
              if (row[key] !== undefined && row[key] !== '') {
                return row[key]
              }
            }
            return ''
          }

          const qty = parseInt(getValue(['qty', 'quantity', 'jumlah', 'kuantitas'])) || 0
          const hargaSatuan = parseFloat(getValue(['hargasatuan', 'harga_satuan', 'harga satuan', 'price', 'harga'])) || 0

          return {
            jenis: getValue(['jenis', 'kategori', 'category', 'type']),
            namaBarang: getValue(['namabarang', 'nama_barang', 'nama barang', 'name', 'product_name']),
            spesifikasi: getValue(['spesifikasi', 'specification', 'spec', 'deskripsi', 'description']),
            qty: qty,
            satuan: getValue(['satuan', 'unit', 'units']),
            hargaSatuan: hargaSatuan,
            foto: getValue(['foto', 'image', 'gambar', 'photo', 'url']) || 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=400&h=300&fit=crop'
          }
        }).filter(item => item.namaBarang) // Filter item yang tidak memiliki nama barang

        if (newCatalogueItems.length === 0) {
          alert('Tidak ada data valid yang ditemukan dalam file CSV. Pastikan kolom namaBarang terisi.')
          return
        }

        // Upload via bulk API
        const result = await catalogueApi.bulkImport(newCatalogueItems)
        // Reload data to get updated list
        const cataloguesData = await catalogueApi.getAllForDashboard()
        setCatalogueItems(cataloguesData.data)
        setIsUploadingCSV(false)
        setCsvFile(null)
        // Reset input file
        const fileInput = document.getElementById('csvFile')
        if (fileInput) fileInput.value = ''
        // Show result message (fallback if result.created/total not available)
        if (result.created !== undefined && result.total !== undefined) {
          alert(`Berhasil menambahkan ${result.created} item dari ${result.total} item dalam file CSV`)
        } else {
          alert('Upload CSV berhasil!')
        }
      } catch (error) {
        console.error('Error parsing CSV:', error)
        alert('Error upload file CSV: ' + error.message)
      } finally {
        setIsSubmitting(false)
      }
    }
    reader.readAsText(csvFile)
  }

  // Handler untuk download template CSV
  const downloadCSVTemplate = () => {
    const csvContent = [
      'jenis,namaBarang,spesifikasi,qty,satuan,hargaSatuan,foto',
      'Elektronik,Contoh Laptop,Intel Core i5 8GB RAM,10,Unit,5000000,https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&h=300&fit=crop',
      'Furniture,Contoh Meja,Kayu Jati 120x60cm,5,Unit,2000000,https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop'
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', 'template_katalog.csv')
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  // Handler untuk export katalog ke CSV
  const exportCatalogueToCSV = () => {
    if (catalogueItems.length === 0) {
      alert('Tidak ada data katalog untuk diekspor')
      return
    }

    const headers = ['jenis', 'namaBarang', 'spesifikasi', 'qty', 'satuan', 'hargaSatuan', 'jumlah', 'foto']
    const csvContent = [
      headers.join(','),
      ...catalogueItems.map(item => 
        headers.map(header => `"${item[header] || ''}"`).join(',')
      )
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', `katalog_export_${new Date().toISOString().split('T')[0]}.csv`)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  // === PRICING PLANS FUNCTIONS ===
  
  // Fetch pricing plans
  const fetchPricingPlans = async () => {
    try {
      const response = await fetch('/api/pricing-plans')
      const data = await response.json()
      
      if (data.success) {
        setPricingPlans(data.data || [])
      } else {
        setPricingError('Failed to fetch pricing plans')
      }
    } catch (error) {
      console.error('Error fetching pricing plans:', error)
      setPricingError('Failed to load pricing plans')
    }
  }

  // Toggle plan status
  const togglePlanStatus = async (planId, currentStatus) => {
    setPricingActionLoading(prev => ({ ...prev, [planId]: 'toggle' }))
    
    try {
      const response = await fetch(`/api/pricing-plans/${planId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          isActive: !currentStatus
        })
      })

      if (response.ok) {
        await fetchPricingPlans() // Refresh data
        setPricingSuccess('Plan status updated successfully')
      } else {
        setPricingError('Failed to update plan status')
      }
    } catch (error) {
      setPricingError('Failed to update plan status')
    } finally {
      setPricingActionLoading(prev => ({ ...prev, [planId]: null }))
    }
  }

  // Delete plan
  const deletePlan = async (planId) => {
    if (!confirm('Are you sure you want to delete this pricing plan?')) {
      return
    }

    setPricingActionLoading(prev => ({ ...prev, [planId]: 'delete' }))
    
    try {
      const response = await fetch(`/api/pricing-plans/${planId}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        await fetchPricingPlans() // Refresh data
        setPricingSuccess('Plan deleted successfully')
      } else {
        setPricingError('Failed to delete plan')
      }
    } catch (error) {
      setPricingError('Failed to delete plan')
    } finally {
      setPricingActionLoading(prev => ({ ...prev, [planId]: null }))
    }
  }

  // Handle pricing CSV file selection
  const handlePricingCSVFileChange = (event) => {
    const file = event.target.files[0]
    if (file && file.type === 'text/csv') {
      setPricingCsvFile(file)
      setPricingError(null)
      setPricingSuccess(null)
    } else {
      alert('Harap pilih file CSV yang valid')
    }
  }

  // Upload pricing CSV
  const handleUploadPricingCSV = async (replaceExisting = false) => {
    if (!pricingCsvFile) {
      alert('Harap pilih file CSV terlebih dahulu')
      return
    }

    try {
      setIsSubmitting(true)
      setPricingError(null)
      setPricingSuccess(null)

      const formData = new FormData()
      formData.append('file', pricingCsvFile)
      formData.append('replaceExisting', replaceExisting.toString())

      const response = await fetch('/api/pricing-plans/import', {
        method: 'POST',
        body: formData
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Import failed')
      }

      setPricingSuccess(data.message)
      setPricingCsvFile(null)
      setIsUploadingPricingCSV(false)
      
      // Reset input file
      const fileInput = document.getElementById('pricingCsvFile')
      if (fileInput) fileInput.value = ''

      // Refresh pricing plans data
      await fetchPricingPlans()

    } catch (error) {
      setPricingError(error.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  // Download pricing template
  const downloadPricingTemplate = async () => {
    try {
      const response = await fetch('/api/pricing-plans/template')
      
      if (!response.ok) {
        throw new Error('Failed to download template')
      }

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'pricing-plans-template.csv'
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (error) {
      setPricingError('Failed to download template')
    }
  }

  // Export pricing to CSV
  const exportPricingToCSV = () => {
    if (pricingPlans.length === 0) {
      alert('Tidak ada data pricing plans untuk diekspor')
      return
    }

    const headers = [
      'name', 'subtitle', 'price', 'originalPrice', 'discount', 'description',
      'features', 'limitations', 'popular', 'color', 'sortOrder', 'isActive'
    ]

    let csv = headers.join(',') + '\n'
    
    pricingPlans.forEach(plan => {
      const values = [
        plan.name,
        plan.subtitle,
        plan.price,
        plan.originalPrice,
        plan.discount,
        plan.description,
        plan.features.join('|'),
        plan.limitations.join('|'),
        plan.popular,
        plan.color,
        plan.sortOrder,
        plan.isActive
      ]
      
      // Wrap values in quotes and escape existing quotes
      const escapedValues = values.map(value => {
        const str = String(value || '')
        return str.includes(',') || str.includes('\n') ? `"${str.replace(/"/g, '""')}"` : str
      })
      
      csv += escapedValues.join(',') + '\n'
    })

    // Download file
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `pricing-plans-export-${new Date().toISOString().split('T')[0]}.csv`
    document.body.appendChild(a)
    a.click()
    window.URL.revokeObjectURL(url)
    document.body.removeChild(a)
  }

  // === MANUAL PRICING PLAN FUNCTIONS ===
  
  // Handle features CSV file
  const handleFeaturesCSVChange = (event) => {
    const file = event.target.files[0]
    if (file && file.type === 'text/csv') {
      setFeaturesCSV(file)
    } else {
      alert('Please select a valid CSV file for features')
      event.target.value = ''
    }
  }

  // Handle limitations CSV file
  const handleLimitationsCSVChange = (event) => {
    const file = event.target.files[0]
    if (file && file.type === 'text/csv') {
      setLimitationsCSV(file)
    } else {
      alert('Please select a valid CSV file for limitations')
      event.target.value = ''
    }
  }

  // Parse CSV for features/limitations
  const parseCSVFeatures = (csvText) => {
    const lines = csvText.trim().split('\n')
    const features = []
    
    lines.forEach((line, index) => {
      const trimmed = line.trim()
      if (trimmed && trimmed !== 'features' && trimmed !== 'feature') { // Skip header
        features.push(trimmed)
      }
    })
    
    return features
  }

  // Import features from CSV
  const importFeaturesFromCSV = async () => {
    if (!featuresCSV) return

    try {
      const text = await featuresCSV.text()
      const features = parseCSVFeatures(text)
      
      setPricingPlanForm(prev => ({
        ...prev,
        features: [...prev.features, ...features]
      }))
      
      setFeaturesCSV(null)
      // Reset file input
      document.getElementById('featuresCSV').value = ''
      
      alert(`Successfully imported ${features.length} features!`)
    } catch (error) {
      console.error('Error parsing features CSV:', error)
      alert('Error parsing CSV file. Please check the format.')
    }
  }

  // Import limitations from CSV
  const importLimitationsFromCSV = async () => {
    if (!limitationsCSV) return

    try {
      const text = await limitationsCSV.text()
      const limitations = parseCSVFeatures(text) // Same parsing logic
      
      setPricingPlanForm(prev => ({
        ...prev,
        limitations: [...prev.limitations, ...limitations]
      }))
      
      setLimitationsCSV(null)
      // Reset file input
      document.getElementById('limitationsCSV').value = ''
      
      alert(`Successfully imported ${limitations.length} limitations!`)
    } catch (error) {
      console.error('Error parsing limitations CSV:', error)
      alert('Error parsing CSV file. Please check the format.')
    }
  }

  // Add single feature manually
  const addSingleFeature = () => {
    const feature = prompt('Enter a new feature:')
    if (feature && feature.trim()) {
      setPricingPlanForm(prev => ({
        ...prev,
        features: [...prev.features, feature.trim()]
      }))
    }
  }

  // Add single limitation manually
  const addSingleLimitation = () => {
    const limitation = prompt('Enter a new limitation:')
    if (limitation && limitation.trim()) {
      setPricingPlanForm(prev => ({
        ...prev,
        limitations: [...prev.limitations, limitation.trim()]
      }))
    }
  }

  // Remove feature
  const removeFeature = (index) => {
    setPricingPlanForm(prev => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index)
    }))
  }

  // Remove limitation
  const removeLimitation = (index) => {
    setPricingPlanForm(prev => ({
      ...prev,
      limitations: prev.limitations.filter((_, i) => i !== index)
    }))
  }

  // Reset pricing plan form
  const resetPricingPlanForm = () => {
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

  // Save pricing plan
  const savePricingPlan = async () => {
    // Validation
    if (!pricingPlanForm.name.trim()) {
      alert('Plan name is required')
      return
    }
    if (!pricingPlanForm.subtitle.trim()) {
      alert('Plan subtitle is required')
      return
    }
    if (!pricingPlanForm.price.trim()) {
      alert('Plan price is required')
      return
    }
    if (!pricingPlanForm.originalPrice.trim()) {
      alert('Original price is required')
      return
    }

    setIsSubmitting(true)
    try {
      const method = editingPricingPlan ? 'PUT' : 'POST'
      const url = editingPricingPlan 
        ? `/api/pricing-plans/${editingPricingPlan.id}` 
        : '/api/pricing-plans'

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(pricingPlanForm)
      })

      if (response.ok) {
        await fetchPricingPlans() // Refresh data
        resetPricingPlanForm()
        setPricingSuccess(editingPricingPlan ? 'Pricing plan updated successfully!' : 'Pricing plan created successfully!')
        setTimeout(() => setPricingSuccess(null), 3000)
      } else {
        const error = await response.text()
        throw new Error(error)
      }
    } catch (error) {
      console.error('Error saving pricing plan:', error)
      setPricingError('Failed to save pricing plan: ' + error.message)
      setTimeout(() => setPricingError(null), 5000)
    } finally {
      setIsSubmitting(false)
    }
  }

  // Edit pricing plan
  const editPricingPlan = (plan) => {
    setPricingPlanForm({ ...plan })
    setEditingPricingPlan(plan)
    setIsAddingPricingPlan(true)
  }

  // Download features template
  const downloadFeaturesTemplate = () => {
    const link = document.createElement('a')
    link.href = '/features-template.csv'
    link.download = 'features-template.csv'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  // Download limitations template
  const downloadLimitationsTemplate = () => {
    const link = document.createElement('a')
    link.href = '/limitations-template.csv'
    link.download = 'limitations-template.csv'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard Admin</h1>
          <p className="text-gray-600 mt-2">Kelola konten halaman utama website</p>
          
          {/* Loading Indicator */}
          {isLoading && (
            <div className="flex justify-center items-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
              <span className="ml-2 text-gray-600">Memuat data...</span>
            </div>
          )}
          
          {/* Statistics Cards */}
          {!isLoading && (
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mt-6">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Total Banner</p>
                    <p className="text-2xl font-bold text-gray-900">{bannerItems.length}</p>
                  </div>
                  <div className="text-blue-500">
                    <Eye className="w-8 h-8" />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Total Produk</p>
                    <p className="text-2xl font-bold text-gray-900">{catalogueItems.length}</p>
                  </div>
                  <div className="text-purple-500">
                    <FileSpreadsheet className="w-8 h-8" />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Pricing Plans</p>
                    <p className="text-2xl font-bold text-gray-900">{pricingPlans.length}</p>
                  </div>
                  <div className="text-green-500">
                    <DollarSign className="w-8 h-8" />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Banner Aktif</p>
                    <p className="text-2xl font-bold text-green-600">
                      {bannerItems.filter(item => item.isActive).length}
                    </p>
                  </div>
                  <div className="text-green-500">
                    <Eye className="w-8 h-8" />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Total Nilai</p>
                    <p className="text-2xl font-bold text-orange-600">
                      Rp {catalogueItems.reduce((sum, item) => sum + item.jumlah, 0).toLocaleString()}
                    </p>
                  </div>
                  <div className="text-orange-500">
                    <Plus className="w-8 h-8" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          )}
        </div>

        {!isLoading && (
          <Tabs defaultValue="banner" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="banner">Kelola Banner</TabsTrigger>
            <TabsTrigger value="catalogue">Kelola Katalog</TabsTrigger>
            <TabsTrigger value="pricing">Kelola Pricing</TabsTrigger>
            <TabsTrigger value="invoice">Pengaturan Invoice</TabsTrigger>
          </TabsList>

          {/* Banner Management Tab */}
          <TabsContent value="banner" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-semibold">Kelola Banner Utama</h2>
              <Button 
                onClick={() => setIsAddingBanner(true)}
                className="flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Tambah Banner
              </Button>
            </div>

            {/* Form untuk tambah/edit banner */}
            {(isAddingBanner || editingBanner) && (
              <Card>
                <CardHeader>
                  <CardTitle>
                    {isAddingBanner ? 'Tambah Banner Baru' : 'Edit Banner'}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="title">Judul</Label>
                      <Input
                        id="title"
                        value={bannerForm.title}
                        onChange={(e) => setBannerForm({...bannerForm, title: e.target.value})}
                        placeholder="Masukkan judul banner"
                      />
                    </div>
                    <div>
                      <Label htmlFor="subtitle">Subtitle</Label>
                      <Input
                        id="subtitle"
                        value={bannerForm.subtitle}
                        onChange={(e) => setBannerForm({...bannerForm, subtitle: e.target.value})}
                        placeholder="Masukkan subtitle"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="description">Deskripsi</Label>
                    <Textarea
                      id="description"
                      value={bannerForm.description}
                      onChange={(e) => setBannerForm({...bannerForm, description: e.target.value})}
                      placeholder="Masukkan deskripsi banner"
                      rows={3}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="price">Harga</Label>
                      <Input
                        id="price"
                        value={bannerForm.price}
                        onChange={(e) => setBannerForm({...bannerForm, price: e.target.value})}
                        placeholder="Mulai dari Rp 25 juta"
                      />
                    </div>
                    <div>
                      <Label htmlFor="rating">Rating</Label>
                      <Input
                        id="rating"
                        type="number"
                        step="0.1"
                        max="5"
                        min="0"
                        value={bannerForm.rating}
                        onChange={(e) => setBannerForm({...bannerForm, rating: e.target.value})}
                        placeholder="4.9"
                      />
                    </div>
                    <div>
                      <Label htmlFor="badge">Badge</Label>
                      <Input
                        id="badge"
                        value={bannerForm.badge}
                        onChange={(e) => setBannerForm({...bannerForm, badge: e.target.value})}
                        placeholder="Paling Populer"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="features">Fitur (pisahkan dengan koma)</Label>
                    <Input
                      id="features"
                      value={bannerForm.features}
                      onChange={(e) => setBannerForm({...bannerForm, features: e.target.value})}
                      placeholder="Kitchen Set Custom, Granite Countertop, Built-in Appliances"
                    />
                  </div>

                  <div>
                    <Label htmlFor="image">URL Gambar</Label>
                    <Input
                      id="image"
                      value={bannerForm.image}
                      onChange={(e) => setBannerForm({...bannerForm, image: e.target.value})}
                      placeholder="https://images.unsplash.com/..."
                    />
                  </div>

                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="isActive"
                      checked={bannerForm.isActive}
                      onChange={(e) => setBannerForm({...bannerForm, isActive: e.target.checked})}
                      className="w-4 h-4"
                    />
                    <Label htmlFor="isActive">Banner Aktif</Label>
                  </div>

                  <div className="flex gap-2">
                    <Button 
                      onClick={handleSaveBanner} 
                      className="flex items-center gap-2 bg-red-600 hover:bg-red-700"
                      disabled={isSubmitting}
                    >
                      <Save className="w-4 h-4" />
                      {isSubmitting ? 'Menyimpan...' : 'Simpan'}
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={handleCancel}
                      className="flex items-center gap-2"
                      disabled={isSubmitting}
                    >
                      <X className="w-4 h-4" />
                      Batal
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Daftar banner items */}
            <div className="grid gap-4">
              {bannerItems.map((item) => (
                <Card key={item.id} className={`${!item.isActive ? 'opacity-60' : ''}`}>
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="text-xl font-semibold">{item.title}</h3>
                          {item.badge && <Badge variant="secondary">{item.badge}</Badge>}
                          {!item.isActive && <Badge variant="destructive">Tidak Aktif</Badge>}
                        </div>
                        <p className="text-gray-600 mb-2">{item.subtitle}</p>
                        <p className="text-gray-700 mb-4">{item.description}</p>
                        <div className="flex flex-wrap gap-2 mb-4">
                          {item.features.map((feature, index) => (
                            <Badge key={index} variant="outline">{feature}</Badge>
                          ))}
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <span>{item.price}</span>
                          <span>⭐ {item.rating}</span>
                        </div>
                      </div>
                      <div className="flex gap-2 ml-4">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => toggleBannerActive(item.id)}
                        >
                          {item.isActive ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEditBanner(item)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDeleteBanner(item.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Catalogue Management Tab */}
          <TabsContent value="catalogue" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-semibold">Kelola Katalog Produk</h2>
              <div className="flex gap-2">
                <Button 
                  onClick={exportCatalogueToCSV}
                  variant="outline"
                  className="flex items-center gap-2"
                  disabled={catalogueItems.length === 0}
                >
                  <Download className="w-4 h-4" />
                  Export CSV
                </Button>
                <Button 
                  onClick={downloadCSVTemplate}
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  Template CSV
                </Button>
                <Button 
                  onClick={() => setIsUploadingCSV(true)}
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  <FileSpreadsheet className="w-4 h-4" />
                  Upload CSV
                </Button>
                <Button 
                  onClick={() => setIsAddingCatalogue(true)}
                  className="flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Tambah Produk
                </Button>
              </div>
            </div>

            {/* Form untuk upload CSV */}
            {isUploadingCSV && (
              <Card>
                <CardHeader>
                  <CardTitle>Upload Data Katalog dari CSV</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="csvFile">Pilih File CSV</Label>
                    <Input
                      id="csvFile"
                      type="file"
                      accept=".csv"
                      onChange={handleCSVFileChange}
                      className="cursor-pointer"
                    />
                    <p className="text-sm text-gray-600">
                      Format CSV harus menggunakan header: jenis, namaBarang, spesifikasi, qty, satuan, hargaSatuan, foto
                    </p>
                  </div>
                  
                  {csvFile && (
                    <div className="p-3 bg-blue-50 border border-blue-200 rounded-md">
                      <p className="text-sm text-blue-800">
                        File dipilih: <strong>{csvFile.name}</strong>
                      </p>
                      <p className="text-xs text-blue-600 mt-1">
                        Ukuran: {(csvFile.size / 1024).toFixed(2)} KB
                      </p>
                    </div>
                  )}

                  <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3">
                    <h4 className="font-medium text-yellow-800 mb-2">Petunjuk Upload CSV:</h4>
                    <ul className="text-sm text-yellow-700 space-y-1">
                      <li>• File harus berformat .csv</li>
                      <li>• Gunakan header: jenis, namaBarang, spesifikasi, qty, satuan, hargaSatuan, foto</li>
                      <li>• qty dan hargaSatuan harus berupa angka</li>
                      <li>• Jika foto kosong, akan menggunakan gambar default</li>
                      <li>• Download template CSV untuk contoh format yang benar</li>
                    </ul>
                  </div>

                  <div className="flex gap-2">
                    <Button 
                      onClick={handleUploadCSV} 
                      className="flex items-center gap-2"
                      disabled={!csvFile}
                    >
                      <Upload className="w-4 h-4" />
                      Upload CSV
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={handleCancel}
                      className="flex items-center gap-2"
                    >
                      <X className="w-4 h-4" />
                      Batal
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Form untuk tambah/edit catalogue */}
            {(isAddingCatalogue || editingCatalogue) && (
              <Card>
                <CardHeader>
                  <CardTitle>
                    {isAddingCatalogue ? 'Tambah Produk Baru' : 'Edit Produk'}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="jenis">Jenis</Label>
                      <Input
                        id="jenis"
                        value={catalogueForm.jenis}
                        onChange={(e) => setCatalogueForm({...catalogueForm, jenis: e.target.value})}
                        placeholder="Elektronik, Furniture, ATK, dll"
                      />
                    </div>
                    <div>
                      <Label htmlFor="namaBarang">Nama Barang</Label>
                      <Input
                        id="namaBarang"
                        value={catalogueForm.namaBarang}
                        onChange={(e) => setCatalogueForm({...catalogueForm, namaBarang: e.target.value})}
                        placeholder="Masukkan nama barang"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="spesifikasi">Spesifikasi</Label>
                    <Textarea
                      id="spesifikasi"
                      value={catalogueForm.spesifikasi}
                      onChange={(e) => setCatalogueForm({...catalogueForm, spesifikasi: e.target.value})}
                      placeholder="Masukkan spesifikasi produk"
                      rows={2}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="qty">Quantity</Label>
                      <Input
                        id="qty"
                        type="number"
                        value={catalogueForm.qty}
                        onChange={(e) => setCatalogueForm({...catalogueForm, qty: e.target.value})}
                        placeholder="10"
                      />
                    </div>
                    <div>
                      <Label htmlFor="satuan">Satuan</Label>
                      <Input
                        id="satuan"
                        value={catalogueForm.satuan}
                        onChange={(e) => setCatalogueForm({...catalogueForm, satuan: e.target.value})}
                        placeholder="Unit, Pcs, Rim, dll"
                      />
                    </div>
                    <div>
                      <Label htmlFor="hargaSatuan">Harga Satuan</Label>
                      <Input
                        id="hargaSatuan"
                        type="number"
                        value={catalogueForm.hargaSatuan}
                        onChange={(e) => setCatalogueForm({...catalogueForm, hargaSatuan: e.target.value})}
                        placeholder="1000000"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="foto">URL Foto</Label>
                    <Input
                      id="foto"
                      value={catalogueForm.foto}
                      onChange={(e) => setCatalogueForm({...catalogueForm, foto: e.target.value})}
                      placeholder="https://images.unsplash.com/..."
                    />
                  </div>

                  <div className="flex gap-2">
                    <Button onClick={handleSaveCatalogue} className="flex items-center gap-2">
                      <Save className="w-4 h-4" />
                      Simpan
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={handleCancel}
                      className="flex items-center gap-2"
                    >
                      <X className="w-4 h-4" />
                      Batal
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Search and Filter Section */}
            <Card>
              <CardContent className="p-4">
                <div className="flex flex-col md:flex-row gap-4 items-center">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      placeholder="Cari produk berdasarkan nama, spesifikasi, atau jenis..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Label htmlFor="jenisFilter" className="whitespace-nowrap">Filter Jenis:</Label>
                    <select
                      id="jenisFilter"
                      value={selectedJenis}
                      onChange={(e) => setSelectedJenis(e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    >
                      {jenisOptions.map((jenis) => (
                        <option key={jenis} value={jenis}>
                          {jenis}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  {(searchTerm || selectedJenis !== 'Semua') && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSearchTerm('')
                        setSelectedJenis('Semua')
                      }}
                      className="whitespace-nowrap"
                    >
                      <X className="w-4 h-4 mr-1" />
                      Reset Filter
                    </Button>
                  )}
                </div>
                
                {/* Search Results Info */}
                <div className="mt-3 text-sm text-gray-600">
                  {searchTerm || selectedJenis !== 'Semua' ? (
                    <span>
                      Menampilkan {filteredCatalogueItems.length} dari {catalogueItems.length} produk
                      {searchTerm && ` untuk "${searchTerm}"`}
                      {selectedJenis !== 'Semua' && ` dalam kategori "${selectedJenis}"`}
                    </span>
                  ) : (
                    <span>Total {catalogueItems.length} produk</span>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Daftar catalogue items */}
            <div className="grid gap-4">
              {currentCatalogueItems.map((item) => (
                <Card key={item.id}>
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start">
                      <div className="flex gap-4">
                        <Image 
                          src={item.foto} 
                          alt={item.namaBarang}
                          width={96}
                          height={96}
                          className="w-24 h-24 object-cover rounded-lg"
                        />
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="text-xl font-semibold">{item.namaBarang}</h3>
                            <Badge variant="secondary">{item.jenis}</Badge>
                          </div>
                          <p className="text-gray-600 mb-2">{item.spesifikasi}</p>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                            <div>
                              <span className="text-gray-500">Qty:</span>
                              <span className="ml-1 font-medium">{item.qty} {item.satuan}</span>
                            </div>
                            <div>
                              <span className="text-gray-500">Harga:</span>
                              <span className="ml-1 font-medium">Rp {item.hargaSatuan.toLocaleString()}</span>
                            </div>
                            <div>
                              <span className="text-gray-500">Total:</span>
                              <span className="ml-1 font-medium">Rp {item.jumlah.toLocaleString()}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2 ml-4">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEditCatalogue(item)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDeleteCatalogue(item.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
              
              {/* Empty State */}
              {filteredCatalogueItems.length === 0 && (
                <Card>
                  <CardContent className="p-12 text-center">
                    <FileSpreadsheet className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      {searchTerm || selectedJenis !== 'Semua' 
                        ? 'Tidak ada produk yang ditemukan' 
                        : 'Belum ada produk'
                      }
                    </h3>
                    <p className="text-gray-500 mb-4">
                      {searchTerm || selectedJenis !== 'Semua'
                        ? 'Coba ubah kata kunci pencarian atau filter kategori'
                        : 'Mulai tambahkan produk ke katalog Anda'
                      }
                    </p>
                    {!searchTerm && selectedJenis === 'Semua' && (
                      <Button onClick={() => setIsAddingCatalogue(true)}>
                        <Plus className="w-4 h-4 mr-2" />
                        Tambah Produk Pertama
                      </Button>
                    )}
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <Card>
                <CardContent className="p-4">
                  <div className="flex justify-center items-center space-x-2">
                    {/* Previous Button */}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                      className="flex items-center space-x-1"
                    >
                      <span>←</span>
                      <span>Sebelumnya</span>
                    </Button>

                    {/* Page Numbers */}
                    <div className="flex space-x-1">
                      {[...Array(totalPages)].map((_, index) => {
                        const pageNumber = index + 1
                        const isCurrentPage = pageNumber === currentPage
                        
                        // Show first page, last page, current page, and pages around current page
                        if (
                          pageNumber === 1 ||
                          pageNumber === totalPages ||
                          (pageNumber >= currentPage - 1 && pageNumber <= currentPage + 1)
                        ) {
                          return (
                            <Button
                              key={pageNumber}
                              variant={isCurrentPage ? "default" : "outline"}
                              size="sm"
                              onClick={() => setCurrentPage(pageNumber)}
                              className={`min-w-[40px] ${
                                isCurrentPage 
                                  ? 'bg-red-600 hover:bg-red-700 text-white' 
                                  : 'hover:bg-gray-100'
                              }`}
                            >
                              {pageNumber}
                            </Button>
                          )
                        }
                        
                        // Show ellipsis
                        if (
                          (pageNumber === currentPage - 2 && currentPage > 3) ||
                          (pageNumber === currentPage + 2 && currentPage < totalPages - 2)
                        ) {
                          return (
                            <span key={pageNumber} className="px-2 py-1 text-gray-500">
                              ...
                            </span>
                          )
                        }
                        
                        return null
                      })}
                    </div>

                    {/* Next Button */}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                      disabled={currentPage === totalPages}
                      className="flex items-center space-x-1"
                    >
                      <span>Selanjutnya</span>
                      <span>→</span>
                    </Button>
                  </div>

                  {/* Pagination Info */}
                  <div className="text-center mt-3 text-sm text-gray-600">
                    Halaman {currentPage} dari {totalPages} 
                    (Menampilkan {startIndex + 1}-{Math.min(endIndex, filteredCatalogueItems.length)} dari {filteredCatalogueItems.length} produk)
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Pricing Plans Management Tab */}
          <TabsContent value="pricing" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-semibold">Kelola Paket Harga</h2>
              <div className="flex gap-2">
                <Button 
                  onClick={() => setIsAddingPricingPlan(true)}
                  className="flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Tambah Plan
                </Button>
                <Button 
                  onClick={exportPricingToCSV}
                  variant="outline"
                  className="flex items-center gap-2"
                  disabled={pricingPlans.length === 0}
                >
                  <Download className="w-4 h-4" />
                  Export CSV
                </Button>
                <Button 
                  onClick={downloadPricingTemplate}
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  Template CSV
                </Button>
                <Button 
                  onClick={() => setIsUploadingPricingCSV(true)}
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  <Upload className="w-4 h-4" />
                  Import CSV
                </Button>
              </div>
            </div>

            {/* Error/Success Messages */}
            {pricingError && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-red-600 mt-0.5" />
                  <p className="text-sm text-red-800">{pricingError}</p>
                </div>
              </div>
            )}

            {pricingSuccess && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600 mt-0.5" />
                  <p className="text-sm text-green-800">{pricingSuccess}</p>
                </div>
              </div>
            )}

            {/* Search Bar */}
            <Card>
              <CardContent className="p-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Cari pricing plan berdasarkan nama, subtitle, atau fitur..."
                    value={pricingSearchTerm}
                    onChange={(e) => setPricingSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                {pricingSearchTerm && (
                  <div className="mt-2 text-sm text-gray-600">
                    Menampilkan hasil pencarian untuk "{pricingSearchTerm}"
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Manual Pricing Plan Form */}
            {(isAddingPricingPlan || editingPricingPlan) && (
              <Card>
                <CardHeader>
                  <CardTitle>
                    {editingPricingPlan ? 'Edit Pricing Plan' : 'Tambah Pricing Plan Baru'}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Basic Information */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="planName">Nama Plan *</Label>
                      <Input
                        id="planName"
                        value={pricingPlanForm.name}
                        onChange={(e) => setPricingPlanForm(prev => ({...prev, name: e.target.value}))}
                        placeholder="e.g., Basic Plan, Premium Plan"
                      />
                    </div>
                    <div>
                      <Label htmlFor="planSubtitle">Subtitle *</Label>
                      <Input
                        id="planSubtitle"
                        value={pricingPlanForm.subtitle}
                        onChange={(e) => setPricingPlanForm(prev => ({...prev, subtitle: e.target.value}))}
                        placeholder="e.g., Perfect for small kitchens"
                      />
                    </div>
                  </div>

                  {/* Pricing Information */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                      <Label htmlFor="planPrice">Harga *</Label>
                      <Input
                        id="planPrice"
                        value={pricingPlanForm.price}
                        onChange={(e) => setPricingPlanForm(prev => ({...prev, price: e.target.value}))}
                        placeholder="Rp 25 juta"
                      />
                    </div>
                    <div>
                      <Label htmlFor="planOriginalPrice">Harga Asli *</Label>
                      <Input
                        id="planOriginalPrice"
                        value={pricingPlanForm.originalPrice}
                        onChange={(e) => setPricingPlanForm(prev => ({...prev, originalPrice: e.target.value}))}
                        placeholder="Rp 30 juta"
                      />
                    </div>
                    <div>
                      <Label htmlFor="planDiscount">Diskon</Label>
                      <Input
                        id="planDiscount"
                        value={pricingPlanForm.discount}
                        onChange={(e) => setPricingPlanForm(prev => ({...prev, discount: e.target.value}))}
                        placeholder="20%"
                      />
                    </div>
                    <div>
                      <Label htmlFor="planSortOrder">Urutan</Label>
                      <Input
                        id="planSortOrder"
                        type="number"
                        value={pricingPlanForm.sortOrder}
                        onChange={(e) => setPricingPlanForm(prev => ({...prev, sortOrder: parseInt(e.target.value) || 1}))}
                        placeholder="1"
                      />
                    </div>
                  </div>

                  {/* Description */}
                  <div>
                    <Label htmlFor="planDescription">Deskripsi</Label>
                    <Textarea
                      id="planDescription"
                      value={pricingPlanForm.description}
                      onChange={(e) => setPricingPlanForm(prev => ({...prev, description: e.target.value}))}
                      placeholder="Jelaskan detail tentang paket ini..."
                      rows={3}
                    />
                  </div>

                  {/* Settings */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="planColor">Warna Tema</Label>
                      <select
                        id="planColor"
                        value={pricingPlanForm.color}
                        onChange={(e) => setPricingPlanForm(prev => ({...prev, color: e.target.value}))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                      >
                        <option value="blue">Blue</option>
                        <option value="green">Green</option>
                        <option value="red">Red</option>
                        <option value="yellow">Yellow</option>
                        <option value="purple">Purple</option>
                        <option value="pink">Pink</option>
                        <option value="gray">Gray</option>
                      </select>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id="planPopular"
                          checked={pricingPlanForm.popular}
                          onChange={(e) => setPricingPlanForm(prev => ({...prev, popular: e.target.checked}))}
                          className="w-4 h-4"
                        />
                        <Label htmlFor="planPopular">Popular Plan</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id="planActive"
                          checked={pricingPlanForm.isActive}
                          onChange={(e) => setPricingPlanForm(prev => ({...prev, isActive: e.target.checked}))}
                          className="w-4 h-4"
                        />
                        <Label htmlFor="planActive">Plan Aktif</Label>
                      </div>
                    </div>
                  </div>

                  {/* Features Section */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold">Features ({pricingPlanForm.features.length})</h3>
                      <div className="flex gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={addSingleFeature}
                        >
                          <Plus className="w-3 h-3 mr-1" />
                          Add Feature
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={downloadFeaturesTemplate}
                        >
                          <Download className="w-3 h-3 mr-1" />
                          Template
                        </Button>
                      </div>
                    </div>

                    {/* CSV Import for Features */}
                    <Card className="bg-blue-50 border-blue-200">
                      <CardContent className="p-4">
                        <div className="flex items-center gap-4">
                          <div className="flex-1">
                            <Label htmlFor="featuresCSV" className="text-sm font-medium">Import Features dari CSV</Label>
                            <Input
                              id="featuresCSV"
                              type="file"
                              accept=".csv"
                              onChange={handleFeaturesCSVChange}
                              className="cursor-pointer mt-1"
                            />
                          </div>
                          <Button
                            type="button"
                            onClick={importFeaturesFromCSV}
                            disabled={!featuresCSV}
                            size="sm"
                          >
                            <Upload className="w-3 h-3 mr-1" />
                            Import
                          </Button>
                        </div>
                        {featuresCSV && (
                          <p className="text-xs text-blue-600 mt-2">
                            File: {featuresCSV.name} ({(featuresCSV.size / 1024).toFixed(2)} KB)
                          </p>
                        )}
                        <p className="text-xs text-blue-600 mt-1">
                          Format: Satu feature per baris. Header optional. Download template untuk contoh.
                        </p>
                      </CardContent>
                    </Card>

                    {/* Features List */}
                    {pricingPlanForm.features.length > 0 ? (
                      <div className="grid gap-2 max-h-48 overflow-y-auto">
                        {pricingPlanForm.features.map((feature, index) => (
                          <div key={index} className="flex items-center gap-2 p-2 bg-green-50 border border-green-200 rounded">
                            <span className="text-green-600 font-bold">✓</span>
                            <span className="flex-1 text-sm">{feature}</span>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => removeFeature(index)}
                              className="text-red-500 hover:text-red-700 p-1"
                            >
                              <X className="w-3 h-3" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-gray-500 border-2 border-dashed border-gray-300 rounded">
                        <p>Belum ada features. Tambah manual atau import dari CSV.</p>
                      </div>
                    )}
                  </div>

                  {/* Limitations Section */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold">Limitations ({pricingPlanForm.limitations.length})</h3>
                      <div className="flex gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={addSingleLimitation}
                        >
                          <Plus className="w-3 h-3 mr-1" />
                          Add Limitation
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={downloadLimitationsTemplate}
                        >
                          <Download className="w-3 h-3 mr-1" />
                          Template
                        </Button>
                      </div>
                    </div>

                    {/* CSV Import for Limitations */}
                    <Card className="bg-red-50 border-red-200">
                      <CardContent className="p-4">
                        <div className="flex items-center gap-4">
                          <div className="flex-1">
                            <Label htmlFor="limitationsCSV" className="text-sm font-medium">Import Limitations dari CSV</Label>
                            <Input
                              id="limitationsCSV"
                              type="file"
                              accept=".csv"
                              onChange={handleLimitationsCSVChange}
                              className="cursor-pointer mt-1"
                            />
                          </div>
                          <Button
                            type="button"
                            onClick={importLimitationsFromCSV}
                            disabled={!limitationsCSV}
                            size="sm"
                          >
                            <Upload className="w-3 h-3 mr-1" />
                            Import
                          </Button>
                        </div>
                        {limitationsCSV && (
                          <p className="text-xs text-red-600 mt-2">
                            File: {limitationsCSV.name} ({(limitationsCSV.size / 1024).toFixed(2)} KB)
                          </p>
                        )}
                        <p className="text-xs text-red-600 mt-1">
                          Format: Satu limitation per baris. Header optional. Download template untuk contoh.
                        </p>
                      </CardContent>
                    </Card>

                    {/* Limitations List */}
                    {pricingPlanForm.limitations.length > 0 ? (
                      <div className="grid gap-2 max-h-48 overflow-y-auto">
                        {pricingPlanForm.limitations.map((limitation, index) => (
                          <div key={index} className="flex items-center gap-2 p-2 bg-red-50 border border-red-200 rounded">
                            <span className="text-red-600 font-bold">✗</span>
                            <span className="flex-1 text-sm">{limitation}</span>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => removeLimitation(index)}
                              className="text-red-500 hover:text-red-700 p-1"
                            >
                              <X className="w-3 h-3" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-gray-500 border-2 border-dashed border-gray-300 rounded">
                        <p>Belum ada limitations. Tambah manual atau import dari CSV.</p>
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2 pt-4 border-t">
                    <Button 
                      onClick={savePricingPlan}
                      className="flex items-center gap-2 bg-red-600 hover:bg-red-700"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Save className="w-4 h-4" />
                      )}
                      {isSubmitting ? 'Menyimpan...' : 'Simpan Pricing Plan'}
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={resetPricingPlanForm}
                      className="flex items-center gap-2"
                      disabled={isSubmitting}
                    >
                      <X className="w-4 h-4" />
                      Batal
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* CSV Import Interface */}
            {isUploadingPricingCSV && (
              <Card>
                <CardHeader>
                  <CardTitle>Import Pricing Plans dari CSV</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="pricingCsvFile">Pilih File CSV</Label>
                    <Input
                      id="pricingCsvFile"
                      type="file"
                      accept=".csv"
                      onChange={handlePricingCSVFileChange}
                      className="cursor-pointer"
                    />
                    <p className="text-sm text-gray-600">
                      Format CSV harus menggunakan header: name, subtitle, price, originalPrice, discount, description, features, limitations, popular, color, sortOrder, isActive
                    </p>
                  </div>
                  
                  {pricingCsvFile && (
                    <div className="p-3 bg-blue-50 border border-blue-200 rounded-md">
                      <p className="text-sm text-blue-800">
                        File dipilih: <strong>{pricingCsvFile.name}</strong>
                      </p>
                      <p className="text-xs text-blue-600 mt-1">
                        Ukuran: {(pricingCsvFile.size / 1024).toFixed(2)} KB
                      </p>
                    </div>
                  )}

                  <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3">
                    <h4 className="font-medium text-yellow-800 mb-2">Petunjuk Upload CSV:</h4>
                    <ul className="text-sm text-yellow-700 space-y-1">
                      <li>• File harus berformat .csv</li>
                      <li>• Required fields: name, subtitle, price, originalPrice</li>
                      <li>• Features/limitations pisahkan dengan | (pipe)</li>
                      <li>• Popular: true/false (hanya satu yang boleh true)</li>
                      <li>• isActive: true/false</li>
                      <li>• Download template CSV untuk contoh format yang benar</li>
                    </ul>
                  </div>

                  <div className="flex gap-2">
                    <Button 
                      onClick={() => handleUploadPricingCSV(false)} 
                      className="flex items-center gap-2"
                      disabled={!pricingCsvFile || isSubmitting}
                    >
                      {isSubmitting ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Upload className="w-4 h-4" />
                      )}
                      {isSubmitting ? 'Importing...' : 'Import & Tambah Data'}
                    </Button>
                    <Button 
                      onClick={() => handleUploadPricingCSV(true)} 
                      variant="outline"
                      className="flex items-center gap-2"
                      disabled={!pricingCsvFile || isSubmitting}
                    >
                      {isSubmitting ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Upload className="w-4 h-4" />
                      )}
                      {isSubmitting ? 'Replacing...' : 'Import & Replace All'}
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => {
                        setIsUploadingPricingCSV(false)
                        setPricingCsvFile(null)
                        setPricingError(null)
                        setPricingSuccess(null)
                      }}
                      className="flex items-center gap-2"
                      disabled={isSubmitting}
                    >
                      <X className="w-4 h-4" />
                      Batal
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Pricing Plans Grid */}
            {pricingPlans.length === 0 ? (
              <Card className="text-center py-12">
                <CardContent>
                  <div className="text-gray-500 mb-4">
                    <DollarSign className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <h3 className="text-lg font-medium mb-2">No Pricing Plans Found</h3>
                    <p>Get started by importing CSV data</p>
                  </div>
                  <Button onClick={() => setIsUploadingPricingCSV(true)}>
                    <Upload className="w-4 h-4 mr-2" />
                    Import Pricing Plans
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredPricingPlans.map((plan) => (
                  <Card key={plan.id} className={`relative ${plan.isActive ? '' : 'opacity-60'}`}>
                    {plan.popular && (
                      <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-red-500 to-red-600 text-white text-center py-1 text-xs font-semibold">
                        <Star className="inline w-3 h-3 mr-1" />
                        POPULAR
                      </div>
                    )}

                    <CardHeader className={`${plan.popular ? 'pt-8' : 'pt-4'}`}>
                      <div className="flex items-center justify-between mb-2">
                        <Badge variant={plan.isActive ? "default" : "secondary"}>
                          {plan.isActive ? "Active" : "Inactive"}
                        </Badge>
                        <Badge variant="outline" className={`text-${plan.color}-600 bg-${plan.color}-50`}>
                          {plan.color}
                        </Badge>
                      </div>

                      <CardTitle className="text-xl font-bold">{plan.name}</CardTitle>
                      <p className="text-sm text-gray-600">{plan.subtitle}</p>
                      
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-2xl font-bold text-gray-900">{plan.price}</span>
                          <Badge variant="destructive" className="text-xs">
                            {plan.discount} OFF
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-500 line-through">{plan.originalPrice}</p>
                      </div>
                    </CardHeader>

                    <CardContent>
                      <p className="text-sm text-gray-600 mb-4">{plan.description}</p>
                      
                      <div className="space-y-3">
                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <p className="text-xs font-medium text-gray-900">
                              Features ({plan.features.length})
                            </p>
                            {plan.features.length > 3 && (
                              <Button
                                size="sm"
                                variant="ghost"
                                className="h-5 px-2 text-xs hover:bg-gray-100"
                                onClick={() => {
                                  setExpandedFeatures(prev => ({
                                    ...prev,
                                    [plan.id]: !prev[plan.id]
                                  }))
                                }}
                              >
                                {expandedFeatures[plan.id] ? 'Collapse' : 'Show All'}
                              </Button>
                            )}
                          </div>
                          <div className="text-xs text-gray-600 space-y-1">
                            {(expandedFeatures[plan.id] ? plan.features : plan.features.slice(0, 3)).map((feature, index) => (
                              <div key={index} className="flex items-start gap-1">
                                <span className="text-green-500 font-bold">✓</span>
                                <span 
                                  className="flex-1 cursor-pointer hover:text-gray-800" 
                                  title={feature.length > 50 ? feature : ''}
                                >
                                  {feature.length > 50 && !expandedFeatures[plan.id] 
                                    ? `${feature.substring(0, 47)}...` 
                                    : feature
                                  }
                                </span>
                              </div>
                            ))}
                            {!expandedFeatures[plan.id] && plan.features.length > 3 && (
                              <div className="text-gray-400 text-center py-1 border-t border-dashed">
                                +{plan.features.length - 3} more features
                              </div>
                            )}
                          </div>
                        </div>

                        {plan.limitations.length > 0 && (
                          <div>
                            <div className="flex items-center justify-between mb-1">
                              <p className="text-xs font-medium text-gray-900">
                                Limitations ({plan.limitations.length})
                              </p>
                              {plan.limitations.length > 2 && (
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  className="h-5 px-2 text-xs hover:bg-gray-100"
                                  onClick={() => {
                                    setExpandedLimitations(prev => ({
                                      ...prev,
                                      [plan.id]: !prev[plan.id]
                                    }))
                                  }}
                                >
                                  {expandedLimitations[plan.id] ? 'Collapse' : 'Show All'}
                                </Button>
                              )}
                            </div>
                            <div className="text-xs text-gray-500 space-y-1">
                              {(expandedLimitations[plan.id] ? plan.limitations : plan.limitations.slice(0, 2)).map((limitation, index) => (
                                <div key={index} className="flex items-start gap-1">
                                  <span className="text-red-500 font-bold">✗</span>
                                  <span 
                                    className="flex-1 cursor-pointer hover:text-gray-700" 
                                    title={limitation.length > 50 ? limitation : ''}
                                  >
                                    {limitation.length > 50 && !expandedLimitations[plan.id] 
                                      ? `${limitation.substring(0, 47)}...` 
                                      : limitation
                                    }
                                  </span>
                                </div>
                              ))}
                              {!expandedLimitations[plan.id] && plan.limitations.length > 2 && (
                                <div className="text-gray-400 text-center py-1 border-t border-dashed">
                                  +{plan.limitations.length - 2} more limitations
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2 mt-4 pt-4 border-t">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setViewingPlan(plan)}
                          className="flex-1"
                        >
                          <Eye className="w-3 h-3 mr-1" />
                          Details
                        </Button>
                        
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => togglePlanStatus(plan.id, plan.isActive)}
                          disabled={pricingActionLoading[plan.id] === 'toggle'}
                        >
                          {pricingActionLoading[plan.id] === 'toggle' ? (
                            <Loader2 className="w-3 h-3 animate-spin" />
                          ) : plan.isActive ? (
                            <EyeOff className="w-3 h-3" />
                          ) : (
                            <Eye className="w-3 h-3" />
                          )}
                        </Button>
                        
                        <Button size="sm" variant="outline" onClick={() => editPricingPlan(plan)}>
                          <Edit className="w-3 h-3" />
                        </Button>
                        
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => deletePlan(plan.id)}
                          disabled={pricingActionLoading[plan.id] === 'delete'}
                          className="text-red-600 hover:text-red-700"
                        >
                          {pricingActionLoading[plan.id] === 'delete' ? (
                            <Loader2 className="w-3 h-3 animate-spin" />
                          ) : (
                            <Trash2 className="w-3 h-3" />
                          )}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {/* Empty State for Filtered Results */}
            {pricingPlans.length > 0 && filteredPricingPlans.length === 0 && (
              <Card className="text-center py-12">
                <CardContent>
                  <div className="text-gray-500 mb-4">
                    <Search className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <h3 className="text-lg font-medium mb-2">No Pricing Plans Found</h3>
                    <p>No plans match your search criteria "{pricingSearchTerm}"</p>
                  </div>
                  <Button 
                    variant="outline" 
                    onClick={() => setPricingSearchTerm('')}
                  >
                    Clear Search
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Invoice Settings Tab */}
          <TabsContent value="invoice" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-semibold">Pengaturan Invoice</h2>
            </div>

            {/* Company Data Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="w-5 h-5" />
                  Data Perusahaan
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {!isEditingCompany ? (
                  <div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <Label className="text-sm font-medium text-gray-700">Nama Perusahaan</Label>
                        <p className="text-sm text-gray-900 bg-gray-50 p-2 rounded">{companyData.name}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-700">Email</Label>
                        <p className="text-sm text-gray-900 bg-gray-50 p-2 rounded">{companyData.email}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-700">Telepon</Label>
                        <p className="text-sm text-gray-900 bg-gray-50 p-2 rounded">{companyData.phone}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-700">Website</Label>
                        <p className="text-sm text-gray-900 bg-gray-50 p-2 rounded">{companyData.website}</p>
                      </div>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-700">Alamat</Label>
                      <p className="text-sm text-gray-900 bg-gray-50 p-2 rounded">{companyData.address}</p>
                    </div>
                    <Button 
                      onClick={() => setIsEditingCompany(true)}
                      className="flex items-center gap-2 mt-4"
                    >
                      <Edit className="w-4 h-4" />
                      Edit Data Perusahaan
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="companyName">Nama Perusahaan</Label>
                        <Input
                          id="companyName"
                          value={companyData.name}
                          onChange={(e) => setCompanyData({...companyData, name: e.target.value})}
                          placeholder="Nama perusahaan"
                        />
                      </div>
                      <div>
                        <Label htmlFor="companyEmail">Email</Label>
                        <Input
                          id="companyEmail"
                          type="email"
                          value={companyData.email}
                          onChange={(e) => setCompanyData({...companyData, email: e.target.value})}
                          placeholder="email@perusahaan.com"
                        />
                      </div>
                      <div>
                        <Label htmlFor="companyPhone">Telepon</Label>
                        <Input
                          id="companyPhone"
                          value={companyData.phone}
                          onChange={(e) => setCompanyData({...companyData, phone: e.target.value})}
                          placeholder="+62 21 1234 5678"
                        />
                      </div>
                      <div>
                        <Label htmlFor="companyWebsite">Website</Label>
                        <Input
                          id="companyWebsite"
                          value={companyData.website}
                          onChange={(e) => setCompanyData({...companyData, website: e.target.value})}
                          placeholder="www.perusahaan.com"
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="companyAddress">Alamat</Label>
                      <Textarea
                        id="companyAddress"
                        value={companyData.address}
                        onChange={(e) => setCompanyData({...companyData, address: e.target.value})}
                        placeholder="Alamat lengkap perusahaan"
                        rows={3}
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        onClick={saveCompanySettings}
                        className="flex items-center gap-2 bg-red-600 hover:bg-red-700"
                      >
                        <Save className="w-4 h-4" />
                        Simpan
                      </Button>
                      <Button 
                        variant="outline"
                        onClick={() => {
                          setIsEditingCompany(false)
                          loadInvoiceSettings() // Reset form
                        }}
                        className="flex items-center gap-2"
                      >
                        <X className="w-4 h-4" />
                        Batal
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Invoice Counter Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Nomor Invoice
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-sm font-medium text-gray-700">Format Nomor Invoice</Label>
                  <p className="text-sm text-gray-600 bg-blue-50 p-2 rounded border border-blue-200">
                    <strong>INV-GBU-{invoiceCounter.toString().padStart(5, '0')}</strong> (Nomor berikutnya)
                  </p>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <Label htmlFor="invoiceCounter">Counter Invoice Berikutnya</Label>
                    <Input
                      id="invoiceCounter"
                      type="number"
                      min="1"
                      value={invoiceCounter}
                      onChange={(e) => setInvoiceCounterState(parseInt(e.target.value) || 1)}
                      placeholder="1"
                      className="w-32"
                    />
                  </div>
                  <Button 
                    onClick={updateInvoiceCounterHandler}
                    className="flex items-center gap-2 bg-red-600 hover:bg-red-700"
                  >
                    <Save className="w-4 h-4" />
                    Update Counter
                  </Button>
                </div>
                
                <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3">
                  <h4 className="font-medium text-yellow-800 mb-2">⚠️ Peringatan:</h4>
                  <p className="text-sm text-yellow-700">
                    Mengubah counter invoice akan mempengaruhi nomor invoice berikutnya. 
                    Pastikan nomor yang diatur tidak duplikat dengan invoice yang sudah ada.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Invoice Preview */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="w-5 h-5" />
                  Preview Invoice
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-gray-50 p-4 rounded-lg border">
                  <div className="flex items-start gap-4 mb-4">
                    <img 
                      src="/Logo.svg" 
                      alt="Logo" 
                      className="w-16 h-16 object-contain"
                    />
                    <div>
                      <h3 className="text-lg font-bold text-red-600">INVOICE</h3>
                      <p className="text-sm text-gray-600">INV-GBU-{invoiceCounter.toString().padStart(5, '0')}</p>
                    </div>
                    <div className="ml-auto text-right">
                      <h4 className="font-bold text-sm">{companyData.name}</h4>
                      <p className="text-xs text-gray-600">{companyData.address}</p>
                      <p className="text-xs text-gray-600">{companyData.phone}</p>
                      <p className="text-xs text-gray-600">{companyData.email}</p>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 text-center">Preview tampilan invoice dengan data terbaru</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        )}
      </div>

      {/* Pricing Plan Detail Modal */}
      {viewingPlan && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold">{viewingPlan.name}</h2>
                  <p className="text-gray-600">{viewingPlan.subtitle}</p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setViewingPlan(null)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Price Section */}
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center gap-3">
                  <span className="text-3xl font-bold text-gray-900">{viewingPlan.price}</span>
                  <Badge variant="destructive">{viewingPlan.discount} OFF</Badge>
                  {viewingPlan.popular && (
                    <Badge className="bg-yellow-500 text-white">
                      <Star className="w-3 h-3 mr-1" />
                      POPULAR
                    </Badge>
                  )}
                </div>
                <p className="text-gray-500 line-through mt-1">{viewingPlan.originalPrice}</p>
              </div>

              {/* Description */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Description</h3>
                <p className="text-gray-600">{viewingPlan.description}</p>
              </div>

              {/* Features */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">
                  Features ({viewingPlan.features.length})
                </h3>
                <div className="grid gap-2">
                  {viewingPlan.features.map((feature, index) => (
                    <div key={index} className="flex items-start gap-2 p-2 bg-green-50 rounded">
                      <span className="text-green-600 font-bold mt-0.5">✓</span>
                      <span className="text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Limitations */}
              {viewingPlan.limitations.length > 0 && (
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">
                    Limitations ({viewingPlan.limitations.length})
                  </h3>
                  <div className="grid gap-2">
                    {viewingPlan.limitations.map((limitation, index) => (
                      <div key={index} className="flex items-start gap-2 p-2 bg-red-50 rounded">
                        <span className="text-red-600 font-bold mt-0.5">✗</span>
                        <span className="text-gray-700">{limitation}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Metadata */}
              <div className="border-t pt-4">
                <h3 className="font-semibold text-gray-900 mb-3">Plan Information</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">Color Theme:</span>
                    <div className="flex items-center gap-2 mt-1">
                      <div className={`w-4 h-4 rounded bg-${viewingPlan.color}-500`}></div>
                      <span className="capitalize">{viewingPlan.color}</span>
                    </div>
                  </div>
                  <div>
                    <span className="text-gray-500">Sort Order:</span>
                    <span className="ml-2 font-medium">{viewingPlan.sortOrder}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Status:</span>
                    <Badge className="ml-2" variant={viewingPlan.isActive ? "default" : "secondary"}>
                      {viewingPlan.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                  <div>
                    <span className="text-gray-500">Popular Plan:</span>
                    <span className="ml-2">{viewingPlan.popular ? "Yes" : "No"}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}