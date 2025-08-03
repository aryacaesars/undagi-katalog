'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'

export default function BannerContent({ setIsAddingBanner }) {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Kelola Banner Utama</h2>
        <Button 
          onClick={() => setIsAddingBanner(true)}
          className="flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Tambah Banner
        </Button>
      </div>
      <Card>
        <CardContent className="p-6 text-center text-gray-500">
          Banner management content will be implemented here...
        </CardContent>
      </Card>
    </div>
  )
}
