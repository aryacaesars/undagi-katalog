// Invoice utility functions

// Get current invoice counter from database
export const getCurrentInvoiceCounter = async () => {
  try {
    const response = await fetch('/api/invoices/last-number')
    const result = await response.json()
    
    if (result.success && result.lastNumber) {
      const lastNumber = parseInt(result.lastNumber.split('-')[1]) || 0
      return lastNumber
    } else {
      return 0
    }
  } catch (error) {
    console.error('Error getting current invoice counter:', error)
    return 0
  }
}

// Update invoice counter in database (this happens automatically when creating invoices)
export const updateInvoiceCounter = async (newCounter) => {
  // This function is not needed as invoice counter is auto-incremented
  // when creating new invoices in the database
  return newCounter
}

// Generate sequential invoice number from database
export const generateInvoiceNumber = async () => {
  try {
    // Get the last invoice number from database
    const response = await fetch('/api/invoices/last-number')
    const result = await response.json()
    
    if (result.success && result.lastNumber) {
      const lastNumber = parseInt(result.lastNumber.split('-')[1]) || 0
      const newNumber = lastNumber + 1
      return `INV-${newNumber.toString().padStart(6, '0')}`
    } else {
      // First invoice
      return 'INV-000001'
    }
  } catch (error) {
    console.error('Error generating invoice number:', error)
    // Fallback to timestamp-based number
    return `INV-${Date.now().toString().slice(-6)}`
  }
}

// Get company data from database
export const getCompanyData = async () => {
  try {
    const response = await fetch('/api/companies?limit=1')
    const result = await response.json()
    
    if (result.success && result.data && result.data.length > 0) {
      // Return the first (default) company
      return result.data[0]
    } else {
      // Return default data if no company found
      return {
        name: 'UNDAGI',
        address: 'Jl. Raya No. 123, Jakarta Selatan 12345',
        phone: '+62 21 1234 5678',
        email: 'info@undagi.com',
        website: 'www.undagi.com',
        logo: '/Logo.svg'
      }
    }
  } catch (error) {
    console.error('Error fetching company data:', error)
    // Return default data on error
    return {
      name: 'UNDAGI',
      address: 'Jl. Raya No. 123, Jakarta Selatan 12345',
      phone: '+62 21 1234 5678',
      email: 'info@undagi.com',
      website: 'www.undagi.com',
      logo: '/Logo.svg'
    }
  }
}

// Save company data to database
export const saveCompanyData = async (companyData) => {
  try {
    // Check if company already exists
    const existingResponse = await fetch('/api/companies?limit=1')
    const existingResult = await existingResponse.json()
    
    let response
    if (existingResult.success && existingResult.data && existingResult.data.length > 0) {
      // Update existing company
      const companyId = existingResult.data[0].id
      response = await fetch(`/api/companies/${companyId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(companyData)
      })
    } else {
      // Create new company
      response = await fetch('/api/companies', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...companyData,
          isDefault: true
        })
      })
    }
    
    const result = await response.json()
    if (result.success) {
      return result.data
    } else {
      throw new Error(result.error || 'Failed to save company data')
    }
  } catch (error) {
    console.error('Error saving company data:', error)
    throw error
  }
}

// Get customer by email or create new one
export const getOrCreateCustomer = async (customerData) => {
  try {
    // First, try to find existing customer by email
    const searchResponse = await fetch(`/api/customers?search=${encodeURIComponent(customerData.email)}`)
    const searchResult = await searchResponse.json()
    
    if (searchResult.success && searchResult.data && searchResult.data.length > 0) {
      // Customer exists, return the first match
      return searchResult.data[0]
    } else {
      // Customer doesn't exist, create new one
      const createResponse = await fetch('/api/customers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(customerData)
      })
      
      const createResult = await createResponse.json()
      if (createResult.success) {
        return createResult.data
      } else {
        throw new Error(createResult.error || 'Failed to create customer')
      }
    }
  } catch (error) {
    console.error('Error getting or creating customer:', error)
    throw error
  }
}

// Create invoice with database
export const createInvoiceInDatabase = async (invoiceData) => {
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
      return result.data
    } else {
      throw new Error(result.error || 'Failed to create invoice')
    }
  } catch (error) {
    console.error('Error creating invoice:', error)
    throw error
  }
}

// Legacy functions for localStorage fallback (deprecated)
export const getInvoiceCounter = () => {
  const storedCounter = localStorage.getItem('invoiceCounter')
  return storedCounter ? parseInt(storedCounter) : 1
}

export const setInvoiceCounter = (counter) => {
  localStorage.setItem('invoiceCounter', counter.toString())
  return counter
}

export const generateInvoiceNumberLocal = () => {
  const storedCounter = localStorage.getItem('invoiceCounter')
  let counter = storedCounter ? parseInt(storedCounter) : 1
  
  const invoiceNumber = `INV-GBU-${counter.toString().padStart(5, '0')}`
  localStorage.setItem('invoiceCounter', (counter + 1).toString())
  
  return invoiceNumber
}

export const getCompanyDataLocal = () => {
  const storedData = localStorage.getItem('companyData')
  
  const defaultData = {
    name: 'UNDAGI',
    address: 'Jl. Raya No. 123, Jakarta Selatan 12345',
    phone: '+62 21 1234 5678',
    email: 'info@undagi.com',
    website: 'www.undagi.com',
    logo: '/Logo.svg'
  }
  
  return storedData ? { ...defaultData, ...JSON.parse(storedData) } : defaultData
}

export const saveCompanyDataLocal = (companyData) => {
  localStorage.setItem('companyData', JSON.stringify(companyData))
}
