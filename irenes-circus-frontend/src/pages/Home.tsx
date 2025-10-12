import { useState, useEffect } from 'react';
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import useSpotifyData from '@/hooks/useSpotifyData';
import { ARTIST_ID } from '@/lib/spotify';
import TrapezeBanner from "@/components/TrapezeBanner";

const Home = () => {
  const { albums, loading } = useSpotifyData();
  const [featuredAlbum, setFeaturedAlbum] = useState<{ id: string; name: string; images: { url: string }[] } | null>(null);

  // Set the featured album when data is loaded
  useEffect(() => {
    if (albums && albums.length > 0) {
      // Use the first album as featured
      setFeaturedAlbum(albums[0]);
    }
  }, [albums]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-circus-cream to-gray-50 text-circus-dark">
      <Navbar />
      
      {/* Hero Section - Rock Stage */}
      <section className="relative bg-gray-50/70 backdrop-blur min-h-[100vh] flex items-center overflow-hidden">
        {/* Light background overlay */}
        <div className="absolute inset-0 bg-gray-50/20"></div>
        
        {/* Golden accent lights */}
        <div className="absolute top-0 left-1/4 w-32 h-32 bg-circus-gold rounded-full blur-3xl opacity-30 animate-pulse"></div>
        <div className="absolute top-0 right-1/4 w-32 h-32 bg-circus-gold rounded-full blur-3xl opacity-20 animate-pulse" style={{animationDelay: '2s'}}></div>
        
        <div className="container mx-auto px-4 relative z-10 text-center py-20">
          {/* Hero static image replacing tent and text */}
          <div className="mx-auto max-w-4xl">
            <img
              src="/images/hero-irenes-circus.png?v=1"
              alt="Irene's Circus hero banner"
              className="w-full h-auto object-contain mx-auto max-h-[300px] md:max-h-[420px]"
              loading="eager"
              decoding="async"
              fetchPriority="high"
            />
          </div>
          
          
          
          <div className="mt-10 flex flex-col sm:flex-row gap-6 justify-center items-center">
            <Button asChild className="bg-circus-gold text-circus-dark font-circus font-bold text-xl px-10 py-8 rounded-lg border-2 border-circus-gold hover:bg-circus-red hover:text-white transition-all duration-300">
              <Link to="/tour">🎸 TOUR DATES</Link>
            </Button>
            <Button asChild className="bg-transparent text-circus-gold font-circus font-bold text-xl px-10 py-8 rounded-lg border-2 border-circus-gold hover:bg-circus-gold hover:text-circus-dark transition-all duration-300">
              <Link to="/music">🎵 LISTEN NOW</Link>
            </Button>
          </div>
          
          <TrapezeBanner className="mt-12" />
        </div>
      </section>
      
      
      
      {/* Latest Release - Vinyl Style */}
      <section className="py-20 bg-gray-50/70 backdrop-blur text-circus-dark border-t-4 border-circus-gold">
        <div className="container mx-auto px-4">
          <h2 className="font-circus text-5xl font-black mb-12 text-circus-gold text-center animate-spotlight">
            LATEST RELEASE
          </h2>
          
          <div className="bg-gray-50/80 backdrop-blur p-8 border-4 border-circus-gold max-w-6xl mx-auto rounded-lg">
            <div className="flex flex-col lg:flex-row gap-8 items-center">
              <div className="lg:w-1/2">
                {loading || !featuredAlbum ? (
                  <div className="animate-pulse bg-circus-gold/20 rounded-lg w-full aspect-square"></div>
                ) : (
                  <div className="relative group">
                    {/* Vinyl record glow effect */}
                    <div className="absolute inset-0 bg-circus-gold rounded-full blur-xl opacity-30 group-hover:opacity-50 transition-opacity duration-300"></div>
                    
                    {/* Vinyl record with grooves */}
                    <div className="relative w-full aspect-square animate-spin hover:animate-spin" style={{animationDuration: '8s'}}>
                      {/* Outer vinyl ring */}
                      <div className="absolute inset-0 rounded-full border-4 border-circus-gold shadow-2xl bg-gradient-to-br from-gray-900 via-black to-gray-800"></div>
                      
                      {/* Vinyl grooves */}
                      <div className="absolute inset-4 rounded-full border border-gray-700 opacity-60"></div>
                      <div className="absolute inset-8 rounded-full border border-gray-600 opacity-40"></div>
                      <div className="absolute inset-12 rounded-full border border-gray-500 opacity-30"></div>
                      <div className="absolute inset-16 rounded-full border border-gray-400 opacity-20"></div>
                      
                      {/* Album cover in center */}
                      <div className="absolute inset-20 rounded-full overflow-hidden shadow-inner">
                        <img 
                          src={featuredAlbum.images[0]?.url || "/images/album-cover.jpg"} 
                          alt={featuredAlbum.name || "Album cover"} 
                          className="w-full h-full object-cover"
                        />
                      </div>
                      
                      {/* Center hole */}
                      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-6 h-6 bg-circus-dark rounded-full border-2 border-circus-gold shadow-inner"></div>
                      
                      {/* Vinyl shine effect */}
                      <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-transparent via-gray-100 to-transparent opacity-10 group-hover:opacity-20 transition-opacity duration-300"></div>
                    </div>
                    
                    {/* Turntable Tonearm (positioned to play the record) */}
                    <div className="absolute top-1/3 right-1/4 transform translate-x-8 -translate-y-4 z-10">
                      {/* Tonearm base/pivot */}
                      <div className="w-8 h-8 bg-circus-gold rounded-full border-3 border-circus-dark shadow-2xl relative">
                        {/* Tonearm shaft */}
                        <div className="absolute top-1/2 left-1/2 transform -translate-y-1/2 origin-left w-28 h-2 bg-gradient-to-r from-circus-gold to-circus-gold/80 rounded-full shadow-lg rotate-[-40deg]">
                          {/* Cartridge/stylus assembly */}
                          <div className="absolute right-0 top-1/2 transform -translate-y-1/2">
                            {/* Cartridge body */}
                            <div className="w-6 h-3 bg-circus-gold rounded-sm border-2 border-circus-dark shadow-md"></div>
                            {/* Stylus needle touching the record */}
                            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1 w-1 h-4 bg-circus-gold shadow-lg"></div>
                            {/* Stylus contact point glow - positioned on the vinyl surface */}
                            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-3 w-2 h-2 bg-circus-gold rounded-full blur-sm opacity-90 animate-pulse"></div>
                          </div>
                        </div>
                        {/* Tonearm counterweight */}
                        <div className="absolute top-1/2 left-1/2 transform -translate-y-1/2 -translate-x-8 w-5 h-5 bg-circus-dark rounded-full border-2 border-circus-gold shadow-lg"></div>
                        {/* Tonearm rest/guide */}
                        <div className="absolute top-1/2 left-1/2 transform -translate-y-1/2 translate-x-2 w-2 h-8 bg-circus-gold rounded-full opacity-60 shadow-md"></div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="lg:w-1/2">
                {loading || !featuredAlbum ? (
                  <div className="space-y-4">
                    <div className="animate-pulse bg-circus-gold/20 h-12 w-3/4 rounded"></div>
                    <div className="animate-pulse bg-circus-gold/20 h-6 w-1/2 rounded"></div>
                    <div className="animate-pulse bg-circus-gold/20 h-32 w-full rounded"></div>
                  </div>
                ) : (
                  <>
                    <h3 className="font-circus text-4xl text-circus-gold mb-4">
                      {featuredAlbum.name}
                    </h3>
                    <div className="font-alt text-xl mb-6 text-circus-dark">
                      <p className="italic">
                        {featuredAlbum.name === "Masquerade Waltz" 
                          ? "Six tracks of raw, uncompromising sound that defines our rebellious spirit. This isn't just music - it's a sonic revolution."
                          : ""}
                      </p>
                    </div>
                    
                    {/* Spotify Embed with rock styling */}
                    <div className="bg-gray-50/50 p-4 border-2 border-circus-gold/30 rounded-lg mb-6 hover:border-circus-gold transition-all duration-300">
                      <iframe 
                        src={`https://open.spotify.com/embed/album/${featuredAlbum.id}?utm_source=generator&theme=0`}
                        width="100%" 
                        height="152" 
                        frameBorder="0" 
                        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" 
                        loading="lazy"
                        className="rounded-none"
                      ></iframe>
                    </div>
                  </>
                )}
                
                <Button asChild className="bg-circus-gold text-circus-dark font-circus font-bold text-lg px-8 py-4 rounded-lg border-2 border-circus-gold hover:bg-circus-red hover:text-white transition-all duration-300 shadow-lg relative overflow-hidden">
                  <Link to="/music" className="flex items-center gap-3">
                    {/* Vinyl record icon */}
                    <div className="w-6 h-6 rounded-full bg-circus-dark border-2 border-circus-gold relative">
                      <div className="absolute inset-1 rounded-full border border-gray-600 opacity-60"></div>
                      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-circus-gold rounded-full"></div>
                    </div>
                    <span>FULL DISCOGRAPHY</span>
                    {/* Enhanced Turntable Tonearm */}
                    <div className="relative">
                      {/* Tonearm base/pivot */}
                      <div className="w-2 h-2 bg-rock-steel rounded-full relative">
                        {/* Tonearm shaft */}
                        <div className="absolute top-1/2 left-1/2 transform -translate-y-1/2 origin-left w-8 h-0.5 bg-rock-amber rotate-[-15deg]">
                          {/* Cartridge/stylus assembly */}
                          <div className="absolute right-0 top-1/2 transform -translate-y-1/2">
                            {/* Cartridge body */}
                            <div className="w-2 h-1 bg-rock-rust rounded-sm"></div>
                            {/* Stylus needle */}
                            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0.5 h-1 bg-rock-amber"></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Live Shows CTA */}
      <section className="py-20 bg-gray-50/70 backdrop-blur">
        <div className="container mx-auto px-4 text-center">
          <Button asChild className="bg-circus-gold text-circus-dark font-circus font-bold text-xl px-12 py-6 rounded-lg border-4 border-circus-gold hover:bg-circus-red hover:text-white transition-all duration-300">
            <Link to="/tour">🎸 TOUR DATES & TICKETS</Link>
          </Button>
        </div>
      </section>
      
      {/* Contact CTA */}
      <section className="py-16 bg-gray-50/70 backdrop-blur border-t-4 border-circus-gold">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-circus text-4xl font-black mb-6 text-circus-gold animate-spotlight">
            JOIN THE CIRCUS
          </h2>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild className="bg-circus-gold text-circus-dark font-circus font-bold text-lg px-8 py-4 rounded-lg border-2 border-circus-gold hover:bg-circus-red hover:text-white transition-all duration-300">
              <Link to="/contact">📧 CONTACT US</Link>
            </Button>
            <Button asChild className="bg-transparent text-circus-gold font-circus font-bold text-lg px-8 py-4 rounded-lg border-2 border-circus-gold hover:bg-circus-gold hover:text-circus-dark transition-all duration-300">
              <Link to="/gallery">📸 GALLERY</Link>
            </Button>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default Home; 