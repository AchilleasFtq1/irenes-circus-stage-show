import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="bg-circus-dark text-circus-cream py-6 shadow-lg">
      <div className="container mx-auto flex justify-between items-center px-4">
        {/* Logo and Band Name */}
        <div className="flex items-center gap-3">
          <img
            src="/images/logo.png"
            alt="Irene's Circus Logo"
            className="w-10 h-10 rounded-full ring-2 ring-circus-gold"
            style={{ background: "#fff" }}
          />
          <span className="font-circus text-xl font-bold text-circus-gold">Irene's Circus</span>
        </div>
        {/* Navigation Links */}
        <ul className="flex gap-6 font-alt font-semibold text-base">
          <li>
            <Link to="/" className="hover:text-circus-gold transition-colors">Home</Link>
          </li>
          <li>
            <Link to="/music" className="hover:text-circus-gold transition-colors">Music</Link>
          </li>
          <li>
            <Link to="/tour" className="hover:text-circus-gold transition-colors">Tour</Link>
          </li>
          <li>
            <Link to="/gallery" className="hover:text-circus-gold transition-colors">Gallery</Link>
          </li>
          <li>
            <Link to="/about" className="hover:text-circus-gold transition-colors">About</Link>
          </li>
          <li>
            <Link to="/contact" className="hover:text-circus-gold transition-colors">Contact</Link>
          </li>
          <li>
            <Link to="/admin" className="hover:text-circus-gold transition-colors">Admin</Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
