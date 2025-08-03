'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Building2, FileText } from 'lucide-react'

export default function InvoiceContent() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">Pengaturan Invoice</h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="w-5 h-5" />
              Data Perusahaan
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 text-center text-gray-500">
            Company data settings will be implemented here...
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Nomor Invoice
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 text-center text-gray-500">
            Invoice numbering settings will be implemented here...
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
