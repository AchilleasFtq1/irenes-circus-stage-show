import React, { useState, useRef, useEffect } from 'react';
import { ImageOff } from 'lucide-react';

interface OptimizedImageProps {
  src: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
  priority?: boolean;
  fallbackSrc?: string;
  placeholder?: 'blur' | 'empty';
  onLoad?: () => void;
  onError?: () => void;
  lazy?: boolean;
}

const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  className = "",
  width,
  height,
  priority = false,
  fallbackSrc,
  placeholder = 'blur',
  onLoad,
  onError,
  lazy = true,
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isInView, setIsInView] = useState(!lazy || priority);
  const imgRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Intersection Observer for lazy loading
  useEffect(() => {
    if (!lazy || priority || isInView) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      {
        rootMargin: '50px', // Start loading 50px before the image comes into view
      }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, [lazy, priority, isInView]);

  const handleLoad = () => {
    setIsLoaded(true);
    onLoad?.();
  };

  const handleError = () => {
    setHasError(true);
    onError?.();
  };

  // Generate responsive srcSet for different screen sizes
  const generateSrcSet = (originalSrc: string) => {
    // If it's an Unsplash URL, we can generate different sizes
    if (originalSrc.includes('unsplash.com')) {
      const baseUrl = originalSrc.split('?')[0];
      return `
        ${baseUrl}?w=400&q=80 400w,
        ${baseUrl}?w=800&q=80 800w,
        ${baseUrl}?w=1200&q=80 1200w,
        ${baseUrl}?w=1600&q=80 1600w
      `;
    }
    return undefined;
  };

  const containerStyle: React.CSSProperties = {
    width: width ? `${width}px` : '100%',
    height: height ? `${height}px` : 'auto',
    position: 'relative',
    overflow: 'hidden',
  };

  return (
    <div 
      ref={containerRef}
      style={containerStyle}
      className={`relative ${className}`}
    >
      {/* Placeholder while loading */}
      {(!isLoaded || !isInView) && !hasError && (
        <div 
          className="absolute inset-0 flex items-center justify-center bg-gray-200 animate-pulse"
          style={{ aspectRatio: width && height ? `${width}/${height}` : 'auto' }}
        >
          {placeholder === 'blur' ? (
            <div className="w-full h-full bg-gradient-to-br from-gray-300 via-gray-200 to-gray-300 animate-pulse" />
          ) : (
            <div className="text-gray-400">
              <div className="w-8 h-8 bg-gray-300 rounded animate-pulse" />
            </div>
          )}
        </div>
      )}

      {/* Error state */}
      {hasError && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-100 text-gray-400">
          <ImageOff size={32} className="mb-2" />
          <span className="text-sm">Image failed to load</span>
          {fallbackSrc && (
            <img
              src={fallbackSrc}
              alt={alt}
              className="absolute inset-0 w-full h-full object-cover"
              onLoad={handleLoad}
            />
          )}
        </div>
      )}

      {/* Actual image */}
      {isInView && !hasError && (
        <img
          ref={imgRef}
          src={src}
          alt={alt}
          width={width}
          height={height}
          srcSet={generateSrcSet(src)}
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          loading={priority ? 'eager' : 'lazy'}
          decoding="async"
          onLoad={handleLoad}
          onError={handleError}
          className={`
            w-full h-full object-cover transition-opacity duration-300
            ${isLoaded ? 'opacity-100' : 'opacity-0'}
          `}
        />
      )}

      {/* Loading overlay with rock theme */}
      {isInView && !isLoaded && !hasError && (
        <div className="absolute inset-0 bg-rock-black/20 flex items-center justify-center">
          <div className="flex items-center gap-2 text-rock-amber">
            <div className="w-6 h-6 border-2 border-rock-amber border-t-transparent rounded-full animate-spin" />
            <span className="font-rock text-sm">Loading...</span>
          </div>
        </div>
      )}
    </div>
  );
};

// Gallery Image Component with rock theme
export const GalleryImage: React.FC<OptimizedImageProps & { 
  span?: 'col' | 'row' | 'both';
  onClick?: () => void;
}> = ({ 
  span, 
  onClick,
  className = "",
  ...props 
}) => {
  const spanClasses = {
    col: 'md:col-span-2',
    row: 'md:row-span-2',
    both: 'md:col-span-2 md:row-span-2',
  };

  return (
    <div 
      className={`
        relative group cursor-pointer overflow-hidden rounded-none border-2 border-rock-steel 
        hover:border-rock-amber transition-all duration-300 bg-rock-charcoal
        ${span ? spanClasses[span] : ''}
        ${onClick ? 'hover:scale-[1.02] hover:shadow-2xl' : ''}
        ${className}
      `}
      onClick={onClick}
    >
      <OptimizedImage
        {...props}
        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
      />
      
      {/* Rock-themed overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-rock-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      {/* Image info overlay */}
      <div className="absolute bottom-0 left-0 right-0 p-4 text-rock-cream transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
        <p className="font-rock font-bold text-sm">{props.alt}</p>
      </div>
      
      {/* Stage lights effect on hover */}
      <div className="absolute top-2 right-2 w-4 h-4 bg-rock-amber rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-pulse transition-opacity duration-300" />
    </div>
  );
};

// Album Cover Component
export const AlbumCover: React.FC<OptimizedImageProps & {
  albumName?: string;
  artist?: string;
  isPlaying?: boolean;
  onClick?: () => void;
}> = ({
  albumName,
  artist,
  isPlaying = false,
  onClick,
  className = "",
  ...props
}) => {
  return (
    <div 
      className={`
        relative group cursor-pointer overflow-hidden rounded-lg
        ${onClick ? 'hover:scale-105' : ''}
        ${isPlaying ? 'ring-2 ring-rock-amber shadow-lg' : ''}
        transition-all duration-300 ${className}
      `}
      onClick={onClick}
    >
      <OptimizedImage
        {...props}
        className="w-full h-full object-cover"
      />
      
      {/* Vinyl record overlay when playing */}
      {isPlaying && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/20">
          <div className="w-16 h-16 border-4 border-rock-amber rounded-full animate-spin" 
               style={{ animationDuration: '3s' }}>
            <div className="w-full h-full border-2 border-rock-amber/50 rounded-full">
              <div className="w-full h-full flex items-center justify-center">
                <div className="w-2 h-2 bg-rock-amber rounded-full" />
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Album info overlay */}
      {(albumName || artist) && (
        <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/80 to-transparent text-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
          {albumName && <p className="font-semibold text-sm truncate">{albumName}</p>}
          {artist && <p className="text-xs opacity-80 truncate">{artist}</p>}
        </div>
      )}
    </div>
  );
};

export default OptimizedImage;
