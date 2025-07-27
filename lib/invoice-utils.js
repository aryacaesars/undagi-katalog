// Invoice utility functions

// Generate sequential invoice number
export const generateInvoiceNumber = () => {
  // Get stored invoice counter from localStorage
  const storedCounter = localStorage.getItem('invoiceCounter')
  let counter = storedCounter ? parseInt(storedCounter) : 1
  
  // Format: INV-GBU-{padded number}
  const invoiceNumber = `INV-GBU-${counter.toString().padStart(5, '0')}`
  
  // Increment and store counter for next invoice
  localStorage.setItem('invoiceCounter', (counter + 1).toString())
  
  return invoiceNumber
}

// Reset invoice counter (for admin use)
export const resetInvoiceCounter = (startNumber = 1) => {
  localStorage.setItem('invoiceCounter', startNumber.toString())
}

// Get current invoice counter
export const getCurrentInvoiceCounter = () => {
  const storedCounter = localStorage.getItem('invoiceCounter')
  return storedCounter ? parseInt(storedCounter) : 1
}

// Set invoice counter to specific number
export const setInvoiceCounter = (number) => {
  localStorage.setItem('invoiceCounter', number.toString())
}

// Get company data from localStorage (for admin customization)
export const getCompanyData = () => {
  const storedData = localStorage.getItem('companyData')
  
  // Default company data
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

// Save company data to localStorage
export const saveCompanyData = (companyData) => {
  localStorage.setItem('companyData', JSON.stringify(companyData))
}
