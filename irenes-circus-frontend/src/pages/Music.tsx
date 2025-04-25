import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import useSpotifyData, { SpotifyAlbum } from '@/hooks/useSpotifyData';
import { ARTIST_ID } from '@/lib/spotify';
import { useState, useEffect } from 'react';

const Music = () => {
  const { albums, loading, error } = useSpotifyData();
  const [selectedAlbum, setSelectedAlbum] = useState<string | null>(null);

  // Set default selected album when albums are loaded
  useEffect(() => {
    if (albums && albums.length > 0 && !selectedAlbum) {
      setSelectedAlbum(albums[0].id);
    }
  }, [albums]);

  // Streaming platform links
  const streamingLinks = {
    spotify: `https://open.spotify.com/artist/${ARTIST_ID}`,
    appleMusic: "https://music.apple.com/artist/irenes-circus", // Update with real link
    youtubeMusic: "https://music.youtube.com/channel/irenes-circus" // Update with real link
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-circus-cream flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-circus-gold"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-circus-cream flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-circus text-circus-gold mb-4">Oops!</h2>
          <p className="text-circus-dark">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-circus-dark text-circus-cream">
      <Navbar />
      
      <main className="container mx-auto px-4 py-12">
        <h1 className="font-circus text-4xl md:text-6xl text-circus-gold mb-4">Music</h1>
        <p className="font-alt text-lg mb-12 max-w-2xl">
          Explore our theatrical musical journey through our recordings.
          Stream our albums and singles.
          </p>

        <section className="mb-16">
          <h2 className="font-circus text-3xl text-circus-gold mb-8">Discography</h2>
          <div className="grid md:grid-cols-2 gap-8">
            {/* Album Grid with Scrolling */}
            <div className="max-h-[600px] overflow-y-auto pr-4 space-y-6 custom-scrollbar">
              {albums.map((album: SpotifyAlbum) => (
                    <div 
                      key={album.id}
                  className={`bg-circus-dark/50 backdrop-blur rounded-lg p-6 border cursor-pointer transition-all
                    ${selectedAlbum === album.id 
                      ? 'border-circus-gold ring-2 ring-circus-gold/20' 
                      : 'border-circus-cream/20 hover:border-circus-gold/50'}`}
                      onClick={() => setSelectedAlbum(album.id)}
                    >
                  <div className="flex gap-4">
                        <img 
                      src={album.images[0]?.url} 
                      alt={`${album.name} Cover`}
                      className="w-24 h-24 object-cover rounded-md"
                        />
                        <div>
                      <h3 className="font-circus text-xl mb-2">{album.name}</h3>
                      <p className="text-circus-cream/60 mb-2">
                        {album.album_type.charAt(0).toUpperCase() + album.album_type.slice(1)} • {new Date(album.release_date).getFullYear()} • {album.total_tracks} tracks
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
            {/* Fixed-height Spotify Player */}
            <div className="bg-circus-dark/50 backdrop-blur rounded-lg p-6 border border-circus-cream/20 h-[600px] flex items-center justify-center">
              {selectedAlbum ? (
                      <iframe 
                  src={`https://open.spotify.com/embed/album/${selectedAlbum}?utm_source=generator&theme=0`}
                        width="100%" 
                        height="380" 
                        frameBorder="0" 
                        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" 
                        loading="lazy"
                  className="rounded-lg"
                      ></iframe>
              ) : (
                <div className="text-center text-circus-cream/60">
                  <p>Select an album to play</p>
                </div>
              )}
            </div>
        </div>
      </section>
      
        <section>
          <h2 className="font-circus text-2xl text-circus-gold mb-6">Listen On</h2>
          <div className="flex flex-wrap gap-4">
            <a
              href={streamingLinks.spotify}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-[#1DB954] text-white px-6 py-3 rounded-full font-bold hover:bg-[#1ed760] transition-colors"
            >
              <svg viewBox="0 0 24 24" className="w-6 h-6 fill-current">
                <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.371-.721.49-1.101.241-3.021-1.858-6.832-2.278-11.322-1.245-.435.101-.861-.21-.961-.645-.101-.435.21-.861.645-.961 4.91-1.121 9.021-.671 12.451 1.371.369.241.49.721.241 1.101zm1.47-3.27c-.301.461-.921.6-1.381.301-3.461-2.131-8.722-2.751-12.842-1.511-.491.18-1.021-.061-1.201-.541-.18-.491.061-1.021.541-1.201 4.681-1.421 10.511-.721 14.471 1.771.449.281.6.901.301 1.361zm.129-3.39c-4.141-2.461-11.012-2.691-14.972-1.49-.61.18-1.251-.18-1.431-.79-.18-.61.18-1.251.79-1.431 4.561-1.381 12.152-1.111 16.952 1.721.57.341.761 1.081.42 1.651-.34.58-1.081.77-1.651.429z"/>
              </svg>
              Spotify
            </a>
            
            <a
              href={streamingLinks.appleMusic}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-[#FA57C1] text-white px-6 py-3 rounded-full font-bold hover:bg-[#ff6cc8] transition-colors"
            >
              <svg viewBox="0 0 24 24" className="w-6 h-6 fill-current">
                <path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701"/>
              </svg>
              Apple Music
            </a>
          
            <a
              href={streamingLinks.youtubeMusic}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-[#FF0000] text-white px-6 py-3 rounded-full font-bold hover:bg-[#ff1a1a] transition-colors"
            >
              <svg viewBox="0 0 24 24" className="w-6 h-6 fill-current">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
              </svg>
              YouTube Music
            </a>
        </div>
      </section>
      </main>
      
      <Footer />
    </div>
  );
};

// Add custom scrollbar styles to your global CSS
const styles = `
.custom-scrollbar::-webkit-scrollbar {
  width: 8px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 4px;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.2);
  border-radius: 4px;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.3);
}
`;

// Add styles to head
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement("style");
  styleSheet.innerText = styles;
  document.head.appendChild(styleSheet);
}

export default Music;
