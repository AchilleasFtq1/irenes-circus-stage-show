
import { Link } from "react-router-dom";
import { Instagram, Facebook, Youtube } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-circus-dark text-circus-cream py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="font-circus text-2xl text-circus-gold mb-4">Irene's Circus</h3>
            <p className="font-alt mb-4">
              A passionate band that combines musical talent with theatrical performance.
            </p>
            <div className="flex space-x-4">
              <a 
                href="https://www.instagram.com/irenescircustheband/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-circus-cream hover:text-circus-gold transition-colors"
              >
                <Instagram />
              </a>
              <a 
                href="#" 
                className="text-circus-cream hover:text-circus-gold transition-colors"
              >
                <Facebook />
              </a>
              <a 
                href="#" 
                className="text-circus-cream hover:text-circus-gold transition-colors"
              >
                <Youtube />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="font-circus text-xl text-circus-gold mb-4">Quick Links</h3>
            <ul className="space-y-2 font-alt">
              <li>
                <Link to="/" className="hover:text-circus-gold transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/music" className="hover:text-circus-gold transition-colors">
                  Music
                </Link>
              </li>
              <li>
                <Link to="/tour" className="hover:text-circus-gold transition-colors">
                  Tour Dates
                </Link>
              </li>
              <li>
                <Link to="/gallery" className="hover:text-circus-gold transition-colors">
                  Gallery
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-circus-gold transition-colors">
                  About Us
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-circus text-xl text-circus-gold mb-4">Contact</h3>
            <p className="font-alt mb-2">Email: info@irenescircus.com</p>
            <p className="font-alt mb-4">Booking: booking@irenescircus.com</p>
            <form className="space-y-2">
              <input 
                type="email" 
                placeholder="Join our mailing list" 
                className="w-full p-2 rounded bg-circus-dark border border-circus-gold text-circus-cream"
              />
              <button 
                type="submit" 
                className="bg-circus-gold text-circus-dark px-4 py-2 rounded font-bold hover:bg-circus-red hover:text-circus-cream transition-colors"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
        
        <div className="border-t border-circus-blue/30 mt-8 pt-8 text-center font-alt text-sm">
          <p>&copy; {new Date().getFullYear()} Irene's Circus. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
