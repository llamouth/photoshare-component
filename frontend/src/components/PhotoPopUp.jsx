import React from 'react';
import { motion } from 'motion/react';
import { AdvancedImage } from '@cloudinary/react'

const PhotoPopUp = ({ setShowPopUp, photo }) => {
  if (!photo) return null;

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      exit={{ opacity: 0 }} 
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
      onClick={() => setShowPopUp(false)}
    >
      <motion.div 
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 100 }}
        className="bg-white p-4 rounded-lg shadow-lg max-w-lg"
        onClick={(e) => e.stopPropagation()}
      >
       <AdvancedImage cldImg={photo} className="w-full h-auto rounded-md" />
        <button 
          className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-700"
          onClick={() => setShowPopUp(false)}
        >
          Close
        </button>
      </motion.div>
    </motion.div>
  );
};

export default PhotoPopUp;