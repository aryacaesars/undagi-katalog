import Image from 'next/image'
import { MapPin, Phone, Mail, Clock, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-red-700 text-white">
      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Image
                src="/Footer Logo.svg"
                alt="Logo"
                width={100}
                height={100}
            />
            </div>
            <p className="text-gray-300 text-sm leading-relaxed">
              Menyediakan katalog barang berkualitas dengan harga terbaik untuk kebutuhan bisnis dan personal Anda.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-white hover:text-white transition-colors">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-white hover:text-white transition-colors">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-white hover:text-white transition-colors">
                <Instagram size={20} />
              </a>
              <a href="#" className="text-white hover:text-white transition-colors">
                <Linkedin size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-300 hover:text-white transition-colors text-sm">
                  Home
                </a>
              </li>
              <li>
                <a href="#about" className="text-gray-300 hover:text-white transition-colors text-sm">
                  About Us
                </a>
              </li>
              <li>
                <a href="#services" className="text-gray-300 hover:text-white transition-colors text-sm">
                  Services
                </a>
              </li>
              <li>
                <a href="#contact" className="text-gray-300 hover:text-white transition-colors text-sm">
                  Contact
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white transition-colors text-sm">
                  Katalog
                </a>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Kategori</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-300 hover:text-white transition-colors text-sm">
                  Elektronik
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white transition-colors text-sm">
                  Furniture
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white transition-colors text-sm">
                  ATK
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white transition-colors text-sm">
                  Office Equipment
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white transition-colors text-sm">
                  Semua Kategori
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Hubungi Kami</h3>
            <div className="space-y-3">
              <div className="flex items-start space-x-3 ">
                <MapPin size={16} className="text-white mt-1 flex-shrink-0" />
                <span className="text-gray-300 text-sm">
                  Jl. Raya Teknologi No. 123<br />
                  Jakarta Selatan, 12345
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone size={16} className="text-white flex-shrink-0" />
                <span className="text-gray-300 text-sm">+62 21 1234 5678</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail size={16} className="text-white flex-shrink-0" />
                <span className="text-gray-300 text-sm">info@undagi.com</span>
              </div>
              <div className="flex items-start space-x-3">
                <Clock size={16} className="text-white mt-1 flex-shrink-0" />
                <span className="text-gray-300 text-sm">
                  Senin - Jumat: 08:00 - 17:00<br />
                  Sabtu: 08:00 - 12:00
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Newsletter Section */}
        <div className="border-t border-red-800 mt-8 pt-8">
          <div className="text-center max-w-md mx-auto">
            <h3 className="text-lg font-semibold mb-2">Stay Updated</h3>
            <p className="text-gray-300 text-sm mb-4">
              Dapatkan informasi terbaru tentang produk dan penawaran khusus
            </p>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="Masukkan email Anda"
                className="flex-1 px-3 py-2 bg-white text-black border border-red-700 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <Button size="sm" className="px-4 bg-white text-red-600 hover:bg-gray-200 hover:text-red-900">
                Subscribe
              </Button>
            </div>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="border-t border-red-800 mt-8 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center text-sm text-gray-200">
            <p>
              © {currentYear} UNDAGI. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="hover:text-white transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="hover:text-white transition-colors">
                Terms of Service
              </a>
              <a href="#" className="hover:text-white transition-colors">
                Cookie Policy
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}