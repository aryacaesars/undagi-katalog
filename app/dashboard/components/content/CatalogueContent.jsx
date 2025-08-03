'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Plus, Download } from 'lucide-react'

export default function CatalogueContent() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Kelola Katalog Produk</h2>
        <div className="flex gap-2">
          <Button variant="outline" className="flex items-center gap-2">
            <Download className="w-4 h-4" />
            Export CSV
          </Button>
          <Button className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Tambah Produk
          </Button>
        </div>
      </div>
      <Card>
        <CardContent className="p-6 text-center text-gray-500">
          Catalogue management content will be implemented here...
        </CardContent>
      </Card>
    </div>
  )
}
