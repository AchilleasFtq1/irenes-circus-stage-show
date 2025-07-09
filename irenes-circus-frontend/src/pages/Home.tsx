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
    <div className="min-h-screen bg-rock-gradient text-rock-cream">
      <Navbar />
      
      {/* Hero Section - Rock Stage */}
      <section className="relative bg-rock-black min-h-[100vh] flex items-center overflow-hidden">
        {/* Grunge background overlay */}
        <div className="absolute inset-0 bg-grunge-overlay opacity-30"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-rock-black via-rock-charcoal to-rock-slate opacity-90"></div>
        
        {/* Stage lights effect */}
        <div className="absolute top-0 left-1/4 w-32 h-32 bg-rock-amber rounded-full blur-3xl opacity-20 animate-stage-lights"></div>
        <div className="absolute top-0 right-1/4 w-32 h-32 bg-rock-rust rounded-full blur-3xl opacity-20 animate-stage-lights" style={{animationDelay: '2s'}}></div>
        
        <div className="container mx-auto px-4 relative z-10 text-center py-20">
          <h1 className="font-edgy text-7xl md:text-9xl font-black mb-6 text-rock-amber rock-text-shadow animate-amp-glow">
            <span className="distorted-text" data-text="IRENE'S">IRENE'S</span>
          </h1>
          <h2 className="font-rock text-5xl md:text-7xl font-bold mb-8 text-rock-rust rock-text-shadow animate-feedback">
            <span className="distorted-text" data-text="CIRCUS">CIRCUS</span>
          </h2>
          
          <div className="mb-8 font-hipster text-xl md:text-2xl text-rock-smoke max-w-4xl mx-auto leading-relaxed">
            <p className="mb-2 animate-riff">⚡ PROGRESSIVE ROCK • COUNTRY FUSION • ALTERNATIVE METAL ⚡</p>
            <p className="italic">Raw. Authentic. Uncompromising.</p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <Button asChild className="bg-rust-gradient text-rock-cream font-rock font-bold text-xl px-10 py-8 rounded-none border-2 border-rock-rust hover:border-rock-amber transition-all duration-300 amp-glow animate-rock-pulse">
              <Link to="/tour">🎸 TOUR DATES</Link>
            </Button>
            <Button asChild className="bg-rock-charcoal text-rock-amber font-rock font-bold text-xl px-10 py-8 rounded-none border-2 border-rock-amber hover:border-rock-rust hover:bg-rock-slate transition-all duration-300 animate-rock-pulse">
              <Link to="/music">🎵 LISTEN NOW</Link>
            </Button>
          </div>
          
          {/* Sound wave visualization */}
          <div className="mt-12 flex justify-center items-end gap-1">
            {[...Array(20)].map((_, i) => (
              <div
                key={i}
                className="bg-rock-rust w-2 rounded-t-sm animate-headbang"
                style={{
                  height: `${Math.random() * 60 + 20}px`,
                  animationDelay: `${i * 0.1}s`
                }}
              />
            ))}
          </div>
        </div>
      </section>
      
      {/* Band Philosophy */}
      <section className="py-20 bg-rock-charcoal border-t-4 border-rock-rust">
        <div className="container mx-auto px-4">
          <h2 className="font-edgy text-5xl font-black mb-12 text-rock-amber text-center rock-text-shadow">
            THE SOUND
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
            <div className="bg-rock-slate p-8 border-2 border-rock-steel hover:border-rock-amber transition-all duration-300 text-center group hover:animate-distortion">
              <div className="h-20 w-20 bg-rock-rust text-rock-cream rounded-none flex items-center justify-center text-3xl font-bold mx-auto mb-6 border-2 border-rock-amber group-hover:animate-amp-glow">
                🎸
              </div>
              <h3 className="font-rock text-2xl text-rock-amber mb-4 rock-text-shadow">HEAVY RIFFS</h3>
              <p className="font-hipster text-lg text-rock-smoke">
                Crushing guitar work that blends metal aggression with country soul. Every note hits like thunder.
              </p>
            </div>
            
            <div className="bg-rock-slate p-8 border-2 border-rock-steel hover:border-rock-amber transition-all duration-300 text-center group hover:animate-distortion">
              <div className="h-20 w-20 bg-rock-rust text-rock-cream rounded-none flex items-center justify-center text-3xl font-bold mx-auto mb-6 border-2 border-rock-amber group-hover:animate-amp-glow">
                🎤
              </div>
              <h3 className="font-rock text-2xl text-rock-amber mb-4 rock-text-shadow">RAW VOCALS</h3>
              <p className="font-hipster text-lg text-rock-smoke">
                Unfiltered emotion delivered with the power of a freight train. No auto-tune, just pure human expression.
              </p>
            </div>
            
            <div className="bg-rock-slate p-8 border-2 border-rock-steel hover:border-rock-amber transition-all duration-300 text-center group hover:animate-distortion">
              <div className="h-20 w-20 bg-rock-rust text-rock-cream rounded-none flex items-center justify-center text-3xl font-bold mx-auto mb-6 border-2 border-rock-amber group-hover:animate-amp-glow">
                🥁
              </div>
              <h3 className="font-rock text-2xl text-rock-amber mb-4 rock-text-shadow">THUNDEROUS RHYTHM</h3>
              <p className="font-hipster text-lg text-rock-smoke">
                Rhythms that shake the earth and move the soul. From subtle country grooves to metal madness.
              </p>
            </div>
          </div>
          
          <div className="text-center">
            <Button asChild className="bg-rock-amber text-rock-black font-rock font-bold text-lg px-8 py-4 rounded-none border-2 border-rock-rust hover:bg-rock-rust hover:text-rock-cream transition-all duration-300 amp-glow">
              <Link to="/about">🤘 OUR STORY</Link>
            </Button>
          </div>
        </div>
      </section>
      
      {/* Latest Release - Vinyl Style */}
      <section className="py-20 bg-rock-black text-rock-cream border-t-4 border-rock-amber">
        <div className="container mx-auto px-4">
          <h2 className="font-edgy text-5xl font-black mb-12 text-rock-rust text-center rock-text-shadow">
            LATEST RELEASE
          </h2>
          
          <div className="bg-rock-charcoal p-8 border-4 border-rock-rust max-w-6xl mx-auto grunge-border">
            <div className="flex flex-col lg:flex-row gap-8 items-center">
              <div className="lg:w-1/2">
                {loading || !featuredAlbum ? (
                  <div className="animate-pulse bg-rock-slate rounded-lg w-full aspect-square vinyl-record"></div>
                ) : (
                  <div className="relative group">
                    {/* Vinyl record glow effect */}
                    <div className="absolute inset-0 bg-rock-rust rounded-full blur-xl opacity-30 group-hover:opacity-50 transition-opacity duration-300"></div>
                    
                    {/* Vinyl record with grooves */}
                    <div className="relative w-full aspect-square animate-spin hover:animate-spin" style={{animationDuration: '8s'}}>
                      {/* Outer vinyl ring */}
                      <div className="absolute inset-0 rounded-full border-4 border-rock-amber shadow-2xl bg-gradient-to-br from-gray-900 via-gray-800 to-black"></div>
                      
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
                      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-6 h-6 bg-rock-black rounded-full border-2 border-rock-amber shadow-inner"></div>
                      
                      {/* Vinyl shine effect */}
                      <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-transparent via-white to-transparent opacity-10 group-hover:opacity-20 transition-opacity duration-300"></div>
                    </div>
                    
                    {/* Turntable Tonearm (positioned to play the record) */}
                    <div className="absolute top-1/3 right-1/4 transform translate-x-8 -translate-y-4 z-10">
                      {/* Tonearm base/pivot */}
                      <div className="w-8 h-8 bg-rock-steel rounded-full border-3 border-rock-amber shadow-2xl relative">
                        {/* Tonearm shaft */}
                        <div className="absolute top-1/2 left-1/2 transform -translate-y-1/2 origin-left w-28 h-2 bg-gradient-to-r from-rock-amber to-rock-copper rounded-full shadow-lg rotate-[-40deg]">
                          {/* Cartridge/stylus assembly */}
                          <div className="absolute right-0 top-1/2 transform -translate-y-1/2">
                            {/* Cartridge body */}
                            <div className="w-6 h-3 bg-rock-rust rounded-sm border-2 border-rock-amber shadow-md"></div>
                            {/* Stylus needle touching the record */}
                            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1 w-1 h-4 bg-rock-amber shadow-lg"></div>
                            {/* Stylus contact point glow - positioned on the vinyl surface */}
                            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-3 w-2 h-2 bg-rock-amber rounded-full blur-sm opacity-90 animate-pulse"></div>
                          </div>
                        </div>
                        {/* Tonearm counterweight */}
                        <div className="absolute top-1/2 left-1/2 transform -translate-y-1/2 -translate-x-8 w-5 h-5 bg-rock-charcoal rounded-full border-2 border-rock-steel shadow-lg"></div>
                        {/* Tonearm rest/guide */}
                        <div className="absolute top-1/2 left-1/2 transform -translate-y-1/2 translate-x-2 w-2 h-8 bg-rock-steel rounded-full opacity-60 shadow-md"></div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="lg:w-1/2">
                {loading || !featuredAlbum ? (
                  <div className="space-y-4">
                    <div className="animate-pulse bg-rock-slate h-12 w-3/4 rounded"></div>
                    <div className="animate-pulse bg-rock-slate h-6 w-1/2 rounded"></div>
                    <div className="animate-pulse bg-rock-slate h-32 w-full rounded"></div>
                  </div>
                ) : (
                  <>
                    <h3 className="font-edgy text-4xl text-rock-amber mb-4">
                      {featuredAlbum.name}
                    </h3>
                    <div className="font-hipster text-xl mb-6 text-rock-smoke">
                      <p className="mb-2">🎯 Genre: Progressive Rock • Country Metal</p>
                      <p className="mb-4">⚡ Pure electricity on vinyl</p>
                      <p className="italic">
                        {featuredAlbum.name === "Masquerade Waltz" 
                          ? "Six tracks of raw, uncompromising sound that defines our rebellious spirit. This isn't just music - it's a sonic revolution."
                          : "Experience the sound that breaks boundaries and redefines what rock can be. No compromises, just pure artistic expression."}
                      </p>
                    </div>
                    
                    {/* Spotify Embed with rock styling */}
                    <div className="bg-rock-slate p-4 border-2 border-rock-steel rounded-none mb-6 hover:border-rock-amber transition-all duration-300">
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
                
                <Button asChild className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-rock-amber font-rock font-bold text-lg px-8 py-4 rounded-none border-2 border-rock-amber hover:border-rock-rust transition-all duration-300 shadow-lg relative overflow-hidden">
                  <Link to="/music" className="flex items-center gap-3">
                    {/* Vinyl record icon */}
                    <div className="w-6 h-6 rounded-full bg-black border-2 border-rock-amber relative">
                      <div className="absolute inset-1 rounded-full border border-gray-600 opacity-60"></div>
                      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-rock-amber rounded-full"></div>
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
      
      {/* Live Shows */}
      <section className="py-20 bg-rock-gradient border-t-4 border-rock-rust">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-edgy text-5xl font-black mb-12 text-rock-amber rock-text-shadow">
            LIVE & LOUD
          </h2>
          
          <div className="max-w-4xl mx-auto mb-8">
            <p className="font-hipster text-2xl text-rock-smoke mb-4">
              🔥 Experience the raw power of live rock 🔥
            </p>
            <p className="font-country text-xl text-rock-ash">
              Every show is a sonic journey through the depths of human emotion. 
              Feel the amp stacks shake your bones and the rhythm move your soul.
            </p>
          </div>
          
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            <span className="bg-rock-rust text-rock-cream px-6 py-2 font-rock font-bold border-2 border-rock-amber animate-rock-pulse">LOUD</span>
            <span className="bg-rock-amber text-rock-black px-6 py-2 font-rock font-bold border-2 border-rock-rust animate-rock-pulse">RAW</span>
            <span className="bg-rock-charcoal text-rock-amber px-6 py-2 font-rock font-bold border-2 border-rock-steel animate-rock-pulse">AUTHENTIC</span>
          </div>
          
          <Button asChild className="bg-rock-amber text-rock-black font-rock font-bold text-xl px-12 py-6 rounded-none border-4 border-rock-rust hover:bg-rock-rust hover:text-rock-cream transition-all duration-300 amp-glow animate-headbang">
            <Link to="/tour">🎸 TOUR DATES & TICKETS</Link>
          </Button>
        </div>
      </section>
      
      {/* Contact CTA */}
      <section className="py-16 bg-rock-black border-t-4 border-rock-amber">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-edgy text-4xl font-black mb-6 text-rock-rust rock-text-shadow">
            JOIN THE REVOLUTION
          </h2>
          <p className="font-hipster text-xl max-w-3xl mx-auto mb-8 text-rock-smoke">
            Ready to experience real rock music? Get in touch for bookings, collaborations, 
            or just to share your passion for authentic sound.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild className="bg-rock-rust text-rock-cream font-rock font-bold text-lg px-8 py-4 rounded-none border-2 border-rock-amber hover:bg-rock-amber hover:text-rock-black transition-all duration-300 amp-glow">
              <Link to="/contact">📧 CONTACT US</Link>
            </Button>
            <Button asChild className="bg-rock-charcoal text-rock-amber font-rock font-bold text-lg px-8 py-4 rounded-none border-2 border-rock-steel hover:border-rock-rust transition-all duration-300">
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