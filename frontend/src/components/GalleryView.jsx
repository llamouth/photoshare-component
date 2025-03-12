import React, { useState, useEffect } from 'react'
import { Cloudinary } from '@cloudinary/url-gen'
import { AdvancedImage } from '@cloudinary/react'

function GalleryView() {
  const [photos, setPhotos] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Cloudinary instance
  const cld = new Cloudinary({
    cloud: { cloudName: 'dqzcozav8' },
  })

  useEffect(() => {
    fetchPhotos()
  }, [])

  const fetchPhotos = async () => {
    setLoading(true)
    setError('')

    try {
      const response = await fetch('http://localhost:3004/api/photos')
      if (!response.ok) throw new Error('Failed to fetch photos')

      const data = await response.json()
      setPhotos(data.resources)
    } catch (error) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <h2>Photo Gallery</h2>
      {loading && <p>Loading...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <div style={{ display: 'flex', flexWrap: 'wrap' }}>
        {photos.map((photo) => {
          const img = cld.image(photo.public_id)
          return (
            <AdvancedImage
              key={photo.public_id}
              cldImg={img}
              style={{ width: '200px', margin: '10px' }}
            />
          )
        })}
      </div>
    </div>
  )
}

export default GalleryView
