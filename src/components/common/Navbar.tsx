import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ArrowRight, Phone } from 'lucide-react';

export const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { label: 'Home', path: '/' },
    { label: 'Workshops', path: '/workshops' },
    { label: 'Events', path: '/events' },
    { label: 'Studio', path: '/gallery' },
    { label: 'About us', path: '/about' },
    { label: 'Contact', path: '/contact' },
  ];

  const isActive = (path: string) => {
    if (path === '/' && location.pathname !== '/') return false;
    return location.pathname.startsWith(path);
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-white/95 backdrop-blur-md py-3 border-b border-[#E8E2D6] shadow-sm'
          : 'bg-white/90 backdrop-blur-sm py-4 border-b border-[#E8E2D6]/70'
      }`}
    >
      <nav className="px-6 py-1 flex justify-between items-center w-full max-w-[1440px] mx-auto">
        {/* Official Clayton Brand Logo */}
        <Link to="/" className="group flex items-center gap-2">
          <img
            src="/assets/clayton/logo/Clayton Art House Logo.png"
            alt="Clayton Art House"
            className="h-10 sm:h-12 w-auto object-contain transition-transform duration-200 group-hover:scale-105"
          />
        </Link>

        {/* Desktop Navigation Links — Clayton Montserrat with active underline */}
        <div className="hidden lg:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`font-montserrat text-sm font-semibold transition-colors duration-200 relative py-1.5 ${
                isActive(link.path)
                  ? 'text-gray-900 border-b-2 border-gray-900'
                  : 'text-stone-600 hover:text-[#577057]'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Header Action Button — Clayton Olive Pill */}
        <div className="hidden lg:flex items-center gap-4">
          <a
            href="tel:042780500"
            className="flex items-center gap-1.5 text-xs font-semibold text-stone-600 hover:text-[#577057] transition-colors"
          >
            <Phone className="w-3.5 h-3.5 text-[#577057]" />
            <span>042780500</span>
          </a>

          <Link
            to="/book"
            className="btn-clayton-green !py-2.5 !px-6 text-xs font-semibold"
          >
            <span>Book Now</span>
          </Link>
        </div>

        {/* Mobile Menu Trigger */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden p-2 text-stone-800 hover:text-[#577057] focus:outline-none"
          aria-label="Toggle Navigation"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </nav>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden absolute top-full left-0 w-full bg-white shadow-lg border-t border-gray-100 flex flex-col font-medium z-40 px-6 py-4 animate-fadeIn">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`px-3 py-3.5 font-montserrat border-b border-gray-100 text-sm font-semibold transition-colors ${
                isActive(link.path) ? 'text-[#577057] font-bold' : 'text-gray-900 hover:text-[#577057]'
              }`}
            >
              {link.label}
            </Link>
          ))}
          <div className="pt-4 flex flex-col gap-3">
            <Link to="/book" className="btn-clayton-green w-full text-center text-sm py-3">
              Book a Workshop
            </Link>
            <div className="text-center text-xs text-stone-500 py-1">
              Kafr Abdo, Alexandria · Tel: 042780500
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
