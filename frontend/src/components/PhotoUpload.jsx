import React, { useState, useRef } from 'react'
import imageCompression from 'browser-image-compression'
import heic2any from 'heic2any'
import { Cloudinary } from '@cloudinary/url-gen'
import { auto } from '@cloudinary/url-gen/actions/resize'
import { autoGravity } from '@cloudinary/url-gen/qualifiers/gravity'
import { AdvancedImage } from '@cloudinary/react'

function PhotoUpload() {
  const [file, setFile] = useState(null)
  const [preview, setPreview] = useState(null)
  const [name, setName] = useState('')
  const [note, setNote] = useState('')
  const [uploadProgress, setUploadProgress] = useState(0)
  const [error, setError] = useState('')
  const [uploadedImage, setUploadedImage] = useState(null)

  // Refs for hidden file inputs (browse + camera)
  const fileInputRef = useRef(null)
  const cameraInputRef = useRef(null)

  // Handle file selection
  const handleFileChange = async (event) => {
    const selectedFile = event.target.files?.[0]
    if (!selectedFile) return

    // Validate file size (max 10MB)
    if (selectedFile.size > 10 * 1024 * 1024) {
      setError('File size exceeds 10MB.')
      return
    }

    // Accept only allowed formats
    if (!['image/jpeg', 'image/png', 'image/heic'].includes(selectedFile.type)) {
      setError('Unsupported file format.')
      return
    }

    try {
      // If it's HEIC, skip compression but convert to JPEG for preview only
      if (selectedFile.type === 'image/heic') {
        // 1. Convert to JPEG for preview
        const convertedBlob = await heic2any({
          blob: selectedFile,
          toType: 'image/jpeg',
          quality: 0.8, // Adjust as desired
        })
        // 2. Create a temporary preview URL from the converted blob
        setPreview(URL.createObjectURL(convertedBlob))

        // 3. Keep the original .heic file for upload
        setFile(selectedFile)
      } else {
        // For JPEG/PNG, do local compression
        const options = {
          maxSizeMB: 1,
          maxWidthOrHeight: 1920,
          useWebWorker: true,
        }
        const compressedFile = await imageCompression(selectedFile, options)
        setFile(compressedFile)
        setPreview(URL.createObjectURL(compressedFile))
      }

      setError('')
      setUploadedImage(null) // Clear any previously uploaded image
    } catch (err) {
      console.error(err)
      setError('Error processing image for preview.')
    }
  }

  // Upload to Cloudinary
  const handleUpload = async () => {
    if (!file || !name.trim() || name.length > 50 || note.length > 200) {
      setError('Please fill out the required fields correctly.')
      return
    }
    setError('')

    const formData = new FormData()
    formData.append('file', file) // Original file (heic or compressed jpg/png)
    formData.append('upload_preset', 'gmabirthday') // Your Cloudinary preset
    formData.append('name', name)
    formData.append('note', note)

    try {
      const response = await fetch(
        'https://api.cloudinary.com/v1_1/dqzcozav8/image/upload',
        {
          method: 'POST',
          body: formData,
        }
      )
      const data = await response.json()
      if (data.error) {
        setError(data.error.message || 'Upload failed. Please try again.')
        return
      }
      console.log('Upload successful', data)

      // Use Cloudinary URL Gen to create an optimized image object
      const cld = new Cloudinary({ cloud: { cloudName: 'dqzcozav8' } })
      const optimizedImage = cld
        .image(data.public_id)
        .format('auto')
        .quality('auto')
        .resize(auto().gravity(autoGravity()).width(500).height(500))

      setUploadedImage(optimizedImage)
      setError('')
    } catch (err) {
      console.error(err)
      setError('Upload failed. Please try again.')
    }
  }

  // Click handlers for the dashed drop-area
  const handleDropAreaClick = () => {
    // Trigger the "browse" file input by default
    fileInputRef.current?.click()
  }

  const handleBrowseClick = (e) => {
    e.stopPropagation()
    fileInputRef.current?.click()
  }

  const handleCameraClick = (e) => {
    e.stopPropagation()
    cameraInputRef.current?.click()
  }

  return (
    <div className="max-w-md mx-auto p-4 space-y-6">
      {/* Heading */}
      <h1 className="text-xl font-semibold">Upload a Photo</h1>

      <form
        onSubmit={(e) => {
          e.preventDefault()
          handleUpload()
        }}
        className="flex flex-col space-y-4"
      >
        {/* PHOTO LABEL */}
        <div className="space-y-2">
          <label className="font-medium text-sm">Photo</label>

          {/* Dashed Drop Area */}
          {!preview && !uploadedImage ? (
            <div
              className="border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors hover:bg-gray-50"
              onClick={handleDropAreaClick}
            >
              <div className="flex flex-col items-center justify-center gap-2">
                {/* Icon */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-12 w-12 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 4.5v15m7.5-7.5h-15"
                  />
                </svg>
                <p className="text-sm text-gray-500">
                  Drag & drop an image here, or click to select
                </p>
                <p className="text-xs text-gray-400 mt-2">
                  Supported formats: JPG, PNG, HEIC (max 10MB)
                </p>

                {/* Browse + Camera Buttons */}
                <div className="flex gap-2 mt-4">
                  <button
                    type="button"
                    className="border border-gray-300 rounded px-3 py-1 text-sm text-gray-600 hover:bg-gray-100"
                    onClick={handleBrowseClick}
                  >
                    Browse
                  </button>
                  <button
                    type="button"
                    className="border border-gray-300 rounded px-3 py-1 text-sm text-gray-600 hover:bg-gray-100"
                    onClick={handleCameraClick}
                  >
                    Camera
                  </button>
                </div>
              </div>
            </div>
          ) : (
            // If we have a preview (file selected but not uploaded)
            // or if there's an uploaded image, show a preview
            <div className="relative">
              {preview && !uploadedImage && (
                <img
                  src={preview}
                  alt="Preview"
                  className="w-full h-auto rounded-md object-cover"
                />
              )}
              {uploadedImage && (
                <div className="border rounded-md overflow-hidden">
                  <AdvancedImage cldImg={uploadedImage} />
                </div>
              )}
            </div>
          )}

          {/* Hidden file inputs (browse + camera) */}
          <input
            type="file"
            accept=".jpg,.jpeg,.png,.heic"
            className="hidden"
            ref={fileInputRef}
            onChange={handleFileChange}
          />
          {/* Camera capture on mobile */}
          <input
            type="file"
            accept=".jpg,.jpeg,.png,.heic"
            capture="environment"
            className="hidden"
            ref={cameraInputRef}
            onChange={handleFileChange}
          />
        </div>

        {/* NAME FIELD */}
        <div className="space-y-2">
          <label htmlFor="name" className="font-medium text-sm">
            Name
          </label>
          <input
            id="name"
            type="text"
            placeholder="Enter a name for your photo"
            value={name}
            onChange={(e) => setName(e.target.value)}
            maxLength={50}
            required
            className="border border-gray-300 rounded px-3 py-2 w-full text-sm"
          />
        </div>

        {/* NOTE FIELD */}
        <div className="space-y-2">
          <label htmlFor="note" className="font-medium text-sm">
            Note (optional)
          </label>
          <textarea
            id="note"
            placeholder="Add a note about your photo"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            maxLength={200}
            className="border border-gray-300 rounded px-3 py-2 w-full text-sm resize-none"
          />
        </div>

        {/* UPLOAD BUTTON */}
        <button
          type="submit"
          className="bg-blue-500 text-white p-2 rounded text-sm hover:bg-blue-600"
        >
          Upload Photo
        </button>

        {/* (Optional) Progress Bar */}
        {uploadProgress > 0 && (
          <progress value={uploadProgress} max="100" className="w-full" />
        )}

        {/* ERROR MESSAGE */}
        {error && (
          <div role="alert" className="text-red-600 text-sm">
            {error}
          </div>
        )}
      </form>
    </div>
  )
}

export default PhotoUpload;