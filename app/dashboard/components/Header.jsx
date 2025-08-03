'use client'

import { Button } from '@/components/ui/button'
import { Menu, Bell, User } from 'lucide-react'

const getPageTitle = (tab) => {
  const titles = {
    dashboard: 'Dashboard',
    banner: 'Kelola Banner',
    catalogue: 'Kelola Katalog',
    pricing: 'Kelola Pricing',
    invoice: 'Pengaturan Invoice',
    analytics: 'Analytics',
    customers: 'Customers'
  }
  return titles[tab] || 'Dashboard'
}

export default function Header({ activeTab, sidebarOpen, setSidebarOpen }) {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="lg:hidden"
          >
            <Menu className="w-5 h-5" />
          </Button>
          <h1 className="ml-2 text-xl font-semibold text-gray-900">
            {getPageTitle(activeTab)}
          </h1>
        </div>
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm">
            <Bell className="w-5 h-5" />
          </Button>
          <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center">
            <User className="w-4 h-4 text-white" />
          </div>
        </div>
      </div>
    </header>
  )
}
