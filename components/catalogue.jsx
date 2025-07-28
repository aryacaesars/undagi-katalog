
'use client'

import { useState, useMemo, useEffect } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { catalogueApi } from '@/lib/api'
import { useCartDB } from '@/lib/cart-db'
import { 
  ShoppingCart, 
  Eye, 
  X, 
  CheckCircle,
  AlertCircle,
  Loader2
} from 'lucide-react'

// Format currency ke Rupiah
const formatCurrency = (amount) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0
  }).format(amount)
}

export default function Catalogue() {
  const router = useRouter()
  const { addToCart, loading: cartLoading } = useCartDB()
  const [selectedCategory, setSelectedCategory] = useState('Semua')
  const [catalogueData, setCatalogueData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(9) // 9 items per halaman (3x3 grid)
  
  // Modal states
  const [selectedItem, setSelectedItem] = useState(null)
  const [showDetailModal, setShowDetailModal] = useState(false)
  const [cartMessage, setCartMessage] = useState(null)
  const [loadingItems, setLoadingItems] = useState(new Set())

  // Cart functions
  const handleAddToCart = async (item) => {
    setLoadingItems(prev => new Set(prev.add(item.id)))
    try {
      const success = await addToCart(item.id, 1)
      if (success) {
        setCartMessage({
          type: 'success',
          text: `${item.namaBarang} berhasil ditambahkan ke keranjang!`
        })
      }
    } catch (error) {
      console.error('Error adding to cart:', error)
      setCartMessage({
        type: 'error',
        text: 'Gagal menambahkan barang ke keranjang'
      })
    } finally {
      setLoadingItems(prev => {
        const newSet = new Set(prev)
        newSet.delete(item.id)
        return newSet
      })
    }
    
    // Hide message after 3 seconds
    setTimeout(() => setCartMessage(null), 3000)
  }

  const openDetailModal = (item) => {
    setSelectedItem(item)
    setShowDetailModal(true)
  }

  const closeDetailModal = () => {
    setSelectedItem(null)
    setShowDetailModal(false)
  }

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      setError(null)
      try {
        const result = await catalogueApi.getAllForCatalog() // Menggunakan fungsi khusus untuk catalog
        setCatalogueData(result.data || [])
      } catch (err) {
        setError('Gagal memuat data katalog')
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  // Get unique categories
  const categories = useMemo(() => {
    const uniqueCategories = [...new Set(catalogueData.map(item => item.jenis))]
    return ['Semua', ...uniqueCategories]
  }, [catalogueData])

  // Filter data based on selected category
  const filteredData = useMemo(() => {
    if (selectedCategory === 'Semua') {
      return catalogueData
    }
    return catalogueData.filter(item => item.jenis === selectedCategory)
  }, [selectedCategory, catalogueData])

  // Pagination calculations
  const totalPages = Math.ceil(filteredData.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentItems = filteredData.slice(startIndex, endIndex)

  // Reset to first page when category changes
  useEffect(() => {
    setCurrentPage(1)
  }, [selectedCategory])

  if (loading) {
    return (
      <section className="py-12 px-4 max-w-6xl mx-auto">
        <div className="text-center py-12">
          <span className="text-gray-500 text-lg">Memuat data katalog...</span>
        </div>
      </section>
    )
  }

  if (error) {
    return (
      <section className="py-12 px-4 max-w-6xl mx-auto">
        <div className="text-center py-12">
          <span className="text-red-500 text-lg">{error}</span>
        </div>
      </section>
    )
  }

  return (
    <section className="py-12 px-4 max-w-6xl mx-auto">
      {/* Cart Message */}
      {cartMessage && (
        <div className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg flex items-center space-x-2 ${
          cartMessage.type === 'success' 
            ? 'bg-green-100 text-green-800 border border-green-200' 
            : 'bg-red-100 text-red-800 border border-red-200'
        }`}>
          {cartMessage.type === 'success' ? (
            <CheckCircle className="w-5 h-5" />
          ) : (
            <AlertCircle className="w-5 h-5" />
          )}
          <span className="text-sm font-medium">{cartMessage.text}</span>
        </div>
      )}

      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Katalog Barang</h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Temukan berbagai macam barang berkualitas dengan harga terbaik
        </p>
      </div>

      {/* Category Filter */}
      <div className="mb-8">
        <div className="flex flex-wrap gap-2 justify-center">
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedCategory(category)}
              className={`mb-2 ${selectedCategory === category ? 'bg-red-600 hover:bg-red-700 text-white' : ''}`}
            >
              {category}
            </Button>
          ))}
        </div>
      </div>

      {/* Catalogue Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {currentItems.map((item) => (
          <Card key={item.id} className="hover:shadow-lg transition-shadow duration-300 overflow-hidden">
            {/* Product Image */}
            <div className="relative h-48 w-full overflow-hidden">
              <Image
                src={item.foto}
                alt={item.namaBarang}
                fill
                className="object-cover hover:scale-105 transition-transform duration-300"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
              <div className="absolute top-2 left-2">
                <Badge variant="secondary" className="bg-red-600 text-white backdrop-blur-sm">
                  {item.jenis}
                </Badge>
              </div>
              <div className="absolute top-2 right-2">
                <span className="bg-black/60 text-white text-xs px-2 py-1 rounded-full backdrop-blur-sm">
                  {item.qty} {item.satuan}
                </span>
              </div>
            </div>

            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-semibold text-gray-900 line-clamp-2">
                {item.namaBarang}
              </CardTitle>
            </CardHeader>
            
            <CardContent>
              <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                {item.spesifikasi}
              </p>
              
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">Harga Satuan:</span>
                  <span className="font-semibold text-blue-600">
                    {formatCurrency(item.hargaSatuan)}
                  </span>
                </div>
                
                <div className="flex justify-between items-center border-t pt-2">
                  <span className="text-sm font-medium text-gray-700">Total:</span>
                  <span className="font-bold text-lg text-green-600">
                    {formatCurrency(item.jumlah)}
                  </span>
                </div>
              </div>
            </CardContent>

            <CardFooter className="flex gap-2">
              <Button 
                size="sm" 
                className="flex-1 bg-red-600 hover:bg-red-700 text-white flex items-center justify-center space-x-1"
                onClick={() => openDetailModal(item)}
              >
                <Eye className="w-4 h-4" />
                <span>Lihat Detail</span>
              </Button>
              <Button 
                size="sm" 
                variant="outline" 
                className="flex-1 border-red-600 text-red-600 hover:bg-red-600 hover:text-white flex items-center justify-center space-x-1"
                onClick={() => handleAddToCart(item)}
                disabled={loadingItems.has(item.id)}
              >
                {loadingItems.has(item.id) ? (
                  <>
                    <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                    <span>Loading...</span>
                  </>
                ) : (
                  <>
                    <ShoppingCart className="w-4 h-4" />
                    <span>Tambah ke Keranjang</span>
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center mt-8 space-x-2">
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
      )}

      {/* Pagination Info */}
      {filteredData.length > 0 && (
        <div className="text-center mt-4 text-sm text-gray-600">
          Menampilkan {startIndex + 1}-{Math.min(endIndex, filteredData.length)} dari {filteredData.length} barang
          {selectedCategory !== 'Semua' && ` dalam kategori "${selectedCategory}"`}
        </div>
      )}

      {/* Empty State */}
      {filteredData.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">
            Tidak ada barang ditemukan untuk kategori "{selectedCategory}"
          </p>
        </div>
      )}

      {/* Detail Modal */}
      {showDetailModal && selectedItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex justify-between items-center p-6 border-b">
              <h3 className="text-xl font-bold text-gray-900">Detail Barang</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={closeDetailModal}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>

            {/* Modal Content */}
            <div className="p-6">
              {/* Product Image */}
              <div className="relative h-64 w-full mb-6 overflow-hidden rounded-lg">
                <Image
                  src={selectedItem.foto}
                  alt={selectedItem.namaBarang}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
                <div className="absolute top-2 left-2">
                  <Badge variant="secondary" className="bg-red-600 text-white">
                    {selectedItem.jenis}
                  </Badge>
                </div>
                <div className="absolute top-2 right-2">
                  <span className="bg-black/60 text-white text-xs px-2 py-1 rounded-full">
                    {selectedItem.qty} {selectedItem.satuan}
                  </span>
                </div>
              </div>

              {/* Product Info */}
              <div className="space-y-4">
                <div>
                  <h4 className="text-2xl font-bold text-gray-900 mb-2">
                    {selectedItem.namaBarang}
                  </h4>
                  <Badge variant="outline" className="text-sm">
                    {selectedItem.jenis}
                  </Badge>
                </div>

                <div>
                  <h5 className="font-semibold text-gray-700 mb-2">Spesifikasi:</h5>
                  <p className="text-gray-600 leading-relaxed">
                    {selectedItem.spesifikasi}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                  <div>
                    <span className="text-sm text-gray-500 block">Kuantitas:</span>
                    <span className="font-semibold text-gray-900">
                      {selectedItem.qty} {selectedItem.satuan}
                    </span>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500 block">Harga Satuan:</span>
                    <span className="font-semibold text-blue-600">
                      {formatCurrency(selectedItem.hargaSatuan)}
                    </span>
                  </div>
                  <div className="col-span-2 border-t pt-2">
                    <span className="text-sm text-gray-500 block">Total Harga:</span>
                    <span className="font-bold text-lg text-green-600">
                      {formatCurrency(selectedItem.jumlah)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex gap-3 p-6 border-t bg-gray-50">
              <Button
                variant="outline"
                className="flex-1"
                onClick={closeDetailModal}
              >
                Tutup
              </Button>
              <Button
                className="flex-1 bg-red-600 hover:bg-red-700 text-white flex items-center justify-center space-x-2"
                onClick={() => {
                  handleAddToCart(selectedItem)
                  closeDetailModal()
                }}
                disabled={selectedItem && loadingItems.has(selectedItem.id)}
              >
                {selectedItem && loadingItems.has(selectedItem.id) ? (
                  <>
                    <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                    <span>Loading...</span>
                  </>
                ) : (
                  <>
                    <ShoppingCart className="w-4 h-4" />
                    <span>Tambah ke Keranjang</span>
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      )}

    </section>
  )
}