import React, { useEffect, useState } from 'react';
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { galleryAPI } from '@/lib/api';
import { IGalleryImage } from '@/lib/types';
import { GalleryImage } from '@/components/OptimizedImage';
import { GallerySkeleton } from '@/components/ui/skeleton';
import SearchFilter from '@/components/SearchFilter';
import { usePagination } from '@/components/Pagination';
import Pagination from '@/components/Pagination';
import { useToast } from '@/hooks/useToast';
import { useAccessibility } from '@/components/AccessibilityProvider';
import { X, ZoomIn, Download, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

const GalleryImproved = () => {
  const [images, setImages] = useState<IGalleryImage[]>([]);
  const [filteredImages, setFilteredImages] = useState<IGalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<IGalleryImage | null>(null);
  const [lightboxIndex, setLightboxIndex] = useState<number>(-1);
  
  const { error: showError } = useToast();
  const { announceToScreenReader, reducedMotion } = useAccessibility();

  // Pagination
  const {
    currentPage,
    totalPages,
    itemsPerPage,
    paginatedData,
    setCurrentPage,
    setItemsPerPage,
    totalItems,
  } = usePagination(filteredImages, 12);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        setLoading(true);
        const data = await galleryAPI.getAll();
        setImages(data);
        announceToScreenReader(`Loaded ${data.length} gallery images`);
      } catch (error: unknown) {
        console.error('Error fetching gallery images:', error);
        showError('Failed to load gallery images');
      } finally {
        setLoading(false);
      }
    };

    fetchImages();
  }, [announceToScreenReader, showError]);

  const closeLightbox = React.useCallback(() => {
    setSelectedImage(null);
    setLightboxIndex(-1);
    announceToScreenReader('Closed lightbox');
    document.body.style.overflow = 'unset';
  }, [announceToScreenReader]);

  const navigateLightbox = React.useCallback((direction: number) => {
    const newIndex = lightboxIndex + direction;
    if (newIndex >= 0 && newIndex < filteredImages.length) {
      const newImage = filteredImages[newIndex];
      setSelectedImage(newImage);
      setLightboxIndex(newIndex);
      announceToScreenReader(`Viewing ${newImage.alt}, image ${newIndex + 1} of ${filteredImages.length}`);
    }
  }, [lightboxIndex, filteredImages, announceToScreenReader]);

  // Keyboard navigation for lightbox
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (lightboxIndex === -1) return;

      switch (e.key) {
        case 'Escape':
          closeLightbox();
          break;
        case 'ArrowLeft':
          e.preventDefault();
          navigateLightbox(-1);
          break;
        case 'ArrowRight':
          e.preventDefault();
          navigateLightbox(1);
          break;
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [lightboxIndex, closeLightbox, navigateLightbox]);

  const openLightbox = (image: IGalleryImage, index: number) => {
    setSelectedImage(image);
    setLightboxIndex(index);
    announceToScreenReader(`Opened lightbox for ${image.alt}`);
    document.body.style.overflow = 'hidden';
  };

  const handleShare = async (image: IGalleryImage) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Irene's Circus - ${image.alt}`,
          text: `Check out this photo from Irene's Circus: ${image.alt}`,
          url: window.location.href,
        });
        announceToScreenReader('Image shared successfully');
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      // Fallback: copy URL to clipboard
      navigator.clipboard.writeText(window.location.href);
      announceToScreenReader('Link copied to clipboard');
    }
  };

  const handleDownload = (image: IGalleryImage) => {
    const link = document.createElement('a');
    link.href = image.src;
    link.download = `irenes-circus-${image.alt.replace(/\s+/g, '-').toLowerCase()}.jpg`;
    link.click();
    announceToScreenReader(`Downloading ${image.alt}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-rock-gradient text-rock-cream">
        <Navbar />
        <main className="container mx-auto px-4 py-12">
          <div className="mb-8">
            <h1 className="font-edgy text-4xl md:text-6xl font-black mb-4 text-rock-amber">
              GALLERY
            </h1>
            <p className="font-hipster text-xl text-rock-smoke max-w-2xl">
              Loading our visual journey...
            </p>
          </div>
          <GallerySkeleton items={12} />
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-rock-gradient text-rock-cream">
      <Navbar />
      
      <main className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-edgy text-4xl md:text-6xl font-black mb-4 text-rock-amber rock-text-shadow">
            GALLERY
          </h1>
          <p className="font-hipster text-xl text-rock-smoke max-w-2xl">
            🎪 Behind the scenes, on stage, and beyond. Witness the raw energy and theatrical magic of Irene's Circus.
          </p>
        </div>

        {/* Search and Filter */}
        <div className="mb-8">
          <SearchFilter
            data={images}
            onFilteredData={setFilteredImages}
            searchFields={['alt']}
            placeholder="Search gallery by description..."
            className="bg-rock-charcoal/50 backdrop-blur rounded-none border-2 border-rock-steel"
          />
        </div>

        {/* Gallery Grid */}
        <div className="mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 auto-rows-max">
            {paginatedData.map((image, index) => (
              <GalleryImage
                key={image._id}
                src={image.src}
                alt={image.alt}
                span={image.span}
                onClick={() => openLightbox(image, index)}
                className={`
                  aspect-square hover:scale-[1.02] transition-transform duration-300
                  ${reducedMotion ? 'hover:scale-100' : ''}
                `}
                lazy={index > 8} // Load first 8 images immediately
              />
            ))}
          </div>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={totalItems}
            itemsPerPage={itemsPerPage}
            onPageChange={setCurrentPage}
            onItemsPerPageChange={setItemsPerPage}
            className="bg-rock-charcoal/50 backdrop-blur rounded-none border-2 border-rock-steel p-4"
          />
        )}
      </main>

      {/* Lightbox Modal */}
      {selectedImage && (
        <div 
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={closeLightbox}
          role="dialog"
          aria-modal="true"
          aria-labelledby="lightbox-title"
        >
          <div 
            className="relative max-w-7xl max-h-full"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={closeLightbox}
              className="absolute top-4 right-4 z-10 bg-black/50 text-white hover:bg-black/70"
              aria-label="Close lightbox"
            >
              <X size={24} />
            </Button>

            {/* Navigation buttons */}
            {lightboxIndex > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigateLightbox(-1)}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 bg-black/50 text-white hover:bg-black/70"
                aria-label="Previous image"
              >
                ←
              </Button>
            )}

            {lightboxIndex < filteredImages.length - 1 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigateLightbox(1)}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 bg-black/50 text-white hover:bg-black/70"
                aria-label="Next image"
              >
                →
              </Button>
            )}

            {/* Image */}
            <img
              src={selectedImage.src}
              alt={selectedImage.alt}
              className="max-w-full max-h-full object-contain"
              id="lightbox-image"
            />

            {/* Image info and actions */}
            <div className="absolute bottom-4 left-4 right-4 bg-black/70 text-white p-4 rounded">
              <h2 id="lightbox-title" className="font-rock text-lg mb-2">
                {selectedImage.alt}
              </h2>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-300">
                  {lightboxIndex + 1} of {filteredImages.length}
                </span>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleShare(selectedImage)}
                    className="text-white hover:bg-white/20"
                    aria-label="Share image"
                  >
                    <Share2 size={16} />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDownload(selectedImage)}
                    className="text-white hover:bg-white/20"
                    aria-label="Download image"
                  >
                    <Download size={16} />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default GalleryImproved;
