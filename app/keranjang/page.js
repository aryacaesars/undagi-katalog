'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useCartDB } from '@/lib/cart-db'
import CheckoutProgress from '@/components/checkout-progress'
import { 
  ShoppingCart, 
  Plus, 
  Minus, 
  Trash2, 
  ArrowLeft, 
  CheckCircle,
  AlertCircle,
  ShoppingBag,
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

export default function KeranjangPage() {
  const router = useRouter()
  const { 
    cartItems, 
    loading, 
    error,
    updateQuantity, 
    removeFromCart, 
    clearCart, 
    getTotalPrice,
    getItemCount,
    setError
  } = useCartDB()
  
  const [message, setMessage] = useState(null)

  const showMessage = (type, text) => {
    setMessage({ type, text })
    setTimeout(() => setMessage(null), 3000)
  }

  const handleQuantityChange = async (catalogueId, newQuantity) => {
    if (newQuantity < 1) return
    
    const success = await updateQuantity(catalogueId, newQuantity)
    if (!success && error) {
      showMessage('error', error)
    }
  }

  const handleRemoveItem = async (item) => {
    const success = await removeFromCart(item.id)
    if (success) {
      showMessage('success', `${item.namaBarang} berhasil dihapus dari keranjang`)
    } else if (error) {
      showMessage('error', error)
    }
  }

  const handleClearCart = async () => {
    if (cartItems.length > 0) {
      const success = await clearCart()
      if (success) {
        showMessage('success', 'Keranjang berhasil dikosongkan')
      } else if (error) {
        showMessage('error', error)
      }
    }
  }

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      showMessage('error', 'Keranjang kosong! Silakan tambahkan produk terlebih dahulu.')
      return
    }

    console.log('Navigating to checkout with', cartItems.length, 'items')
    // Use Next.js router for smooth navigation
    router.push('/checkout')
  }

  // Calculate totals
  const subtotal = getTotalPrice() // This now uses jumlah instead of hargaSatuan
  const tax = subtotal * 0.11 // 11% PPN
  const serviceCharge = 12737500 // Service Charge (Biaya Survey, Pengiriman & Inspeksi)
  const total = subtotal + tax + serviceCharge

  // Loading state
  if (loading && cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20 py-8 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-red-600" />
          <p className="text-gray-600">Memuat keranjang...</p>
        </div>
      </div>
    )
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20 py-8">
        <div className="max-w-6xl mx-auto px-4">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-4 mb-6">
              <Button variant="outline" onClick={() => window.history.back()}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Kembali
              </Button>
              <h1 className="text-3xl font-bold text-gray-900">Keranjang Belanja</h1>
            </div>
          </div>

          {/* Empty Cart */}
          <Card className="text-center py-16">
            <CardContent>
              <ShoppingBag className="w-24 h-24 text-gray-300 mx-auto mb-6" />
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Keranjang Anda Kosong</h2>
              <p className="text-gray-600 mb-8 max-w-md mx-auto">
                Belum ada produk yang ditambahkan ke keranjang. Mulai berbelanja sekarang!
              </p>
              <Button 
                size="lg" 
                className="bg-red-600 hover:bg-red-700 text-white"
                onClick={() => window.location.href = '/'}
              >
                <ShoppingCart className="w-5 h-5 mr-2" />
                Mulai Berbelanja
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20 py-8">
      {/* Checkout Progress */}
      <CheckoutProgress currentStep={1} />
      
      {/* Message Alert */}
      {message && (
        <div className={`fixed top-24 right-4 z-50 p-4 rounded-lg shadow-lg ${
          message.type === 'success' 
            ? 'bg-green-100 text-green-800 border border-green-200' 
            : 'bg-red-100 text-red-800 border border-red-200'
        }`}>
          <div className="flex items-center gap-2">
            {message.type === 'success' ? (
              <CheckCircle className="w-5 h-5" />
            ) : (
              <AlertCircle className="w-5 h-5" />
            )}
            <span>{message.text}</span>
          </div>
        </div>
      )}
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <Button variant="outline" onClick={() => window.history.back()}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Kembali
              </Button>
              <h1 className="text-3xl font-bold text-gray-900">Keranjang Belanja</h1>
            </div>
            <Badge variant="secondary" className="text-lg px-3 py-1">
              {getItemCount()} Item
            </Badge>
          </div>
          
          {/* Cart Actions */}
          <div className="flex justify-between items-center">
            <p className="text-gray-600">
              Total: <span className="font-bold text-gray-900">{formatCurrency(total)}</span>
            </p>
            <Button 
              variant="outline" 
              onClick={handleClearCart}
              className="text-red-600 border-red-200 hover:bg-red-50"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Kosongkan Keranjang
            </Button>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item) => (
              <Card key={item.id} className="overflow-hidden">
                <CardContent className="p-0">
                  <div className="flex flex-col md:flex-row">
                    {/* Product Image */}
                    <div className="relative w-full md:w-48 h-48 md:h-32">
                      <Image
                        src={item.foto}
                        alt={item.namaBarang}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 192px"
                      />
                      <Badge 
                        variant="secondary" 
                        className="absolute top-2 left-2 text-xs"
                      >
                        {item.jenis}
                      </Badge>
                    </div>

                    {/* Product Details */}
                    <div className="flex-1 p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="font-bold text-lg text-gray-900 mb-1">
                            {item.namaBarang}
                          </h3>
                          <p className="text-gray-600 text-sm mb-2">
                            {item.spesifikasi}
                          </p>
                          <div className="space-y-1">
                            <p className="text-gray-500 text-sm">
                              {formatCurrency(item.hargaSatuan)} / {item.satuan}
                            </p>
                            <p className="font-bold text-red-600 text-lg">
                              {formatCurrency(item.jumlah ? (item.jumlah * item.quantity) : (item.hargaSatuan * item.quantity))}
                            </p>
                          </div>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleRemoveItem(item)}
                          className="text-red-600 border-red-200 hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex items-center justify-between mt-4">
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-gray-600">Jumlah:</span>
                          <div className="flex items-center border rounded-lg">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                              disabled={item.quantity <= 1 || loading}
                              className="h-8 w-8 p-0 hover:bg-gray-100"
                            >
                              <Minus className="w-4 h-4" />
                            </Button>
                            <span className="px-3 py-1 text-center min-w-[40px] font-semibold">
                              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : item.quantity}
                            </span>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                              disabled={loading}
                              className="h-8 w-8 p-0 hover:bg-gray-100"
                            >
                              <Plus className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>

                        {/* Item Total */}
                        <div className="text-right">
                          <p className="text-sm text-gray-600">Qty: {item.quantity} {item.satuan}</p>
                          <p className="font-bold text-lg text-gray-900">
                            {formatCurrency(item.jumlah ? (item.jumlah * item.quantity) : (item.hargaSatuan * item.quantity))}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-8">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  Ringkasan Pesanan
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Price Breakdown */}
                <div className="space-y-2 pb-4 border-b">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal ({getItemCount()} item)</span>
                    <span className="font-semibold">{formatCurrency(subtotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">PPN (11%)</span>
                    <span className="font-semibold">{formatCurrency(tax)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Service Charge</span>
                    <span className="font-semibold">{formatCurrency(serviceCharge)}</span>
                  </div>
                  <div className="text-xs text-gray-500 pl-4 -mt-1">
                    (Biaya Survey, Pengiriman & Inspeksi)
                  </div>
                </div>

                {/* Total */}
                <div className="flex justify-between items-center py-2 bg-gray-50 px-3 rounded-lg">
                  <span className="font-bold text-lg">Total</span>
                  <span className="font-bold text-xl text-red-600">{formatCurrency(total)}</span>
                </div>

                {/* Checkout Button */}
                <Button 
                  size="lg" 
                  className="w-full bg-red-600 hover:bg-red-700 text-white shadow-lg"
                  onClick={handleCheckout}
                >
                  <CheckCircle className="w-5 h-5 mr-2" />
                  Lanjut ke Pembayaran
                </Button>

                {/* Additional Info */}
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                    <div className="text-sm">
                      <p className="font-semibold text-blue-900 mb-1">Informasi Service Charge</p>
                      <p className="text-blue-700">
                        Service Charge mencakup biaya survey lokasi, pengiriman material, dan inspeksi kualitas.
                        Tim profesional kami akan memastikan proyek berjalan lancar.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Continue Shopping */}
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => window.location.href = '/'}
                >
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  Lanjut Berbelanja
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
