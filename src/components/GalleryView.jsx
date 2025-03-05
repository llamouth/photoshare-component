import React, { useState, useEffect } from 'react'
import { Cloudinary } from '@cloudinary/url-gen'
import { AdvancedImage } from '@cloudinary/react'
import { auto } from '@cloudinary/url-gen/actions/resize'
import { autoGravity } from '@cloudinary/url-gen/qualifiers/gravity'

function GalleryView() {
  const [photos, setPhotos] = useState([])
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Create the Cloudinary instance once
  const cld = new Cloudinary({ cloud: { cloudName: 'dqzcozav8' } })

  useEffect(() => {
    fetchPhotos(page)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page])

  const fetchPhotos = async (pageNumber) => {
    setLoading(true)
    try {
      // Replace "your_cloud_name" with our cloud name "dqzcozav8"
      const response = await fetch(
        `https://res.cloudinary.com/dqzcozav8/image/list/photos.json`
      )
      const data = await response.json()

      // For example, show 20 photos per page.
      const photosPerPage = 20
      const startIndex = (pageNumber - 1) * photosPerPage
      const paginatedResources = data.resources.slice(
        startIndex,
        startIndex + photosPerPage
      )

      // Map the Cloudinary resource objects to our photo data structure.
      const photos = paginatedResources.map((resource) => ({
        id: resource.public_id,
        name: resource.context?.custom?.name || '',
        note: resource.context?.custom?.note || '',
        timestamp: new Date(resource.created_at).getTime(),
        aspectRatio: resource.width / resource.height,
      }))

      setPhotos((prev) => [...prev, ...photos])
    } catch (err) {
      console.error(err)
      setError('Error fetching photos.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-4">
      <div className="grid grid-cols-2 gap-4">
        {photos.map((photo) => {
          // Create an image object using Cloudinary's URL Gen API for each photo.
          const image = cld
            .image(photo.id)
            .format('auto')
            .quality('auto')
            .resize(auto().gravity(autoGravity()).width(500).height(500))

          return (
            <div key={photo.id} className="flex flex-col">
              <AdvancedImage
                cldImg={image}
                alt={photo.name}
                className="w-full object-cover"
              />
              <div className="p-2">
                <p className="font-bold">{photo.name}</p>
                {photo.note && <p className="text-sm">{photo.note}</p>}
              </div>
            </div>
          )
        })}
      </div>
      {error && <div role="alert" className="text-red-600 mt-4">{error}</div>}
      <div className="flex justify-center mt-4">
        {loading ? (
          <span>Loading...</span>
        ) : (
          <button
            onClick={() => setPage(page + 1)}
            className="p-2 bg-blue-500 text-white rounded"
          >
            Load More
          </button>
        )}
      </div>
    </div>
  )
}

export default GalleryView
