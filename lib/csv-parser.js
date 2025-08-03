// Utility untuk parsing CSV data
export const parseCSV = (csvText) => {
  const lines = csvText.split('\n').filter(line => line.trim() !== '')
  
  if (lines.length < 2) {
    throw new Error('CSV must have at least a header row and one data row')
  }

  // Parse header
  const headers = lines[0].split(',').map(header => header.trim().replace(/"/g, ''))
  
  // Parse data rows
  const data = lines.slice(1).map((line, index) => {
    const values = parseCSVLine(line)
    
    if (values.length !== headers.length) {
      throw new Error(`Row ${index + 2} has ${values.length} values but expected ${headers.length}`)
    }
    
    const row = {}
    headers.forEach((header, i) => {
      row[header] = values[i]
    })
    
    return row
  })

  return { headers, data }
}

// Parse single CSV line handling quoted values
const parseCSVLine = (line) => {
  const values = []
  let current = ''
  let inQuotes = false
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i]
    
    if (char === '"') {
      inQuotes = !inQuotes
    } else if (char === ',' && !inQuotes) {
      values.push(current.trim())
      current = ''
    } else {
      current += char
    }
  }
  
  // Add the last value
  values.push(current.trim())
  
  return values
}

// Convert CSV data to pricing plan format
export const csvToPricingPlans = (csvData) => {
  return csvData.map((row, index) => {
    // Required fields validation
    const requiredFields = ['name', 'subtitle', 'price', 'originalPrice']
    const missingFields = requiredFields.filter(field => !row[field] || row[field].trim() === '')
    
    if (missingFields.length > 0) {
      throw new Error(`Row ${index + 2}: Missing required fields: ${missingFields.join(', ')}`)
    }

    // Parse features and limitations (pipe-separated values)
    const features = row.features ? row.features.split('|').map(f => f.trim()).filter(f => f) : []
    const limitations = row.limitations ? row.limitations.split('|').map(l => l.trim()).filter(l => l) : []

    return {
      name: row.name.trim(),
      subtitle: row.subtitle.trim(),
      price: row.price.trim(),
      originalPrice: row.originalPrice.trim(),
      discount: row.discount ? row.discount.trim() : "0%",
      description: row.description ? row.description.trim() : "",
      features,
      limitations,
      popular: row.popular ? row.popular.toLowerCase() === 'true' : false,
      color: row.color ? row.color.trim() : "blue",
      sortOrder: row.sortOrder ? parseInt(row.sortOrder) : 0,
      isActive: row.isActive ? row.isActive.toLowerCase() !== 'false' : true
    }
  })
}

// Generate CSV template
export const generateCSVTemplate = () => {
  const headers = [
    'name',
    'subtitle', 
    'price',
    'originalPrice',
    'discount',
    'description',
    'features',
    'limitations',
    'popular',
    'color',
    'sortOrder',
    'isActive'
  ]

  const sampleData = [
    {
      name: 'Basic',
      subtitle: 'Solusi Dasar Terjangkau',
      price: '15 juta',
      originalPrice: '20 juta',
      discount: '25%',
      description: 'Paket dasar untuk renovasi dapur kecil dengan kualitas standar yang baik',
      features: 'Kitchen set standar (HPL finish)|Countertop granite lokal|Sink stainless steel 1 bowl|Kran air standar|Instalasi listrik dasar|Cat tembok anti jamur|Garansi 1 tahun',
      limitations: 'Maksimal 3 meter linear|Tidak termasuk appliances|Desain template',
      popular: 'false',
      color: 'blue',
      sortOrder: '1',
      isActive: 'true'
    },
    {
      name: 'Regular',
      subtitle: 'Pilihan Terpopuler',
      price: '35 juta',
      originalPrice: '45 juta',
      discount: '22%',
      description: 'Paket lengkap dengan kualitas premium dan fitur tambahan yang optimal',
      features: 'Kitchen set custom (Polyurethane finish)|Countertop granite import/quartz|Sink stainless steel double bowl|Kran air dengan spray|Instalasi listrik + under cabinet LED|Backsplash keramik premium|Exhaust fan powerful|Cat anti jamur & mudah dibersihkan|Soft closing drawer & door|Garansi 2 tahun',
      limitations: 'Maksimal 5 meter linear|1 appliance included',
      popular: 'true',
      color: 'red',
      sortOrder: '2',
      isActive: 'true'
    }
  ]

  let csv = headers.join(',') + '\n'
  
  sampleData.forEach(row => {
    const values = headers.map(header => {
      const value = row[header] || ''
      // Wrap in quotes if contains comma or newline
      return value.includes(',') || value.includes('\n') ? `"${value}"` : value
    })
    csv += values.join(',') + '\n'
  })

  return csv
}
