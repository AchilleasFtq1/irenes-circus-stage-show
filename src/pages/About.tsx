
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BandMember from "@/components/BandMember";
import { bandMembers } from "@/data/bandData";

const About = () => {
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
                  Founded in 2022 by frontwoman Irene Castillo, Irene's Circus began as a vision to create music that was as visually captivating as it was sonically engaging.
                </p>
                <p>
                  Drawing inspiration from theatrical performances, classic circus aesthetics, and alternative rock, the band quickly developed a unique sound and style that set them apart in the indie music scene.
                </p>
                <p>
                  What started as small performances in intimate venues soon grew into elaborate shows that combined musical talent with theatrical elements, creating an immersive experience for audiences.
                </p>
                <p>
                  Today, Irene's Circus continues to push boundaries, blending genres and art forms to create unforgettable performances that tell stories and evoke emotions beyond what music alone can achieve.
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
          
          <div className="space-y-16">
            {bandMembers.map((member, index) => (
              <BandMember 
                key={member.id} 
                name={member.name} 
                instrument={member.instrument} 
                bio={member.bio} 
                image={member.image}
                isReversed={index % 2 !== 0}
              />
            ))}
          </div>
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
