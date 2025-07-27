'use client'

import { CheckCircle, Circle, ArrowRight } from 'lucide-react'

const steps = [
  { id: 1, name: 'Keranjang', description: 'Review produk' },
  { id: 2, name: 'Data Customer', description: 'Isi informasi' },
  { id: 3, name: 'Invoice', description: 'Konfirmasi & download' }
]

export default function CheckoutProgress({ currentStep = 1 }) {
  return (
    <div className="bg-white border-b border-gray-200 py-4 mb-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center">
              {/* Step Circle */}
              <div className="flex items-center">
                <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                  step.id < currentStep 
                    ? 'bg-green-600 border-green-600 text-white' 
                    : step.id === currentStep
                    ? 'bg-red-600 border-red-600 text-white'
                    : 'bg-white border-gray-300 text-gray-500'
                }`}>
                  {step.id < currentStep ? (
                    <CheckCircle className="w-6 h-6" />
                  ) : (
                    <span className="text-sm font-semibold">{step.id}</span>
                  )}
                </div>
                
                {/* Step Info */}
                <div className="ml-3">
                  <p className={`text-sm font-medium ${
                    step.id <= currentStep ? 'text-gray-900' : 'text-gray-500'
                  }`}>
                    {step.name}
                  </p>
                  <p className="text-xs text-gray-500">{step.description}</p>
                </div>
              </div>
              
              {/* Arrow */}
              {index < steps.length - 1 && (
                <ArrowRight className="w-5 h-5 text-gray-400 mx-6" />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
