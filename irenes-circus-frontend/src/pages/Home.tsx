import { useState, useEffect } from 'react';
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import useSpotifyData from '@/hooks/useSpotifyData';
import { ARTIST_ID } from '@/lib/spotify';

const Home = () => {
  const { albums, loading } = useSpotifyData();
  const [featuredAlbum, setFeaturedAlbum] = useState<any>(null);

  // Set the featured album when data is loaded
  useEffect(() => {
    if (albums && albums.length > 0) {
      // Use the first album as featured
      setFeaturedAlbum(albums[0]);
    }
  }, [albums]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-circus-cream to-white text-circus-dark">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative bg-circus-dark min-h-[90vh] flex items-center">
        <div className="absolute inset-0 bg-[url('/images/hero-bg.jpg')] bg-cover bg-center opacity-40"></div>
        <div className="container mx-auto px-4 relative z-10 text-center py-20">
          <h1 className="font-circus text-6xl md:text-8xl font-bold mb-6 text-circus-gold animate-spotlight">
            Irene's Circus
          </h1>
          <p className="font-alt text-2xl text-circus-cream max-w-3xl mx-auto mb-10">
            A theatrical musical experience that combines powerful vocals, dramatic instrumentation, 
            and circus-inspired performance art.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild className="bg-circus-gold text-circus-dark font-bold text-lg px-8 py-6 hover:bg-circus-red hover:text-circus-cream">
              <Link to="/tour">Tour Dates</Link>
            </Button>
            <Button asChild className="bg-circus-cream text-circus-dark font-bold text-lg px-8 py-6 hover:bg-circus-red hover:text-circus-cream">
              <Link to="/music">Listen Now</Link>
            </Button>
          </div>
        </div>
      </section>
      
      {/* Featured Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="font-circus text-4xl font-bold mb-12 text-circus-dark text-center">
            The Stage Show
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
            <div className="bg-white p-8 rounded-lg shadow-md hover:shadow-lg transition-shadow text-center">
              <div className="h-16 w-16 bg-circus-gold text-circus-dark rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                1
              </div>
              <h3 className="font-circus text-2xl text-circus-red mb-3">Theatrical Experience</h3>
              <p className="font-alt text-lg">
                More than just a concert, our performances blend music with narrative and visual art for a complete sensory journey.
              </p>
            </div>
            
            <div className="bg-white p-8 rounded-lg shadow-md hover:shadow-lg transition-shadow text-center">
              <div className="h-16 w-16 bg-circus-gold text-circus-dark rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                2
              </div>
              <h3 className="font-circus text-2xl text-circus-red mb-3">Eclectic Soundscapes</h3>
              <p className="font-alt text-lg">
                Our music mixes alternative rock, folk, theatrical pop, and vintage influences for a unique sonic palette.
              </p>
            </div>
            
            <div className="bg-white p-8 rounded-lg shadow-md hover:shadow-lg transition-shadow text-center">
              <div className="h-16 w-16 bg-circus-gold text-circus-dark rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                3
              </div>
              <h3 className="font-circus text-2xl text-circus-red mb-3">Circus Artistry</h3>
              <p className="font-alt text-lg">
                Elements of circus performance art weave throughout our shows, creating magical and unexpected moments.
              </p>
            </div>
          </div>
          
          <div className="text-center">
            <Button asChild className="bg-circus-gold text-circus-dark font-bold hover:bg-circus-red hover:text-circus-cream">
              <Link to="/about">Read Our Story</Link>
            </Button>
          </div>
        </div>
      </section>
      
      {/* Latest Music */}
      <section className="py-20 bg-circus-dark text-circus-cream">
        <div className="container mx-auto px-4">
          <h2 className="font-circus text-4xl font-bold mb-12 text-circus-gold text-center">
            Latest Release
          </h2>
          
          <div className="bg-circus-dark/50 p-8 rounded-lg max-w-4xl mx-auto">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="md:w-1/3">
                {loading || !featuredAlbum ? (
                  <div className="animate-pulse bg-gray-300 rounded-lg w-full aspect-square"></div>
                ) : (
                  <img 
                    src={featuredAlbum.images[0]?.url || "/images/album-cover.jpg"} 
                    alt={featuredAlbum.name || "Album cover"} 
                    className="rounded-lg shadow-lg w-full"
                  />
                )}
              </div>
              
              <div className="md:w-2/3">
                {loading || !featuredAlbum ? (
                  <div className="space-y-4">
                    <div className="animate-pulse bg-gray-300 h-8 w-3/4 rounded"></div>
                    <div className="animate-pulse bg-gray-300 h-4 w-1/3 rounded"></div>
                    <div className="animate-pulse bg-gray-300 h-24 w-full rounded"></div>
                  </div>
                ) : (
                  <>
                    <h3 className="font-circus text-3xl text-circus-gold mb-2">{featuredAlbum.name}</h3>
                    <p className="font-alt text-lg mb-4">
                      {featuredAlbum.name === "Masquerade Waltz" 
                        ? "Our debut EP features six tracks that showcase our theatrical style and storytelling through music."
                        : "Explore our latest musical journey, combining theatrical elements with a unique sound."}
                    </p>
                    
                    {/* Spotify Embed */}
                    <div className="spotify-embed-container w-full rounded-md overflow-hidden mb-4">
                      <iframe 
                        src={`https://open.spotify.com/embed/album/${featuredAlbum.id}?utm_source=generator&theme=0`}
                        width="100%" 
                        height="152" 
                        frameBorder="0" 
                        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" 
                        loading="lazy"
                      ></iframe>
                    </div>
                  </>
                )}
                
                <Button asChild className="bg-circus-gold text-circus-dark font-bold hover:bg-circus-red hover:text-circus-cream">
                  <Link to="/music">Listen to Full Album</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Upcoming Shows Preview */}
      <section className="py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-circus text-4xl font-bold mb-12 text-circus-dark">
            Catch Us Live
          </h2>
          
          <p className="font-alt text-xl max-w-2xl mx-auto mb-8">
            Experience the magic of Irene's Circus on stage with our theatrical performances. Check our upcoming tour dates.
          </p>
          
          <Button asChild className="bg-circus-gold text-circus-dark font-bold hover:bg-circus-red hover:text-circus-cream">
            <Link to="/tour">View All Tour Dates</Link>
          </Button>
        </div>
      </section>
      
      {/* Contact CTA */}
      <section className="py-16 bg-circus-cream/50">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-circus text-3xl font-bold mb-4 text-circus-dark">
            Get in Touch
          </h2>
          <p className="font-alt text-xl max-w-2xl mx-auto mb-8">
            For bookings, press inquiries, or just to say hello, reach out to us through our contact form.
          </p>
          
          <Button asChild className="bg-circus-gold text-circus-dark font-bold hover:bg-circus-red hover:text-circus-cream">
            <Link to="/contact">Contact Us</Link>
          </Button>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default Home; 