'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useCart } from '@/lib/cart-context'
import InvoiceGenerator from '@/components/invoice-generator'
import CheckoutProgress from '@/components/checkout-progress'
import { downloadInvoiceAsPDF, formatInvoiceForPrint } from '@/lib/pdf-utils'
import { generateInvoiceNumber, getCompanyData } from '@/lib/invoice-utils'
import { 
  Download, 
  ArrowLeft, 
  FileText,
  CheckCircle,
  Building2,
  Calendar,
  Hash
} from 'lucide-react'

// Format currency ke Rupiah
const formatCurrency = (amount) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0
  }).format(amount)
}

// Format date
const formatDate = (date) => {
  return new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  }).format(date)
}

export default function InvoicePage() {
  const searchParams = useSearchParams()
  const { cartItems, getTotalPrice, clearCart, isLoaded } = useCart()
  const [invoiceData, setInvoiceData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Wait for cart to be loaded first
    if (!isLoaded) return

    // Check if customer data exists
    const customerDataStr = sessionStorage.getItem('customerData')
    const storedOrderId = sessionStorage.getItem('orderId')
    
    if (!customerDataStr) {
      // Redirect to checkout if no customer data
      window.location.href = '/checkout'
      return
    }

    // Parse customer data
    const customerData = JSON.parse(customerDataStr)

    // Generate sequential invoice number
    let orderId = searchParams.get('orderId') || storedOrderId
    if (!orderId) {
      orderId = generateInvoiceNumber()
      sessionStorage.setItem('orderId', orderId)
    }
    
    const currentDate = new Date()
    
    const subtotal = getTotalPrice()
    const tax = subtotal * 0.11 // 11% PPN
    const serviceCharge = 12737500 // Service Charge
    const total = subtotal + tax + serviceCharge

    // Get company data (customizable from admin)
    const companyData = getCompanyData()

    const invoice = {
      invoiceNumber: orderId,
      date: currentDate,
      dueDate: new Date(currentDate.getTime() + (30 * 24 * 60 * 60 * 1000)), // 30 days from now
      
      // Company Info - from localStorage or default
      company: companyData,
      
      // Customer Info from form
      customer: {
        name: customerData.name,
        email: customerData.email,
        phone: customerData.phone,
        company: customerData.company || '',
        address: `${customerData.address}, ${customerData.city}${customerData.postalCode ? ' ' + customerData.postalCode : ''}`,
        notes: customerData.notes || ''
      },
      
      // Items
      items: cartItems.map(item => ({
        id: item.id,
        name: item.namaBarang,
        specification: item.spesifikasi,
        quantity: item.quantity,
        unit: item.satuan,
        unitPrice: item.hargaSatuan,
        total: item.jumlah ? (item.jumlah * item.quantity) : (item.hargaSatuan * item.quantity)
      })),
      
      // Totals
      subtotal,
      tax,
      serviceCharge,
      total
    }

    setInvoiceData(invoice)
    setLoading(false)

    // Apply print formatting
    formatInvoiceForPrint()
  }, [cartItems, getTotalPrice, searchParams, isLoaded])

  const handleDownloadPDF = () => {
    if (invoiceData) {
      // Use PDF utility function
      downloadInvoiceAsPDF(invoiceData)
    }
  }

  const handleBackToHome = () => {
    clearCart()
    // Clear customer data and order ID from session storage
    sessionStorage.removeItem('customerData')
    sessionStorage.removeItem('orderId')
    window.location.href = '/'
  }

  if (loading || !invoiceData) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20 py-8 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Memproses invoice...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Checkout Progress */}
      <div className="no-print pt-20">
        <CheckoutProgress currentStep={3} />
      </div>
      
      {/* Print Styles */}
      <style jsx>{`
        @media print {
          .no-print {
            display: none !important;
          }
          
          .print-container {
            padding: 0 !important;
            margin: 0 !important;
            background: white !important;
          }
          
          body {
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
        }
      `}</style>

      {/* Header - Hidden when printing */}
      <div className="no-print py-8 bg-white border-b">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="outline" onClick={() => window.history.back()}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Kembali
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Invoice</h1>
                <p className="text-gray-600">#{invoiceData.invoiceNumber}</p>
              </div>
            </div>
            
            <div className="flex gap-3">
              <Button 
                variant="outline" 
                onClick={handleDownloadPDF}
                className="flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                Download PDF
              </Button>
              <Button 
                onClick={handleBackToHome}
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                Selesai
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Invoice Content */}
      <div className="print-container py-8">
        <div className="max-w-4xl mx-auto px-4">
          <InvoiceGenerator data={invoiceData} />
        </div>
      </div>

      {/* Success Message - Hidden when printing */}
      <div className="no-print bg-green-50 border-t border-green-200">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center gap-3 text-green-800">
            <CheckCircle className="w-6 h-6" />
            <div>
              <p className="font-semibold">Pesanan Berhasil Dibuat!</p>
              <p className="text-sm text-green-600">
                Invoice telah digenerate. Anda dapat mendownload PDF atau mencetak langsung.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
