'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { 
  Plus, 
  Trash2, 
  Save, 
  X, 
  Upload,
  FileSpreadsheet,
  Download,
  Search,
  Star,
  CheckCircle,
  AlertCircle,
  Loader2,
  Edit,
  Eye,
  EyeOff
} from 'lucide-react'

export default function PricingManagement({ 
  pricingPlans, 
  setPricingPlans,
  isSubmitting, 
  setIsSubmitting 
}) {
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
        await fetchPricingPlans()
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
        await fetchPricingPlans()
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
      
      const fileInput = document.getElementById('pricingCsvFile')
      if (fileInput) fileInput.value = ''

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
      
      const escapedValues = values.map(value => {
        const str = String(value || '')
        return str.includes(',') || str.includes('\n') ? `"${str.replace(/"/g, '""')}"` : str
      })
      
      csv += escapedValues.join(',') + '\n'
    })

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
      if (trimmed && trimmed !== 'features' && trimmed !== 'feature') {
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
      const limitations = parseCSVFeatures(text)
      
      setPricingPlanForm(prev => ({
        ...prev,
        limitations: [...prev.limitations, ...limitations]
      }))
      
      setLimitationsCSV(null)
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
        await fetchPricingPlans()
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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-bold text-gray-900">Pricing Plans Management</h2>
        <div className="flex flex-wrap gap-2">
          <Button 
            onClick={() => setIsAddingPricingPlan(true)}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            Tambah Plan
          </Button>
          <Button 
            onClick={() => setIsUploadingPricingCSV(true)}
            variant="outline"
          >
            <Upload className="w-4 h-4 mr-2" />
            Import CSV
          </Button>
          <Button 
            onClick={exportPricingToCSV}
            variant="outline"
          >
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </Button>
        </div>
      </div>

      {/* Messages */}
      {pricingError && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-red-600" />
          <span className="text-red-800">{pricingError}</span>
        </div>
      )}

      {pricingSuccess && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-2">
          <CheckCircle className="w-5 h-5 text-green-600" />
          <span className="text-green-800">{pricingSuccess}</span>
        </div>
      )}

      {/* Search */}
      <div className="bg-white p-4 rounded-lg shadow-md border">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Cari pricing plans..."
            value={pricingSearchTerm}
            onChange={(e) => setPricingSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* CSV Upload Form */}
      {isUploadingPricingCSV && (
        <div className="bg-white p-6 rounded-lg shadow-md border">
          <h3 className="text-lg font-semibold mb-4">Import Pricing Plans dari CSV</h3>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="pricingCsvFile">Pilih File CSV</Label>
              <Input
                id="pricingCsvFile"
                type="file"
                accept=".csv"
                onChange={handlePricingCSVFileChange}
              />
            </div>
            
            <div className="flex gap-2">
              <Button 
                onClick={() => handleUploadPricingCSV(false)}
                disabled={!pricingCsvFile || isSubmitting}
                className="bg-green-600 hover:bg-green-700"
              >
                <Upload className="w-4 h-4 mr-2" />
                {isSubmitting ? 'Mengupload...' : 'Import (Tambah)'}
              </Button>
              <Button 
                onClick={() => handleUploadPricingCSV(true)}
                disabled={!pricingCsvFile || isSubmitting}
                variant="destructive"
              >
                <Upload className="w-4 h-4 mr-2" />
                {isSubmitting ? 'Mengupload...' : 'Import (Replace)'}
              </Button>
              <Button 
                onClick={downloadPricingTemplate}
                variant="outline"
              >
                <FileSpreadsheet className="w-4 h-4 mr-2" />
                Download Template
              </Button>
              <Button 
                onClick={() => {
                  setIsUploadingPricingCSV(false)
                  setPricingCsvFile(null)
                }}
                variant="outline"
              >
                <X className="w-4 h-4 mr-2" />
                Batal
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Add/Edit Form */}
      {isAddingPricingPlan && (
        <div className="bg-white p-6 rounded-lg shadow-md border">
          <h3 className="text-lg font-semibold mb-4">
            {editingPricingPlan ? 'Edit Pricing Plan' : 'Tambah Pricing Plan Baru'}
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="planName">Nama Plan</Label>
              <Input
                id="planName"
                value={pricingPlanForm.name}
                onChange={(e) => setPricingPlanForm({...pricingPlanForm, name: e.target.value})}
                placeholder="Basic Plan"
              />
            </div>
            
            <div>
              <Label htmlFor="planSubtitle">Subtitle</Label>
              <Input
                id="planSubtitle"
                value={pricingPlanForm.subtitle}
                onChange={(e) => setPricingPlanForm({...pricingPlanForm, subtitle: e.target.value})}
                placeholder="Perfect for starters"
              />
            </div>
            
            <div>
              <Label htmlFor="planPrice">Harga</Label>
              <Input
                id="planPrice"
                value={pricingPlanForm.price}
                onChange={(e) => setPricingPlanForm({...pricingPlanForm, price: e.target.value})}
                placeholder="99000"
              />
            </div>
            
            <div>
              <Label htmlFor="planOriginalPrice">Harga Original</Label>
              <Input
                id="planOriginalPrice"
                value={pricingPlanForm.originalPrice}
                onChange={(e) => setPricingPlanForm({...pricingPlanForm, originalPrice: e.target.value})}
                placeholder="150000"
              />
            </div>
            
            <div>
              <Label htmlFor="planDiscount">Diskon (%)</Label>
              <Input
                id="planDiscount"
                value={pricingPlanForm.discount}
                onChange={(e) => setPricingPlanForm({...pricingPlanForm, discount: e.target.value})}
                placeholder="34"
              />
            </div>
            
            <div>
              <Label htmlFor="planColor">Warna</Label>
              <select
                id="planColor"
                value={pricingPlanForm.color}
                onChange={(e) => setPricingPlanForm({...pricingPlanForm, color: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="blue">Blue</option>
                <option value="green">Green</option>
                <option value="purple">Purple</option>
                <option value="red">Red</option>
                <option value="orange">Orange</option>
              </select>
            </div>
            
            <div className="md:col-span-2">
              <Label htmlFor="planDescription">Deskripsi</Label>
              <Textarea
                id="planDescription"
                value={pricingPlanForm.description}
                onChange={(e) => setPricingPlanForm({...pricingPlanForm, description: e.target.value})}
                placeholder="Deskripsi lengkap plan ini..."
                rows={3}
              />
            </div>
            
            <div className="md:col-span-2">
              <Label>Features</Label>
              <div className="space-y-2">
                <div className="flex gap-2">
                  <Button 
                    type="button"
                    onClick={addSingleFeature}
                    size="sm"
                    variant="outline"
                  >
                    <Plus className="w-3 h-3 mr-1" />
                    Tambah Feature
                  </Button>
                  <Input
                    id="featuresCSV"
                    type="file"
                    accept=".csv"
                    onChange={handleFeaturesCSVChange}
                    className="hidden"
                  />
                  <Button 
                    type="button"
                    onClick={() => document.getElementById('featuresCSV').click()}
                    size="sm"
                    variant="outline"
                  >
                    <FileSpreadsheet className="w-3 h-3 mr-1" />
                    Import CSV
                  </Button>
                  {featuresCSV && (
                    <Button 
                      type="button"
                      onClick={importFeaturesFromCSV}
                      size="sm"
                      className="bg-green-600 hover:bg-green-700"
                    >
                      Import Features
                    </Button>
                  )}
                  <Button 
                    type="button"
                    onClick={downloadFeaturesTemplate}
                    size="sm"
                    variant="outline"
                  >
                    <Download className="w-3 h-3 mr-1" />
                    Template
                  </Button>
                </div>
                
                <div className="space-y-1 max-h-32 overflow-y-auto">
                  {pricingPlanForm.features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-2 bg-gray-50 p-2 rounded">
                      <span className="flex-1 text-sm">{feature}</span>
                      <Button
                        type="button"
                        onClick={() => removeFeature(index)}
                        size="sm"
                        variant="destructive"
                        className="h-6 w-6 p-0"
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="md:col-span-2">
              <Label>Limitations</Label>
              <div className="space-y-2">
                <div className="flex gap-2">
                  <Button 
                    type="button"
                    onClick={addSingleLimitation}
                    size="sm"
                    variant="outline"
                  >
                    <Plus className="w-3 h-3 mr-1" />
                    Tambah Limitation
                  </Button>
                  <Input
                    id="limitationsCSV"
                    type="file"
                    accept=".csv"
                    onChange={handleLimitationsCSVChange}
                    className="hidden"
                  />
                  <Button 
                    type="button"
                    onClick={() => document.getElementById('limitationsCSV').click()}
                    size="sm"
                    variant="outline"
                  >
                    <FileSpreadsheet className="w-3 h-3 mr-1" />
                    Import CSV
                  </Button>
                  {limitationsCSV && (
                    <Button 
                      type="button"
                      onClick={importLimitationsFromCSV}
                      size="sm"
                      className="bg-green-600 hover:bg-green-700"
                    >
                      Import Limitations
                    </Button>
                  )}
                  <Button 
                    type="button"
                    onClick={downloadLimitationsTemplate}
                    size="sm"
                    variant="outline"
                  >
                    <Download className="w-3 h-3 mr-1" />
                    Template
                  </Button>
                </div>
                
                <div className="space-y-1 max-h-32 overflow-y-auto">
                  {pricingPlanForm.limitations.map((limitation, index) => (
                    <div key={index} className="flex items-center gap-2 bg-gray-50 p-2 rounded">
                      <span className="flex-1 text-sm">{limitation}</span>
                      <Button
                        type="button"
                        onClick={() => removeLimitation(index)}
                        size="sm"
                        variant="destructive"
                        className="h-6 w-6 p-0"
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={pricingPlanForm.popular}
                  onChange={(e) => setPricingPlanForm({...pricingPlanForm, popular: e.target.checked})}
                  className="rounded"
                />
                <span className="text-sm">Popular Plan</span>
              </label>
              
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={pricingPlanForm.isActive}
                  onChange={(e) => setPricingPlanForm({...pricingPlanForm, isActive: e.target.checked})}
                  className="rounded"
                />
                <span className="text-sm">Active</span>
              </label>
            </div>
            
            <div>
              <Label htmlFor="planSortOrder">Sort Order</Label>
              <Input
                id="planSortOrder"
                type="number"
                value={pricingPlanForm.sortOrder}
                onChange={(e) => setPricingPlanForm({...pricingPlanForm, sortOrder: parseInt(e.target.value) || 1})}
                placeholder="1"
              />
            </div>
          </div>
          
          <div className="flex gap-2 mt-6">
            <Button 
              onClick={savePricingPlan}
              disabled={isSubmitting}
              className="bg-green-600 hover:bg-green-700"
            >
              <Save className="w-4 h-4 mr-2" />
              {isSubmitting ? 'Menyimpan...' : 'Simpan'}
            </Button>
            <Button 
              onClick={resetPricingPlanForm}
              variant="outline"
            >
              <X className="w-4 h-4 mr-2" />
              Batal
            </Button>
          </div>
        </div>
      )}

      {/* Pricing Plans List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPricingPlans.map((plan) => (
          <div key={plan.id} className="bg-white rounded-lg shadow-md border overflow-hidden relative">
            {plan.popular && (
              <div className="absolute top-2 right-2">
                <Badge className="bg-yellow-500 text-white">
                  <Star className="w-3 h-3 mr-1" />
                  Popular
                </Badge>
              </div>
            )}
            
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-bold">{plan.name}</h3>
                  <p className="text-sm text-gray-600">{plan.subtitle}</p>
                </div>
                
                <button
                  onClick={() => togglePlanStatus(plan.id, plan.isActive)}
                  className={`p-1 rounded ${plan.isActive ? 'text-green-600' : 'text-gray-400'}`}
                  title={plan.isActive ? 'Aktif' : 'Nonaktif'}
                  disabled={pricingActionLoading[plan.id] === 'toggle'}
                >
                  {pricingActionLoading[plan.id] === 'toggle' ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : plan.isActive ? (
                    <Eye className="w-4 h-4" />
                  ) : (
                    <EyeOff className="w-4 h-4" />
                  )}
                </button>
              </div>
              
              <div className="mb-4">
                <div className="flex items-center gap-2">
                  <span className="text-3xl font-bold">Rp {parseFloat(plan.price).toLocaleString()}</span>
                  {plan.originalPrice && parseFloat(plan.originalPrice) > parseFloat(plan.price) && (
                    <span className="text-sm text-gray-500 line-through">
                      Rp {parseFloat(plan.originalPrice).toLocaleString()}
                    </span>
                  )}
                </div>
                {plan.discount && (
                  <Badge variant="destructive" className="mt-1">
                    {plan.discount}% OFF
                  </Badge>
                )}
              </div>
              
              <p className="text-sm text-gray-600 mb-4">{plan.description}</p>
              
              {plan.features && plan.features.length > 0 && (
                <div className="mb-4">
                  <p className="text-sm font-semibold mb-2">Features:</p>
                  <div className="space-y-1">
                    {plan.features.slice(0, 3).map((feature, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-sm">
                        <CheckCircle className="w-3 h-3 text-green-600" />
                        <span>{feature}</span>
                      </div>
                    ))}
                    {plan.features.length > 3 && (
                      <p className="text-xs text-gray-500">+{plan.features.length - 3} features lainnya</p>
                    )}
                  </div>
                </div>
              )}
              
              <div className="flex gap-2">
                <Button
                  size="sm"
                  onClick={() => editPricingPlan(plan)}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Edit className="w-3 h-3 mr-1" />
                  Edit
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => deletePlan(plan.id)}
                  disabled={pricingActionLoading[plan.id] === 'delete'}
                >
                  {pricingActionLoading[plan.id] === 'delete' ? (
                    <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                  ) : (
                    <Trash2 className="w-3 h-3 mr-1" />
                  )}
                  Hapus
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredPricingPlans.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">
            {pricingSearchTerm 
              ? 'Tidak ada pricing plans yang sesuai dengan pencarian.' 
              : 'Belum ada pricing plans. Klik "Tambah Plan" untuk membuat yang pertama.'
            }
          </p>
        </div>
      )}
    </div>
  )
}
