import React, { useState } from 'react';
import { Image as ImageIcon } from 'lucide-react';

interface GalleryImageProps {
  src: string;
  alt: string;
  className?: string;
  fallbackClassName?: string;
}

const GalleryImage: React.FC<GalleryImageProps> = ({ 
  src, 
  alt, 
  className = '',
  fallbackClassName = ''
}) => {
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);

  const handleError = () => {
    console.error(`Failed to load image: ${src}`);
    setError(true);
    setLoading(false);
  };

  const handleLoad = () => {
    setLoading(false);
  };

  if (error) {
    return (
      <div className={`flex items-center justify-center bg-gray-100 ${fallbackClassName}`}>
        <div className="text-center p-4">
          <ImageIcon size={48} className="mx-auto mb-2 text-gray-400" />
          <p className="text-sm text-gray-500">Image unavailable</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {loading && (
        <div className={`flex items-center justify-center bg-gray-100 animate-pulse ${fallbackClassName}`}>
          <ImageIcon size={48} className="text-gray-300" />
        </div>
      )}
      <img
        src={src}
        alt={alt}
        className={`${className} ${loading ? 'hidden' : ''}`}
        onError={handleError}
        onLoad={handleLoad}
        loading="lazy"
      />
    </>
  );
};

export default GalleryImage;
