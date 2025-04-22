
import { Link } from "react-router-dom";
import { ArrowRight, Play, Calendar, Instagram, Facebook, Youtube } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { events, tracks } from "@/data/bandData";
import MusicPlayer from "@/components/MusicPlayer";
import EventCard from "@/components/EventCard";

const Index = () => {
  // Use only the first 3 events for the homepage
  const upcomingEvents = events.slice(0, 3);

  // Placeholder Spotify link
  const spotifyUrl = "https://open.spotify.com/artist/6TLsXlJETwFmrCkfq6ZrTr";

  return (
    <div className="min-h-screen bg-circus-cream text-circus-dark" style={{ background: "linear-gradient(to bottom, #F9F4D2 0%, #fff 100%)" }}>
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative bg-circus-dark text-circus-cream overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80" 
            alt="Irene's Circus performing" 
            className="w-full h-full object-cover opacity-40"
          />
        </div>
        
        <div className="container mx-auto px-4 py-20 md:py-32 relative z-10 flex flex-col items-center">
          <img
            src="/lovable-uploads/fe5985cf-a00a-4e1f-9fcc-4dfb55611ee7.png"
            alt="Irene's Circus Logo"
            className="w-40 h-40 md:w-56 md:h-56 mb-6 object-contain drop-shadow-lg animate-float"
            style={{ background: "#F9F4D2", borderRadius: '1.5rem', border: "4px solid #F0A202" }}
          />
          <div className="max-w-3xl w-full animate-spotlight text-center">
            <h1 className="font-circus text-4xl md:text-6xl font-black mb-4 text-circus-gold drop-shadow-lg">
              Irene's Circus
            </h1>
            <p className="font-alt text-xl md:text-2xl mb-8 leading-relaxed text-circus-cream">
              A theatrical musical experience that combines powerful vocals, dramatic instrumentation, and circus-inspired performance art.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link 
                to="/music" 
                className="bg-circus-gold text-circus-dark px-6 py-3 rounded-lg font-bold flex items-center gap-2 hover:bg-circus-red hover:text-circus-cream transition-colors"
              >
                <Play size={20} />
                Listen Now
              </Link>
              <Link 
                to="/tour" 
                className="bg-transparent border-2 border-circus-gold text-circus-gold px-6 py-3 rounded-lg font-bold flex items-center gap-2 hover:bg-circus-gold hover:text-circus-dark transition-colors"
              >
                <Calendar size={20} />
                Tour Dates
              </Link>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-circus-dark to-transparent"></div>
      </section>
      
      {/* Latest Release Section */}
      <section className="py-16" style={{ background: "#1C77C3" }}>
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center mb-8">
            <h2 className="font-circus text-3xl font-bold mb-2 md:mb-0" style={{ color: "#F0A202", textShadow: "0 2px 8px #2B303A77" }}>
              Latest Release
            </h2>
            <Link 
              to="/music" 
              className="font-alt flex items-center gap-1 hover:text-circus-gold transition-colors text-circus-cream"
              style={{ color: "#fff" }}
            >
              View All Music <ArrowRight size={16} />
            </Link>
          </div>
          
          <MusicPlayer tracks={tracks.slice(0, 3)} />

          <div className="mt-6 flex justify-center">
            <a
              href={spotifyUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 bg-[#1DB954] text-white font-bold px-6 py-3 rounded-full shadow-lg hover:bg-[#169147] transition-colors"
              style={{ fontFamily: 'Montserrat, sans-serif', letterSpacing: 1 }}
            >
              <svg width="26" height="26" viewBox="0 0 168 168" xmlns="http://www.w3.org/2000/svg"><g fill="none"><circle fill="#1ED760" cx="84" cy="84" r="84"/><g transform="translate(45 52)" fill="#FFF"><path d="M79.714 66.171c-1.327 0-2.687-.389-3.868-1.198-20.934-13.387-47.076-16.411-77.858-9.012a6.09 6.09 0 01-7.301-4.37 6.093 6.093 0 014.369-7.302c33.968-8.059 63.471-4.544 87.466 10.46a6.09 6.09 0 01-3.808 11.222zM84.711 49.667c-1.646 0-3.306-.495-4.732-1.523-24.067-16.926-60.885-21.768-89.581-11.949a7.01 7.01 0 01-8.816-4.878 6.99 6.99 0 014.876-8.814c32.13-10.924 72.303-5.561 100.337 13.511a7.002 7.002 0 01-2.084 12.635zM85.685 32.359c-.932 0-1.869-.17-2.784-.527C62.348 22.295 37.814 19.624 10.575 24.943a8.008 8.008 0 01-9.466-6.465 8.004 8.004 0 016.466-9.466C40.355 3.7 68.963 6.762 94.578 17.625a8.006 8.006 0 013.898 10.497 7.996 7.996 0 01-7.037 4.237z"/></g></g></svg>
              Listen on Spotify
            </a>
          </div>
        </div>
      </section>
      
      {/* Upcoming Shows Section */}
      <section className="py-16" style={{ background: "#F0A202" }}>
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center mb-8">
            <h2 className="font-circus text-3xl font-bold mb-2 md:mb-0" style={{ color: "#2B303A", textShadow: "0 2px 6px #F9F4D2CC" }}>
              Upcoming Shows
            </h2>
            <Link 
              to="/tour" 
              className="font-alt flex items-center gap-1 hover:text-circus-red transition-colors"
              style={{ color: "#1C77C3" }}
            >
              View All Dates <ArrowRight size={16} />
            </Link>
          </div>
          
          <div className="space-y-4">
            {upcomingEvents.map(event => (
              <EventCard 
                key={event.id} 
                event={event} 
                className="text-circus-dark bg-white bg-opacity-80 hover:border-circus-gold"
              />
            ))}
          </div>
          
          <div className="mt-8 text-center">
            <Link 
              to="/tour" 
              className="bg-circus-blue text-white px-6 py-3 rounded-lg font-bold inline-flex items-center gap-2 hover:bg-circus-red hover:text-circus-cream transition-colors"
            >
              See All Tour Dates <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>
      
      {/* Call to Action Section */}
      <section className="py-16 bg-circus-dark text-circus-cream relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1501386761578-eac5c94b800a?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80" 
            alt="Concert crowd" 
            className="w-full h-full object-cover opacity-20"
          />
        </div>
        
        <div className="container mx-auto px-4 relative z-10 text-center">
          <h2 className="font-circus text-3xl md:text-4xl font-bold mb-4 text-circus-gold">
            Join the Show
          </h2>
          <p className="font-alt text-xl max-w-2xl mx-auto mb-8">
            Follow us on social media for exclusive content, behind-the-scenes footage, and tour announcements.
          </p>
          
          <div className="flex justify-center gap-6">
            <a 
              href="https://www.instagram.com/irenescircustheband/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="bg-circus-cream/10 p-4 rounded-full hover:bg-circus-gold hover:text-circus-dark transition-all"
            >
              <Instagram size={24} />
            </a>
            <a 
              href="#" 
              className="bg-circus-cream/10 p-4 rounded-full hover:bg-circus-gold hover:text-circus-dark transition-all"
            >
              <Facebook size={24} />
            </a>
            <a 
              href="#" 
              className="bg-circus-cream/10 p-4 rounded-full hover:bg-circus-gold hover:text-circus-dark transition-all"
            >
              <Youtube size={24} />
            </a>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default Index;
