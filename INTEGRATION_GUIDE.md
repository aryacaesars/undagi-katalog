# Integrasi Dashboard dengan Database

Berikut langkah-langkah untuk mengintegrasikan dashboard yang sudah ada dengan database:

## 1. Setup Database (Setelah konfigurasi Neon DB)

```bash
# Generate Prisma client
npm run db:generate

# Push schema ke database
npm run db:push

# Seed data awal
npm run db:seed
```

## 2. Update Dashboard Component

Ganti state management dengan API calls:

```javascript
// Import API utilities
import { bannerApi, catalogueApi, handleApiError } from '@/lib/api'
import { useState, useEffect } from 'react'

export default function Dashboard() {
  // State untuk data dari database
  const [bannerItems, setBannerItems] = useState([])
  const [catalogueItems, setCatalogueItems] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // Load data saat component mount
  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    setLoading(true)
    try {
      const [banners, catalogues] = await Promise.all([
        bannerApi.getAll(),
        catalogueApi.getAll()
      ])
      
      setBannerItems(banners)
      setCatalogueItems(catalogues.data)
    } catch (err) {
      setError(handleApiError(err))
    } finally {
      setLoading(false)
    }
  }

  // Handler untuk save banner (update untuk API)
  const handleSaveBanner = async () => {
    try {
      setLoading(true)
      
      const bannerData = {
        ...bannerForm,
        features: bannerForm.features.split(',').map(f => f.trim()),
        rating: parseFloat(bannerForm.rating)
      }

      if (isAddingBanner) {
        const newBanner = await bannerApi.create(bannerData)
        setBannerItems([...bannerItems, newBanner])
        setIsAddingBanner(false)
      } else {
        const updatedBanner = await bannerApi.update(editingBanner, bannerData)
        setBannerItems(bannerItems.map(item => 
          item.id === editingBanner ? updatedBanner : item
        ))
        setEditingBanner(null)
      }
      
      // Reset form
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
      
      alert('Banner berhasil disimpan!')
    } catch (err) {
      alert('Error: ' + handleApiError(err))
    } finally {
      setLoading(false)
    }
  }

  // Handler untuk delete banner (update untuk API)
  const handleDeleteBanner = async (id) => {
    if (!confirm('Yakin ingin menghapus banner ini?')) return
    
    try {
      setLoading(true)
      await bannerApi.delete(id)
      setBannerItems(bannerItems.filter(item => item.id !== id))
      alert('Banner berhasil dihapus!')
    } catch (err) {
      alert('Error: ' + handleApiError(err))
    } finally {
      setLoading(false)
    }
  }

  // Handler untuk save catalogue (update untuk API)
  const handleSaveCatalogue = async () => {
    try {
      setLoading(true)
      
      const catalogueData = {
        ...catalogueForm,
        qty: parseInt(catalogueForm.qty),
        hargaSatuan: parseFloat(catalogueForm.hargaSatuan)
      }

      if (isAddingCatalogue) {
        const newCatalogue = await catalogueApi.create(catalogueData)
        setCatalogueItems([...catalogueItems, newCatalogue])
        setIsAddingCatalogue(false)
      } else {
        const updatedCatalogue = await catalogueApi.update(editingCatalogue, catalogueData)
        setCatalogueItems(catalogueItems.map(item => 
          item.id === editingCatalogue ? updatedCatalogue : item
        ))
        setCatalogueEditing(null)
      }
      
      // Reset form
      setCatalogueForm({
        jenis: '',
        namaBarang: '',
        spesifikasi: '',
        qty: '',
        satuan: '',
        hargaSatuan: '',
        foto: ''
      })
      
      alert('Produk berhasil disimpan!')
    } catch (err) {
      alert('Error: ' + handleApiError(err))
    } finally {
      setLoading(false)
    }
  }

  // Handler untuk upload CSV (update untuk API)
  const handleUploadCSV = async () => {
    if (!csvFile) {
      alert('Harap pilih file CSV terlebih dahulu')
      return
    }

    const reader = new FileReader()
    reader.onload = async (e) => {
      try {
        setLoading(true)
        const csvText = e.target.result
        const parsedData = parseCSV(csvText)
        
        // Mapping data sama seperti sebelumnya
        const newCatalogueItems = parsedData.map((row, index) => {
          // ... mapping logic sama
        }).filter(item => item.namaBarang)

        if (newCatalogueItems.length === 0) {
          alert('Tidak ada data valid yang ditemukan dalam file CSV.')
          return
        }

        // Bulk import via API
        const result = await catalogueApi.bulkImport(newCatalogueItems)
        
        // Reload data from database
        const catalogues = await catalogueApi.getAll()
        setCatalogueItems(catalogues.data)
        
        setIsUploadingCSV(false)
        setCsvFile(null)
        
        // Reset input file
        const fileInput = document.getElementById('csvFile')
        if (fileInput) fileInput.value = ''
        
        alert(`Berhasil menambahkan ${result.data.created} item dari file CSV`)
      } catch (error) {
        console.error('Error uploading CSV:', error)
        alert('Error: ' + handleApiError(error))
      } finally {
        setLoading(false)
      }
    }
    reader.readAsText(csvFile)
  }

  // Loading state di UI
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  // Error state di UI
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">Error: {error}</p>
          <button 
            onClick={loadData}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  // Rest of component sama seperti sebelumnya...
}
```

## 3. Environment Setup

Pastikan file `.env` sudah dikonfigurasi:

```env
DATABASE_URL="your-neon-db-connection-string"
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://localhost:3000"
```

## 4. Testing

1. Jalankan database setup:
```bash
npm run db:push
npm run db:seed
```

2. Jalankan development server:
```bash
npm run dev
```

3. Buka http://localhost:3000/dashboard

4. Test CRUD operations dan CSV upload

## 5. Production Deployment

1. Set environment variables di production
2. Run migrations:
```bash
npx prisma migrate deploy
```

3. Optionally seed production data

## Database Management

Gunakan Prisma Studio untuk manage data:
```bash
npm run db:studio
```

Atau akses langsung via Neon console: https://console.neon.tech
