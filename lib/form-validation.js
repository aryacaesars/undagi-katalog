// Validation utilities for forms

export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export const validatePhone = (phone) => {
  // Remove all non-digit characters except + and -
  const cleanPhone = phone.replace(/[^\d+\-\s()]/g, '')
  // Must contain at least 8 digits
  const digitCount = cleanPhone.replace(/[^\d]/g, '').length
  return digitCount >= 8 && digitCount <= 15
}

export const validateRequired = (value) => {
  return value && value.toString().trim().length > 0
}

export const validateCustomerForm = (data) => {
  const errors = {}

  // Required fields validation
  if (!validateRequired(data.name)) {
    errors.name = 'Nama lengkap wajib diisi'
  }

  if (!validateRequired(data.email)) {
    errors.email = 'Email wajib diisi'
  } else if (!validateEmail(data.email)) {
    errors.email = 'Format email tidak valid'
  }

  if (!validateRequired(data.phone)) {
    errors.phone = 'Nomor telepon wajib diisi'
  } else if (!validatePhone(data.phone)) {
    errors.phone = 'Format nomor telepon tidak valid (8-15 digit)'
  }

  if (!validateRequired(data.address)) {
    errors.address = 'Alamat wajib diisi'
  }

  if (!validateRequired(data.city)) {
    errors.city = 'Kota wajib diisi'
  }

  // Optional field validations
  if (data.postalCode && !/^\d{5}$/.test(data.postalCode)) {
    errors.postalCode = 'Kode pos harus 5 digit angka'
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  }
}

export const formatPhoneNumber = (phone) => {
  // Remove all non-digit characters except +
  let cleaned = phone.replace(/[^\d+]/g, '')
  
  // If starts with 0, replace with +62
  if (cleaned.startsWith('0')) {
    cleaned = '+62' + cleaned.substring(1)
  }
  
  // If doesn't start with +, add +62
  if (!cleaned.startsWith('+')) {
    cleaned = '+62' + cleaned
  }
  
  return cleaned
}

export const sanitizeInput = (input, maxLength = 255) => {
  if (!input) return ''
  
  return input
    .toString()
    .trim()
    .substring(0, maxLength)
    .replace(/[<>]/g, '') // Remove potential HTML tags
}

export const validateAndSanitizeCustomerData = (rawData) => {
  // Sanitize all inputs
  const sanitizedData = {
    name: sanitizeInput(rawData.name, 100),
    email: sanitizeInput(rawData.email, 100).toLowerCase(),
    phone: formatPhoneNumber(sanitizeInput(rawData.phone, 20)),
    company: sanitizeInput(rawData.company, 100),
    address: sanitizeInput(rawData.address, 300),
    city: sanitizeInput(rawData.city, 50),
    postalCode: sanitizeInput(rawData.postalCode, 10),
    notes: sanitizeInput(rawData.notes, 500)
  }

  // Validate
  const validation = validateCustomerForm(sanitizedData)

  return {
    data: sanitizedData,
    ...validation
  }
}
