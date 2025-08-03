'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Plus, Upload } from 'lucide-react'

export default function PricingContent() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Kelola Paket Harga</h2>
        <div className="flex gap-2">
          <Button className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Tambah Plan
          </Button>
          <Button variant="outline" className="flex items-center gap-2">
            <Upload className="w-4 h-4" />
            Import CSV
          </Button>
        </div>
      </div>
      <Card>
        <CardContent className="p-6 text-center text-gray-500">
          Pricing management content will be implemented here...
        </CardContent>
      </Card>
    </div>
  )
}
