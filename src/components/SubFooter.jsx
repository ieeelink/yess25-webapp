import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import ContactPopup from './ContactPopup';

const SubFooter = ({ onNavigate }) => {
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [currentSection, setCurrentSection] = useState('home');
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const { state } = location;
    if (state?.section) {
      setCurrentSection(state.section);
    }
  }, [location]);

  useEffect(() => {
    const handleScroll = () => {
      const container = document.querySelector('.scrollbar-hide');
      if (container) {
        const scrollLeft = container.scrollLeft;
        const windowWidth = window.innerWidth;
        const halfWindowWidth = windowWidth / 2;
        
        // Calculate which section is more than half visible
        if (scrollLeft >= windowWidth - halfWindowWidth && scrollLeft < windowWidth * 2 - halfWindowWidth) {
          setCurrentSection('highlights');
        } else if (scrollLeft >= windowWidth * 2 - halfWindowWidth) {
          setCurrentSection('about');
        } else {
          setCurrentSection('home');
        }
      }
    };

    const container = document.querySelector('.scrollbar-hide');
    if (container) {
      container.addEventListener('scroll', handleScroll);
      return () => container.removeEventListener('scroll', handleScroll);
    }
  }, []);

  const toggleContact = (e) => {
    e.stopPropagation();
    setIsContactOpen(!isContactOpen);
  };

  const handleCloseContact = () => {
    setIsContactOpen(false);
  };

  const handleNavigation = (sectionId) => {
    if (location.pathname !== '/') {
      navigate('/', { state: { section: sectionId } });
    } else if (onNavigate) {
      onNavigate(sectionId);
      setCurrentSection(sectionId);
    }
  };

  return (
    <footer className="bg-brand-white text-brand-black pb-3 lg:pb-6">
      <div className="w-screen px-4 lg:px-8">
        <div className="flex items-center justify-between h-12 lg:h-20">
          {/* Desktop Navigation */}
          <nav className="hidden lg:flex w-full justify-between px-8">
            <button 
              onClick={() => handleNavigation('highlights')}
              className={`text-lg font-medium transition-all duration-300 hover:scale-110 ${
                currentSection === 'about' ? 'text-[#fe4a56]' : 'text-white hover:text-[#8c0505]'
              }`}
            >
              HIGHLIGHTS'24
            </button>
            <div className="flex flex-col items-center">
              <div className="text-sm text-gray-400">
                © {new Date().getFullYear()} IEEE LINK. All rights reserved.
              </div>
              <div className="flex space-x-4 mt-2">
                <Link to="/tos" className="text-sm text-gray-400 hover:text-[#fe4a56] transition-colors">
                  Terms of Service
                </Link>
                <Link to="/privacy" className="text-sm text-gray-400 hover:text-[#fe4a56] transition-colors">
                  Privacy Policy
                </Link>
              </div>
            </div>
            <div className="relative">
              <button
                onClick={toggleContact}
                className={`text-lg font-medium transition-all duration-300 hover:scale-110 ${
                  location.pathname === '/contact' ? 'text-[#fe4a56]' : 'text-white hover:text-[#8c0505]'
                }`}
              >
                CONTACT US
              </button>
              <ContactPopup isOpen={isContactOpen} onClose={handleCloseContact} />
            </div>
          </nav>

          {/* Mobile Copyright */}
          <div className="lg:hidden w-full text-center">
            <div className="text-sm text-gray-400">
              © {new Date().getFullYear()} IEEE LINK. All rights reserved.
            </div>
            <div className="flex justify-center space-x-4">
              <Link to="/terms" className="text-sm text-gray-400 hover:text-[#fe4a56] transition-colors">
                Terms of Service
              </Link>
              <Link to="/privacy" className="text-sm text-gray-400 hover:text-[#fe4a56] transition-colors">
                Privacy Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default SubFooter;
