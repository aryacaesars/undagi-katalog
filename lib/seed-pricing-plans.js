// Utility untuk seed pricing plans data
import { prisma } from './prisma'

export const seedPricingPlans = async () => {
  try {
    // Check if pricing plans already exist
    const existingPlans = await prisma.pricingPlan.findMany()
    
    if (existingPlans.length > 0) {
      console.log('Pricing plans already exist, skipping seed')
      return existingPlans
    }

    console.log('Seeding pricing plans data...')

    const pricingPlansData = [
      {
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
        color: "blue",
        sortOrder: 1,
        isActive: true
      },
      {
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
        color: "red",
        sortOrder: 2,
        isActive: true
      },
      {
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
        color: "purple",
        sortOrder: 3,
        isActive: true
      }
    ]

    // Create pricing plans
    const createdPlans = await Promise.all(
      pricingPlansData.map(planData => 
        prisma.pricingPlan.create({
          data: planData
        })
      )
    )

    console.log(`Successfully seeded ${createdPlans.length} pricing plans`)
    return createdPlans

  } catch (error) {
    console.error('Error seeding pricing plans:', error)
    throw error
  }
}
