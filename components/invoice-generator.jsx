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
  // Fungsi konfirmasi via WhatsApp
  const handleWhatsappConfirm = async () => {
    // Kirim request ke backend untuk update status invoice
    try {
      await fetch(`/api/invoices/${invoiceData.invoiceNumber}/confirm-wa`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'MASUK', confirmedAt: new Date() })
      });
    } catch (err) {
      // Optional: tampilkan error jika perlu
      console.error('Gagal mencatat konfirmasi invoice:', err);
    }
    // Redirect ke WhatsApp
    window.open('https://wa.me/6289524396489?text=Halo%2C%20saya%20ingin%20mengkonfirmasi%20invoice%20ini.', '_blank');
  };
  if (!data) {
    console.log('InvoiceGenerator: No data provided')
    return null
  }
  
  // Debug logging
  console.log('InvoiceGenerator data:', data)
  console.log('Date value:', data.date, 'Type:', typeof data.date)
  console.log('DueDate value:', data.dueDate, 'Type:', typeof data.dueDate)

  // Ensure we have required data with defaults
  const invoiceDate = data.date ? new Date(data.date) : new Date();
  const dueDate = new Date(invoiceDate);
  dueDate.setDate(invoiceDate.getDate() + 7);
  const invoiceData = {
    invoiceNumber: data.invoiceNumber || `INV-${String(data.company?.invoiceCounter || 1).padStart(4, '0')}`,
    date: invoiceDate,
    dueDate: dueDate,
    company: data.company || {
      name: 'UNDAGI',
      address: 'Alamat tidak tersedia',
      phone: 'Telepon tidak tersedia',
      email: 'Email tidak tersedia',
      logo: '/Logo.svg',
      signature: '/ttd.png',
      authorizedBy: 'Direktur'
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
    <>
      <style jsx global>{`
        @media print {
          * {
            -webkit-print-color-adjust: exact !important;
            color-adjust: exact !important;
          }
          
          @page {
            margin: 0.5in;
            size: A4;
          }
          
          .print-container {
            box-shadow: none !important;
            margin: 0 !important;
            padding: 0 !important;
            max-width: none !important;
            width: 100% !important;
            page-break-before: avoid !important;
          }
          
          .print-avoid-break {
            page-break-inside: avoid;
            break-inside: avoid;
          }
          
          .signature-section {
            page-break-inside: avoid !important;
            break-inside: avoid !important;
            margin-top: auto;
          }
          
          .items-table {
            page-break-inside: auto;
          }
          
          .terms-section {
            page-break-inside: avoid !important;
            break-inside: avoid !important;
            margin-top: 1rem;
          }
          
          body {
            margin: 0 !important;
            padding: 0 !important;
          }
          
          html, body {
            height: auto !important;
          }
          
          .no-print {
            display: none !important;
          }
          
          /* Pastikan header tidak terpotong */
          .invoice-header {
            page-break-after: avoid;
            break-after: avoid;
          }
          
          /* Pastikan summary tidak terpotong */
          .invoice-summary {
            page-break-inside: avoid;
            break-inside: avoid;
          }
        }
      `}</style>
      <Card className="w-full bg-white shadow-lg print-container">
        <CardContent className="p-8">
        <div className="print-content">
        {/* Header */}
        <div className="flex justify-between items-start mb-6 invoice-header">
          <div className="flex items-center gap-6">
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
          
          {/* Company Info dengan Logo */}
          <div className="text-right">
            {/* Logo */}
            <div className="flex justify-end mb-3">
              <div className="flex-shrink-0">
                <div className="relative">
                  <Image
                    src={invoiceData.company.logo || "/Logo.svg"}
                    alt={`${invoiceData.company.name} Logo`}
                    width={80}
                    height={80}
                    className="object-contain"
                    priority
                    unoptimized
                    onError={(e) => {
                      console.error('Error loading logo:', e);
                      // Hide the Image component and show fallback
                      e.target.style.display = 'none';
                      const fallback = e.target.nextElementSibling;
                      if (fallback) fallback.style.display = 'block';
                    }}
                  />
                  {/* Fallback image */}
                  <img
                    src="/Logo.svg"
                    alt={`${invoiceData.company.name} Logo`}
                    width={80}
                    height={80}
                    className="object-contain"
                    style={{ display: 'none' }}
                    onError={(e) => {
                      console.error('Fallback image also failed to load');
                      e.target.style.display = 'none';
                      // Show placeholder text
                      const placeholder = e.target.nextElementSibling;
                      if (placeholder) placeholder.style.display = 'flex';
                    }}
                  />
                  {/* Text placeholder as last resort */}
                  <div 
                    className="w-20 h-20 bg-gray-200 border-2 border-dashed border-gray-400 flex items-center justify-center text-xs text-gray-500 text-center"
                    style={{ display: 'none' }}
                  >
                    Logo<br/>Tidak<br/>Tersedia
                  </div>
                </div>
              </div>
            </div>
            
            <h2 className="text-xl font-bold text-gray-900 mb-2">{invoiceData.company.name}</h2>
            <div className="text-xs text-gray-600 space-y-1">
              <div className="flex items-center justify-end gap-2">
                <span>{invoiceData.company.address}</span>
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
        <div className="mb-4 items-table">
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
                  
          <div className="invoice-summary">
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

        {/* Terms and Signature */}
        <div className="border-t border-gray-200 pt-4 mt-4 signature-section">
          <div className="flex justify-between items-start">
            {/* Terms & Conditions (Left) */}
            <div className="w-1/2 pr-4">
              <h3 className="text-sm font-semibold text-gray-900 mb-2">Syarat & Ketentuan</h3>
              <div className="text-xs text-gray-600">
                <h4 className="font-semibold text-gray-900 mb-1">Pembayaran:</h4>
                <ul className="space-y-0.5 list-disc list-inside">
                  <li>Pembayaran dilakukan dalam 7 hari setelah invoice diterbitkan.</li>
                  <li>Transfer ke rekening yang tertera.</li>
                  <li>Konfirmasi pembayaran wajib disertakan.</li>
                </ul>
              </div>
            </div>

            {/* Signature (Right) */}
            <div className="w-1/2 flex justify-end">
              <div className="text-center">
                <h4 className="font-semibold text-gray-900 mb-2 text-xs">Hormat Kami,</h4>
                <div className="w-32 h-16 flex items-center justify-center mb-2">
                  <Image
                    src={invoiceData.company.signature || "/ttd.png"}
                    alt="Tanda Tangan"
                    width={100}
                    height={30}
                    className="object-fit"
                    unoptimized
                    onError={(e) => {
                      console.error('Error loading signature:', e);
                      e.target.style.display = 'none';
                      const placeholder = e.target.parentElement.querySelector('.signature-placeholder');
                      if (placeholder) placeholder.style.display = 'flex';
                    }}
                  />
                  <div 
                    className="signature-placeholder w-30 h-12 bg-gray-100 border border-dashed border-gray-300 flex items-center justify-center text-xs text-gray-400"
                    style={{ display: 'none' }}
                  >
                    TTD
                  </div>
                </div>
                <div className="border-t border-gray-400 w-32 mx-auto mb-1"></div>
                <p className="font-semibold text-gray-900 text-xs">{invoiceData.company.authorizedBy || 'Direktur Keuangan'}</p>
                <p className="text-gray-600 text-xs">Nia Dewi Anisa</p>
              </div>
            </div>
          </div>
        </div>
        </div>
      </CardContent>
    </Card>
    </>
  )
}
