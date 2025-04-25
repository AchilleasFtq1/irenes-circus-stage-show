import { useState, useEffect, Fragment } from 'react';
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BandMember from "@/components/BandMember";
import { bandMembersAPI } from '@/lib/api';
import { IBandMember } from '@/lib/types';

const About = () => {
  const [bandMembers, setBandMembers] = useState<IBandMember[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchBandMembers = async () => {
      try {
        setIsLoading(true);
        const data = await bandMembersAPI.getAll();
        setBandMembers(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching band members:', err);
        setError('Failed to load band information. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchBandMembers();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-circus-cream to-white text-circus-dark">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative bg-circus-dark text-circus-cream py-20">
        <div className="container mx-auto px-4">
          <h1 className="font-circus text-4xl md:text-5xl font-bold mb-4 text-circus-gold animate-spotlight">
            About Us
          </h1>
          <p className="font-alt text-xl max-w-2xl mb-6">
            Meet the performers behind Irene's Circus and discover our story.
          </p>
        </div>
      </section>
      
      {/* Band Story */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-8 items-center">
            <div className="md:w-1/2">
              <h2 className="font-circus text-3xl font-bold mb-4 text-circus-red">Our Story</h2>
              <div className="space-y-4 font-alt text-lg">
                <p>
                  Irene's Circus was formed in 2022 when lead vocalist Irene Castillo, a former theater performer, 
                  decided to combine her love of theatrical performance with her passion for music.
                </p>
                <p>
                  Drawing inspiration from the dramatic world of circus arts, vintage carnivals, and the nostalgic 
                  atmosphere of 1920s speakeasies, Irene assembled a group of like-minded musicians who shared her 
                  vision for creating immersive musical experiences.
                </p>
                <p>
                  What sets Irene's Circus apart is not just their music, but their elaborate stage shows that incorporate 
                  elements of theater, circus performance, and visual storytelling. Each concert is designed as a complete 
                  sensory experience that transports the audience to another world.
                </p>
                <p>
                  The band's sound is an eclectic mix of alternative rock, folk, and theatrical pop, characterized by 
                  Irene's powerful vocals, rich instrumental arrangements, and narrative-driven lyrics that tell stories 
                  of adventure, love, loss, and redemption.
                </p>
              </div>
            </div>
            
            <div className="md:w-1/2">
              <div className="rounded-lg overflow-hidden shadow-xl">
                <img 
                  src="https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80" 
                  alt="Irene's Circus performing on stage" 
                  className="w-full h-auto"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Meet the Band */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="font-circus text-3xl font-bold mb-12 text-circus-dark text-center">
            Meet the Band
          </h2>
          
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-20 w-20 border-b-2 border-circus-gold"></div>
            </div>
          ) : error ? (
            <div className="text-center text-circus-red p-6 bg-white bg-opacity-70 rounded-lg shadow">
              <p>{error}</p>
              <button 
                onClick={() => window.location.reload()} 
                className="mt-4 px-4 py-2 bg-circus-gold text-circus-dark rounded-md hover:bg-circus-red hover:text-circus-cream transition-colors">
                Try Again
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {bandMembers.map(member => (
                <Fragment key={member._id}>
                  <BandMember member={member} />
                </Fragment>
              ))}
            </div>
          )}
        </div>
      </section>
      
      {/* Press Kit */}
      <section className="py-16 bg-circus-dark text-circus-cream">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-circus text-3xl font-bold mb-4 text-circus-gold">
            Press & Media
          </h2>
          <p className="font-alt text-xl max-w-2xl mx-auto mb-8">
            For press inquiries, interview requests, or media kit access, please contact our publicity team.
          </p>
          
          <a 
            href="mailto:press@irenescircus.com" 
            className="bg-circus-gold text-circus-dark px-6 py-3 rounded-lg font-bold inline-block hover:bg-circus-red hover:text-circus-cream transition-colors mr-4"
          >
            Contact Press
          </a>
          
          <button 
            className="bg-transparent border-2 border-circus-gold text-circus-gold px-6 py-3 rounded-lg font-bold inline-block hover:bg-circus-gold hover:text-circus-dark transition-colors"
          >
            Download Press Kit
          </button>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default About;
