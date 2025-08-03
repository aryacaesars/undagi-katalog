'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function AnalyticsContent() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">Analytics Dashboard</h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Monthly Sales</CardTitle>
          </CardHeader>
          <CardContent className="p-6 text-center text-gray-500">
            Sales analytics chart will be implemented here...
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Popular Products</CardTitle>
          </CardHeader>
          <CardContent className="p-6 text-center text-gray-500">
            Product analytics will be implemented here...
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
