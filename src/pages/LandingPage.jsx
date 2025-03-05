import React, { useRef } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import QRCode from 'react-qr-code'
import { toast } from 'sonner'

// ShadCN UI components
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '../components/ui/card'
import { Button } from '../components/ui/button'
import { Tabs, TabsList, TabsTrigger } from '../components/ui/tabs'

// Example: your site URL could come from an env var:
const APP_URL = import.meta.env.VITE_APP_URL || 'https://myphotowebapp.com'

export default function LandingPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const qrRef = useRef(null)

  // Determine which tab should be active based on the current path
  // If you're on "/", default to "upload" or whichever you prefer
  let activeTab = 'upload'
  if (location.pathname.startsWith('/gallery')) {
    activeTab = 'gallery'
  } else if (location.pathname.startsWith('/upload')) {
    activeTab = 'upload'
  } else {
    // If we are exactly on "/", pick a default
    activeTab = 'upload'
  }

  // "Download QR Code" button handler
  const handleDownload = () => {
    const canvas = qrRef.current?.querySelector('canvas')
    if (!canvas) return

    // Convert canvas to PNG data URL
    const dataUrl = canvas.toDataURL('image/png')
    const link = document.createElement('a')
    link.href = dataUrl
    link.download = 'qrcode.png'
    link.click()

    toast.success('QR Code downloaded successfully.')
  }

  return (
    <div className="flex flex-col min-h-screen">
      {/* Top Header / Nav */}
      <header className="border-b">
        <div className="container mx-auto flex items-center justify-between h-16 px-4">
          {/* Left: App Name */}
          <div className="font-bold text-lg">PhotoShare</div>

          {/* Center: Tabs for "Upload" and "Gallery" */}
          <Tabs
            value={activeTab}
            onValueChange={(value) => navigate(`/${value}`)} 
            // This callback navigates to /upload or /gallery
          >
            <TabsList>
              <TabsTrigger value="upload">Upload</TabsTrigger>
              <TabsTrigger value="gallery">Gallery</TabsTrigger>
            </TabsList>
          </Tabs>

          {/* Right: Black circle placeholder -> On click, go to landing page "/" */}
          <div
            className="w-8 h-8 bg-black rounded-full cursor-pointer"
            onClick={() => navigate('/')}
          />
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-xl font-semibold">Share This App</CardTitle>
            <CardDescription className="text-sm">Scan to Share Photos</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center space-y-4">
            <p className="text-center text-sm text-muted-foreground">
              Scan this QR code with your mobile device to access the photo sharing app
            </p>

            {/* QR Code container (for download reference) */}
            <div ref={qrRef}>
              <QRCode value={APP_URL} size={200} />
            </div>
          </CardContent>
          <CardFooter className="flex justify-center">
            <Button onClick={handleDownload}>Download QR Code</Button>
          </CardFooter>
        </Card>
      </main>

    </div>
  )
}
