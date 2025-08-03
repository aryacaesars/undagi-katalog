'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { 
  Eye,
  Package,
  CreditCard,
  Receipt,
  DollarSign
} from 'lucide-react'

export default function OverviewContent({ 
  isLoading, 
  bannerItems, 
  catalogueItems, 
  pricingPlans, 
  setActiveTab 
}) {
  return (
    <div className="space-y-6">
      {/* Loading Indicator */}
      {isLoading && (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
          <span className="ml-2 text-gray-600">Memuat data...</span>
        </div>
      )}
      
      {/* Statistics Cards */}
      {!isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Banner</p>
                  <p className="text-2xl font-bold text-gray-900">{bannerItems.length}</p>
                </div>
                <div className="text-blue-500">
                  <Eye className="w-8 h-8" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Produk</p>
                  <p className="text-2xl font-bold text-gray-900">{catalogueItems.length}</p>
                </div>
                <div className="text-purple-500">
                  <Package className="w-8 h-8" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Pricing Plans</p>
                  <p className="text-2xl font-bold text-gray-900">{pricingPlans.length}</p>
                </div>
                <div className="text-green-500">
                  <CreditCard className="w-8 h-8" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Nilai</p>
                  <p className="text-lg font-bold text-orange-600">
                    Rp {catalogueItems.reduce((sum, item) => sum + item.jumlah, 0).toLocaleString()}
                  </p>
                </div>
                <div className="text-orange-500">
                  <DollarSign className="w-8 h-8" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
