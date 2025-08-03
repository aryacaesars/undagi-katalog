"use client"

import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Plus, ArrowRight } from 'lucide-react'
import React from 'react'

export default function DashboardGreeting() {
  const currentHour = new Date().getHours()
  const getGreeting = () => {
    if (currentHour < 12) return "Good Morning"
    if (currentHour < 17) return "Good Afternoon"
    return "Good Evening"
  }

  return (
    <div className="space-y-8">
      {/* Main Greeting Section */}
      <div className="text-center space-y-4">
        <div className="space-y-2">
          <h1 className="text-4xl font-light text-gray-900 tracking-tight">
            {getGreeting()}
          </h1>
          <p className="text-lg text-gray-500 font-light">
            Welcome back to your dashboard
          </p>
        </div>
      </div>

      {/* Quick Actions Card */}
      <Card className="border-0 shadow-sm bg-gradient-to-br from-gray-50 to-white">
        <CardContent className="p-8">
          <div className="text-center space-y-6">
            <div className="w-16 h-16 mx-auto bg-blue-100 rounded-full flex items-center justify-center">
              <Plus className="w-8 h-8 text-blue-600" />
            </div>
            
            <div className="space-y-2">
              <h3 className="text-xl font-medium text-gray-900">
                Kelola Konten Anda
              </h3>
              <p className="text-gray-500 max-w-md mx-auto leading-relaxed">
                Buat, edit, dan publikasikan konten berkualitas untuk audience Anda dengan mudah.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
              <Button className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg font-medium transition-colors">
                Buat Konten Baru
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
              <Button variant="outline" className="border-red-200 text-red-600 hover:bg-red-50 px-6 py-2 rounded-lg font-medium">
                Lihat Panduan
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Preview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-0 shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="p-6 text-center">
            <div className="text-2xl font-bold text-gray-900">0</div>
            <div className="text-sm text-gray-500 mt-1">Projects</div>
          </CardContent>
        </Card>
        
        <Card className="border-0 shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="p-6 text-center">
            <div className="text-2xl font-bold text-gray-900">0</div>
            <div className="text-sm text-gray-500 mt-1">Tasks</div>
          </CardContent>
        </Card>
        
        <Card className="border-0 shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="p-6 text-center">
            <div className="text-2xl font-bold text-gray-900">0</div>
            <div className="text-sm text-gray-500 mt-1">Completed</div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
