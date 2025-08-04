"use client"

import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Plus, ArrowRight, FileText, Eye } from 'lucide-react'
import Link from 'next/link'
import React, { useEffect } from 'react'
import { useInvoices } from '@/lib/use-invoice'

function DashboardGreeting() {
  const currentHour = new Date().getHours()
  const getGreeting = () => {
    if (currentHour < 12) return "Good Morning"
    if (currentHour < 17) return "Good Afternoon"
    return "Good Evening"
  }

  // Ambil 5 invoice terbaru yang sudah di-generate (status bukan DRAFT)
  const { invoices, loading, error, fetchInvoices } = useInvoices()
  useEffect(() => {
    fetchInvoices({ page: 1, limit: 5, status: 'SENT' })
  }, [])

  return (
    <div className="space-y-8">
      {/* Main Greeting Section */}
      <div className="text-center space-y-4">
        <div className="space-y-2">
          <h1 className="text-4xl font-light text-gray-900 tracking-tight">
            {getGreeting()}
          </h1>
          <p className="text-lg text-gray-500 font-light">
            Welcome back to your dashboard
          </p>
        </div>
      </div>

      {/* Quick Actions Card */}
      <Card className="border-0 shadow-sm bg-gradient-to-br from-gray-50 to-white">
        <CardContent className="p-8">
          <div className="text-center space-y-6">
            <div className="w-16 h-16 mx-auto bg-blue-100 rounded-full flex items-center justify-center">
              <Plus className="w-8 h-8 text-blue-600" />
            </div>
            
            <div className="space-y-2">
              <h3 className="text-xl font-medium text-gray-900">
                Kelola Konten Anda
              </h3>
              <p className="text-gray-500 max-w-md mx-auto leading-relaxed">
                Buat, edit, dan publikasikan konten berkualitas untuk audience Anda dengan mudah.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
              <Button className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg font-medium transition-colors">
                Buat Konten Baru
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
              <Button variant="outline" className="border-red-200 text-red-600 hover:bg-red-50 px-6 py-2 rounded-lg font-medium">
                Lihat Panduan
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Invoice List Preview */}
      <Card className="border-0 shadow-sm mt-8">
        <CardContent className="p-6">
          <div className="mb-4 flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-500" />
            <span className="font-semibold text-gray-900">Invoice Terbaru (Sudah di-generate)</span>
          </div>
          {loading ? (
            <div className="text-gray-500">Memuat invoice...</div>
          ) : error ? (
            <div className="text-red-500">Gagal memuat invoice</div>
          ) : invoices.length === 0 ? (
            <div className="text-gray-500">Belum ada invoice yang di-generate.</div>
          ) : (
            <ul className="divide-y divide-gray-100">
              {invoices.map(inv => (
                <li key={inv.id} className="py-2 flex items-center justify-between">
                  <div>
                    <span className="font-medium text-gray-800">{inv.invoiceNumber}</span>
                    <span className="ml-2 text-xs px-2 py-1 rounded bg-blue-50 text-blue-700">{inv.status}</span>
                    <span className="ml-2 text-gray-500">{new Date(inv.createdAt).toLocaleDateString('id-ID')}</span>
                  </div>
                  <Link href={`/invoice/${inv.id}`}>
                    <Button variant="outline" size="sm">
                      <Eye className="w-4 h-4" />
                    </Button>
                  </Link>
                </li>
              ))}
            </ul>
          )}
          <div className="mt-4 text-right">
            <Link href="/invoice/list">
              <Button variant="ghost" size="sm">Lihat Semua Invoice</Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default DashboardGreeting;
