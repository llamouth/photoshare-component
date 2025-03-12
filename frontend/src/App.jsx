import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import MainLayout from './pages/MainLayout'
import QRCodePage from './pages/QRCodePage'
import UploadPage from './pages/UploadPage'
import GalleryPage from './pages/GalleryPage'

function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          {/* Default route redirects to the QR Code page */}
          <Route index element={<Navigate to="/qr" replace />} />
          <Route path="upload" element={<UploadPage />} />
          <Route path="gallery" element={<GalleryPage />} />
          <Route path="qr" element={<QRCodePage />} />
        </Route>
      </Routes>

      {/* Footer */}
      <footer className="border-t">
        <div className="container mx-auto py-4 text-center text-sm text-muted-foreground">
          PhotoShare – A mobile-first photo sharing application
          <br />
          © 2025 PhotoShare. All rights reserved.
        </div>
      </footer>
    </div>
  )
}

export default App
