// src/pages/QRCodePage.jsx
import React, { useRef } from 'react'
import QRCode from 'react-qr-code'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/components/ui/card'
import { toast } from 'sonner'

// Use an environment variable for the app URL if available
const APP_URL = import.meta.env.VITE_APP_URL || 'http://localhost:5173'

export default function QRCodePage() {
  const qrRef = useRef(null)

  // "Download QR Code" handler: converts the canvas to a PNG and triggers download
  const handleDownload = () => {
    const canvas = qrRef.current?.querySelector('canvas')
    if (!canvas) return

    const dataUrl = canvas.toDataURL('image/png')
    const link = document.createElement('a')
    link.href = dataUrl
    link.download = 'qrcode.png'
    link.click()

    toast.success('QR Code downloaded successfully.')
  }

  return (
    <div className="flex flex-col items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-xl font-semibold">Share This App</CardTitle>
          <CardDescription className="text-sm">Scan to access PhotoShare</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center space-y-4">
          <p className="text-center text-sm text-muted-foreground">
            Scan this QR code with your mobile device to visit PhotoShare.
          </p>
          {/* QR Code container */}
          <div ref={qrRef}>
            <QRCode value={APP_URL} size={200} />
          </div>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button onClick={handleDownload}>Download QR Code</Button>
        </CardFooter>
      </Card>
    </div>
  )
}
