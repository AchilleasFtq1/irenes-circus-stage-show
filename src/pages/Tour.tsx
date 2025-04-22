
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import EventCard from "@/components/EventCard";
import { events } from "@/data/bandData";

const Tour = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-circus-cream to-white text-circus-dark">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative bg-circus-dark text-circus-cream py-20">
        <div className="container mx-auto px-4">
          <h1 className="font-circus text-4xl md:text-5xl font-bold mb-4 text-circus-gold animate-spotlight">
            Tour Dates
          </h1>
          <p className="font-alt text-xl max-w-2xl mb-6">
            Catch Irene's Circus live for an unforgettable theatrical musical experience. Check our upcoming shows and secure your tickets now.
          </p>
        </div>
      </section>
      
      {/* Tour Dates Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="font-circus text-3xl font-bold mb-8 text-circus-dark">
            Upcoming Shows
          </h2>
          
          <div className="space-y-4 mb-16">
            {events.map(event => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
          
          {/* Past Shows */}
          <h2 className="font-circus text-3xl font-bold mb-8 text-circus-dark">
            Past Shows
          </h2>
          
          <div className="space-y-4 opacity-70">
            {/* Past events with dummy data */}
            {[
              {
                id: 101,
                date: "2025-01-15",
                venue: "The Echo",
                city: "Los Angeles",
                country: "USA",
              },
              {
                id: 102,
                date: "2025-01-10",
                venue: "Mercury Lounge",
                city: "New York",
                country: "USA",
              },
              {
                id: 103,
                date: "2024-12-18",
                venue: "The Crocodile",
                city: "Seattle",
                country: "USA",
              }
            ].map(event => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        </div>
      </section>
      
      {/* Booking Section */}
      <section className="py-16 bg-circus-dark text-circus-cream">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-circus text-3xl font-bold mb-4 text-circus-gold">
            Book Irene's Circus
          </h2>
          <p className="font-alt text-xl max-w-2xl mx-auto mb-8">
            Interested in booking Irene's Circus for a private event, festival, or venue? Reach out to our booking team.
          </p>
          
          <a 
            href="mailto:booking@irenescircus.com" 
            className="bg-circus-gold text-circus-dark px-6 py-3 rounded-lg font-bold inline-block hover:bg-circus-red hover:text-circus-cream transition-colors"
          >
            Contact Booking
          </a>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default Tour;
