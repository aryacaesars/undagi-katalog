'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function InvoicePage() {
  const router = useRouter()

  useEffect(() => {
    // Redirect to invoice list
    router.push('/invoice/list')
  }, [router])

  return (
    <div className="container mx-auto py-8">
      <div className="text-center">
        <p>Redirecting to invoice management...</p>
      </div>
    </div>
  )
}
