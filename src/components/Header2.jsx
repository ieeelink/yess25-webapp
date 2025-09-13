import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FaBars, FaTimes, FaYoutube, FaLinkedin, FaInstagram, FaWhatsapp } from 'react-icons/fa';
import ReactDOM from 'react-dom';

const Header2 = ({ isScrolled = false, onNavigate }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [currentSection, setCurrentSection] = useState('landing');
  const location = useLocation();
  const navigate = useNavigate();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const navItems = [
    { name: 'HOME', path: '/', sectionId: 'landing' },
    { name: 'UPDATES', path: '/updates', sectionId: 'updates' },
    { name: 'EVENTS', path: '/events', sectionId: 'events' },
    { name: 'SPONSORS', path: '/sponsors', sectionId: 'sponsors' },
    { name:"SPEAKERS", path:"/speakers",sectionId:"speakers" },
    { name: 'ABOUT', path: '/about', sectionId: 'about' },
  ];

  // Check if current page is not home
  const isNotHomePage = location.pathname !== '/';

  const sectionIds = ['landing', 'updates', 'events', 'about', 'sponsors', 'highlights'];
  const sectionRefs = useRef({});

  // Scrollspy effect: highlight nav based on section in viewport
  useEffect(() => {
    // Only run on home page
    if (location.pathname !== '/' && location.pathname !== '/home2') return;

    const sectionIds = ['landing', 'updates', 'events', 'about', 'sponsors', 'highlights'];
    const getSectionVisibility = (id) => {
      const el = document.getElementById(id);
      if (!el) {
        return 0;
      }
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight || document.documentElement.clientHeight;
      const visible = Math.max(0, Math.min(rect.bottom, vh) - Math.max(rect.top, 0));
      return visible / Math.min(rect.height, vh);
    };
    const getFooterVisibility = () => {
      const footer = document.querySelector('footer');
      if (!footer) return 0;
      const rect = footer.getBoundingClientRect();
      const vh = window.innerHeight || document.documentElement.clientHeight;
      const visible = Math.max(0, Math.min(rect.bottom, vh) - Math.max(rect.top, 0));
      return visible / Math.min(rect.height, vh);
    };
    const onScroll = () => {
      let maxRatio = 0;
      let active = 'landing';
      const visibilityData = {};
      
      sectionIds.forEach((id) => {
        const ratio = getSectionVisibility(id);
        visibilityData[id] = ratio;
        if (ratio > 0.2 && ratio > maxRatio) {
          maxRatio = ratio;
          active = id;
        }
      });
      
      // Check contact/footer last
      const contactRatio = getFooterVisibility();
      visibilityData['contact'] = contactRatio;
      if (contactRatio > 0.2 && contactRatio > maxRatio) {
        active = 'contact';
      }
      
      setCurrentSection(active);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    // Run once on mount
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, [location.pathname]);

  const handleNavigation = (item) => {
    if (location.pathname === '/' || location.pathname === '/home2') {
      // If we're already on home page, scroll to section
      if (item.name === 'CONTACT') {
        // For contact, scroll to footer
        const footer = document.querySelector('footer');
        if (footer) {
          footer.scrollIntoView({ behavior: 'smooth' });
        }
        setCurrentSection('contact');
      } else {
        // Use the onNavigate prop from parent (Home2.jsx)
        if (onNavigate) {
          onNavigate(item.sectionId);
        } else {
          // Fallback: scroll to section manually with smooth behavior
          const section = document.getElementById(item.sectionId);
          if (section) {
            try {
              section.scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'nearest' });
            } catch (e) {
              // Fallback for older browsers
              window.scrollTo({
                top: section.offsetTop - 80,
                behavior: 'smooth'
              });
            }
          }
        }
        setCurrentSection(item.sectionId);
      }
    } else {
      // If we're on a different page, navigate to home with section
      if (item.name === 'CONTACT') {
        navigate('/', { state: { scrollToFooter: true } });
      } else {
        navigate('/', { state: { section: item.sectionId } });
      }
    }
    setIsMenuOpen(false);
  };

  return (
    <>
      <header className={`fixed top-0 left-0 right-0 z-50 pt-2 transition-all duration-300 ease-in-out ${
        isNotHomePage ? 'bg-black/30 backdrop-blur-sm' : (isScrolled ? 'bg-black/70 backdrop-blur-sm' : 'bg-transparent')
      }`}>
        <div className="w-full px-4 sm:px-6 lg:px-12">
          <div className="flex items-center justify-between h-16 sm:h-20">
            {/* Logo */}
            <div className="flex-shrink-0">
              <Link to="/" className="flex items-center">
                <img 
                  src="/yess_icon.png" 
                  alt="YESS Logo" 
                  className={`h-8 w-auto sm:h-12 transition-all duration-500 ease-in-out ${
                    isNotHomePage ? 'opacity-100 scale-100' : (isScrolled ? 'opacity-100 scale-100' : 'opacity-0 scale-75')
                  }`}
                />
                <div className={`overflow-hidden transition-all duration-500 ease-in-out ${
                  isNotHomePage ? 'max-w-[140px] opacity-100' : (isScrolled ? 'max-w-[140px] opacity-100' : 'max-w-0 opacity-0')
                }`}>
                  <span className="inline-block ml-2 text-lg font-bold text-white sm:ml-3 sm:text-2xl whitespace-nowrap">
                    YESS'25
                  </span>
                </div>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden space-x-2 lg:flex xl:space-x-4">
              {navItems.map((item) => (
                <button
                  key={item.name}
                  onClick={() => handleNavigation(item)}
                  className={`px-3 sm:px-4 py-2 sm:py-3 rounded-md text-sm font-medium transition-colors duration-200 ${
                    location.pathname === '/' && currentSection === item.sectionId
                      ? 'text-red-400 bg-red-900/20'
                      : 'text-white hover:text-red-400 hover:bg-red-900/20'
                  }`}
                >
                  {item.name}
                </button>
              ))}
            </nav>

            {/* Mobile menu button */}
            <div className="lg:hidden">
              <button
                onClick={toggleMenu}
                className="relative z-50 inline-flex items-center justify-center p-2 text-white transition-colors duration-200 rounded-md sm:p-3 hover:text-red-400 hover:bg-red-900/20 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-red-500"
              >
                <FaBars className="w-5 h-5 sm:h-6 sm:w-6" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay rendered via Portal */}
      {isMenuOpen && ReactDOM.createPortal(
        <div
          className="fixed inset-0 visible transition-all duration-300 ease-in-out opacity-100 lg:hidden bg-black/90 z-60"
        >
          <button
            onClick={toggleMenu}
            className="absolute p-2 text-white transition-colors duration-200 rounded-md top-4 right-4 sm:p-3 hover:text-red-400 hover:bg-red-900/20 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-red-500 z-70"
            aria-label="Close menu"
          >
            <FaTimes className="w-5 h-5 sm:h-6 sm:w-6" />
          </button>
          <div className="flex flex-col items-center w-full h-full">
            <div className="flex flex-col items-center justify-center flex-grow space-y-4">
              {navItems.map((item) => (
                <button
                  key={item.name}
                  onClick={() => handleNavigation(item)}
                  className={`block px-3 py-2 rounded-md font-medium transition-all duration-300 hover:scale-105 ${
                    location.pathname === '/' && currentSection === item.sectionId
                      ? 'text-red-400 text-xl bg-red-900/20'
                      : 'text-white hover:text-red-400 text-lg'
                  }`}
                >
                  {item.name}
                </button>
              ))}
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
};

export default Header2;