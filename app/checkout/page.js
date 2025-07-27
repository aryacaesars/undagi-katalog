'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { useCart } from '@/lib/cart-context'
import CheckoutProgress from '@/components/checkout-progress'
import { validateAndSanitizeCustomerData } from '@/lib/form-validation'
import { generateInvoiceNumber } from '@/lib/invoice-utils'
import { 
  ArrowLeft, 
  User, 
  Mail, 
  Phone, 
  MapPin,
  Building2,
  FileText,
  CheckCircle,
  AlertCircle,
  ShoppingCart
} from 'lucide-react'

// Format currency ke Rupiah
const formatCurrency = (amount) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0
  }).format(amount)
}

export default function CheckoutPage() {
  const router = useRouter()
  const { cartItems, getTotalPrice, isLoaded } = useCart()
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState(null)
  
  // Form data
  const [customerData, setCustomerData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    address: '',
    city: '',
    postalCode: '',
    notes: ''
  })

  // Form validation errors
  const [errors, setErrors] = useState({})

  // Handle redirect when cart is loaded and empty
  useEffect(() => {
    if (isLoaded && cartItems.length === 0) {
      console.log('Cart is loaded and empty, redirecting to home')
      router.push('/')
    }
  }, [isLoaded, cartItems.length, router])

  const showMessage = (type, text) => {
    setMessage({ type, text })
    setTimeout(() => setMessage(null), 5000)
  }

  const validateForm = () => {
    const validation = validateAndSanitizeCustomerData(customerData)
    setErrors(validation.errors)
    
    if (validation.isValid) {
      // Update customerData with sanitized values
      setCustomerData(validation.data)
    }
    
    return validation.isValid
  }

  const handleInputChange = (field, value) => {
    setCustomerData(prev => ({
      ...prev,
      [field]: value
    }))

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) {
      showMessage('error', 'Mohon lengkapi semua field yang wajib diisi')
      return
    }

    setLoading(true)

    try {
      // Generate sequential invoice number
      const orderId = generateInvoiceNumber()

      // Save customer data to sessionStorage (or could be saved to database)
      sessionStorage.setItem('customerData', JSON.stringify(customerData))
      sessionStorage.setItem('orderId', orderId)

      // Redirect to invoice page
      router.push(`/invoice?orderId=${orderId}`)
    } catch (error) {
      console.error('Error processing checkout:', error)
      showMessage('error', 'Terjadi kesalahan saat memproses data. Silakan coba lagi.')
    } finally {
      setLoading(false)
    }
  }

  // Calculate totals
  const subtotal = getTotalPrice()
  const tax = subtotal * 0.11 // 11% PPN
  const serviceCharge = 12737500 // Service Charge
  const total = subtotal + tax + serviceCharge

  // Show loading while cart is being loaded from localStorage
  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20 py-8 flex items-center justify-center">
        <Card className="text-center py-16 max-w-md">
          <CardContent>
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Memuat halaman checkout...</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20 py-8 flex items-center justify-center">
        <Card className="text-center py-16 max-w-md">
          <CardContent>
            <ShoppingCart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-gray-900 mb-2">Keranjang Kosong</h2>
            <p className="text-gray-600 mb-6">Silakan tambahkan produk ke keranjang terlebih dahulu</p>
            <Button onClick={() => router.push('/')}>
              Kembali Berbelanja
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20 py-8">
      {/* Checkout Progress */}
      <CheckoutProgress currentStep={2} />
      
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
          <div className="flex items-center gap-4 mb-6">
            <Button variant="outline" onClick={() => router.back()}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Kembali
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Checkout</h1>
              <p className="text-gray-600">Lengkapi data Anda untuk melanjutkan pemesanan</p>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Customer Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Data Customer
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Personal Information */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium text-gray-900 border-b pb-2">
                      Informasi Pribadi
                    </h3>
                    
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name" className="flex items-center gap-2">
                          <User className="w-4 h-4" />
                          Nama Lengkap *
                        </Label>
                        <Input
                          id="name"
                          type="text"
                          placeholder="Masukkan nama lengkap"
                          value={customerData.name}
                          onChange={(e) => handleInputChange('name', e.target.value)}
                          className={errors.name ? 'border-red-500' : ''}
                        />
                        {errors.name && (
                          <p className="text-sm text-red-600">{errors.name}</p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="email" className="flex items-center gap-2">
                          <Mail className="w-4 h-4" />
                          Email *
                        </Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="nama@contoh.com"
                          value={customerData.email}
                          onChange={(e) => handleInputChange('email', e.target.value)}
                          className={errors.email ? 'border-red-500' : ''}
                        />
                        {errors.email && (
                          <p className="text-sm text-red-600">{errors.email}</p>
                        )}
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="phone" className="flex items-center gap-2">
                          <Phone className="w-4 h-4" />
                          Nomor Telepon *
                        </Label>
                        <Input
                          id="phone"
                          type="tel"
                          placeholder="+62 812 3456 7890"
                          value={customerData.phone}
                          onChange={(e) => handleInputChange('phone', e.target.value)}
                          className={errors.phone ? 'border-red-500' : ''}
                        />
                        {errors.phone && (
                          <p className="text-sm text-red-600">{errors.phone}</p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="company" className="flex items-center gap-2">
                          <Building2 className="w-4 h-4" />
                          Nama Perusahaan
                        </Label>
                        <Input
                          id="company"
                          type="text"
                          placeholder="PT. Contoh Perusahaan (opsional)"
                          value={customerData.company}
                          onChange={(e) => handleInputChange('company', e.target.value)}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Address Information */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium text-gray-900 border-b pb-2">
                      Alamat
                    </h3>

                    <div className="space-y-2">
                      <Label htmlFor="address" className="flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        Alamat Lengkap *
                      </Label>
                      <Textarea
                        id="address"
                        placeholder="Jalan, nomor rumah, RT/RW, kelurahan, kecamatan"
                        value={customerData.address}
                        onChange={(e) => handleInputChange('address', e.target.value)}
                        className={errors.address ? 'border-red-500' : ''}
                        rows={3}
                      />
                      {errors.address && (
                        <p className="text-sm text-red-600">{errors.address}</p>
                      )}
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="city">Kota *</Label>
                        <Input
                          id="city"
                          type="text"
                          placeholder="Jakarta"
                          value={customerData.city}
                          onChange={(e) => handleInputChange('city', e.target.value)}
                          className={errors.city ? 'border-red-500' : ''}
                        />
                        {errors.city && (
                          <p className="text-sm text-red-600">{errors.city}</p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="postalCode">Kode Pos</Label>
                        <Input
                          id="postalCode"
                          type="text"
                          placeholder="12345"
                          value={customerData.postalCode}
                          onChange={(e) => handleInputChange('postalCode', e.target.value)}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Additional Notes */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium text-gray-900 border-b pb-2">
                      Catatan Tambahan
                    </h3>

                    <div className="space-y-2">
                      <Label htmlFor="notes" className="flex items-center gap-2">
                        <FileText className="w-4 h-4" />
                        Catatan untuk Pesanan
                      </Label>
                      <Textarea
                        id="notes"
                        placeholder="Catatan khusus untuk pesanan Anda (opsional)"
                        value={customerData.notes}
                        onChange={(e) => handleInputChange('notes', e.target.value)}
                        rows={3}
                      />
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="pt-6 border-t">
                    <Button 
                      type="submit" 
                      size="lg" 
                      className="w-full bg-red-600 hover:bg-red-700 text-white"
                      disabled={loading}
                    >
                      {loading ? (
                        <div className="flex items-center gap-2">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                          Memproses...
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-5 h-5" />
                          Lanjut ke Invoice
                        </div>
                      )}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-8">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ShoppingCart className="w-5 h-5 text-red-600" />
                  Ringkasan Pesanan
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Items List */}
                <div className="space-y-3 max-h-60 overflow-y-auto">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-sm text-gray-900 truncate">
                          {item.namaBarang}
                        </h4>
                        <p className="text-xs text-gray-600">
                          {item.quantity} {item.satuan} × {formatCurrency(item.hargaSatuan)}
                        </p>
                      </div>
                      <div className="text-sm font-semibold text-gray-900">
                        {formatCurrency(item.jumlah ? (item.jumlah * item.quantity) : (item.hargaSatuan * item.quantity))}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Price Breakdown */}
                <div className="space-y-2 pt-4 border-t">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Subtotal ({cartItems.length} item)</span>
                    <span className="font-semibold">{formatCurrency(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">PPN (11%)</span>
                    <span className="font-semibold">{formatCurrency(tax)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Service Charge</span>
                    <span className="font-semibold">{formatCurrency(serviceCharge)}</span>
                  </div>
                  <div className="text-xs text-gray-500 pl-4 -mt-1">
                    (Biaya Survey, Pengiriman & Inspeksi)
                  </div>
                </div>

                {/* Total */}
                <div className="flex justify-between items-center py-3 bg-red-50 px-3 rounded-lg border border-red-200">
                  <span className="font-bold text-lg">Total</span>
                  <span className="font-bold text-xl text-red-600">{formatCurrency(total)}</span>
                </div>

                {/* Info */}
                <div className="bg-blue-50 p-3 rounded-lg text-sm">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                    <p className="text-blue-700">
                      Setelah mengisi data, Anda akan mendapatkan invoice yang dapat didownload sebagai PDF.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
