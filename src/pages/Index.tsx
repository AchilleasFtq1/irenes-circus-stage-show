
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
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-circus-cream to-white text-circus-dark">
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
        
        <div className="container mx-auto px-4 py-20 md:py-32 relative z-10">
          <div className="max-w-3xl animate-spotlight">
            <h1 className="font-circus text-4xl md:text-6xl font-black mb-4 text-circus-gold">
              Irene's Circus
            </h1>
            <p className="font-alt text-xl md:text-2xl mb-8 leading-relaxed">
              A theatrical musical experience that combines powerful vocals, dramatic instrumentation, and circus-inspired performance art.
            </p>
            <div className="flex flex-wrap gap-4">
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
      <section className="py-16 bg-circus-cream">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center mb-8">
            <h2 className="font-circus text-3xl font-bold text-circus-dark">
              Latest Release
            </h2>
            <Link 
              to="/music" 
              className="font-alt text-circus-red flex items-center gap-1 hover:text-circus-gold transition-colors"
            >
              View All Music <ArrowRight size={16} />
            </Link>
          </div>
          
          <MusicPlayer tracks={tracks.slice(0, 3)} />
        </div>
      </section>
      
      {/* Upcoming Shows Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center mb-8">
            <h2 className="font-circus text-3xl font-bold text-circus-dark">
              Upcoming Shows
            </h2>
            <Link 
              to="/tour" 
              className="font-alt text-circus-red flex items-center gap-1 hover:text-circus-gold transition-colors"
            >
              View All Dates <ArrowRight size={16} />
            </Link>
          </div>
          
          <div className="space-y-4">
            {upcomingEvents.map(event => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
          
          <div className="mt-8 text-center">
            <Link 
              to="/tour" 
              className="bg-circus-gold text-circus-dark px-6 py-3 rounded-lg font-bold inline-flex items-center gap-2 hover:bg-circus-red hover:text-circus-cream transition-colors"
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
