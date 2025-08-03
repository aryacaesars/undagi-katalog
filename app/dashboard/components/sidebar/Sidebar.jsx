'use client'

import { Button } from '@/components/ui/button'
import { 
  Home,
  Package,
  CreditCard,
  Receipt,
  BarChart3,
  Users,
  LogOut,
  User,
  Eye,
  X
} from 'lucide-react'

const SidebarItem = ({ icon: Icon, label, active, onClick }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
      active
        ? 'bg-red-100 text-red-900 border-r-2 border-red-500'
        : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
    }`}
  >
    <Icon className={`mr-3 w-4 h-4 ${active ? 'text-red-500' : 'text-gray-400'}`} />
    {label}
  </button>
)

export default function Sidebar({ activeTab, setActiveTab, sidebarOpen, setSidebarOpen }) {
  return (
    <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-200 ease-in-out lg:translate-x-0 lg:static lg:inset-0`}>
      <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200">
        <div className="flex items-center">
          <img src="/Logo.svg" alt="UNDAGI" className="w-8 h-8" />
          <h2 className="ml-2 text-xl font-bold text-gray-900">UNDAGI</h2>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setSidebarOpen(false)}
          className="lg:hidden"
        >
          <X className="w-4 h-4" />
        </Button>
      </div>

      <nav className="mt-4 px-2">
        <div className="space-y-1">
          <SidebarItem
            icon={Eye}
            label="Kelola Banner"
            active={activeTab === 'banners'}
            onClick={() => setActiveTab('banners')}
          />
          <SidebarItem
            icon={Package}
            label="Kelola Katalog"
            active={activeTab === 'catalogues'}
            onClick={() => setActiveTab('catalogues')}
          />
          <SidebarItem
            icon={CreditCard}
            label="Kelola Pricing"
            active={activeTab === 'pricing'}
            onClick={() => setActiveTab('pricing')}
          />
          <SidebarItem
            icon={Receipt}
            label="Pengaturan Invoice"
            active={activeTab === 'settings'}
            onClick={() => setActiveTab('settings')}
          />
        </div>

        <div className="mt-8">
          <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
            Analytics
          </h3>
          <div className="mt-2 space-y-1">
            <SidebarItem
              icon={BarChart3}
              label="Statistik"
              active={activeTab === 'analytics'}
              onClick={() => setActiveTab('analytics')}
            />
            <SidebarItem
              icon={Users}
              label="Customers"
              active={activeTab === 'customers'}
              onClick={() => setActiveTab('customers')}
            />
          </div>
        </div>
      </nav>

      {/* User Profile at Bottom */}
      <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200">
        <div className="flex items-center">
          <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center">
            <User className="w-4 h-4 text-white" />
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium text-gray-900">Admin</p>
            <p className="text-xs text-gray-500">admin@undagi.com</p>
          </div>
          <Button variant="ghost" size="sm" className="ml-auto">
            <LogOut className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
