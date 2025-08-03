'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { catalogueApi } from '@/lib/api'
import { 
  Edit, 
  Plus, 
  Trash2, 
  Save, 
  X, 
  Upload,
  FileSpreadsheet,
  Download,
  Search,
  RefreshCw
} from 'lucide-react'

export default function CatalogueManagement({ 
  catalogueItems, 
  setCatalogueItems, 
  isSubmitting, 
  setIsSubmitting 
}) {
  const [editingCatalogue, setCatalogueEditing] = useState(null)
  const [isAddingCatalogue, setIsAddingCatalogue] = useState(false)
  const [isUploadingCSV, setIsUploadingCSV] = useState(false)
  const [csvFile, setCsvFile] = useState(null)
  const [isRefreshing, setIsRefreshing] = useState(false)

  // Pagination and search states
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(6)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedJenis, setSelectedJenis] = useState('Semua')

  const [catalogueForm, setCatalogueForm] = useState({
    jenis: '',
    namaBarang: '',
    spesifikasi: '',
    qty: '',
    satuan: '',
    hargaSatuan: '',
    foto: ''
  })

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

  // Auto-refresh data on component mount to demonstrate API usage
  useEffect(() => {
    console.log('CatalogueManagement component mounted, current data:', catalogueItems.length, 'items')
    
    // Log API endpoint information
    console.log('Available API endpoints:')
    console.log('- GET /api/catalogues - Fetch all catalogues with pagination')
    console.log('- POST /api/catalogues - Create new catalogue item')
    console.log('- PUT /api/catalogues/[id] - Update catalogue item')
    console.log('- DELETE /api/catalogues/[id] - Delete catalogue item')
    console.log('- POST /api/catalogues/bulk - Bulk import catalogue items')
    
    // If no data is loaded, try to fetch from API
    if (catalogueItems.length === 0) {
      console.log('No catalogue items found, attempting to fetch from API...')
      refreshCatalogueData()
    }
  }, []) // Only run once when component mounts

  // Function to refresh catalogue data from API
  const refreshCatalogueData = async () => {
    try {
      setIsRefreshing(true)
      console.log('Refreshing catalogue data from API...')
      const cataloguesData = await catalogueApi.getAllForDashboard()
      setCatalogueItems(cataloguesData.data)
      console.log('Catalogue data refreshed:', cataloguesData.data.length, 'items')
    } catch (error) {
      console.error('Error refreshing catalogue data:', error)
      alert('Gagal memuat ulang data katalog: ' + error.message)
    } finally {
      setIsRefreshing(false)
    }
  }

  // Test API connectivity
  const testApiConnection = async () => {
    try {
      setIsRefreshing(true)
      console.log('Testing API connection...')
      
      // Test with a simple API call
      const response = await fetch('/api/catalogues?limit=1')
      const result = await response.json()
      
      if (result.success) {
        alert('✅ Koneksi API berhasil! Data tersedia: ' + (result.pagination?.total || 0) + ' produk')
        console.log('API Connection Test Result:', result)
      } else {
        alert('❌ API Error: ' + (result.error || 'Unknown error'))
      }
    } catch (error) {
      console.error('API Connection Test Failed:', error)
      alert('❌ Koneksi API gagal: ' + error.message)
    } finally {
      setIsRefreshing(false)
    }
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
        console.log('Creating new catalogue item via API:', updatedItem)
        const newCatalogue = await catalogueApi.create(updatedItem)
        console.log('New catalogue created:', newCatalogue)
        setCatalogueItems([...catalogueItems, newCatalogue])
        setIsAddingCatalogue(false)
        alert('Produk berhasil ditambahkan melalui API!')
      } else {
        console.log('Updating catalogue item via API:', editingCatalogue, updatedItem)
        const updatedCatalogue = await catalogueApi.update(editingCatalogue, updatedItem)
        console.log('Catalogue updated:', updatedCatalogue)
        setCatalogueItems(catalogueItems.map(item => 
          item.id === editingCatalogue ? updatedCatalogue : item
        ))
        setCatalogueEditing(null)
        alert('Produk berhasil diperbarui melalui API!')
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
      console.error('Error saving catalogue via API:', error)
      alert('Gagal menyimpan produk melalui API: ' + error.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  // Handler untuk cancel editing
  const handleCancel = () => {
    setCatalogueEditing(null)
    setIsAddingCatalogue(false)
    setIsUploadingCSV(false)
    setCsvFile(null)
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
  const handleDeleteCatalogue = async (id) => {
    if (confirm('Apakah Anda yakin ingin menghapus produk ini?')) {
      try {
        console.log('Deleting catalogue item via API:', id)
        await catalogueApi.delete(id)
        console.log('Catalogue item deleted successfully')
        setCatalogueItems(catalogueItems.filter(item => item.id !== id))
        alert('Produk berhasil dihapus melalui API!')
      } catch (error) {
        console.error('Error deleting catalogue via API:', error)
        alert('Gagal menghapus produk melalui API: ' + error.message)
      }
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

  // Fungsi untuk parse CSV
  const parseCSV = (csvText) => {
    const lines = csvText.split('\n')
    const headers = lines[0].split(',').map(header => header.trim().replace(/"/g, '').toLowerCase())
    const data = []

    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim()
      if (line) {
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
        
        const newCatalogueItems = parsedData.map((row, index) => {
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
        }).filter(item => item.namaBarang)

        if (newCatalogueItems.length === 0) {
          alert('Tidak ada data valid yang ditemukan dalam file CSV. Pastikan kolom namaBarang terisi.')
          return
        }

        console.log('Uploading', newCatalogueItems.length, 'items to API via bulk import...')
        const result = await catalogueApi.bulkImport(newCatalogueItems)
        console.log('Bulk import result:', result)
        
        // Refresh data from API after successful import
        await refreshCatalogueData()
        
        setIsUploadingCSV(false)
        setCsvFile(null)
        
        const fileInput = document.getElementById('csvFile')
        if (fileInput) fileInput.value = ''
        
        if (result.created !== undefined && result.total !== undefined) {
          alert(`✅ Berhasil menambahkan ${result.created} item dari ${result.total} item melalui API`)
        } else {
          alert('✅ Upload CSV berhasil melalui API!')
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Catalogue Management</h2>
          <p className="text-sm text-gray-600 mt-1">
            Mengelola data katalog produk melalui API - Total: {catalogueItems.length} item
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button 
            onClick={() => setIsAddingCatalogue(true)}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            Tambah Produk
          </Button>
          <Button 
            onClick={() => setIsUploadingCSV(true)}
            variant="outline"
          >
            <Upload className="w-4 h-4 mr-2" />
            Import CSV
          </Button>
          <Button 
            onClick={exportCatalogueToCSV}
            variant="outline"
          >
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </Button>
          <Button 
            onClick={refreshCatalogueData}
            disabled={isRefreshing}
            variant="outline"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
            {isRefreshing ? 'Refreshing...' : 'Refresh'}
          </Button>
          <Button 
            onClick={testApiConnection}
            disabled={isRefreshing}
            variant="outline"
            size="sm"
            className="text-xs"
          >
            Test API
          </Button>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="bg-white p-4 rounded-lg shadow-md border">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="search">Cari Produk</Label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                id="search"
                placeholder="Cari nama, spesifikasi, atau kategori..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          
          <div>
            <Label htmlFor="jenis-filter">Filter Kategori</Label>
            <select
              id="jenis-filter"
              value={selectedJenis}
              onChange={(e) => setSelectedJenis(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {jenisOptions.map(jenis => (
                <option key={jenis} value={jenis}>{jenis}</option>
              ))}
            </select>
          </div>
          
          <div className="flex items-end">
            <div className="text-sm text-gray-600">
              Menampilkan {startIndex + 1}-{Math.min(endIndex, filteredCatalogueItems.length)} dari {filteredCatalogueItems.length} produk
              {isRefreshing && (
                <div className="mt-1 flex items-center text-blue-600">
                  <RefreshCw className="w-3 h-3 mr-1 animate-spin" />
                  <span className="text-xs">Memperbarui data...</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* CSV Upload Form */}
      {isUploadingCSV && (
        <div className="bg-white p-6 rounded-lg shadow-md border">
          <h3 className="text-lg font-semibold mb-4">Import Data dari CSV</h3>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="csvFile">Pilih File CSV</Label>
              <Input
                id="csvFile"
                type="file"
                accept=".csv"
                onChange={handleCSVFileChange}
              />
            </div>
            
            <div className="flex gap-2">
              <Button 
                onClick={handleUploadCSV}
                disabled={!csvFile || isSubmitting}
                className="bg-green-600 hover:bg-green-700"
              >
                <Upload className="w-4 h-4 mr-2" />
                {isSubmitting ? 'Mengupload...' : 'Upload CSV'}
              </Button>
              <Button 
                onClick={downloadCSVTemplate}
                variant="outline"
              >
                <FileSpreadsheet className="w-4 h-4 mr-2" />
                Download Template
              </Button>
              <Button 
                onClick={handleCancel}
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
      {(isAddingCatalogue || editingCatalogue) && (
        <div className="bg-white p-6 rounded-lg shadow-md border">
          <h3 className="text-lg font-semibold mb-4">
            {isAddingCatalogue ? 'Tambah Produk Baru' : 'Edit Produk'}
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="jenis">Kategori</Label>
              <Input
                id="jenis"
                value={catalogueForm.jenis}
                onChange={(e) => setCatalogueForm({...catalogueForm, jenis: e.target.value})}
                placeholder="Masukkan kategori"
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
            
            <div className="md:col-span-2">
              <Label htmlFor="spesifikasi">Spesifikasi</Label>
              <Textarea
                id="spesifikasi"
                value={catalogueForm.spesifikasi}
                onChange={(e) => setCatalogueForm({...catalogueForm, spesifikasi: e.target.value})}
                placeholder="Masukkan spesifikasi produk"
                rows={3}
              />
            </div>
            
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
                placeholder="Unit, Kg, Meter, dll"
              />
            </div>
            
            <div>
              <Label htmlFor="hargaSatuan">Harga Satuan</Label>
              <Input
                id="hargaSatuan"
                type="number"
                value={catalogueForm.hargaSatuan}
                onChange={(e) => setCatalogueForm({...catalogueForm, hargaSatuan: e.target.value})}
                placeholder="100000"
              />
            </div>
            
            <div>
              <Label htmlFor="foto">URL Foto</Label>
              <Input
                id="foto"
                value={catalogueForm.foto}
                onChange={(e) => setCatalogueForm({...catalogueForm, foto: e.target.value})}
                placeholder="https://example.com/image.jpg"
              />
            </div>
          </div>
          
          <div className="flex gap-2 mt-6">
            <Button 
              onClick={handleSaveCatalogue}
              disabled={isSubmitting}
              className="bg-green-600 hover:bg-green-700"
            >
              <Save className="w-4 h-4 mr-2" />
              {isSubmitting ? 'Menyimpan...' : 'Simpan'}
            </Button>
            <Button 
              onClick={handleCancel}
              variant="outline"
            >
              <X className="w-4 h-4 mr-2" />
              Batal
            </Button>
          </div>
        </div>
      )}

      {/* Product List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {currentCatalogueItems.map((item) => (
          <div key={item.id} className="bg-white rounded-lg shadow-md border overflow-hidden">
            {item.foto && (
              <img 
                src={item.foto} 
                alt={item.namaBarang}
                className="w-full h-48 object-cover"
              />
            )}
            
            <div className="p-4">
              <div className="flex justify-between items-start mb-2">
                <Badge variant="secondary">{item.jenis}</Badge>
              </div>
              
              <h3 className="font-semibold text-lg mb-2">{item.namaBarang}</h3>
              <p className="text-sm text-gray-600 mb-3 line-clamp-2">{item.spesifikasi}</p>
              
              <div className="space-y-1 text-sm mb-4">
                <div className="flex justify-between">
                  <span className="text-gray-500">Quantity:</span>
                  <span>{item.qty} {item.satuan}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Harga Satuan:</span>
                  <span className="font-semibold">Rp {item.hargaSatuan.toLocaleString()}</span>
                </div>
                <div className="flex justify-between border-t pt-1">
                  <span className="text-gray-500">Total:</span>
                  <span className="font-bold text-blue-600">Rp {(item.qty * item.hargaSatuan).toLocaleString()}</span>
                </div>
              </div>
              
              <div className="flex gap-2">
                <Button
                  size="sm"
                  onClick={() => handleEditCatalogue(item)}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Edit className="w-3 h-3 mr-1" />
                  Edit
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => handleDeleteCatalogue(item.id)}
                >
                  <Trash2 className="w-3 h-3 mr-1" />
                  Hapus
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
          >
            Previous
          </Button>
          
          <div className="flex gap-1">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <Button
                key={page}
                variant={currentPage === page ? "default" : "outline"}
                size="sm"
                onClick={() => setCurrentPage(page)}
                className="w-8 h-8 p-0"
              >
                {page}
              </Button>
            ))}
          </div>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
          >
            Next
          </Button>
        </div>
      )}

      {filteredCatalogueItems.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">
            {searchTerm || selectedJenis !== 'Semua' 
              ? 'Tidak ada produk yang sesuai dengan filter.' 
              : 'Belum ada produk. Klik "Tambah Produk" untuk membuat yang pertama.'
            }
          </p>
        </div>
      )}
    </div>
  )
}
