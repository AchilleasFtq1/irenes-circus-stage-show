import { useState, useEffect, useMemo, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import GalleryGrid from "@/components/GalleryGrid";
import { galleryAPI, eventsAPI } from '@/lib/api';
import { IGalleryImage, IEvent } from '@/lib/types';

const Gallery = () => {
  const [galleryImages, setGalleryImages] = useState<IGalleryImage[]>([]);
  const [events, setEvents] = useState<IEvent[]>([]);
  const [selectedEventId, setSelectedEventId] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const location = useLocation();
  const navigate = useNavigate();
  const imageCountsByEvent = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const img of galleryImages) {
      if (!img.eventId) continue;
      counts[img.eventId] = (counts[img.eventId] || 0) + 1;
    }
    return counts;
  }, [galleryImages]);

  const eventsWithImages = useMemo(() => {
    return events.filter((ev) => imageCountsByEvent[ev._id] > 0);
  }, [events, imageCountsByEvent]);

  const groupedEventsByYear = useMemo(() => {
    const byYear: Record<string, IEvent[]> = {};
    for (const ev of eventsWithImages) {
      const year = new Date(ev.date).getFullYear().toString();
      if (!byYear[year]) byYear[year] = [];
      byYear[year].push(ev);
    }
    Object.values(byYear).forEach((arr) => arr.sort((a, b) => (a.date < b.date ? 1 : -1)));
    return Object.entries(byYear).sort(([a], [b]) => (a < b ? 1 : -1));
  }, [eventsWithImages]);

  // Lazy-load a performance section's images when scrolled into view
  const LazyEventGallery: React.FC<{ event: IEvent; initialImages?: IGalleryImage[] }> = ({ event, initialImages }) => {
    const [images, setImages] = useState<IGalleryImage[] | null>(initialImages ?? null);
    const [hasLoaded, setHasLoaded] = useState<boolean>(!!initialImages);
    const sectionRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
      if (hasLoaded) return; // already have images
      const node = sectionRef.current;
      if (!node) return;
      const observer = new IntersectionObserver((entries, obs) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setHasLoaded(true);
            galleryAPI
              .getAll({ eventId: event._id })
              .then((data) => setImages(data))
              .catch(() => setImages([]));
            obs.disconnect();
            break;
          }
        }
      }, { rootMargin: '0px 0px 200px 0px' });
      observer.observe(node);
      return () => observer.disconnect();
    }, [event._id, hasLoaded]);

    const formattedDate = useMemo(() => {
      const d = new Date(event.date);
      return isNaN(d.getTime()) ? event.date : d.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
    }, [event.date]);

    return (
      <section id={`event-${event._id}`} ref={sectionRef} className="mb-8">
        <h4 className="font-alt text-xl font-semibold mb-3 text-circus-dark">
          {formattedDate} — {event.venue}, {event.city}
          {typeof imageCountsByEvent[event._id] === 'number' && (
            <span className="ml-2 text-sm text-circus-dark/70">({imageCountsByEvent[event._id]})</span>
          )}
        </h4>
        {images === null ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="h-40 bg-gray-50/60 animate-pulse rounded" />
            ))}
          </div>
        ) : images.length === 0 ? (
          <div className="text-sm text-circus-dark/70">No images for this performance yet.</div>
        ) : (
          <GalleryGrid images={images} />
        )}
      </section>
    );
  };
  
  useEffect(() => {
    const fetchGalleryImages = async () => {
      try {
        setIsLoading(true);
        const [images, allEvents] = await Promise.all([
          galleryAPI.getAll(selectedEventId ? { eventId: selectedEventId } : undefined),
          eventsAPI.getAll()
        ]);
        setGalleryImages(images);
        setEvents(allEvents);
        setError(null);
      } catch (err) {
        console.error('Error fetching gallery images:', err);
        setError('Failed to load gallery. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchGalleryImages();
  }, [selectedEventId]);

  // Initialize from ?eventId= and keep URL in sync
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const id = params.get('eventId') || '';
    setSelectedEventId(id);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (selectedEventId) {
      params.set('eventId', selectedEventId);
    } else {
      params.delete('eventId');
    }
    navigate({ search: params.toString() }, { replace: true });

    if (!selectedEventId) return;
    // Auto-scroll to section if present; otherwise scroll to top of grid
    const el = document.getElementById(`event-${selectedEventId}`);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [selectedEventId, location.search, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-circus-cream to-gray-50 text-circus-dark">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative bg-gray-50/70 backdrop-blur text-circus-dark py-20">
        <div className="container mx-auto px-4">
          <h1 className="font-circus text-4xl md:text-5xl font-bold mb-4 text-circus-gold animate-spotlight">
            Gallery
          </h1>
          <p className="font-alt text-xl max-w-2xl mb-6">
            Explore photos from our performances, behind the scenes, and more. Experience the visual side of Irene's Circus.
          </p>
        </div>
      </section>
      
      {/* Gallery Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="font-circus text-3xl font-bold mb-8 text-circus-dark">
            Performance Highlights
          </h2>
          {/* Performance Filter - user-friendly chips */}
          <div className="mb-6">
            <div className="flex items-center gap-2 overflow-x-auto pb-2">
              <button
                type="button"
                onClick={() => setSelectedEventId('')}
                aria-pressed={selectedEventId === ''}
                className={`whitespace-nowrap px-4 py-2 rounded-full border transition-colors ${
                  selectedEventId === ''
                    ? 'bg-circus-gold text-circus-dark border-circus-gold'
                    : 'bg-gray-50/80 text-circus-dark border-circus-gold hover:bg-circus-gold/20'
                }`}
              >
                All
              </button>
              {events
                .filter((ev) => imageCountsByEvent[ev._id] > 0)
                .map((ev) => (
                  <button
                    key={ev._id}
                    type="button"
                    onClick={() => setSelectedEventId(ev._id)}
                    aria-pressed={selectedEventId === ev._id}
                    className={`whitespace-nowrap px-4 py-2 rounded-full border transition-colors ${
                      selectedEventId === ev._id
                        ? 'bg-circus-gold text-circus-dark border-circus-gold'
                        : 'bg-gray-50/80 text-circus-dark border-circus-gold hover:bg-circus-gold/20'
                    }`}
                    title={`${ev.date} — ${ev.venue}, ${ev.city}`}
                  >
                    {ev.venue} • {ev.city}
                    <span className="ml-2 text-xs opacity-70">({imageCountsByEvent[ev._id]})</span>
                  </button>
                ))}
            </div>
          </div>
          
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-20 w-20 border-b-2 border-circus-gold"></div>
            </div>
          ) : error ? (
            <div className="text-center text-circus-red p-6 bg-gray-50 bg-opacity-70 rounded-lg shadow">
              <p>{error}</p>
              <button 
                onClick={() => window.location.reload()} 
                className="mt-4 px-4 py-2 bg-circus-gold text-circus-dark rounded-md hover:bg-circus-red hover:text-white transition-colors">
                Try Again
              </button>
            </div>
          ) : selectedEventId ? (
            galleryImages.length === 0 ? (
              <div className="text-center p-10 bg-gray-50 bg-opacity-80 rounded-lg shadow">
                <h2 className="text-2xl font-bold mb-4">No Images Yet</h2>
                <p>No images for this performance yet. Try another one.</p>
              </div>
            ) : (
              <GalleryGrid images={galleryImages} />
            )
          ) : eventsWithImages.length === 0 ? (
            <div className="text-center p-10 bg-gray-50 bg-opacity-80 rounded-lg shadow">
              <h2 className="text-2xl font-bold mb-4">No Images Yet</h2>
              <p>Check back soon for photos from our performances and events!</p>
            </div>
          ) : (
            groupedEventsByYear.map(([year, evs]) => (
              <div key={year} className="mb-10">
                <h3 className="font-circus text-2xl font-bold mb-4 text-circus-dark">{year}</h3>
                {evs.map((ev) => (
                  <LazyEventGallery
                    key={ev._id}
                    event={ev}
                    initialImages={galleryImages.filter((img) => img.eventId === ev._id)}
                  />
                ))}
              </div>
            ))
          )}
        </div>
      </section>
      
      {/* Behind the Scenes */}
      <section className="py-16 bg-gray-50/70 backdrop-blur text-circus-dark">
        <div className="container mx-auto px-4 text-center">
          <p className="font-alt text-xl max-w-2xl mx-auto mb-8">
            For more behind-the-scenes content, follow us on Instagram.
          </p>
          
          <a 
            href="https://www.instagram.com/irenescircustheband/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="bg-circus-gold text-circus-dark px-6 py-3 rounded-lg font-bold inline-block hover:bg-circus-red hover:text-white transition-colors"
          >
            @irenescircustheband
          </a>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default Gallery;
