'use client'

import Image from 'next/image'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Building2, 
  Calendar, 
  Hash, 
  Phone, 
  Mail, 
  Globe,
  MapPin
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
  if (!date) {
    return 'Tanggal tidak tersedia'
  }
  
  try {
    // Convert to Date object if it's a string
    const dateObj = typeof date === 'string' ? new Date(date) : date
    
    // Check if the date is valid
    if (isNaN(dateObj.getTime())) {
      return 'Tanggal tidak valid'
    }
    
    return new Intl.DateTimeFormat('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    }).format(dateObj)
  } catch (error) {
    console.error('Error formatting date:', error, 'Input:', date)
    return 'Tanggal tidak valid'
  }
}

export default function InvoiceGenerator({ data }) {
  if (!data) {
    console.log('InvoiceGenerator: No data provided')
    return null
  }
  
  // Debug logging
  console.log('InvoiceGenerator data:', data)
  console.log('Date value:', data.date, 'Type:', typeof data.date)
  console.log('DueDate value:', data.dueDate, 'Type:', typeof data.dueDate)

  // Ensure we have required data with defaults
  const invoiceData = {
    invoiceNumber: data.invoiceNumber || 'INV-000001',
    date: data.date || new Date(),
    dueDate: data.dueDate || new Date(),
    company: data.company || {
      name: 'UNDAGI',
      address: 'Alamat tidak tersedia',
      phone: 'Telepon tidak tersedia',
      email: 'Email tidak tersedia',
      logo: '/Logo.svg'
    },
    customer: data.customer || {
      name: 'Customer tidak tersedia',
      address: 'Alamat tidak tersedia',
      email: 'Email tidak tersedia',
      phone: 'Telepon tidak tersedia'
    },
    items: data.items || [],
    subtotal: data.subtotal || 0,
    tax: data.tax || 0,
    serviceCharge: data.serviceCharge || 0,
    total: data.total || 0,
    notes: data.notes || '',
    status: data.status || 'DRAFT'
  }

  return (
    <Card className="w-full bg-white shadow-lg print-container">
      <CardContent className="p-8 print-avoid-break">
        {/* Header */}
        <div className="flex justify-between items-start mb-6">
          <div className="flex items-center gap-6">
            {/* Logo */}
            <div className="flex-shrink-0">
              <Image
                src={invoiceData.company.logo || "/Logo.svg"}
                alt={`${invoiceData.company.name} Logo`}
                width={80}
                height={80}
                className="object-contain"
              />
            </div>
            
            <div>
              <h1 className="text-2xl font-bold text-red-600 mb-1">INVOICE</h1>
              <div className="space-y-1 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <Hash className="w-4 h-4" />
                  <span className="font-semibold">{invoiceData.invoiceNumber}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>Tanggal: {formatDate(invoiceData.date)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>Jatuh Tempo: {formatDate(invoiceData.dueDate)}</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Company Info */}
          <div className="text-right">
            <h2 className="text-xl font-bold text-gray-900 mb-2">{invoiceData.company.name}</h2>
            <div className="text-xs text-gray-600 space-y-1">
              <div className="flex items-center justify-end gap-2">
                <MapPin className="w-3 h-3" />
                <span>{invoiceData.company.address}</span>
              </div>
              <div className="flex items-center justify-end gap-2">
                <Phone className="w-3 h-3" />
                <span>{invoiceData.company.phone}</span>
              </div>
              <div className="flex items-center justify-end gap-2">
                <Mail className="w-3 h-3" />
                <span>{invoiceData.company.email}</span>
              </div>
              <div className="flex items-center justify-end gap-2">
                <Globe className="w-3 h-3" />
                <span>{invoiceData.company.website}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bill To Section */}
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <div>
            <h3 className="text-base font-semibold text-gray-900 mb-2 flex items-center gap-2">
              <Building2 className="w-4 h-4" />
              Bill To:
            </h3>
            <div className="bg-gray-50 p-3 rounded-lg">
              <p className="font-semibold text-gray-900 text-sm">{invoiceData.customer.name}</p>
              {invoiceData.customer.company && (
                <p className="text-gray-700 text-xs font-medium">{invoiceData.customer.company}</p>
              )}
              <p className="text-gray-600 text-xs mt-1">{invoiceData.customer.address}</p>
              <div className="mt-1 space-y-0.5">
                <p className="text-gray-600 text-xs">Tel: {invoiceData.customer.phone}</p>
                <p className="text-gray-600 text-xs">Email: {invoiceData.customer.email}</p>
              </div>
              {invoiceData.customer.notes && (
                <div className="mt-2 pt-1 border-t border-gray-200">
                  <p className="text-gray-500 text-xs font-medium">Catatan:</p>
                  <p className="text-gray-600 text-xs">{invoiceData.customer.notes}</p>
                </div>
              )}
            </div>
          </div>

        </div>

        {/* Items Table */}
        <div className="mb-4 print-avoid-break">
          <h3 className="text-base font-semibold text-gray-900 mb-3">Detail Pemesanan</h3>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-200">
              <thead>
                <tr className="bg-gray-50">
                  <th className="border border-gray-200 px-2 py-2 text-left text-xs font-semibold text-gray-900">
                    No.
                  </th>
                  <th className="border border-gray-200 px-2 py-2 text-left text-xs font-semibold text-gray-900">
                    Nama Barang
                  </th>
                  <th className="border border-gray-200 px-2 py-2 text-left text-xs font-semibold text-gray-900">
                    Spesifikasi
                  </th>
                  <th className="border border-gray-200 px-2 py-2 text-center text-xs font-semibold text-gray-900">
                    Qty
                  </th>
                  <th className="border border-gray-200 px-2 py-2 text-center text-xs font-semibold text-gray-900">
                    Satuan
                  </th>
                  <th className="border border-gray-200 px-2 py-2 text-right text-xs font-semibold text-gray-900">
                    Harga Satuan
                  </th>
                  <th className="border border-gray-200 px-2 py-2 text-right text-xs font-semibold text-gray-900">
                    Total
                  </th>
                </tr>
              </thead>
              <tbody>
                {invoiceData.items.map((item, index) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="border border-gray-200 px-2 py-2 text-xs text-gray-900">
                      {index + 1}
                    </td>
                    <td className="border border-gray-200 px-2 py-2 text-xs font-medium text-gray-900">
                      {item.name}
                    </td>
                    <td className="border border-gray-200 px-2 py-2 text-xs text-gray-600">
                      {item.specification}
                    </td>
                    <td className="border border-gray-200 px-2 py-2 text-xs text-center text-gray-900">
                      {item.quantity}
                    </td>
                    <td className="border border-gray-200 px-2 py-2 text-xs text-center text-gray-900">
                      {item.unit}
                    </td>
                    <td className="border border-gray-200 px-2 py-2 text-xs text-right text-gray-900">
                      {formatCurrency(item.unitPrice)}
                    </td>
                    <td className="border border-gray-200 px-2 py-2 text-xs text-right font-semibold text-gray-900">
                      {formatCurrency(item.total)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
                  
          <div>
            <h3 className="text-base font-semibold text-gray-900 mb-2">Invoice Summary</h3>
            <div className="bg-red-50 p-3 rounded-lg border border-red-200">
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="text-gray-600">Subtotal:</span>
                  <span className="font-semibold">{formatCurrency(invoiceData.subtotal)}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-600">PPN (11%):</span>
                  <span className="font-semibold">{formatCurrency(invoiceData.tax)}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-600">Service Charge:</span>
                  <span className="font-semibold">{formatCurrency(invoiceData.serviceCharge)}</span>
                </div>
                <hr className="border-red-200" />
                <div className="flex justify-between text-sm">
                  <span className="font-bold text-red-700">Total:</span>
                  <span className="font-bold text-red-700">{formatCurrency(invoiceData.total)}</span>
                </div>
              </div>
            </div>
          </div>

        {/* Terms and Conditions */}
        <div className="border-t border-gray-200 pt-3">
          <h3 className="text-sm font-semibold text-gray-900 mb-2">Syarat & Ketentuan</h3>
          <div className="grid md:grid-cols-2 gap-4 text-xs text-gray-600">
            <div>
              <h4 className="font-semibold text-gray-900 mb-1">Pembayaran:</h4>
              <ul className="space-y-0.5 list-disc list-inside">
                <li>Pembayaran dilakukan dalam 30 hari setelah invoice diterbitkan</li>
                <li>Transfer ke rekening yang tertera</li>
                <li>Konfirmasi pembayaran wajib disertakan</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-1">Layanan:</h4>
              <ul className="space-y-0.5 list-disc list-inside">
                <li>Service charge mencakup survey, pengiriman & inspeksi</li>
                <li>Garansi sesuai dengan standar industri</li>
                <li>Support teknis tersedia 24/7</li>
              </ul>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
