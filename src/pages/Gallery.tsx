
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import GalleryGrid from "@/components/GalleryGrid";
import { galleryImages } from "@/data/bandData";

const Gallery = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-circus-cream to-white text-circus-dark">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative bg-circus-dark text-circus-cream py-20">
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
          
          <GalleryGrid images={galleryImages} />
        </div>
      </section>
      
      {/* Behind the Scenes */}
      <section className="py-16 bg-circus-dark text-circus-cream">
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
            className="bg-circus-gold text-circus-dark px-6 py-3 rounded-lg font-bold inline-block hover:bg-circus-red hover:text-circus-cream transition-colors"
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
