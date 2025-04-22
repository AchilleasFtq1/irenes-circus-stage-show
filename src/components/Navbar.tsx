
import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X, Music, Calendar, Image, Users, Home } from "lucide-react";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const navLinks = [
    { name: "Home", path: "/", icon: <Home className="w-5 h-5" /> },
    { name: "Music", path: "/music", icon: <Music className="w-5 h-5" /> },
    { name: "Tour", path: "/tour", icon: <Calendar className="w-5 h-5" /> },
    { name: "Gallery", path: "/gallery", icon: <Image className="w-5 h-5" /> },
    { name: "About", path: "/about", icon: <Users className="w-5 h-5" /> },
  ];

  return (
    <nav className="bg-circus-dark text-circus-cream p-4 sticky top-0 z-50">
      <div className="container mx-auto flex justify-between items-center">
        <Link 
          to="/" 
          className="font-circus text-circus-gold text-2xl font-bold hover:text-circus-red transition-colors"
        >
          Irene's Circus
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex space-x-8">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              className="font-alt text-circus-cream hover:text-circus-gold transition-colors duration-300 flex items-center gap-2"
            >
              {link.icon}
              {link.name}
            </Link>
          ))}
        </div>

        {/* Mobile Navigation Toggle */}
        <button
          onClick={toggleMenu}
          className="md:hidden text-circus-cream hover:text-circus-gold"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-circus-dark py-4 animate-accordion-down">
          <div className="container mx-auto flex flex-col space-y-4">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className="font-alt text-circus-cream hover:text-circus-gold transition-colors duration-300 flex items-center gap-2 px-4 py-2"
                onClick={() => setIsOpen(false)}
              >
                {link.icon}
                {link.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
