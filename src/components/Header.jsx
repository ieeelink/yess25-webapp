import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    setLoading(true);
    
    // Function to handle page load
    const handleLoad = () => {
      setLoading(false);
    };

    // Add load event listener
    window.addEventListener('load', handleLoad);

    // If the page is already loaded, stop loading
    if (document.readyState === 'complete') {
      setLoading(false);
    }

    // Cleanup
    return () => {
      window.removeEventListener('load', handleLoad);
    };
  }, [location]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <header className="fixed top-0 left-0 right-0 bg-brand-white z-50">
      {/* Loading Bar */}
      <div className={`h-1 bg-[#fe4a56] transition-all duration-300 ${loading ? 'loading-bar w-full' : 'w-0 opacity-0'}`}></div>
      
      <div className="py-2">
        <div className="w-screen px-8">
          <div className="flex items-center justify-between h-20">
            {/* Desktop Navigation */}
            <nav className="hidden md:flex w-full justify-between px-8">
              <Link 
                to="/" 
                className={`text-lg font-medium transition-all duration-300 hover:scale-110 ${
                  isActive('/') ? 'text-[#fe4a56]' : 'text-brand-white hover:text-brand-darkred'
                }`}
              >
                HOME
              </Link>
              <Link 
                to="/tickets" 
                className={`text-lg font-medium transition-all duration-300 hover:scale-110 ${
                  isActive('/events') ? 'text-[#fe4a56]' : 'text-brand-white hover:text-brand-darkred'
                }`}
              >
                EVENTS
              </Link>
            </nav>

            {/* Mobile menu button */}
            <button 
              className="md:hidden p-2 rounded-md text-brand-white hover:text-brand-darkred hover:bg-gray-100 focus:outline-none transition-colors ml-auto relative z-50"
              onClick={toggleMenu}
            >
              <svg 
                className="h-7 w-7" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>

          {/* Mobile Navigation */}
          <div 
            className={`md:hidden fixed inset-0 bg-black z-40 transition-transform duration-300 ease-in-out ${
              isMenuOpen ? 'translate-x-0' : 'translate-x-full'
            }`}
          >
            <div className="h-full w-full flex flex-col items-center justify-center space-y-8">
              <Link 
                to="/" 
                className={`block px-3 py-2 rounded-md text-2xl font-medium hover:bg-gray-50 transition-all duration-300 hover:scale-105 ${
                  isActive('/') ? 'text-[#fe4a56]' : 'text-brand-white hover:text-brand-darkred'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link 
                to="/about" 
                className={`block px-3 py-2 rounded-md text-2xl font-medium hover:bg-gray-50 transition-all duration-300 hover:scale-105 ${
                  isActive('/about') ? 'text-[#fe4a56]' : 'text-brand-white hover:text-brand-darkred'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                Tickets
              </Link>
              <Link 
                to="/services" 
                className={`block px-3 py-2 rounded-md text-2xl font-medium hover:bg-gray-50 transition-all duration-300 hover:scale-105 ${
                  isActive('/services') ? 'text-[#fe4a56]' : 'text-brand-white hover:text-brand-darkred'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                Services
              </Link>
              <Link 
                to="/contact" 
                className={`block px-3 py-2 rounded-md text-2xl font-medium hover:bg-gray-50 transition-all duration-300 hover:scale-105 ${
                  isActive('/contact') ? 'text-[#fe4a56]' : 'text-brand-white hover:text-brand-darkred'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                Contact
              </Link>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
