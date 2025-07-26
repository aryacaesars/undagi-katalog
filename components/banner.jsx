"use client"

import { useState, useEffect } from "react"
import { 
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Star, ArrowRight, Phone, Mail, MapPin } from "lucide-react"
import { bannerApi } from "@/lib/api"

export default function KitchenRenovationBanner() {
  const [api, setApi] = useState()
  const [current, setCurrent] = useState(0)
  const [count, setCount] = useState(0)
  const [renovationServices, setRenovationServices] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Fallback data jika backend tidak tersedia
  const fallbackServices = [
    {
      id: 1,
      title: "Renovasi Dapur Modern",
      subtitle: "Desain Contemporary & Minimalis",
      description: "Transformasi dapur Anda dengan desain modern yang menggabungkan fungsi dan estetika terkini",
      image: "https://images.unsplash.com/photo-1556912167-f556f1f39fdf?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80",
      price: "Mulai dari Rp 25 juta",
      rating: 4.9,
      features: ["Kitchen Set Custom", "Granite Countertop", "Built-in Appliances", "LED Lighting"],
      badge: "Paling Populer"
    },
    {
      id: 2,
      title: "Renovasi Dapur Klasik",
      subtitle: "Elegant & Timeless Design",
      description: "Ciptakan suasana hangat dan elegan dengan sentuhan klasik yang tak lekang waktu",
      image: "https://images.unsplash.com/photo-1565538810643-b5bdb714032a?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80",
      price: "Mulai dari Rp 30 juta",
      rating: 4.8,
      features: ["Solid Wood Cabinet", "Marble Countertop", "Vintage Hardware", "Crown Molding"],
      badge: "Premium"
    },
    {
      id: 3,
      title: "Renovasi Dapur Kompak",
      subtitle: "Solusi untuk Ruang Terbatas",
      description: "Maksimalkan fungsi dapur kecil dengan desain cerdas dan storage yang optimal",
      image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80",
      price: "Mulai dari Rp 18 juta",
      rating: 4.7,
      features: ["Space Saving Cabinet", "Multi-functional Island", "Compact Appliances", "Smart Storage"],
      badge: "Hemat Ruang"
    }
  ]

  // Fetch data dari backend
  useEffect(() => {
    const fetchBanners = async () => {
      try {
        setLoading(true)
        const banners = await bannerApi.getAll(true) // Hanya ambil banner yang aktif
        
        if (banners && banners.length > 0) {
          setRenovationServices(banners)
        } else {
          // Jika tidak ada data dari backend, gunakan fallback
          setRenovationServices(fallbackServices)
        }
        setError(null)
      } catch (err) {
        console.error('Error fetching banners:', err)
        setError(err.message)
        // Gunakan fallback data jika terjadi error
        setRenovationServices(fallbackServices)
      } finally {
        setLoading(false)
      }
    }

    fetchBanners()
  }, [])

  useEffect(() => {
    if (!api) return

    setCount(api.scrollSnapList().length)
    setCurrent(api.selectedScrollSnap() + 1)

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap() + 1)
    })

    // Auto scroll every 5 seconds
    const autoScroll = setInterval(() => {
      if (api.canScrollNext()) {
        api.scrollNext()
      } else {
        api.scrollTo(0)
      }
    }, 5000)

    return () => clearInterval(autoScroll)
  }, [api])

  // Loading state
  if (loading) {
    return (
      <section className="relative bg-white pt-20">
        <div className="max-w-6xl mx-auto px-4 pt-8 pb-16">
          <div className="text-center mb-12">
            <div className="animate-pulse">
              <div className="h-6 bg-slate-200 rounded w-64 mx-auto mb-4"></div>
              <div className="h-12 bg-slate-200 rounded w-96 mx-auto mb-4"></div>
              <div className="h-6 bg-slate-200 rounded w-80 mx-auto"></div>
            </div>
          </div>
          <div className="w-full max-w-6xl mx-auto">
            <div className="bg-slate-200 rounded-2xl h-96 animate-pulse"></div>
          </div>
        </div>
      </section>
    )
  }

  // Error state dengan fallback data
  if (error && renovationServices.length === 0) {
    return (
      <section className="relative bg-white pt-20">
        <div className="max-w-6xl mx-auto px-4 pt-8 pb-16">
          <div className="text-center mb-12">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
              <p className="text-red-600">
                Gagal memuat data dari server. Menampilkan data fallback.
              </p>
            </div>
            <Badge variant="secondary" className="mb-4">
              Kontraktor Terpercaya #1 di Indonesia
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold text-slate-900 dark:text-slate-100 mb-4">
              Renovasi Dapur
              <span className="text-red-600 dark:text-red-400"> Impian Anda</span>
            </h1>
            <p className="text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
              Wujudkan dapur impian dengan layanan renovasi profesional. 
              Garansi 5 tahun, konsultasi gratis, dan pengerjaan berkualitas tinggi.
            </p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="relative bg-white pt-20">
      <div className="max-w-6xl mx-auto px-4 pt-8 pb-16">
        {/* Header */}
        <div className="text-center mb-12">
          <Badge variant="secondary" className="mb-4">
            Kontraktor Terpercaya #1 di Indonesia
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold text-slate-900 dark:text-slate-100 mb-4">
            Renovasi Dapur
            <span className="text-red-600 dark:text-red-400"> Impian Anda</span>
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
            Wujudkan dapur impian dengan layanan renovasi profesional. 
            Garansi 5 tahun, konsultasi gratis, dan pengerjaan berkualitas tinggi.
          </p>
          {error && (
            <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded-lg p-3 max-w-md mx-auto">
              <p className="text-yellow-700 text-sm">
                ⚠️ Menggunakan data lokal karena koneksi ke server bermasalah
              </p>
            </div>
          )}
        </div>

        {/* Carousel */}
        <Carousel setApi={setApi} className="w-full max-w-6xl mx-auto">
          <CarouselContent>
            {renovationServices.map((service) => (
              <CarouselItem key={service.id}>
                <div className="grid lg:grid-cols-2 gap-0 items-stretch bg-white dark:bg-slate-800 rounded-2xl shadow-2xl overflow-hidden">
                  {/* Image Section */}
                  <div className="relative h-64 lg:h-96 overflow-hidden">
                    <img
                      src={service.image}
                      alt={service.title}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-black/20"></div>
                    <div className="absolute top-4 left-4">
                      <Badge variant="default" className="bg-red-600 hover:bg-red-700 text-white px-2 py-1 text-xs font-semibold">
                        {service.badge || "Tersedia"}
                      </Badge>
                    </div>
                    <div className="absolute bottom-4 right-4 bg-white/95 dark:bg-slate-800/95 px-3 py-1.5 rounded-full shadow-lg">
                      <div className="flex items-center gap-1.5">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                          {service.rating || 4.5}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Content Section */}
                  <div className="flex flex-col justify-center p-6 lg:p-8 bg-gradient-to-br from-white to-slate-50 dark:from-slate-800 dark:to-slate-900">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <h2 className="text-2xl lg:text-3xl font-bold text-slate-900 dark:text-slate-100 leading-tight">
                          {service.title}
                        </h2>
                        <p className="text-red-600 dark:text-red-400 text-lg font-semibold">
                          {service.subtitle}
                        </p>
                        <p className="text-slate-600 dark:text-slate-300 text-base leading-relaxed">
                          {service.description}
                        </p>
                      </div>

                      {/* Features Grid */}
                      <div className="grid grid-cols-1 gap-2">
                        {service.features && service.features.length > 0 ? (
                          service.features.map((feature, index) => (
                            <div key={index} className="flex items-center gap-2 p-2 rounded-lg bg-slate-50 dark:bg-slate-700/50">
                              <div className="w-2 h-2 bg-red-600 rounded-full flex-shrink-0"></div>
                              <span className="text-sm font-medium text-slate-700 dark:text-slate-200">{feature}</span>
                            </div>
                          ))
                        ) : (
                          <div className="flex items-center gap-2 p-2 rounded-lg bg-slate-50 dark:bg-slate-700/50">
                            <div className="w-2 h-2 bg-red-600 rounded-full flex-shrink-0"></div>
                            <span className="text-sm font-medium text-slate-700 dark:text-slate-200">Konsultasi Gratis</span>
                          </div>
                        )}
                      </div>

                      {/* Price Section */}
                      <div className="bg-slate-100 dark:bg-slate-700 p-3 rounded-xl">
                        <p className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-1">
                          {service.price || "Hubungi untuk harga"}
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          *Harga dapat berubah sesuai spesifikasi
                        </p>
                      </div>

                      {/* Call to Action Buttons */}
                      <div className="flex flex-col gap-3 pt-2">
                        <Button variant="outline" size="default" className="w-full border-2 border-red-200 hover:border-red-300 hover:bg-red-50 dark:border-red-800 dark:hover:bg-red-900/20">
                          <Phone className="w-4 h-4 mr-2" />
                          Konsultasi Gratis
                        </Button>
                        <Button size="default" className="w-full bg-red-600 hover:bg-red-700 text-white shadow-lg hover:shadow-xl transition-all duration-300">
                          Dapatkan Penawaran
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="hidden lg:flex -left-12 w-10 h-10 bg-white/90 hover:bg-white shadow-lg" />
          <CarouselNext className="hidden lg:flex -right-12 w-10 h-10 bg-white/90 hover:bg-white shadow-lg" />
        </Carousel>

        {/* Carousel Indicators */}
        <div className="flex justify-center mt-8 gap-2">
          {Array.from({ length: count }).map((_, index) => (
            <button
              key={index}
              className={`w-3 h-3 rounded-full transition-colors ${
                index === current - 1 
                  ? "bg-red-600" 
                  : "bg-slate-300 dark:bg-slate-600"
              }`}
              onClick={() => api?.scrollTo(index)}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
