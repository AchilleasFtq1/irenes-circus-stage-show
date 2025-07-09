
import { Link } from "react-router-dom";
import { Instagram, Facebook, Youtube } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-rock-black text-rock-cream py-16 border-t-4 border-rock-rust bg-grunge-overlay">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <div>
            <div className="mb-6">
              <h3 className="font-edgy text-3xl font-black text-rock-amber rock-text-shadow mb-2">
                IRENE'S
              </h3>
              <h4 className="font-rock text-xl font-bold text-rock-rust -mt-2">
                CIRCUS
              </h4>
            </div>
            <p className="font-hipster text-lg mb-6 text-rock-smoke">
              Authentic rock music from the heart. 
              No filters, no compromises, just pure sonic rebellion.
            </p>
            <div className="flex space-x-6">
              <a 
                href="https://www.instagram.com/irenescircustheband/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-rock-cream hover:text-rock-amber transition-all duration-300 transform hover:scale-110 amp-glow"
              >
                <Instagram size={32} />
              </a>
              <a 
                href="#" 
                className="text-rock-cream hover:text-rock-amber transition-all duration-300 transform hover:scale-110 amp-glow"
              >
                <Facebook size={32} />
              </a>
              <a 
                href="#" 
                className="text-rock-cream hover:text-rock-amber transition-all duration-300 transform hover:scale-110 amp-glow"
              >
                <Youtube size={32} />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="font-rock text-2xl font-bold text-rock-amber mb-6 rock-text-shadow">
              QUICK LINKS
            </h3>
            <ul className="space-y-3 font-hipster text-lg">
              <li>
                <Link 
                  to="/" 
                  className="hover:text-rock-amber transition-colors duration-300 relative group"
                >
                  <span className="group-hover:animate-feedback">🏠 HOME</span>
                </Link>
              </li>
              <li>
                <Link 
                  to="/music" 
                  className="hover:text-rock-amber transition-colors duration-300 relative group"
                >
                  <span className="group-hover:animate-feedback">🎵 MUSIC</span>
                </Link>
              </li>
              <li>
                <Link 
                  to="/tour" 
                  className="hover:text-rock-amber transition-colors duration-300 relative group"
                >
                  <span className="group-hover:animate-feedback">🎸 TOUR DATES</span>
                </Link>
              </li>
              <li>
                <Link 
                  to="/gallery" 
                  className="hover:text-rock-amber transition-colors duration-300 relative group"
                >
                  <span className="group-hover:animate-feedback">📸 GALLERY</span>
                </Link>
              </li>
              <li>
                <Link 
                  to="/about" 
                  className="hover:text-rock-amber transition-colors duration-300 relative group"
                >
                  <span className="group-hover:animate-feedback">🤘 ABOUT US</span>
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-rock text-2xl font-bold text-rock-amber mb-6 rock-text-shadow">
              CONTACT
            </h3>
            <div className="font-hipster text-lg mb-6 text-rock-smoke">
              <p className="mb-2">📧 Email: info@irenescircus.com</p>
              <p className="mb-4">🎤 Booking: booking@irenescircus.com</p>
            </div>
            <form className="space-y-4">
              <input 
                type="email" 
                placeholder="Join the rock revolution..." 
                className="w-full p-3 rounded-none bg-rock-charcoal border-2 border-rock-steel text-rock-cream placeholder-rock-smoke focus:border-rock-amber transition-colors duration-300 font-hipster"
              />
              <button 
                type="submit" 
                className="bg-rust-gradient text-rock-cream px-6 py-3 rounded-none font-rock font-bold border-2 border-rock-amber hover:border-rock-rust transition-all duration-300 amp-glow animate-rock-pulse"
              >
                🤘 SUBSCRIBE
              </button>
            </form>
          </div>
        </div>
        
        <div className="border-t-2 border-rock-rust mt-12 pt-8 text-center">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="font-hipster text-rock-smoke">
              &copy; {new Date().getFullYear()} Irene's Circus. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0 font-rock font-bold text-sm">
              <span className="text-rock-rust">LOUD</span>
              <span className="text-rock-amber">•</span>
              <span className="text-rock-rust">RAW</span>
              <span className="text-rock-amber">•</span>
              <span className="text-rock-rust">AUTHENTIC</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
