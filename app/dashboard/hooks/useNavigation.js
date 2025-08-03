'use client'

import { useState } from 'react'

export function useNavigation() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [activeTab, setActiveTab] = useState('overview')

  return {
    sidebarOpen,
    setSidebarOpen,
    activeTab,
    setActiveTab
  }
}
