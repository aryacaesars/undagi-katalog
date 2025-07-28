'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import InvoiceGenerator from '@/components/invoice-generator'
import { useInvoice, useCompanies, useCustomers } from '@/lib/use-invoice'
import { Plus, Trash2, Save, Eye } from 'lucide-react'

export default function InvoiceManagementPage() {
  const [showPreview, setShowPreview] = useState(false)
  const [formData, setFormData] = useState({
    companyId: '',
    customerId: '',
    dueDate: '',
    tax: 0,
    serviceCharge: 0,
    notes: '',
    items: [
      {
        name: '',
        specification: '',
        quantity: 1,
        unit: '',
        unitPrice: 0
      }
    ]
  })

  const [newCompany, setNewCompany] = useState({
    name: '',
    address: '',
    phone: '',
    email: '',
    website: '',
    isDefault: false
  })

  const [newCustomer, setNewCustomer] = useState({
    name: '',
    company: '',
    address: '',
    phone: '',
    email: '',
    notes: ''
  })

  const [showCompanyForm, setShowCompanyForm] = useState(false)
  const [showCustomerForm, setShowCustomerForm] = useState(false)

  const { invoice, loading, error, createInvoice } = useInvoice()
  const { companies, loading: companiesLoading, fetchCompanies, createCompany } = useCompanies()
  const { customers, loading: customersLoading, fetchCustomers, createCustomer } = useCustomers()

  useEffect(() => {
    fetchCompanies()
    fetchCustomers()
  }, [])

  // Set default due date to 30 days from now
  useEffect(() => {
    const defaultDueDate = new Date()
    defaultDueDate.setDate(defaultDueDate.getDate() + 30)
    setFormData(prev => ({
      ...prev,
      dueDate: defaultDueDate.toISOString().split('T')[0]
    }))
  }, [])

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleItemChange = (index, field, value) => {
    const updatedItems = [...formData.items]
    updatedItems[index] = {
      ...updatedItems[index],
      [field]: value
    }
    setFormData(prev => ({
      ...prev,
      items: updatedItems
    }))
  }

  const addItem = () => {
    setFormData(prev => ({
      ...prev,
      items: [
        ...prev.items,
        {
          name: '',
          specification: '',
          quantity: 1,
          unit: '',
          unitPrice: 0
        }
      ]
    }))
  }

  const removeItem = (index) => {
    if (formData.items.length > 1) {
      const updatedItems = formData.items.filter((_, i) => i !== index)
      setFormData(prev => ({
        ...prev,
        items: updatedItems
      }))
    }
  }

  const handleCreateCompany = async (e) => {
    e.preventDefault()
    const company = await createCompany(newCompany)
    if (company) {
      setNewCompany({
        name: '',
        address: '',
        phone: '',
        email: '',
        website: '',
        isDefault: false
      })
      setShowCompanyForm(false)
      setFormData(prev => ({ ...prev, companyId: company.id }))
    }
  }

  const handleCreateCustomer = async (e) => {
    e.preventDefault()
    const customer = await createCustomer(newCustomer)
    if (customer) {
      setNewCustomer({
        name: '',
        company: '',
        address: '',
        phone: '',
        email: '',
        notes: ''
      })
      setShowCustomerForm(false)
      setFormData(prev => ({ ...prev, customerId: customer.id }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!formData.companyId || !formData.customerId || formData.items.length === 0) {
      alert('Please fill all required fields')
      return
    }

    const invoiceData = {
      ...formData,
      companyId: parseInt(formData.companyId),
      customerId: parseInt(formData.customerId),
      tax: parseFloat(formData.tax || 0),
      serviceCharge: parseFloat(formData.serviceCharge || 0)
    }

    const createdInvoice = await createInvoice(invoiceData)
    if (createdInvoice) {
      alert('Invoice created successfully!')
      // Reset form
      setFormData({
        companyId: '',
        customerId: '',
        dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        tax: 0,
        serviceCharge: 0,
        notes: '',
        items: [
          {
            name: '',
            specification: '',
            quantity: 1,
            unit: '',
            unitPrice: 0
          }
        ]
      })
    }
  }

  const calculateSubtotal = () => {
    return formData.items.reduce((sum, item) => {
      return sum + (item.quantity * item.unitPrice)
    }, 0)
  }

  const calculateTotal = () => {
    const subtotal = calculateSubtotal()
    const tax = parseFloat(formData.tax || 0)
    const serviceCharge = parseFloat(formData.serviceCharge || 0)
    return subtotal + tax + serviceCharge
  }

  // Convert form data to invoice preview format
  const getPreviewData = () => {
    const selectedCompany = companies.find(c => c.id === parseInt(formData.companyId))
    const selectedCustomer = customers.find(c => c.id === parseInt(formData.customerId))
    
    if (!selectedCompany || !selectedCustomer) return null

    return {
      invoiceNumber: 'PREVIEW',
      date: new Date(),
      dueDate: new Date(formData.dueDate),
      company: selectedCompany,
      customer: selectedCustomer,
      items: formData.items.map((item, index) => ({
        id: index,
        name: item.name,
        specification: item.specification,
        quantity: item.quantity,
        unit: item.unit,
        unitPrice: item.unitPrice,
        total: item.quantity * item.unitPrice
      })),
      subtotal: calculateSubtotal(),
      tax: parseFloat(formData.tax || 0),
      serviceCharge: parseFloat(formData.serviceCharge || 0),
      total: calculateTotal()
    }
  }

  if (showPreview) {
    const previewData = getPreviewData()
    return (
      <div className="container mx-auto py-8">
        <div className="mb-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Invoice Preview</h1>
          <Button onClick={() => setShowPreview(false)}>
            Back to Form
          </Button>
        </div>
        {previewData ? (
          <InvoiceGenerator data={previewData} />
        ) : (
          <p>Please fill company and customer information to preview</p>
        )}
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8">
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-3xl font-bold">Create Invoice</h1>
        <div className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => setShowPreview(true)}
            disabled={!formData.companyId || !formData.customerId}
          >
            <Eye className="w-4 h-4 mr-2" />
            Preview
          </Button>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Company Selection */}
        <Card>
          <CardHeader>
            <CardTitle>Company Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-4 items-end">
              <div className="flex-1">
                <Label htmlFor="companyId">Select Company</Label>
                <select
                  id="companyId"
                  value={formData.companyId}
                  onChange={(e) => handleInputChange('companyId', e.target.value)}
                  className="w-full mt-1 p-2 border border-gray-300 rounded-lg"
                  required
                >
                  <option value="">Choose Company</option>
                  {companies.map(company => (
                    <option key={company.id} value={company.id}>
                      {company.name} {company.isDefault && '(Default)'}
                    </option>
                  ))}
                </select>
              </div>
              <Button
                type="button"
                onClick={() => setShowCompanyForm(!showCompanyForm)}
                variant="outline"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Company
              </Button>
            </div>

            {showCompanyForm && (
              <Card className="mt-4">
                <CardHeader>
                  <CardTitle className="text-lg">Add New Company</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="companyName">Company Name *</Label>
                      <Input
                        id="companyName"
                        value={newCompany.name}
                        onChange={(e) => setNewCompany(prev => ({ ...prev, name: e.target.value }))}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="companyEmail">Email *</Label>
                      <Input
                        id="companyEmail"
                        type="email"
                        value={newCompany.email}
                        onChange={(e) => setNewCompany(prev => ({ ...prev, email: e.target.value }))}
                        required
                      />
                    </div>
                    <div className="col-span-2">
                      <Label htmlFor="companyAddress">Address *</Label>
                      <Textarea
                        id="companyAddress"
                        value={newCompany.address}
                        onChange={(e) => setNewCompany(prev => ({ ...prev, address: e.target.value }))}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="companyPhone">Phone *</Label>
                      <Input
                        id="companyPhone"
                        value={newCompany.phone}
                        onChange={(e) => setNewCompany(prev => ({ ...prev, phone: e.target.value }))}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="companyWebsite">Website</Label>
                      <Input
                        id="companyWebsite"
                        value={newCompany.website}
                        onChange={(e) => setNewCompany(prev => ({ ...prev, website: e.target.value }))}
                      />
                    </div>
                  </div>
                  <div className="flex gap-2 mt-4">
                    <Button onClick={handleCreateCompany} disabled={companiesLoading}>
                      Save Company
                    </Button>
                    <Button type="button" variant="outline" onClick={() => setShowCompanyForm(false)}>
                      Cancel
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </CardContent>
        </Card>

        {/* Customer Selection */}
        <Card>
          <CardHeader>
            <CardTitle>Customer Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-4 items-end">
              <div className="flex-1">
                <Label htmlFor="customerId">Select Customer</Label>
                <select
                  id="customerId"
                  value={formData.customerId}
                  onChange={(e) => handleInputChange('customerId', e.target.value)}
                  className="w-full mt-1 p-2 border border-gray-300 rounded-lg"
                  required
                >
                  <option value="">Choose Customer</option>
                  {customers.map(customer => (
                    <option key={customer.id} value={customer.id}>
                      {customer.name} {customer.company && `(${customer.company})`}
                    </option>
                  ))}
                </select>
              </div>
              <Button
                type="button"
                onClick={() => setShowCustomerForm(!showCustomerForm)}
                variant="outline"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Customer
              </Button>
            </div>

            {showCustomerForm && (
              <Card className="mt-4">
                <CardHeader>
                  <CardTitle className="text-lg">Add New Customer</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="customerName">Customer Name *</Label>
                      <Input
                        id="customerName"
                        value={newCustomer.name}
                        onChange={(e) => setNewCustomer(prev => ({ ...prev, name: e.target.value }))}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="customerCompany">Company</Label>
                      <Input
                        id="customerCompany"
                        value={newCustomer.company}
                        onChange={(e) => setNewCustomer(prev => ({ ...prev, company: e.target.value }))}
                      />
                    </div>
                    <div className="col-span-2">
                      <Label htmlFor="customerAddress">Address *</Label>
                      <Textarea
                        id="customerAddress"
                        value={newCustomer.address}
                        onChange={(e) => setNewCustomer(prev => ({ ...prev, address: e.target.value }))}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="customerPhone">Phone *</Label>
                      <Input
                        id="customerPhone"
                        value={newCustomer.phone}
                        onChange={(e) => setNewCustomer(prev => ({ ...prev, phone: e.target.value }))}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="customerEmail">Email *</Label>
                      <Input
                        id="customerEmail"
                        type="email"
                        value={newCustomer.email}
                        onChange={(e) => setNewCustomer(prev => ({ ...prev, email: e.target.value }))}
                        required
                      />
                    </div>
                    <div className="col-span-2">
                      <Label htmlFor="customerNotes">Notes</Label>
                      <Textarea
                        id="customerNotes"
                        value={newCustomer.notes}
                        onChange={(e) => setNewCustomer(prev => ({ ...prev, notes: e.target.value }))}
                      />
                    </div>
                  </div>
                  <div className="flex gap-2 mt-4">
                    <Button onClick={handleCreateCustomer} disabled={customersLoading}>
                      Save Customer
                    </Button>
                    <Button type="button" variant="outline" onClick={() => setShowCustomerForm(false)}>
                      Cancel
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </CardContent>
        </Card>

        {/* Invoice Details */}
        <Card>
          <CardHeader>
            <CardTitle>Invoice Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="dueDate">Due Date</Label>
                <Input
                  id="dueDate"
                  type="date"
                  value={formData.dueDate}
                  onChange={(e) => handleInputChange('dueDate', e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="tax">Tax (Rp)</Label>
                <Input
                  id="tax"
                  type="number"
                  value={formData.tax}
                  onChange={(e) => handleInputChange('tax', e.target.value)}
                  min="0"
                />
              </div>
              <div>
                <Label htmlFor="serviceCharge">Service Charge (Rp)</Label>
                <Input
                  id="serviceCharge"
                  type="number"
                  value={formData.serviceCharge}
                  onChange={(e) => handleInputChange('serviceCharge', e.target.value)}
                  min="0"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => handleInputChange('notes', e.target.value)}
                placeholder="Additional notes or terms..."
              />
            </div>
          </CardContent>
        </Card>

        {/* Items */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Invoice Items</CardTitle>
              <Button type="button" onClick={addItem} variant="outline">
                <Plus className="w-4 h-4 mr-2" />
                Add Item
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {formData.items.map((item, index) => (
                <div key={index} className="p-4 border border-gray-200 rounded-lg">
                  <div className="grid grid-cols-12 gap-4 items-end">
                    <div className="col-span-3">
                      <Label htmlFor={`itemName${index}`}>Item Name *</Label>
                      <Input
                        id={`itemName${index}`}
                        value={item.name}
                        onChange={(e) => handleItemChange(index, 'name', e.target.value)}
                        required
                      />
                    </div>
                    <div className="col-span-3">
                      <Label htmlFor={`itemSpec${index}`}>Specification</Label>
                      <Input
                        id={`itemSpec${index}`}
                        value={item.specification}
                        onChange={(e) => handleItemChange(index, 'specification', e.target.value)}
                      />
                    </div>
                    <div className="col-span-2">
                      <Label htmlFor={`itemQty${index}`}>Quantity *</Label>
                      <Input
                        id={`itemQty${index}`}
                        type="number"
                        value={item.quantity}
                        onChange={(e) => handleItemChange(index, 'quantity', parseFloat(e.target.value) || 0)}
                        min="0"
                        step="0.01"
                        required
                      />
                    </div>
                    <div className="col-span-1">
                      <Label htmlFor={`itemUnit${index}`}>Unit *</Label>
                      <Input
                        id={`itemUnit${index}`}
                        value={item.unit}
                        onChange={(e) => handleItemChange(index, 'unit', e.target.value)}
                        placeholder="Pcs, M2, etc"
                        required
                      />
                    </div>
                    <div className="col-span-2">
                      <Label htmlFor={`itemPrice${index}`}>Unit Price *</Label>
                      <Input
                        id={`itemPrice${index}`}
                        type="number"
                        value={item.unitPrice}
                        onChange={(e) => handleItemChange(index, 'unitPrice', parseFloat(e.target.value) || 0)}
                        min="0"
                        required
                      />
                    </div>
                    <div className="col-span-1 flex justify-end">
                      {formData.items.length > 1 && (
                        <Button
                          type="button"
                          onClick={() => removeItem(index)}
                          variant="outline"
                          size="sm"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                  <div className="mt-2 text-right">
                    <Badge variant="secondary">
                      Total: Rp {(item.quantity * item.unitPrice).toLocaleString('id-ID')}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>

            {/* Summary */}
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>Rp {calculateSubtotal().toLocaleString('id-ID')}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax:</span>
                  <span>Rp {parseFloat(formData.tax || 0).toLocaleString('id-ID')}</span>
                </div>
                <div className="flex justify-between">
                  <span>Service Charge:</span>
                  <span>Rp {parseFloat(formData.serviceCharge || 0).toLocaleString('id-ID')}</span>
                </div>
                <hr />
                <div className="flex justify-between font-bold">
                  <span>Total:</span>
                  <span>Rp {calculateTotal().toLocaleString('id-ID')}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-4">
          <Button type="submit" disabled={loading}>
            <Save className="w-4 h-4 mr-2" />
            {loading ? 'Creating...' : 'Create Invoice'}
          </Button>
        </div>
      </form>
    </div>
  )
}
