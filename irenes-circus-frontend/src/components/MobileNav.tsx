import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Home, Music, Calendar, Image, Mail, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface NavItem {
  path: string;
  label: string;
  icon: React.ReactNode;
  emoji?: string;
}

const publicNavItems: NavItem[] = [
  { path: '/', label: 'Home', icon: <Home size={20} />, emoji: '🏠' },
  { path: '/music', label: 'Music', icon: <Music size={20} />, emoji: '🎵' },
  { path: '/tour', label: 'Tour', icon: <Calendar size={20} />, emoji: '🎸' },
  { path: '/gallery', label: 'Gallery', icon: <Image size={20} />, emoji: '📸' },
  { path: '/contact', label: 'Contact', icon: <Mail size={20} />, emoji: '📧' },
];

const MobileNav: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  // Close menu when route changes
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Close menu on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen]);

  return (
    <>
      {/* Mobile Menu Button - Only visible on small screens */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsOpen(true)}
        className="md:hidden fixed top-4 right-4 z-50 bg-rock-black/80 text-rock-amber border border-rock-amber hover:bg-rock-amber hover:text-rock-black transition-all duration-300"
        aria-label="Open navigation menu"
      >
        <Menu size={24} />
      </Button>

      {/* Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Mobile Menu Panel */}
      <div
        className={`
          fixed top-0 right-0 h-full w-80 max-w-[90vw] bg-rock-black text-rock-cream z-50 
          transform transition-transform duration-300 ease-in-out md:hidden
          border-l-4 border-rock-amber shadow-2xl
          ${isOpen ? 'translate-x-0' : 'translate-x-full'}
        `}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-rock-steel">
          <div className="flex items-center gap-3">
            <img
              src="/images/logo.png"
              alt="Irene's Circus"
              className="w-10 h-10 rounded-full border-2 border-rock-amber"
            />
            <h2 className="font-edgy text-xl text-rock-amber">IRENE'S CIRCUS</h2>
          </div>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsOpen(false)}
            className="text-rock-amber hover:text-rock-rust hover:bg-rock-charcoal"
            aria-label="Close navigation menu"
          >
            <X size={24} />
          </Button>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 overflow-y-auto py-6">
          <ul className="space-y-2 px-4">
            {publicNavItems.map((item) => {
              const isActive = location.pathname === item.path || 
                (item.path === '/admin' && location.pathname.startsWith('/admin'));
              
              return (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className={`
                      flex items-center gap-4 px-4 py-3 rounded-none border-l-4 transition-all duration-300
                      ${isActive 
                        ? 'border-rock-amber bg-rock-charcoal text-rock-amber' 
                        : 'border-transparent hover:border-rock-rust hover:bg-rock-charcoal/50 hover:text-rock-amber'
                      }
                    `}
                    onClick={() => setIsOpen(false)}
                  >
                    <span className="text-2xl">{item.emoji}</span>
                    <div className="flex-1">
                      <span className="font-rock font-bold text-lg">{item.label}</span>
                    </div>
                    {item.icon}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Footer */}
        <div className="p-6 border-t border-rock-steel">
          <div className="text-center space-y-2">
            <div className="flex justify-center gap-4 text-rock-amber">
              <a 
                href="https://spotify.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:text-rock-rust transition-colors"
                aria-label="Spotify"
              >
                🎵
              </a>
              <a 
                href="https://instagram.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:text-rock-rust transition-colors"
                aria-label="Instagram"
              >
                📸
              </a>
              <a 
                href="https://youtube.com/@irenescircustheband?si=kKnlTsH2X3akowr4" 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:text-rock-rust transition-colors"
                aria-label="YouTube"
              >
                📺
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default MobileNav;
