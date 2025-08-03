"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Check, Star, ArrowRight, Phone, Loader2 } from "lucide-react"

const formatCurrency = (amount) => {
  return `Rp ${amount}`
}

export default function PricingPlans() {
  const [pricingPlans, setPricingPlans] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Fallback data jika API gagal
  const fallbackPlans = [
    {
      id: "basic",
      name: "Basic",
      subtitle: "Solusi Dasar Terjangkau",
      price: "15 juta",
      originalPrice: "20 juta",
      discount: "25%",
      description: "Paket dasar untuk renovasi dapur kecil dengan kualitas standar yang baik",
      features: [
        "Kitchen set standar (HPL finish)",
        "Countertop granite lokal",
        "Sink stainless steel 1 bowl",
        "Kran air standar",
        "Instalasi listrik dasar",
        "Cat tembok anti jamur",
        "Garansi 1 tahun"
      ],
      limitations: [
        "Maksimal 3 meter linear",
        "Tidak termasuk appliances",
        "Desain template"
      ],
      popular: false,
      color: "blue"
    },
    {
      id: "regular",
      name: "Regular",
      subtitle: "Pilihan Terpopuler",
      price: "35 juta",
      originalPrice: "45 juta",
      discount: "22%",
      description: "Paket lengkap dengan kualitas premium dan fitur tambahan yang optimal",
      features: [
        "Kitchen set custom (Polyurethane finish)",
        "Countertop granite import/quartz",
        "Sink stainless steel double bowl",
        "Kran air dengan spray",
        "Instalasi listrik + under cabinet LED",
        "Backsplash keramik premium",
        "Exhaust fan powerful",
        "Cat anti jamur & mudah dibersihkan",
        "Soft closing drawer & door",
        "Garansi 2 tahun"
      ],
      limitations: [
        "Maksimal 5 meter linear",
        "1 appliance included"
      ],
      popular: true,
      color: "red"
    },
    {
      id: "premium",
      name: "Premium",
      subtitle: "Luxury & Exclusive",
      price: "65 juta",
      originalPrice: "85 juta",
      discount: "24%",
      description: "Paket premium dengan material terbaik dan desain eksklusif sesuai keinginan",
      features: [
        "Kitchen set full custom (Lacquer finish)",
        "Countertop marble/engineered stone",
        "Sink granite/ceramic premium",
        "Kran pull-out dengan filter",
        "Smart lighting system",
        "Backsplash natural stone/mosaic",
        "Range hood stainless steel",
        "Kitchen island (opsional)",
        "Built-in appliances premium",
        "Soft close full extension",
        "Smart storage solutions",
        "Konsultasi desainer",
        "Garansi 3 tahun"
      ],
      limitations: [],
      popular: false,
      color: "purple"
    }
  ]

  // Fetch pricing plans from API
  useEffect(() => {
    const fetchPricingPlans = async () => {
      try {
        const response = await fetch('/api/pricing-plans')
        const data = await response.json()
        
        if (data.success && data.data.length > 0) {
          setPricingPlans(data.data)
        } else {
          // Use fallback data if no plans in database
          setPricingPlans(fallbackPlans)
        }
      } catch (error) {
        console.error('Error fetching pricing plans:', error)
        setError('Failed to load pricing plans')
        // Use fallback data on error
        setPricingPlans(fallbackPlans)
      } finally {
        setLoading(false)
      }
    }

    fetchPricingPlans()
  }, [])

  const handleContactWhatsApp = (planName) => {
    const message = `Halo, saya tertarik dengan paket ${planName} dari UNDAGI. Bisakah saya mendapatkan informasi lebih lanjut?`
    const whatsappUrl = `https://wa.me/6281234567890?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, '_blank')
  }

  if (loading) {
    return (
      <section className="py-16 bg-gradient-to-br from-gray-50 to-white">
        <div className="container mx-auto px-4">
          <div className="flex justify-center items-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            <span className="ml-2 text-gray-600">Loading pricing plans...</span>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-16 bg-gradient-to-br from-gray-50 to-white">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <Badge variant="outline" className="mb-4 px-4 py-2">
            Paket Bundling Terbaik
          </Badge>
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Pilih Paket Renovasi Dapur
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Kami menyediakan 3 paket unggulan yang disesuaikan dengan kebutuhan dan budget Anda. 
            Semua paket sudah termasuk material, instalasi, dan garansi resmi.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {pricingPlans.map((plan) => (
            <Card 
              key={plan.id}
              className={`relative overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 ${
                plan.popular 
                  ? 'ring-2 ring-red-500 shadow-xl scale-105' 
                  : 'hover:shadow-lg'
              }`}
            >
              {plan.popular && (
                <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-red-500 to-red-600 text-white text-center py-2 text-sm font-semibold">
                  <Star className="inline w-4 h-4 mr-1" />
                  PALING POPULER
                </div>
              )}

              <CardHeader className={`text-center ${plan.popular ? 'pt-12' : 'pt-6'}`}>
                <div className="mb-4">
                  <Badge 
                    variant="secondary" 
                    className={`text-${plan.color}-600 bg-${plan.color}-50 border-${plan.color}-200`}
                  >
                    {plan.discount} OFF
                  </Badge>
                </div>
                
                <CardTitle className="text-2xl font-bold text-gray-900 mb-2">
                  {plan.name}
                </CardTitle>
                
                <p className={`text-sm font-medium text-${plan.color}-600 mb-3`}>
                  {plan.subtitle}
                </p>

                <div className="mb-4">
                  <div className="flex items-center justify-center gap-2 mb-1">
                    <span className="text-3xl font-bold text-gray-900">
                      {formatCurrency(plan.price)}
                    </span>
                  </div>
                  <div className="flex items-center justify-center gap-2">
                    <span className="text-lg text-gray-500 line-through">
                      {formatCurrency(plan.originalPrice)}
                    </span>
                    <Badge variant="destructive" className="text-xs">
                      Hemat {plan.discount}
                    </Badge>
                  </div>
                </div>

                <p className="text-sm text-gray-600">
                  {plan.description}
                </p>
              </CardHeader>

              <CardContent className="pt-0">
                {/* Features */}
                <div className="mb-6">
                  <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-500" />
                    Yang Termasuk:
                  </h4>
                  <ul className="space-y-2">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm">
                        <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Limitations */}
                {plan.limitations.length > 0 && (
                  <div className="mb-6">
                    <h4 className="font-semibold text-gray-900 mb-3">
                      Keterbatasan:
                    </h4>
                    <ul className="space-y-1">
                      {plan.limitations.map((limitation, index) => (
                        <li key={index} className="text-sm text-gray-500">
                          • {limitation}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* CTA Buttons */}
                <div className="space-y-3">
                  <Button 
                    className={`w-full ${
                      plan.popular 
                        ? 'bg-red-600 hover:bg-red-700' 
                        : `bg-${plan.color}-600 hover:bg-${plan.color}-700`
                    } text-white font-semibold py-3`}
                    onClick={() => handleContactWhatsApp(plan.name)}
                  >
                    <Phone className="w-4 h-4 mr-2" />
                    Konsultasi Gratis
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    className="w-full border-gray-300 text-gray-700 hover:bg-gray-50"
                  >
                    Lihat Detail
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-12">
          <div className="bg-gradient-to-r from-red-50 to-orange-50 rounded-2xl p-8 max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Tidak Yakin Pilih Paket Mana?
            </h3>
            <p className="text-gray-600 mb-6">
              Tim ahli kami siap membantu Anda memilih paket yang tepat sesuai kebutuhan dan budget. 
              Konsultasi gratis tanpa komitmen!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="bg-red-600 hover:bg-red-700 text-white px-8"
                onClick={() => handleContactWhatsApp("konsultasi")}
              >
                <Phone className="w-5 h-5 mr-2" />
                Konsultasi Gratis Sekarang
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="border-red-300 text-red-700 hover:bg-red-50"
              >
                Download Katalog Lengkap
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
