
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import MusicPlayer from "@/components/MusicPlayer";
import { tracks } from "@/data/bandData";
import { DiscAlbum, Calendar, Play } from "lucide-react";

const Music = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-circus-cream to-white text-circus-dark">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative bg-circus-dark text-circus-cream py-20">
        <div className="container mx-auto px-4">
          <h1 className="font-circus text-4xl md:text-5xl font-bold mb-4 text-circus-gold animate-spotlight">
            Our Music
          </h1>
          <p className="font-alt text-xl max-w-2xl mb-6">
            Explore our latest releases, albums, and singles. Irene's Circus blends theatrical storytelling with alternative rock for a unique musical experience.
          </p>
        </div>
      </section>
      
      {/* Featured Release */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="w-full md:w-1/2">
              <h2 className="font-circus text-3xl font-bold mb-4 text-circus-red">
                Featured Release
              </h2>
              <h3 className="font-circus text-2xl mb-3">Under the Big Top</h3>
              <p className="font-alt mb-6 text-lg">
                Our latest EP explores the thrill and wonder of circus life through a unique musical journey. Five tracks that take you from the anticipation before the show to the grand finale.
              </p>
              
              <div className="flex gap-4 mb-8">
                <div className="flex items-center gap-2 text-circus-dark/70 font-alt">
                  <DiscAlbum size={18} />
                  <span>EP</span>
                </div>
                <div className="flex items-center gap-2 text-circus-dark/70 font-alt">
                  <Calendar size={18} />
                  <span>Released: April 2025</span>
                </div>
              </div>
              
              <button className="bg-circus-gold text-circus-dark px-6 py-3 rounded-lg font-bold flex items-center gap-2 hover:bg-circus-red hover:text-circus-cream transition-colors">
                <Play size={20} />
                Play Album
              </button>
            </div>
            
            <div className="w-full md:w-1/2">
              <div className="rounded-lg overflow-hidden shadow-xl">
                <img 
                  src="https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80" 
                  alt="Under the Big Top album cover" 
                  className="w-full h-auto object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Player Section */}
      <section className="py-16 bg-circus-dark text-circus-cream">
        <div className="container mx-auto px-4">
          <h2 className="font-circus text-3xl font-bold mb-8 text-circus-gold">
            Listen Now
          </h2>
          
          <MusicPlayer tracks={tracks} />
        </div>
      </section>
      
      {/* Discography */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="font-circus text-3xl font-bold mb-8 text-circus-dark">
            Discography
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Album 1 */}
            <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow">
              <div className="h-64 overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1511379938547-c1f69419868d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80" 
                  alt="Album cover" 
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                />
              </div>
              <div className="p-4">
                <h3 className="font-circus text-xl font-bold">The First Act</h3>
                <p className="font-alt text-sm text-circus-dark/70 mb-2">Debut Album • 2023</p>
                <p className="font-alt mb-4">
                  Our first full-length album that introduced the world to the Irene's Circus sound.
                </p>
                <button className="text-circus-red font-bold flex items-center gap-1 hover:text-circus-gold transition-colors">
                  <Play size={16} />
                  Listen
                </button>
              </div>
            </div>
            
            {/* Album 2 */}
            <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow">
              <div className="h-64 overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1470019693664-1d202d2c0907?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80" 
                  alt="Album cover" 
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                />
              </div>
              <div className="p-4">
                <h3 className="font-circus text-xl font-bold">Funambulism</h3>
                <p className="font-alt text-sm text-circus-dark/70 mb-2">EP • 2024</p>
                <p className="font-alt mb-4">
                  A collection of songs inspired by the art of tightrope walking and finding balance.
                </p>
                <button className="text-circus-red font-bold flex items-center gap-1 hover:text-circus-gold transition-colors">
                  <Play size={16} />
                  Listen
                </button>
              </div>
            </div>
            
            {/* Album 3 */}
            <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow">
              <div className="h-64 overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80" 
                  alt="Album cover" 
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                />
              </div>
              <div className="p-4">
                <h3 className="font-circus text-xl font-bold">Under the Big Top</h3>
                <p className="font-alt text-sm text-circus-dark/70 mb-2">EP • 2025</p>
                <p className="font-alt mb-4">
                  Our latest release exploring the wonder and drama of circus life.
                </p>
                <button className="text-circus-red font-bold flex items-center gap-1 hover:text-circus-gold transition-colors">
                  <Play size={16} />
                  Listen
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default Music;
