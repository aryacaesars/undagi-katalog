'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { 
  Plus, 
  Edit, 
  Trash2, 
  Save, 
  X, 
  Star,
  ArrowUp,
  ArrowDown,
  Eye,
  EyeOff
} from 'lucide-react'

export default function PricingPlansManager() {
  const [plans, setPlans] = useState([])
  const [loading, setLoading] = useState(true)
  const [editingPlan, setEditingPlan] = useState(null)
  const [showForm, setShowForm] = useState(false)

  const [formData, setFormData] = useState({
    name: '',
    subtitle: '',
    price: '',
    originalPrice: '',
    discount: '',
    description: '',
    features: [],
    limitations: [],
    popular: false,
    color: 'blue',
    sortOrder: 0,
    isActive: true
  })

  // Fetch pricing plans
  const fetchPlans = async () => {
    try {
      const response = await fetch('/api/pricing-plans')
      const data = await response.json()
      if (data.success) {
        setPlans(data.data)
      }
    } catch (error) {
      console.error('Error fetching plans:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPlans()
  }, [])

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault()
    
    try {
      const url = editingPlan 
        ? `/api/pricing-plans/${editingPlan.id}`
        : '/api/pricing-plans'
      
      const method = editingPlan ? 'PUT' : 'POST'
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      })

      const data = await response.json()
      
      if (data.success) {
        await fetchPlans()
        resetForm()
        alert(editingPlan ? 'Plan updated successfully!' : 'Plan created successfully!')
      } else {
        alert('Error: ' + data.error)
      }
    } catch (error) {
      console.error('Error saving plan:', error)
      alert('Failed to save plan')
    }
  }

  // Reset form
  const resetForm = () => {
    setFormData({
      name: '',
      subtitle: '',
      price: '',
      originalPrice: '',
      discount: '',
      description: '',
      features: [],
      limitations: [],
      popular: false,
      color: 'blue',
      sortOrder: 0,
      isActive: true
    })
    setEditingPlan(null)
    setShowForm(false)
  }

  // Edit plan
  const handleEdit = (plan) => {
    setFormData({
      name: plan.name,
      subtitle: plan.subtitle,
      price: plan.price,
      originalPrice: plan.originalPrice,
      discount: plan.discount,
      description: plan.description,
      features: plan.features,
      limitations: plan.limitations,
      popular: plan.popular,
      color: plan.color,
      sortOrder: plan.sortOrder,
      isActive: plan.isActive
    })
    setEditingPlan(plan)
    setShowForm(true)
  }

  // Delete plan
  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this plan?')) return

    try {
      const response = await fetch(`/api/pricing-plans/${id}`, {
        method: 'DELETE'
      })

      const data = await response.json()
      
      if (data.success) {
        await fetchPlans()
        alert('Plan deleted successfully!')
      } else {
        alert('Error: ' + data.error)
      }
    } catch (error) {
      console.error('Error deleting plan:', error)
      alert('Failed to delete plan')
    }
  }

  // Add/Remove features
  const addFeature = () => {
    setFormData(prev => ({
      ...prev,
      features: [...prev.features, '']
    }))
  }

  const removeFeature = (index) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index)
    }))
  }

  const updateFeature = (index, value) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.map((feature, i) => i === index ? value : feature)
    }))
  }

  // Add/Remove limitations
  const addLimitation = () => {
    setFormData(prev => ({
      ...prev,
      limitations: [...prev.limitations, '']
    }))
  }

  const removeLimitation = (index) => {
    setFormData(prev => ({
      ...prev,
      limitations: prev.limitations.filter((_, i) => i !== index)
    }))
  }

  const updateLimitation = (index, value) => {
    setFormData(prev => ({
      ...prev,
      limitations: prev.limitations.map((limitation, i) => i === index ? value : limitation)
    }))
  }

  if (loading) {
    return <div className="p-8">Loading...</div>
  }

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Pricing Plans Manager</h1>
          <p className="text-gray-600 mt-2">Manage your pricing plans for the website</p>
        </div>
        <Button 
          onClick={() => setShowForm(true)}
          className="bg-blue-600 hover:bg-blue-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add New Plan
        </Button>
      </div>

      {/* Form */}
      {showForm && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>
              {editingPlan ? 'Edit Pricing Plan' : 'Add New Pricing Plan'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="name">Plan Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Basic, Regular, Premium"
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="subtitle">Subtitle</Label>
                  <Input
                    id="subtitle"
                    value={formData.subtitle}
                    onChange={(e) => setFormData(prev => ({ ...prev, subtitle: e.target.value }))}
                    placeholder="Solusi Dasar Terjangkau"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="price">Price</Label>
                  <Input
                    id="price"
                    value={formData.price}
                    onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                    placeholder="15 juta"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="originalPrice">Original Price</Label>
                  <Input
                    id="originalPrice"
                    value={formData.originalPrice}
                    onChange={(e) => setFormData(prev => ({ ...prev, originalPrice: e.target.value }))}
                    placeholder="20 juta"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="discount">Discount</Label>
                  <Input
                    id="discount"
                    value={formData.discount}
                    onChange={(e) => setFormData(prev => ({ ...prev, discount: e.target.value }))}
                    placeholder="25%"
                  />
                </div>

                <div>
                  <Label htmlFor="color">Color</Label>
                  <select
                    id="color"
                    value={formData.color}
                    onChange={(e) => setFormData(prev => ({ ...prev, color: e.target.value }))}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  >
                    <option value="blue">Blue</option>
                    <option value="red">Red</option>
                    <option value="purple">Purple</option>
                    <option value="green">Green</option>
                    <option value="yellow">Yellow</option>
                  </select>
                </div>
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Plan description..."
                  rows={3}
                />
              </div>

              {/* Features */}
              <div>
                <Label>Features</Label>
                <div className="space-y-2">
                  {formData.features.map((feature, index) => (
                    <div key={index} className="flex gap-2">
                      <Input
                        value={feature}
                        onChange={(e) => updateFeature(index, e.target.value)}
                        placeholder="Feature description"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => removeFeature(index)}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    onClick={addFeature}
                    className="w-full"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Feature
                  </Button>
                </div>
              </div>

              {/* Limitations */}
              <div>
                <Label>Limitations</Label>
                <div className="space-y-2">
                  {formData.limitations.map((limitation, index) => (
                    <div key={index} className="flex gap-2">
                      <Input
                        value={limitation}
                        onChange={(e) => updateLimitation(index, e.target.value)}
                        placeholder="Limitation description"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => removeLimitation(index)}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    onClick={addLimitation}
                    className="w-full"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Limitation
                  </Button>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.popular}
                    onChange={(e) => setFormData(prev => ({ ...prev, popular: e.target.checked }))}
                  />
                  Popular Plan
                </label>
                
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
                  />
                  Active
                </label>
              </div>

              <div className="flex gap-4">
                <Button type="submit" className="bg-green-600 hover:bg-green-700">
                  <Save className="w-4 h-4 mr-2" />
                  {editingPlan ? 'Update Plan' : 'Create Plan'}
                </Button>
                <Button type="button" variant="outline" onClick={resetForm}>
                  <X className="w-4 h-4 mr-2" />
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Plans List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {plans.map((plan) => (
          <Card key={plan.id} className="relative">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    {plan.name}
                    {plan.popular && (
                      <Badge variant="destructive" className="text-xs">
                        <Star className="w-3 h-3 mr-1" />
                        Popular
                      </Badge>
                    )}
                    {!plan.isActive && (
                      <Badge variant="secondary" className="text-xs">
                        <EyeOff className="w-3 h-3 mr-1" />
                        Hidden
                      </Badge>
                    )}
                  </CardTitle>
                  <p className="text-sm text-gray-600">{plan.subtitle}</p>
                </div>
                
                <div className="flex gap-1">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleEdit(plan)}
                  >
                    <Edit className="w-3 h-3" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDelete(plan.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              </div>
              
              <div className="text-2xl font-bold">
                Rp {plan.price}
                <span className="text-sm text-gray-500 line-through ml-2">
                  Rp {plan.originalPrice}
                </span>
              </div>
            </CardHeader>
            
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">{plan.description}</p>
              
              <div className="space-y-2">
                <div>
                  <strong className="text-xs">Features ({plan.features.length}):</strong>
                  <div className="text-xs text-gray-600">
                    {plan.features.slice(0, 3).map((feature, i) => (
                      <div key={i}>• {feature}</div>
                    ))}
                    {plan.features.length > 3 && (
                      <div>... and {plan.features.length - 3} more</div>
                    )}
                  </div>
                </div>
                
                {plan.limitations.length > 0 && (
                  <div>
                    <strong className="text-xs">Limitations ({plan.limitations.length}):</strong>
                    <div className="text-xs text-gray-500">
                      {plan.limitations.slice(0, 2).map((limitation, i) => (
                        <div key={i}>• {limitation}</div>
                      ))}
                      {plan.limitations.length > 2 && (
                        <div>... and {plan.limitations.length - 2} more</div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {plans.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No pricing plans found.</p>
          <p className="text-gray-400">Create your first pricing plan to get started.</p>
        </div>
      )}
    </div>
  )
}
