import React, { useState, useEffect } from 'react';
import { Cloudinary } from '@cloudinary/url-gen';
import { AdvancedImage } from '@cloudinary/react';
import PhotoPopUp from './PhotoPopUp';

function GalleryView() {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPopUp, setShowPopUp] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState(null);

  // Cloudinary instance
  const cld = new Cloudinary({
    cloud: { cloudName: 'dqzcozav8' },
  });

  useEffect(() => {
    fetchPhotos();
  }, []);

  const fetchPhotos = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:3004/api/photos');
      if (!response.ok) throw new Error('Failed to fetch photos');

      const data = await response.json();
      setPhotos(data.resources);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Photo Gallery</h2>
      {loading && <p>Loading...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <div className='flex flex-wrap gap-3'>
        {photos.map((photo) => {
          // Create Cloudinary image instance for each photo
          const img = cld.image(photo.public_id).format('jpg');

          return (
            <div key={photo.public_id} onClick={() => {
              setSelectedPhoto(img);
              setShowPopUp(true);
            }}>
              <AdvancedImage cldImg={img} className="w-32 h-32 object-cover rounded-md cursor-pointer" />
            </div>
          );
        })}
      </div>

      {showPopUp && <PhotoPopUp setShowPopUp={setShowPopUp} photo={selectedPhoto} />}
    </div>
  );
}

export default GalleryView;
