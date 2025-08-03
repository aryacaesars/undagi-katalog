"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import CSVImporter from "@/components/csv-importer"
import { 
  Plus, 
  Upload, 
  Download, 
  Edit2, 
  Trash2, 
  Eye, 
  EyeOff, 
  Star,
  Loader2,
  RefreshCw
} from "lucide-react"

export default function PricingPlansAdmin() {
  const [pricingPlans, setPricingPlans] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showImporter, setShowImporter] = useState(false)
  const [actionLoading, setActionLoading] = useState({})

  // Fetch pricing plans
  const fetchPricingPlans = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/pricing-plans')
      const data = await response.json()
      
      if (data.success) {
        setPricingPlans(data.data || [])
      } else {
        setError('Failed to fetch pricing plans')
      }
    } catch (error) {
      console.error('Error fetching pricing plans:', error)
      setError('Failed to load pricing plans')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPricingPlans()
  }, [])

  // Handle import success
  const handleImportSuccess = (newPlans) => {
    setPricingPlans(newPlans)
    setShowImporter(false)
  }

  // Toggle plan active status
  const togglePlanStatus = async (planId, currentStatus) => {
    setActionLoading(prev => ({ ...prev, [planId]: 'toggle' }))
    
    try {
      const response = await fetch(`/api/pricing-plans/${planId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          isActive: !currentStatus
        })
      })

      if (response.ok) {
        await fetchPricingPlans() // Refresh data
      } else {
        setError('Failed to update plan status')
      }
    } catch (error) {
      setError('Failed to update plan status')
    } finally {
      setActionLoading(prev => ({ ...prev, [planId]: null }))
    }
  }

  // Delete plan
  const deletePlan = async (planId) => {
    if (!confirm('Are you sure you want to delete this pricing plan?')) {
      return
    }

    setActionLoading(prev => ({ ...prev, [planId]: 'delete' }))
    
    try {
      const response = await fetch(`/api/pricing-plans/${planId}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        await fetchPricingPlans() // Refresh data
      } else {
        setError('Failed to delete plan')
      }
    } catch (error) {
      setError('Failed to delete plan')
    } finally {
      setActionLoading(prev => ({ ...prev, [planId]: null }))
    }
  }

  // Export current data as CSV
  const exportToCSV = () => {
    if (pricingPlans.length === 0) {
      alert('No data to export')
      return
    }

    const headers = [
      'name', 'subtitle', 'price', 'originalPrice', 'discount', 'description',
      'features', 'limitations', 'popular', 'color', 'sortOrder', 'isActive'
    ]

    let csv = headers.join(',') + '\n'
    
    pricingPlans.forEach(plan => {
      const values = [
        plan.name,
        plan.subtitle,
        plan.price,
        plan.originalPrice,
        plan.discount,
        plan.description,
        plan.features.join('|'),
        plan.limitations.join('|'),
        plan.popular,
        plan.color,
        plan.sortOrder,
        plan.isActive
      ]
      
      // Wrap values in quotes and escape existing quotes
      const escapedValues = values.map(value => {
        const str = String(value || '')
        return str.includes(',') || str.includes('\n') ? `"${str.replace(/"/g, '""')}"` : str
      })
      
      csv += escapedValues.join(',') + '\n'
    })

    // Download file
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'pricing-plans-export.csv'
    document.body.appendChild(a)
    a.click()
    window.URL.revokeObjectURL(url)
    document.body.removeChild(a)
  }

  if (showImporter) {
    return (
      <div className="container mx-auto px-4 py-8">
        <CSVImporter
          onImportSuccess={handleImportSuccess}
          onClose={() => setShowImporter(false)}
        />
      </div>
    )
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          <span className="ml-2 text-gray-600">Loading pricing plans...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Pricing Plans Management
        </h1>
        <p className="text-gray-600">
          Manage your pricing plans, import data from CSV, or create new plans
        </p>
      </div>

      {/* Actions Bar */}
      <div className="flex flex-wrap gap-3 mb-6">
        <Button onClick={() => setShowImporter(true)} className="bg-blue-600 hover:bg-blue-700">
          <Upload className="w-4 h-4 mr-2" />
          Import CSV
        </Button>
        
        <Button variant="outline" onClick={exportToCSV} disabled={pricingPlans.length === 0}>
          <Download className="w-4 h-4 mr-2" />
          Export CSV
        </Button>
        
        <Button variant="outline" onClick={fetchPricingPlans}>
          <RefreshCw className="w-4 h-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <p className="text-red-800">{error}</p>
        </div>
      )}

      {/* Plans Grid */}
      {pricingPlans.length === 0 ? (
        <Card className="text-center py-12">
          <CardContent>
            <div className="text-gray-500 mb-4">
              <Upload className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <h3 className="text-lg font-medium mb-2">No Pricing Plans Found</h3>
              <p>Get started by importing CSV data or creating a new plan</p>
            </div>
            <Button onClick={() => setShowImporter(true)}>
              <Upload className="w-4 h-4 mr-2" />
              Import CSV Data
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {pricingPlans.map((plan) => (
            <Card key={plan.id} className={`relative ${plan.isActive ? '' : 'opacity-60'}`}>
              {plan.popular && (
                <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-red-500 to-red-600 text-white text-center py-1 text-xs font-semibold">
                  <Star className="inline w-3 h-3 mr-1" />
                  POPULAR
                </div>
              )}

              <CardHeader className={`${plan.popular ? 'pt-8' : 'pt-4'}`}>
                <div className="flex items-center justify-between mb-2">
                  <Badge variant={plan.isActive ? "default" : "secondary"}>
                    {plan.isActive ? "Active" : "Inactive"}
                  </Badge>
                  <Badge variant="outline" className={`text-${plan.color}-600 bg-${plan.color}-50`}>
                    {plan.color}
                  </Badge>
                </div>

                <CardTitle className="text-xl font-bold">{plan.name}</CardTitle>
                <p className="text-sm text-gray-600">{plan.subtitle}</p>
                
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-bold text-gray-900">{plan.price}</span>
                    <Badge variant="destructive" className="text-xs">
                      {plan.discount} OFF
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-500 line-through">{plan.originalPrice}</p>
                </div>
              </CardHeader>

              <CardContent>
                <p className="text-sm text-gray-600 mb-4">{plan.description}</p>
                
                <div className="space-y-3">
                  <div>
                    <p className="text-xs font-medium text-gray-900 mb-1">
                      Features ({plan.features.length})
                    </p>
                    <div className="text-xs text-gray-600 max-h-20 overflow-y-auto">
                      {plan.features.slice(0, 3).map((feature, index) => (
                        <div key={index}>• {feature}</div>
                      ))}
                      {plan.features.length > 3 && (
                        <div className="text-gray-500">+ {plan.features.length - 3} more...</div>
                      )}
                    </div>
                  </div>

                  {plan.limitations.length > 0 && (
                    <div>
                      <p className="text-xs font-medium text-gray-900 mb-1">
                        Limitations ({plan.limitations.length})
                      </p>
                      <div className="text-xs text-gray-500">
                        {plan.limitations.slice(0, 2).map((limitation, index) => (
                          <div key={index}>• {limitation}</div>
                        ))}
                        {plan.limitations.length > 2 && (
                          <div>+ {plan.limitations.length - 2} more...</div>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex gap-2 mt-4 pt-4 border-t">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => togglePlanStatus(plan.id, plan.isActive)}
                    disabled={actionLoading[plan.id] === 'toggle'}
                  >
                    {actionLoading[plan.id] === 'toggle' ? (
                      <Loader2 className="w-3 h-3 animate-spin" />
                    ) : plan.isActive ? (
                      <EyeOff className="w-3 h-3" />
                    ) : (
                      <Eye className="w-3 h-3" />
                    )}
                  </Button>
                  
                  <Button size="sm" variant="outline">
                    <Edit2 className="w-3 h-3" />
                  </Button>
                  
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => deletePlan(plan.id)}
                    disabled={actionLoading[plan.id] === 'delete'}
                    className="text-red-600 hover:text-red-700"
                  >
                    {actionLoading[plan.id] === 'delete' ? (
                      <Loader2 className="w-3 h-3 animate-spin" />
                    ) : (
                      <Trash2 className="w-3 h-3" />
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
