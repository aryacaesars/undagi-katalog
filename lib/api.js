// API utility functions for dashboard integration
import { useState } from 'react'

const API_BASE = '/api'

// Banner API functions
export const bannerApi = {
  // Get all banners
  getAll: async (activeOnly = false) => {
    const url = activeOnly ? `${API_BASE}/banners?active=true` : `${API_BASE}/banners`
    const response = await fetch(url)
    const result = await response.json()
    if (!result.success) throw new Error(result.error)
    return result.data
  },

  // Get banner by ID
  getById: async (id) => {
    const response = await fetch(`${API_BASE}/banners/${id}`)
    const result = await response.json()
    if (!result.success) throw new Error(result.error)
    return result.data
  },

  // Create banner
  create: async (bannerData) => {
    const response = await fetch(`${API_BASE}/banners`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(bannerData),
    })
    const result = await response.json()
    if (!result.success) throw new Error(result.error)
    return result.data
  },

  // Update banner
  update: async (id, bannerData) => {
    const response = await fetch(`${API_BASE}/banners/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(bannerData),
    })
    const result = await response.json()
    if (!result.success) throw new Error(result.error)
    return result.data
  },

  // Delete banner
  delete: async (id) => {
    const response = await fetch(`${API_BASE}/banners/${id}`, {
      method: 'DELETE',
    })
    const result = await response.json()
    if (!result.success) throw new Error(result.error)
    return result
  }
}

// Catalogue API functions
export const catalogueApi = {
  // Get all catalogues
  getAll: async (options = {}) => {
    const params = new URLSearchParams()
    if (options.jenis) params.append('jenis', options.jenis)
    if (options.search) params.append('search', options.search)
    if (options.page) params.append('page', options.page)
    if (options.limit) params.append('limit', options.limit)

    const url = `${API_BASE}/catalogues${params.toString() ? '?' + params.toString() : ''}`
    const response = await fetch(url)
    const result = await response.json()
    if (!result.success) throw new Error(result.error)
    return result
  },

  // Get all catalogues without pagination limit (for dashboard)
  getAllForDashboard: async () => {
    const params = new URLSearchParams()
    params.append('limit', '10000') // Set limit yang sangat besar untuk mengambil semua data
    
    const url = `${API_BASE}/catalogues?${params.toString()}`
    const response = await fetch(url)
    const result = await response.json()
    if (!result.success) throw new Error(result.error)
    return result
  },

  // Get all catalogues for frontend catalog display
  getAllForCatalog: async () => {
    const params = new URLSearchParams()
    params.append('limit', '10000') // Set limit yang sangat besar untuk mengambil semua data
    
    const url = `${API_BASE}/catalogues?${params.toString()}`
    const response = await fetch(url)
    const result = await response.json()
    if (!result.success) throw new Error(result.error)
    return result
  },

  // Get catalogue by ID
  getById: async (id) => {
    const response = await fetch(`${API_BASE}/catalogues/${id}`)
    const result = await response.json()
    if (!result.success) throw new Error(result.error)
    return result.data
  },

  // Create catalogue
  create: async (catalogueData) => {
    const response = await fetch(`${API_BASE}/catalogues`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(catalogueData),
    })
    const result = await response.json()
    if (!result.success) throw new Error(result.error)
    return result.data
  },

  // Update catalogue
  update: async (id, catalogueData) => {
    const response = await fetch(`${API_BASE}/catalogues/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(catalogueData),
    })
    const result = await response.json()
    if (!result.success) throw new Error(result.error)
    return result.data
  },

  // Delete catalogue
  delete: async (id) => {
    const response = await fetch(`${API_BASE}/catalogues/${id}`, {
      method: 'DELETE',
    })
    const result = await response.json()
    if (!result.success) throw new Error(result.error)
    return result
  },

  // Bulk import catalogues
  bulkImport: async (catalogues) => {
    const response = await fetch(`${API_BASE}/catalogues/bulk`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ catalogues }),
    })
    const result = await response.json()
    if (!result.success) throw new Error(result.error)
    return result
  },

  // Bulk delete catalogues
  bulkDelete: async (ids) => {
    const response = await fetch(`${API_BASE}/catalogues/bulk`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ ids }),
    })
    const result = await response.json()
    if (!result.success) throw new Error(result.error)
    return result
  }
}

// Error handling utility
export const handleApiError = (error) => {
  console.error('API Error:', error)
  
  if (error.message) {
    return error.message
  }
  
  return 'Terjadi kesalahan pada server'
}

// Loading state hook
export const useApiState = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const executeApi = async (apiCall) => {
    setLoading(true)
    setError(null)
    
    try {
      const result = await apiCall()
      return result
    } catch (err) {
      const errorMessage = handleApiError(err)
      setError(errorMessage)
      throw err
    } finally {
      setLoading(false)
    }
  }

  return { loading, error, executeApi }
}
