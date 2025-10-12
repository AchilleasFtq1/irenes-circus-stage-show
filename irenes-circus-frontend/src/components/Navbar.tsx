import { Link } from "react-router-dom";
import MobileNav from "@/components/MobileNav";

const Navbar = () => {
  return (
    <nav className="bg-rock-black text-rock-cream py-3 shadow-2xl border-b-4 border-rock-rust sticky top-0 z-50 bg-grunge-overlay">
      <div className="container mx-auto flex justify-between items-center px-4">
        {/* Logo Only */}
        <Link to="/" className="group">
          <div className="relative">
            <img
              src="/images/logo.png"
              alt="Irene's Circus Logo"
              className="w-16 h-16 rounded-full border-3 border-rock-amber hover:border-rock-rust transition-all duration-300 amp-glow shadow-lg"
              style={{ 
                background: "linear-gradient(135deg, #F7FAFC 0%, #EDF2F7 100%)",
                padding: "4px"
              }}
            />
            {/* Glow effect behind logo */}
            <div className="absolute -inset-1 bg-rock-amber rounded-full blur-sm opacity-20 group-hover:opacity-40 transition-opacity duration-300"></div>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <ul className="hidden md:flex gap-8 font-rock font-bold text-base">
          <li>
            <Link 
              to="/" 
              className="hover:text-rock-amber transition-colors duration-300 relative group px-2 py-1 border-b-2 border-transparent hover:border-rock-amber"
            >
              <span className="group-hover:animate-feedback">HOME</span>
            </Link>
          </li>
          <li>
            <Link 
              to="/music" 
              className="hover:text-rock-amber transition-colors duration-300 relative group px-2 py-1 border-b-2 border-transparent hover:border-rock-amber"
            >
              <span className="group-hover:animate-feedback">🎵 MUSIC</span>
            </Link>
          </li>
          <li>
            <Link 
              to="/tour" 
              className="hover:text-rock-amber transition-colors duration-300 relative group px-2 py-1 border-b-2 border-transparent hover:border-rock-amber"
            >
              <span className="group-hover:animate-feedback">🎸 TOUR</span>
            </Link>
          </li>
          <li>
            <Link 
              to="/gallery" 
              className="hover:text-rock-amber transition-colors duration-300 relative group px-2 py-1 border-b-2 border-transparent hover:border-rock-amber"
            >
              <span className="group-hover:animate-feedback">📸 GALLERY</span>
            </Link>
          </li>
          
          <li>
            <Link 
              to="/contact" 
              className="hover:text-rock-amber transition-colors duration-300 relative group px-2 py-1 border-b-2 border-transparent hover:border-rock-amber"
            >
              <span className="group-hover:animate-feedback">📧 CONTACT</span>
            </Link>
          </li>
          <li>
            <Link 
              to="/admin" 
              className="bg-rock-rust text-rock-cream px-4 py-2 rounded-none border-2 border-rock-amber hover:bg-rock-amber hover:text-rock-black transition-all duration-300 amp-glow font-bold"
            >
              ⚡ ADMIN
            </Link>
          </li>
        </ul>

        {/* Mobile Navigation */}
        <MobileNav />
      </div>
    </nav>
  );
};

export default Navbar;
