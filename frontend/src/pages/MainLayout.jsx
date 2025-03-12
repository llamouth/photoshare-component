// src/layouts/MainLayout.jsx
import React from 'react'
import { Outlet, useNavigate, useLocation } from 'react-router-dom'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'

export default function MainLayout() {
  const navigate = useNavigate()
  const location = useLocation()

  // Determine active tab based on current pathname
  let activeTab = 'qr'
  if (location.pathname.includes('upload')) {
    activeTab = 'upload'
  } else if (location.pathname.includes('gallery')) {
    activeTab = 'gallery'
  } else if (location.pathname.includes('qr')) {
    activeTab = 'qr'
  }

  return (
    <div className="flex flex-col">
      {/* Header with App Name, Tabs, and Black Circle */}
      <header className="border-b">
        <div className="container mx-auto flex items-center justify-between h-16 px-4">
          {/* Left: App Name */}
          <div className="font-bold text-lg">Liz's 75th </div>

          {/* Center: Tabs */}
          <Tabs value={activeTab} onValueChange={(value) => navigate(`/${value}`)}>
            <TabsList>
              <TabsTrigger value="upload">Upload</TabsTrigger>
              <TabsTrigger value="gallery">Gallery</TabsTrigger>
              <TabsTrigger value="qr">QR Code</TabsTrigger>
            </TabsList>
          </Tabs>

          {/* Right: Black circle navigates to QR Code page */}
          <div
            className="w-8 h-8 bg-black rounded-full cursor-pointer"
            onClick={() => navigate('/qr')}
          />
        </div>
      </header>

      {/* Main content rendered via nested routes */}
      <main className="flex-1 p-4">
        <Outlet />
      </main>
    </div>
  )
}
