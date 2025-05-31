import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import ContactPopup from './ContactPopup';


const SubFooter = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isContactOpen, setIsContactOpen] = useState(false);
  const location = useLocation();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleContact = (e) => {
    e.stopPropagation();
    setIsContactOpen(!isContactOpen);
  };

  const handleCloseContact = () => {
    setIsContactOpen(false);
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <footer className="bg-brand-white text-brand-black pb-3 md:pb-6">
      <div className="w-screen px-4 md:px-8">
        <div className="flex items-center justify-between h-12 md:h-20">
          {/* Desktop Navigation */}
          <nav className="hidden md:flex w-full justify-between px-8">
            <Link 
              to="/highlights" 
              className={`text-lg font-medium transition-all duration-300 hover:scale-110 ${
                isActive('/highlights') ? 'text-[#fe4a56]' : 'text-white hover:text-[#8c0505]'
              }`}
            >
              HIGHLIGHTS'24
            </Link>
            <div className="text-sm text-gray-400">
              © {new Date().getFullYear()} IEEE LINK. All rights reserved.
            </div>
            <div className="relative">
              <button
                onClick={toggleContact}
                className={`text-lg font-medium transition-all duration-300 hover:scale-110 ${
                  isActive('/contact') ? 'text-[#fe4a56]' : 'text-white hover:text-[#8c0505]'
                }`}
              >
                CONTACT US
              </button>
              <ContactPopup isOpen={isContactOpen} onClose={handleCloseContact} />
            </div>
          </nav>

          {/* Mobile Copyright */}
          <div className="md:hidden w-full text-center text-sm text-gray-400">
            © {new Date().getFullYear()} IEEE LINK. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
};

export default SubFooter;
