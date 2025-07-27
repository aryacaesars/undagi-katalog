'use client'

import { useState, useCallback } from 'react'

export const useInvoice = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const generateInvoice = useCallback(async (cartItems, getTotalPrice) => {
    setLoading(true)
    setError(null)

    try {
      const orderId = `INV-${Date.now()}`
      const currentDate = new Date()
      
      const subtotal = getTotalPrice()
      const tax = subtotal * 0.11 // 11% PPN
      const serviceCharge = 12737500 // Service Charge
      const total = subtotal + tax + serviceCharge

      const invoice = {
        invoiceNumber: orderId,
        date: currentDate,
        dueDate: new Date(currentDate.getTime() + (30 * 24 * 60 * 60 * 1000)), // 30 days from now
        
        // Company Info
        company: {
          name: 'UNDAGI',
          address: 'Jl. Raya No. 123, Jakarta Selatan 12345',
          phone: '+62 21 1234 5678',
          email: 'info@undagi.com',
          website: 'www.undagi.com'
        },
        
        // Customer Info (could be dynamic later)
        customer: {
          name: 'Customer',
          address: 'Alamat Customer',
          phone: '-',
          email: '-'
        },
        
        // Items
        items: cartItems.map(item => ({
          id: item.id,
          name: item.namaBarang,
          specification: item.spesifikasi,
          quantity: item.quantity,
          unit: item.satuan,
          unitPrice: item.hargaSatuan,
          total: item.jumlah ? (item.jumlah * item.quantity) : (item.hargaSatuan * item.quantity)
        })),
        
        // Totals
        subtotal,
        tax,
        serviceCharge,
        total
      }

      // Optional: Save to API
      const response = await fetch('/api/invoices', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(invoice),
      })

      if (!response.ok) {
        throw new Error('Gagal menyimpan invoice')
      }

      setLoading(false)
      return invoice
    } catch (err) {
      setError(err.message)
      setLoading(false)
      throw err
    }
  }, [])

  const getInvoice = useCallback(async (invoiceId) => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch(`/api/invoices/${invoiceId}`)
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Gagal mengambil invoice')
      }

      setLoading(false)
      return data.data
    } catch (err) {
      setError(err.message)
      setLoading(false)
      throw err
    }
  }, [])

  const downloadInvoice = useCallback((invoiceData) => {
    // Set document title untuk PDF filename
    const originalTitle = document.title
    document.title = `Invoice-${invoiceData.invoiceNumber}`
    
    // Trigger print dialog
    window.print()
    
    // Restore original title
    setTimeout(() => {
      document.title = originalTitle
    }, 1000)
  }, [])

  return {
    loading,
    error,
    generateInvoice,
    getInvoice,
    downloadInvoice
  }
}
