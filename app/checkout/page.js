'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { useCartDB } from '@/lib/cart-db'
import CheckoutProgress from '@/components/checkout-progress'
import { validateAndSanitizeCustomerData } from '@/lib/form-validation'
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
  const { cartItems, getTotalPrice, loading, sessionId, clearCart } = useCartDB()
  const [submitting, setSubmitting] = useState(false)
  const [message, setMessage] = useState(null)
  const [redirectingToInvoice, setRedirectingToInvoice] = useState(false)
  
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
    console.log('Checkout useEffect - loading:', loading, 'cartItems.length:', cartItems.length, 'sessionId:', sessionId, 'redirectingToInvoice:', redirectingToInvoice)
    
    // Only redirect if loading is complete, sessionId exists, cart is empty, and we're not redirecting to invoice
    if (!loading && sessionId && cartItems.length === 0 && !redirectingToInvoice) {
      console.log('Cart is loaded and empty, scheduling redirect to home')
      
      // Add a longer delay to ensure proper loading and avoid race conditions
      const timeout = setTimeout(() => {
        console.log('Executing redirect to home')
        router.push('/')
      }, 3000) // Increased to 3 seconds
      
      return () => {
        console.log('Clearing redirect timeout')
        clearTimeout(timeout)
      }
    }
  }, [loading, cartItems.length, sessionId, redirectingToInvoice, router])

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

    setSubmitting(true)

    try {
      // Step 1: Create or find customer
      const customerPayload = {
        name: customerData.name,
        company: customerData.company || null,
        address: customerData.address + (customerData.city ? `, ${customerData.city}` : '') + (customerData.postalCode ? ` ${customerData.postalCode}` : ''),
        phone: customerData.phone,
        email: customerData.email,
        notes: customerData.notes || null
      }
      
      console.log('Creating customer with data:', customerPayload)
      
      const customerResponse = await fetch('/api/customers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(customerPayload)
      })

      const customerResult = await customerResponse.json()
      console.log('Customer API response:', customerResult)
      
      if (!customerResult.success) {
        throw new Error(customerResult.error || 'Failed to create customer')
      }

      // Step 2: Get default company
      const companyResponse = await fetch('/api/companies?limit=100') // Get all companies
      const companyResult = await companyResponse.json()
      
      console.log('Company API response:', companyResult)
      
      if (!companyResult.success || !companyResult.data || companyResult.data.length === 0) {
        throw new Error('No company found in database. Please create a company first.')
      }

      // Find default company or use first one
      const defaultCompany = companyResult.data.find(c => c.isDefault) || companyResult.data[0]
      console.log('Using company:', defaultCompany)

      // Step 3: Prepare invoice items from cart
      const invoiceItems = cartItems.map(item => ({
        name: item.namaBarang,
        specification: item.spesifikasi || '',
        quantity: item.quantity,
        unit: item.satuan,
        unitPrice: item.jumlah || item.hargaSatuan
      }))

      // Step 4: Create invoice
      const dueDate = new Date()
      dueDate.setDate(dueDate.getDate() + 30) // 30 days from now

      const invoicePayload = {
        companyId: defaultCompany.id,
        customerId: customerResult.data.id,
        dueDate: dueDate.toISOString(),
        items: invoiceItems,
        tax: subtotal * 0.11, // 11% PPN
        serviceCharge: 12737500, // Service Charge
        notes: customerData.notes || null
      }
      
      console.log('Creating invoice with data:', invoicePayload)

      const invoiceResponse = await fetch('/api/invoices', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(invoicePayload)
      })

      const invoiceResult = await invoiceResponse.json()
      console.log('Invoice API response:', invoiceResult)
      
      if (!invoiceResult.success) {
        throw new Error(invoiceResult.error || 'Failed to create invoice')
      }

      // Step 5: Set flag to prevent redirect to home and redirect immediately to invoice page
      setRedirectingToInvoice(true)
      router.replace(`/invoice/${invoiceResult.data.id}?view=user`)
      
      // Step 6: Clear cart after redirect (in background)
      clearCart()
      
    } catch (error) {
      console.error('Error processing checkout:', error)
      showMessage('error', `Terjadi kesalahan: ${error.message}`)
    } finally {
      setSubmitting(false)
    }
  }

  // Calculate totals
  const subtotal = getTotalPrice()
  const tax = subtotal * 0.11 // 11% PPN
  const serviceCharge = 12737500 // Service Charge
  const total = subtotal + tax + serviceCharge

  // Show loading while cart is being loaded from database or while submitting
  if (loading || !sessionId || submitting || redirectingToInvoice) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20 py-8 flex items-center justify-center">
        <Card className="text-center py-16 max-w-md">
          <CardContent>
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
            <p className="text-gray-600">
              {submitting || redirectingToInvoice ? 'Memproses pesanan...' : 'Memuat halaman checkout...'}
            </p>
            <p className="text-sm text-gray-500 mt-2">
              {submitting || redirectingToInvoice ? 'Membuat invoice...' : 'Mengambil data keranjang...'}
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (cartItems.length === 0 && !submitting && !redirectingToInvoice) {
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
                      disabled={submitting}
                    >
                      {submitting ? (
                        <div className="flex items-center gap-2">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                          Membuat Invoice...
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
                          {item.namaBarang || 'Unknown Product'}
                        </h4>
                        <p className="text-xs text-gray-600">
                          {item.quantity || 0} {item.satuan || 'unit'} × {formatCurrency(item.jumlah || item.hargaSatuan || 0)}
                        </p>
                      </div>
                      <div className="text-sm font-semibold text-gray-900">
                        {formatCurrency((item.jumlah || item.hargaSatuan || 0) * (item.quantity || 0))}
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
