import { useEffect, useState } from 'react';
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Calendar } from "lucide-react";

interface Event {
  _id: string;
  date: string;
  venue: string;
  city: string;
  country: string;
  ticketLink?: string;
  isSoldOut?: boolean;
}

const Tour = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/events`);
        if (!response.ok) throw new Error('Failed to fetch events');
        const data = await response.json();
        setEvents(data);
      } catch (err) {
        setError('Failed to load events. Please try again later.');
        console.error('Error fetching events:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const month = date.toLocaleString('default', { month: 'short' });
    const day = date.getDate();
    return { month, day };
  };

  // Split events into upcoming and past
  const now = new Date();
  const upcomingEvents = events.filter(event => new Date(event.date) >= now)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  const pastEvents = events.filter(event => new Date(event.date) < now)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  if (loading) {
    return (
      <div className="min-h-screen bg-circus-cream flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-circus-gold"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-circus-cream">
      <Navbar />
      
      <main className="container mx-auto px-4 py-12">
        <h1 className="font-circus text-4xl md:text-6xl text-circus-dark mb-4">Tour Dates</h1>
        <p className="font-alt text-lg mb-12 max-w-2xl text-circus-dark/80">
          Join us for an unforgettable evening of theatrical music and circus arts.
          Check our upcoming shows and secure your tickets.
        </p>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        {/* Upcoming Shows */}
        <section className="mb-16">
          <h2 className="font-circus text-3xl text-circus-dark mb-8">Upcoming Shows</h2>
          <div className="space-y-4">
            {upcomingEvents.length > 0 ? (
              upcomingEvents.map((event) => {
                const { month, day } = formatDate(event.date);
                return (
                  <div 
                    key={event._id}
                    className="flex flex-col sm:flex-row items-start sm:items-center gap-4 bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow"
                  >
                    {/* Date Box */}
                    <div className="bg-circus-dark text-circus-cream p-4 rounded-lg text-center min-w-[100px]">
                      <Calendar className="w-6 h-6 mx-auto mb-1 text-circus-gold" />
                      <div className="font-circus text-circus-gold text-xl">{month}</div>
                      <div className="font-circus text-2xl">{day}</div>
                    </div>

                    {/* Event Details */}
                    <div className="flex-grow">
                      <h3 className="font-circus text-xl text-circus-dark mb-1">{event.venue}</h3>
                      <p className="text-circus-dark/60 mb-2">
                        {event.city}, {event.country}
                      </p>
                    </div>

                    {/* Ticket Button */}
                    <div className="w-full sm:w-auto">
                      {event.isSoldOut ? (
                        <div className="bg-red-100 text-red-600 px-6 py-2 rounded-full font-bold text-center">
                          Sold Out
                        </div>
                      ) : event.ticketLink ? (
                        <a
                          href={event.ticketLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block w-full text-center bg-circus-gold text-circus-dark px-6 py-2 rounded-full font-bold hover:bg-circus-red hover:text-white transition-colors"
                        >
                          Get Tickets
                        </a>
                      ) : (
                        <div className="bg-yellow-100 text-yellow-600 px-6 py-2 rounded-full font-bold text-center">
                          Coming Soon
                        </div>
                      )}
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-12 bg-white rounded-lg">
                <h3 className="font-circus text-xl text-circus-dark mb-2">No Upcoming Shows</h3>
                <p className="text-circus-dark/60">Check back soon for new tour dates!</p>
              </div>
            )}
          </div>
        </section>

        {/* Past Shows */}
        <section>
          <h2 className="font-circus text-3xl text-circus-dark mb-8">Past Shows</h2>
          {pastEvents.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {pastEvents.map((event) => {
                const { month, day } = formatDate(event.date);
                return (
                  <div 
                    key={event._id}
                    className="bg-white/50 backdrop-blur rounded-lg p-6"
                  >
                    <div className="flex items-center gap-4 mb-4">
                      <div className="bg-circus-dark/10 text-circus-dark p-3 rounded-lg text-center min-w-[80px]">
                        <div className="font-circus text-lg">{month}</div>
                        <div className="font-circus text-xl">{day}</div>
                      </div>
                      <div>
                        <h3 className="font-circus text-lg text-circus-dark">{event.venue}</h3>
                        <p className="text-circus-dark/60 text-sm">
                          {event.city}, {event.country}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12 bg-white/50 backdrop-blur rounded-lg">
              <h3 className="font-circus text-xl text-circus-dark mb-2">No Past Shows</h3>
              <p className="text-circus-dark/60">Check back later for our performance history!</p>
            </div>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Tour;
