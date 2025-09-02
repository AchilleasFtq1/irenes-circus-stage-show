import { useState, useEffect } from 'react';
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import GalleryGrid from "@/components/GalleryGrid";
import { galleryAPI } from '@/lib/api';
import { IGalleryImage } from '@/lib/types';

const Gallery = () => {
  const [galleryImages, setGalleryImages] = useState<IGalleryImage[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchGalleryImages = async () => {
      try {
        setIsLoading(true);
        const data = await galleryAPI.getAll();
        setGalleryImages(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching gallery images:', err);
        setError('Failed to load gallery. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchGalleryImages();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-circus-cream to-white text-circus-dark">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative bg-white/70 backdrop-blur text-circus-dark py-20">
        <div className="container mx-auto px-4">
          <h1 className="font-circus text-4xl md:text-5xl font-bold mb-4 text-circus-gold animate-spotlight">
            Gallery
          </h1>
          <p className="font-alt text-xl max-w-2xl mb-6">
            Explore photos from our performances, behind the scenes, and more. Experience the visual side of Irene's Circus.
          </p>
        </div>
      </section>
      
      {/* Gallery Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="font-circus text-3xl font-bold mb-8 text-circus-dark">
            Performance Highlights
          </h2>
          
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-20 w-20 border-b-2 border-circus-gold"></div>
            </div>
          ) : error ? (
            <div className="text-center text-circus-red p-6 bg-white bg-opacity-70 rounded-lg shadow">
              <p>{error}</p>
              <button 
                onClick={() => window.location.reload()} 
                className="mt-4 px-4 py-2 bg-circus-gold text-circus-dark rounded-md hover:bg-circus-red hover:text-white transition-colors">
                Try Again
              </button>
            </div>
          ) : galleryImages.length === 0 ? (
            <div className="text-center p-10 bg-white bg-opacity-80 rounded-lg shadow">
              <h2 className="text-2xl font-bold mb-4">No Images Yet</h2>
              <p>
                Check back soon for photos from our performances and events!
              </p>
            </div>
          ) : (
            <GalleryGrid images={galleryImages} />
          )}
        </div>
      </section>
      
      {/* Behind the Scenes */}
      <section className="py-16 bg-white/70 backdrop-blur text-circus-dark">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-circus text-3xl font-bold mb-4 text-circus-gold">
            Follow Our Journey
          </h2>
          <p className="font-alt text-xl max-w-2xl mx-auto mb-8">
            For more behind-the-scenes content, follow us on Instagram.
          </p>
          
          <a 
            href="https://www.instagram.com/irenescircustheband/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="bg-circus-gold text-circus-dark px-6 py-3 rounded-lg font-bold inline-block hover:bg-circus-red hover:text-white transition-colors"
          >
            @irenescircustheband
          </a>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default Gallery;
