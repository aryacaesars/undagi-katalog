'use client'

import { useState, useEffect, useCallback } from 'react'

// Custom hook untuk mengelola invoice data
export function useInvoice(invoiceId = null) {
  const [invoice, setInvoice] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // Fetch single invoice
  const fetchInvoice = async (id) => {
    if (!id) return

    setLoading(true)
    setError(null)
    
    try {
      const response = await fetch(`/api/invoices/${id}`)
      const result = await response.json()
      
      if (result.success) {
        setInvoice(result.data)
      } else {
        setError(result.error || 'Failed to fetch invoice')
      }
    } catch (err) {
      setError('Network error occurred')
      console.error('Error fetching invoice:', err)
    } finally {
      setLoading(false)
    }
  }

  // Create new invoice
  const createInvoice = async (invoiceData) => {
    setLoading(true)
    setError(null)
    
    try {
      const response = await fetch('/api/invoices', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(invoiceData)
      })
      
      const result = await response.json()
      
      if (result.success) {
        setInvoice(result.data)
        return result.data
      } else {
        setError(result.error || 'Failed to create invoice')
        return null
      }
    } catch (err) {
      setError('Network error occurred')
      console.error('Error creating invoice:', err)
      return null
    } finally {
      setLoading(false)
    }
  }

  // Update invoice
  const updateInvoice = async (id, updateData) => {
    setLoading(true)
    setError(null)
    
    try {
      const response = await fetch(`/api/invoices/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData)
      })
      
      const result = await response.json()
      
      if (result.success) {
        setInvoice(result.data)
        return result.data
      } else {
        setError(result.error || 'Failed to update invoice')
        return null
      }
    } catch (err) {
      setError('Network error occurred')
      console.error('Error updating invoice:', err)
      return null
    } finally {
      setLoading(false)
    }
  }

  // Delete invoice
  const deleteInvoice = async (id) => {
    setLoading(true)
    setError(null)
    
    try {
      const response = await fetch(`/api/invoices/${id}`, {
        method: 'DELETE'
      })
      
      const result = await response.json()
      
      if (result.success) {
        setInvoice(null)
        return true
      } else {
        setError(result.error || 'Failed to delete invoice')
        return false
      }
    } catch (err) {
      setError('Network error occurred')
      console.error('Error deleting invoice:', err)
      return false
    } finally {
      setLoading(false)
    }
  }

  // Legacy function for cart integration
  const generateInvoice = useCallback(async (cartItems, getTotalPrice) => {
    setLoading(true)
    setError(null)

    try {
      // Get default company (should be created first)
      const companiesResponse = await fetch('/api/companies?limit=1')
      const companiesResult = await companiesResponse.json()
      
      if (!companiesResult.success || companiesResult.data.length === 0) {
        throw new Error('No company found. Please create a company first.')
      }

      const company = companiesResult.data[0]
      
      // Create a default customer for cart orders
      const customerData = {
        name: 'Customer',
        address: 'Alamat Customer',
        phone: '-',
        email: 'customer@example.com'
      }

      const customerResponse = await fetch('/api/customers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(customerData)
      })

      const customerResult = await customerResponse.json()
      if (!customerResult.success) {
        throw new Error('Failed to create customer')
      }

      const subtotal = getTotalPrice()
      const tax = subtotal * 0.11 // 11% PPN
      const serviceCharge = 12737500 // Service Charge

      const invoiceData = {
        companyId: company.id,
        customerId: customerResult.data.id,
        dueDate: new Date(Date.now() + (30 * 24 * 60 * 60 * 1000)), // 30 days from now
        tax,
        serviceCharge,
        items: cartItems.map(item => ({
          name: item.namaBarang,
          specification: item.spesifikasi,
          quantity: item.quantity,
          unit: item.satuan,
          unitPrice: item.hargaSatuan
        }))
      }

      return await createInvoice(invoiceData)
    } catch (err) {
      setError(err.message)
      console.error('Error generating invoice:', err)
      return null
    }
  }, [createInvoice])

  useEffect(() => {
    if (invoiceId) {
      fetchInvoice(invoiceId)
    }
  }, [invoiceId])

  return {
    invoice,
    loading,
    error,
    fetchInvoice,
    createInvoice,
    updateInvoice,
    deleteInvoice,
    generateInvoice, // Legacy support
    setError
  }
}

// Custom hook untuk mengelola list invoice
export function useInvoices() {
  const [invoices, setInvoices] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0
  })

  // Fetch invoices list
  const fetchInvoices = async (params = {}) => {
    setLoading(true)
    setError(null)
    
    try {
      const searchParams = new URLSearchParams({
        page: params.page || 1,
        limit: params.limit || 10,
        ...(params.status && { status: params.status }),
        ...(params.search && { search: params.search })
      })

      const response = await fetch(`/api/invoices?${searchParams}`)
      const result = await response.json()
      
      if (result.success) {
        setInvoices(result.data)
        setPagination(result.pagination)
      } else {
        setError(result.error || 'Failed to fetch invoices')
      }
    } catch (err) {
      setError('Network error occurred')
      console.error('Error fetching invoices:', err)
    } finally {
      setLoading(false)
    }
  }

  return {
    invoices,
    loading,
    error,
    pagination,
    fetchInvoices,
    setError
  }
}

// Custom hook untuk mengelola companies
export function useCompanies() {
  const [companies, setCompanies] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const fetchCompanies = async (params = {}) => {
    setLoading(true)
    setError(null)
    
    try {
      const searchParams = new URLSearchParams({
        page: params.page || 1,
        limit: params.limit || 50,
        ...(params.search && { search: params.search })
      })

      const response = await fetch(`/api/companies?${searchParams}`)
      const result = await response.json()
      
      if (result.success) {
        setCompanies(result.data)
      } else {
        setError(result.error || 'Failed to fetch companies')
      }
    } catch (err) {
      setError('Network error occurred')
      console.error('Error fetching companies:', err)
    } finally {
      setLoading(false)
    }
  }

  const createCompany = async (companyData) => {
    setLoading(true)
    setError(null)
    
    try {
      const response = await fetch('/api/companies', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(companyData)
      })
      
      const result = await response.json()
      
      if (result.success) {
        setCompanies(prev => [result.data, ...prev])
        return result.data
      } else {
        setError(result.error || 'Failed to create company')
        return null
      }
    } catch (err) {
      setError('Network error occurred')
      console.error('Error creating company:', err)
      return null
    } finally {
      setLoading(false)
    }
  }

  return {
    companies,
    loading,
    error,
    fetchCompanies,
    createCompany,
    setError
  }
}

// Custom hook untuk mengelola customers
export function useCustomers() {
  const [customers, setCustomers] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const fetchCustomers = async (params = {}) => {
    setLoading(true)
    setError(null)
    
    try {
      const searchParams = new URLSearchParams({
        page: params.page || 1,
        limit: params.limit || 50,
        ...(params.search && { search: params.search })
      })

      const response = await fetch(`/api/customers?${searchParams}`)
      const result = await response.json()
      
      if (result.success) {
        setCustomers(result.data)
      } else {
        setError(result.error || 'Failed to fetch customers')
      }
    } catch (err) {
      setError('Network error occurred')
      console.error('Error fetching customers:', err)
    } finally {
      setLoading(false)
    }
  }

  const createCustomer = async (customerData) => {
    setLoading(true)
    setError(null)
    
    try {
      const response = await fetch('/api/customers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(customerData)
      })
      
      const result = await response.json()
      
      if (result.success) {
        setCustomers(prev => [result.data, ...prev])
        return result.data
      } else {
        setError(result.error || 'Failed to create customer')
        return null
      }
    } catch (err) {
      setError('Network error occurred')
      console.error('Error creating customer:', err)
      return null
    } finally {
      setLoading(false)
    }
  }

  return {
    customers,
    loading,
    error,
    fetchCustomers,
    createCustomer,
    setError
  }
}
