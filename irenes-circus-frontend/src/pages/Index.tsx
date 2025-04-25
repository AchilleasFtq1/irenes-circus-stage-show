import { Link } from "react-router-dom";
import { ArrowRight, Play, Calendar, Instagram, Facebook, Youtube } from "lucide-react";
import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import MusicPlayer from "@/components/MusicPlayer";
import EventCard from "@/components/EventCard";
import { getArtistTopTracks } from "@/lib/spotify";
import type { SpotifyTrack } from "@/lib/spotify";

interface Track {
  id: number;
  title: string;
  duration: string;
  audioSrc: string;
  albumArt: string;
}

const Index = () => {
  const [events, setEvents] = useState<any[]>([]);
  const [tracks, setTracks] = useState<Track[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch events from backend
        const eventsResponse = await fetch(`${import.meta.env.VITE_API_URL}/api/events`);
        const eventsData = await eventsResponse.json();
        setEvents(eventsData);

        // Fetch tracks from Spotify and convert to MusicPlayer format
        const spotifyTracks = await getArtistTopTracks();
        if (spotifyTracks) {
          const formattedTracks: Track[] = spotifyTracks.map((track, index) => ({
            id: index + 1, // Add sequential IDs
            title: track.name,
            duration: formatDuration(track.duration_ms),
            audioSrc: track.preview_url || '',
            albumArt: track.album.images[0]?.url || ''
          }));
          setTracks(formattedTracks);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const formatDuration = (ms: number): string => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  // Use only the first 3 events for the homepage
  const upcomingEvents = events.slice(0, 3);

  // Spotify artist URL
  const spotifyUrl = "https://open.spotify.com/artist/25XfQgnvMcoCvcfNqU69ZG";

  if (loading) {
    return <div className="min-h-screen bg-circus-cream flex items-center justify-center">
      <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-circus-gold"></div>
    </div>;
  }

  return (
    <div className="min-h-screen bg-circus-cream text-circus-dark" style={{ background: "linear-gradient(to bottom, #F9F4D2 0%, #fff 100%)" }}>
      <Navbar />
      
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-12 md:py-24">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div>
            <h1 className="font-circus text-4xl md:text-6xl mb-4">
              Welcome to<br />
              <span className="text-circus-gold">Irene's Circus</span>
            </h1>
            <p className="font-alt text-lg mb-8">
              Experience the magic of circus arts through music and performance
            </p>
            <Link
              to="/about"
              className="inline-flex items-center gap-2 bg-circus-gold text-circus-dark px-6 py-3 rounded-full font-circus hover:bg-circus-red hover:text-white transition-colors"
            >
              Learn More <ArrowRight size={20} />
            </Link>
          </div>
          
          {/* Music Player */}
          <div className="relative">
            <MusicPlayer tracks={tracks} />
          </div>
        </div>
      </section>

      {/* Upcoming Events Section */}
      <section className="container mx-auto px-4 py-12">
        <div className="flex justify-between items-center mb-8">
          <h2 className="font-circus text-3xl">Upcoming Events</h2>
          <Link
            to="/events"
            className="inline-flex items-center gap-2 text-circus-gold hover:text-circus-red transition-colors"
          >
            View All <ArrowRight size={20} />
          </Link>
        </div>
        
        <div className="grid md:grid-cols-3 gap-6">
          {upcomingEvents.map(event => (
            <EventCard 
              key={event.id} 
              event={{...event, _id: event.id}}
              className="text-circus-dark bg-white bg-opacity-80 hover:border-circus-gold"
            />
          ))}
        </div>
      </section>

      {/* Social Links */}
      <section className="container mx-auto px-4 py-12">
        <h2 className="font-circus text-3xl text-center mb-8">Follow Us</h2>
        <div className="flex justify-center gap-6">
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-circus-dark hover:text-circus-gold transition-colors"
          >
            <Instagram size={32} />
          </a>
          <a
            href="https://facebook.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-circus-dark hover:text-circus-gold transition-colors"
          >
            <Facebook size={32} />
          </a>
          <a
            href="https://youtube.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-circus-dark hover:text-circus-gold transition-colors"
          >
            <Youtube size={32} />
          </a>
          <a
            href={spotifyUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-circus-dark hover:text-circus-gold transition-colors"
          >
            <Play size={32} />
          </a>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
