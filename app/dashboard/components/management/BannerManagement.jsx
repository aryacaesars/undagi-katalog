'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { bannerApi } from '@/lib/api'
import { Edit, Plus, Trash2, Save, X, Eye, EyeOff } from 'lucide-react'

export default function BannerManagement({ 
  bannerItems, 
  setBannerItems, 
  isSubmitting, 
  setIsSubmitting 
}) {
  const [editingBanner, setEditingBanner] = useState(null)
  const [isAddingBanner, setIsAddingBanner] = useState(false)
  
  // Debug: Log bannerItems when component mounts or props change
  useEffect(() => {
    console.log('BannerManagement received bannerItems:', bannerItems)
    console.log('Number of banner items:', bannerItems?.length || 0)
  }, [bannerItems])
  
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

  // Handler untuk edit banner
  const handleEditBanner = (item) => {
    setEditingBanner(item.id)
    setBannerForm({
      ...item,
      features: item.features.join(', ')
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

  // Handler untuk cancel editing
  const handleCancel = () => {
    setEditingBanner(null)
    setIsAddingBanner(false)
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Banner Management</h2>
        <Button 
          onClick={() => setIsAddingBanner(true)}
          className="bg-blue-600 hover:bg-blue-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          Tambah Banner
        </Button>
      </div>

      {/* Add/Edit Form */}
      {(isAddingBanner || editingBanner) && (
        <div className="bg-white p-6 rounded-lg shadow-md border">
          <h3 className="text-lg font-semibold mb-4">
            {isAddingBanner ? 'Tambah Banner Baru' : 'Edit Banner'}
          </h3>
          
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
            
            <div className="md:col-span-2">
              <Label htmlFor="description">Deskripsi</Label>
              <Textarea
                id="description"
                value={bannerForm.description}
                onChange={(e) => setBannerForm({...bannerForm, description: e.target.value})}
                placeholder="Masukkan deskripsi banner"
                rows={3}
              />
            </div>
            
            <div>
              <Label htmlFor="image">URL Gambar</Label>
              <Input
                id="image"
                value={bannerForm.image}
                onChange={(e) => setBannerForm({...bannerForm, image: e.target.value})}
                placeholder="https://example.com/image.jpg"
              />
            </div>
            
            <div>
              <Label htmlFor="price">Harga</Label>
              <Input
                id="price"
                value={bannerForm.price}
                onChange={(e) => setBannerForm({...bannerForm, price: e.target.value})}
                placeholder="Rp 100.000"
              />
            </div>
            
            <div>
              <Label htmlFor="rating">Rating</Label>
              <Input
                id="rating"
                type="number"
                min="0"
                max="5"
                step="0.1"
                value={bannerForm.rating}
                onChange={(e) => setBannerForm({...bannerForm, rating: e.target.value})}
                placeholder="4.5"
              />
            </div>
            
            <div>
              <Label htmlFor="badge">Badge</Label>
              <Input
                id="badge"
                value={bannerForm.badge}
                onChange={(e) => setBannerForm({...bannerForm, badge: e.target.value})}
                placeholder="PROMO, NEW, dll"
              />
            </div>
            
            <div className="md:col-span-2">
              <Label htmlFor="features">Fitur (pisahkan dengan koma)</Label>
              <Textarea
                id="features"
                value={bannerForm.features}
                onChange={(e) => setBannerForm({...bannerForm, features: e.target.value})}
                placeholder="Fitur 1, Fitur 2, Fitur 3"
                rows={2}
              />
            </div>
          </div>
          
          <div className="flex gap-2 mt-6">
            <Button 
              onClick={handleSaveBanner}
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

      {/* Banner List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {bannerItems.map((item) => (
          <div key={item.id} className="bg-white rounded-lg shadow-md border overflow-hidden">
            {item.image && (
              <img 
                src={item.image} 
                alt={item.title}
                className="w-full h-48 object-cover"
              />
            )}
            
            <div className="p-4">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-semibold text-lg">{item.title}</h3>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => toggleBannerActive(item.id)}
                    className={`p-1 rounded ${item.isActive ? 'text-green-600' : 'text-gray-400'}`}
                    title={item.isActive ? 'Aktif' : 'Nonaktif'}
                  >
                    {item.isActive ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              
              <p className="text-sm text-gray-600 mb-2">{item.subtitle}</p>
              <p className="text-sm text-gray-500 mb-3 line-clamp-2">{item.description}</p>
              
              {item.price && (
                <p className="text-lg font-bold text-blue-600 mb-2">{item.price}</p>
              )}
              
              {item.features && item.features.length > 0 && (
                <div className="mb-3">
                  <p className="text-xs text-gray-500 mb-1">Fitur:</p>
                  <div className="flex flex-wrap gap-1">
                    {item.features.slice(0, 3).map((feature, idx) => (
                      <span key={idx} className="text-xs bg-gray-100 px-2 py-1 rounded">
                        {feature}
                      </span>
                    ))}
                    {item.features.length > 3 && (
                      <span className="text-xs text-gray-500">+{item.features.length - 3} lainnya</span>
                    )}
                  </div>
                </div>
              )}
              
              <div className="flex gap-2">
                <Button
                  size="sm"
                  onClick={() => handleEditBanner(item)}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Edit className="w-3 h-3 mr-1" />
                  Edit
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => handleDeleteBanner(item.id)}
                >
                  <Trash2 className="w-3 h-3 mr-1" />
                  Hapus
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {bannerItems.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">Belum ada banner. Klik "Tambah Banner" untuk membuat yang pertama.</p>
        </div>
      )}
    </div>
  )
}
