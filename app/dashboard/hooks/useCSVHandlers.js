'use client'

// Custom hook untuk CSV handling di Dashboard
import { catalogueApi } from '@/lib/api'

export function useCSVHandlers(catalogueItems, setCatalogueItems, pricingPlans, setPricingPlans, setIsSubmitting) {
  
  // Handler untuk CSV upload
  const handleCSVFileChange = (event, setCsvFile) => {
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
  const handleUploadCSV = async (csvFile, setCsvFile, setIsUploadingCSV) => {
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

  // Fetch pricing plans
  const fetchPricingPlans = async () => {
    try {
      const response = await fetch('/api/pricing-plans')
      const data = await response.json()
      
      if (data.success) {
        setPricingPlans(data.data || [])
      } else {
        console.error('Failed to fetch pricing plans')
      }
    } catch (error) {
      console.error('Error fetching pricing plans:', error)
    }
  }

  // Handle pricing CSV file selection
  const handlePricingCSVFileChange = (event, setPricingCsvFile, setPricingError, setPricingSuccess) => {
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
  const handleUploadPricingCSV = async (pricingCsvFile, setPricingCsvFile, setIsUploadingPricingCSV, setPricingError, setPricingSuccess, replaceExisting = false) => {
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
  const downloadPricingTemplate = async (setPricingError) => {
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

  return {
    handleCSVFileChange,
    parseCSV,
    handleUploadCSV,
    downloadCSVTemplate,
    exportCatalogueToCSV,
    fetchPricingPlans,
    handlePricingCSVFileChange,
    handleUploadPricingCSV,
    downloadPricingTemplate,
    exportPricingToCSV
  }
}
