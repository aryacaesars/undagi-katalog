'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import InvoiceGenerator from '@/components/invoice-generator'
import { useInvoice } from '@/lib/use-invoice'
import { ArrowLeft, Edit, Trash2, Download, Send, Home } from 'lucide-react'

const statusColors = {
  DRAFT: 'bg-gray-100 text-gray-800',
  SENT: 'bg-blue-100 text-blue-800',
  PAID: 'bg-green-100 text-green-800',
  OVERDUE: 'bg-red-100 text-red-800',
  CANCELLED: 'bg-red-100 text-red-800'
}

export default function InvoiceDetailPage() {
  const params = useParams()
  const router = useRouter()
  const searchParams = useSearchParams()
  const { invoice, loading, error, fetchInvoice, updateInvoice, deleteInvoice } = useInvoice()
  
  // Check if this is user view (from checkout) or admin view
  const isUserView = searchParams.get('view') === 'user'

  useEffect(() => {
    if (params.id) {
      fetchInvoice(params.id)
    }
  }, [params.id])

  const handleStatusUpdate = async (newStatus) => {
    const updated = await updateInvoice(params.id, { status: newStatus })
    if (updated) {
      // Invoice will be updated automatically by the hook
    }
  }

  const handleDelete = async () => {
    if (confirm('Are you sure you want to delete this invoice? This action cannot be undone.')) {
      const deleted = await deleteInvoice(params.id)
      if (deleted) {
        router.push('/invoice/list')
      }
    }
  }

  const handlePrint = () => {
    window.print()
  }

  if (loading) {
    return (
      <div className="container mx-auto py-8">
        <div className="text-center">
          <p>Loading invoice...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto py-8">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          {isUserView ? (
            <Button onClick={() => router.push('/')}>
              <Home className="w-4 h-4 mr-2" />
              Kembali ke Beranda
            </Button>
          ) : (
            <Link href="/invoice/list">
              <Button>Back to Invoice List</Button>
            </Link>
          )}
        </div>
      </div>
    )
  }

  if (!invoice) {
    return (
      <div className="container mx-auto py-8">
        <div className="text-center">
          <p className="mb-4">Invoice not found</p>
          {isUserView ? (
            <Button onClick={() => router.push('/')}>
              <Home className="w-4 h-4 mr-2" />
              Kembali ke Beranda
            </Button>
          ) : (
            <Link href="/invoice/list">
              <Button>Back to Invoice List</Button>
            </Link>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8">
      {/* User Success Message - Only for user view */}
      {isUserView && (
        <div className="mb-6 print:hidden">
          <Card className="bg-green-50 border-green-200">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-green-800">Pesanan Berhasil Dibuat!</h3>
                  <p className="text-green-700">Invoice Anda telah berhasil dibuat. Silakan download PDF untuk arsip Anda.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Header - Hide on print */}
      <div className="mb-6 print:hidden">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-4">
            {isUserView ? (
              <Button variant="outline" size="sm" onClick={() => router.push('/')}>
                <Home className="w-4 h-4 mr-2" />
                Kembali ke Beranda
              </Button>
            ) : (
              <Link href="/invoice/list">
                <Button variant="outline" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to List
                </Button>
              </Link>
            )}
            <div>
              <h1 className="text-2xl font-bold flex items-center gap-3">
                {isUserView ? `Invoice Pesanan Anda` : `Invoice ${invoice.invoiceNumber}`}
                <Badge className={statusColors[invoice.status]}>
                  {invoice.status}
                </Badge>
              </h1>
              <p className="text-gray-600 mt-1">
                {isUserView ? `Nomor Invoice: ${invoice.invoiceNumber}` : `Created on ${new Date(invoice.createdAt).toLocaleDateString('id-ID')}`}
              </p>
            </div>
          </div>

          <div className="flex gap-2">
            {/* Status Actions - Only for admin view */}
            {!isUserView && invoice.status === 'DRAFT' && (
              <Button 
                onClick={() => handleStatusUpdate('SENT')}
                size="sm"
              >
                <Send className="w-4 h-4 mr-2" />
                Send Invoice
              </Button>
            )}
            
            {!isUserView && invoice.status === 'SENT' && (
              <Button 
                onClick={() => handleStatusUpdate('PAID')}
                variant="outline"
                size="sm"
              >
                Mark as Paid
              </Button>
            )}


            {/* Print/Download - Available for both admin and user */}
            <Button onClick={handlePrint} variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              {isUserView ? 'Download PDF' : 'Print/Save PDF'}
            </Button>

            {/* Konfirmasi via WhatsApp */}
            <Button
              type="button"
              className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded shadow flex items-center gap-2"
              style={{ minWidth: 0 }}
              onClick={async () => {
                // Jika status masih DRAFT, update ke SENT dulu
                if (invoice.status === 'DRAFT') {
                  try {
                    await updateInvoice(invoice.id, { status: 'SENT' });
                  } catch (err) {
                    console.error('Gagal update status invoice:', err);
                  }
                }
                try {
                  await fetch(`/api/invoices/${invoice.invoiceNumber}/confirm-wa`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ status: 'MASUK', confirmedAt: new Date() })
                  });
                } catch (err) {
                  console.error('Gagal mencatat konfirmasi invoice:', err);
                }
                // Compose WhatsApp message
                const invoiceLink = `${window.location.origin}/invoice/${invoice.invoiceNumber}`;
                const customerName = invoice.customer?.name || '';
                const senderName = invoice.company?.authorizedBy || 'Admin';
                const message =
                  `Halo Admin,\n\nSaya (${customerName}) ingin mengkonfirmasi pembayaran untuk Invoice No: ${invoice.invoiceNumber}.\n\nBerikut link invoice: ${invoiceLink}`;
                const encodedMessage = encodeURIComponent(message);
                window.open(`https://wa.me/6289524396489?text=${encodedMessage}`, '_blank');
                // Redirect ke beranda setelah klik tombol
                setTimeout(() => {
                  window.location.href = '/';
                }, 500);
              }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 12c0 4.556-3.694 8.25-8.25 8.25A8.212 8.212 0 0 1 4.5 18.2l-1.2 3.05a.75.75 0 0 1-.97.43.75.75 0 0 1-.43-.97l1.2-3.05A8.25 8.25 0 1 1 20.25 12Z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 10.125c.375 1.125 1.5 2.25 2.625 2.625m0 0c.375.375 1.125.375 1.5 0l.75-.75c.375-.375.375-1.125 0-1.5l-.75-.75c-.375-.375-1.125-.375-1.5 0l-.75.75c-.375.375-.375 1.125 0 1.5Z" />
              </svg>
              Konfirmasi via WhatsApp
            </Button>
            
            {/* Edit and Delete - Only for admin view */}
            {!isUserView && (
              <>
                <Link href={`/invoice/${invoice.id}/edit`}>
                  <Button variant="outline" size="sm">
                    <Edit className="w-4 h-4 mr-2" />
                    Edit
                  </Button>
                </Link>
                
                <Button 
                  onClick={handleDelete}
                  variant="outline" 
                  size="sm"
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete
                </Button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Invoice Content */}
      <div className="max-w-4xl mx-auto">
        <InvoiceGenerator data={invoice} />
      </div>

      {/* User View Footer Message */}
      {isUserView && (
        <Card className="mt-6 print:hidden bg-blue-50 border-blue-200">
          <CardContent className="pt-6">
            <div className="text-center">
              <h3 className="font-semibold mb-2 text-blue-800">Terima kasih atas pesanan Anda!</h3>
              <p className="text-blue-700 text-sm">
                Tim kami akan segera memproses pesanan Anda dan menghubungi Anda untuk konfirmasi lebih lanjut. 
                Silakan simpan invoice ini sebagai bukti pemesanan.
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Additional Info - Hide on print and for user view */}
      {!isUserView && invoice.notes && (
        <Card className="mt-6 print:hidden">
          <CardContent className="pt-6">
            <h3 className="font-semibold mb-2">Internal Notes</h3>
            <p className="text-gray-600 whitespace-pre-wrap">{invoice.notes}</p>
          </CardContent>
        </Card>
      )}

      {/* Print Styles */}
      <style jsx global>{`
        @media print {
          body {
            -webkit-print-color-adjust: exact;
            color-adjust: exact;
          }
          
          .print\\:hidden {
            display: none !important;
          }
          
          .print-container {
            box-shadow: none !important;
            border: none !important;
            margin: 0 !important;
            padding: 20px !important;
          }
          
          .print-avoid-break {
            break-inside: avoid;
          }
          
          @page {
            margin: 0.5in;
            size: A4;
          }
        }
      `}</style>
    </div>
  )
}
