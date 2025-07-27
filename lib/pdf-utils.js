// PDF utility functions untuk invoice generation

export const downloadInvoiceAsPDF = (invoiceData) => {
  // Untuk sekarang menggunakan browser print function
  // Nanti bisa dikembangkan dengan library PDF generation yang lebih advanced
  
  // Set document title untuk PDF filename
  const originalTitle = document.title
  document.title = `Invoice-${invoiceData.invoiceNumber}`
  
  // Trigger print dialog
  window.print()
  
  // Restore original title
  setTimeout(() => {
    document.title = originalTitle
  }, 1000)
}

export const generatePDFWithLibrary = async (invoiceData) => {
  // Placeholder untuk future implementation dengan library seperti:
  // - jsPDF
  // - react-pdf
  // - puppeteer
  
  console.log('PDF generation with library - to be implemented')
  console.log('Invoice data:', invoiceData)
  
  // Return promise untuk consistency
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        filename: `Invoice-${invoiceData.invoiceNumber}.pdf`
      })
    }, 1000)
  })
}

export const formatInvoiceForPrint = () => {
  // Add print-specific styles
  const printStyles = `
    @media print {
      @page {
        margin: 0.3in;
        size: A4;
      }
      
      body {
        -webkit-print-color-adjust: exact;
        print-color-adjust: exact;
        font-size: 11px;
        line-height: 1.3;
      }
      
      .no-print {
        display: none !important;
      }
      
      .print-break {
        page-break-before: always;
      }
      
      .print-avoid-break {
        page-break-inside: avoid;
      }
      
      .print-container {
        padding: 0 !important;
        margin: 0 !important;
        background: white !important;
        box-shadow: none !important;
        border: none !important;
        height: fit-content !important;
      }
      
      table {
        border-collapse: collapse;
        width: 100%;
        font-size: 10px;
      }
      
      th, td {
        border: 1px solid #000;
        padding: 4px;
        text-align: left;
      }
      
      .text-red-600 {
        color: #dc2626 !important;
      }
      
      .bg-red-50 {
        background-color: #fef2f2 !important;
      }
      
      .bg-gray-50 {
        background-color: #f9fafb !important;
      }
      
      /* Compress spacing for single page */
      .mb-6 {
        margin-bottom: 0.5rem !important;
      }
      
      .mb-4 {
        margin-bottom: 0.3rem !important;
      }
      
      .mt-8, .mt-6, .mt-4 {
        margin-top: 0.3rem !important;
      }
      
      .pt-6, .pt-4, .pt-3 {
        padding-top: 0.2rem !important;
      }
      
      .pb-6, .pb-4, .pb-3 {
        padding-bottom: 0.2rem !important;
      }
      
      .p-8 {
        padding: 0.5rem !important;
      }
      
      .p-6 {
        padding: 0.4rem !important;
      }
      
      .p-4 {
        padding: 0.3rem !important;
      }
      
      .p-3 {
        padding: 0.2rem !important;
      }
      
      h1 {
        font-size: 18px !important;
        margin-bottom: 0.2rem !important;
      }
      
      h2 {
        font-size: 16px !important;
        margin-bottom: 0.2rem !important;
      }
      
      h3 {
        font-size: 14px !important;
        margin-bottom: 0.2rem !important;
      }
      
      h4 {
        font-size: 12px !important;
        margin-bottom: 0.1rem !important;
      }
      
      /* Hide footer in print */
      .print-footer {
        display: none !important;
      }
      
      /* Hide elements with no-print class */
      .no-print {
        display: none !important;
        visibility: hidden !important;
        height: 0 !important;
        width: 0 !important;
        margin: 0 !important;
        padding: 0 !important;
      }
      
      /* Ensure footer elements are hidden */
      .border-t.border-gray-200.text-center,
      div[class*="mt-8"][class*="pt-6"][class*="border-t"] {
        display: none !important;
      }
    }
  `
  
  // Add styles to document if not already present
  if (!document.getElementById('invoice-print-styles')) {
    const styleSheet = document.createElement('style')
    styleSheet.id = 'invoice-print-styles'
    styleSheet.textContent = printStyles
    document.head.appendChild(styleSheet)
  }
}
