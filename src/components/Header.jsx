import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  FaYoutube, 
  FaLinkedin, 
  FaInstagram, 
  FaWhatsapp 
} from 'react-icons/fa';

const Header = ({ onNavigate }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isScrolled, setIsScrolled] = useState(false);
  const [currentSection, setCurrentSection] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

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

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsScrolled(scrollPosition > 100); // Adjust this value based on your landing section height
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const { state } = location;
    if (state?.section) {
      setCurrentSection(state.section);
    }
  }, [location]);

  useEffect(() => {
    const handleHorizontalScroll = () => {
      const container = document.querySelector('.scrollbar-hide');
      if (container) {
        const scrollLeft = container.scrollLeft;
        const windowWidth = window.innerWidth;
        const halfWindowWidth = windowWidth / 2;
        
        // Calculate which section is more than half visible
        if (scrollLeft >= windowWidth - halfWindowWidth && scrollLeft < windowWidth * 2 - halfWindowWidth) {
          setCurrentSection('about');
        } else if (scrollLeft >= windowWidth * 2 - halfWindowWidth) {
          setCurrentSection('highlights');
        } else {
          setCurrentSection('home');
        }
      }
    };

    const container = document.querySelector('.scrollbar-hide');
    if (container) {
      container.addEventListener('scroll', handleHorizontalScroll);
      return () => container.removeEventListener('scroll', handleHorizontalScroll);
    }
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleNavigation = (sectionId) => {
    if (location.pathname !== '/') {
      navigate('/', { state: { section: sectionId }, replace: true });
    } else if (onNavigate) {
      onNavigate(sectionId);
      setCurrentSection(sectionId);
    }
    setIsMenuOpen(false);
  };

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-300 ${
      isScrolled ? 'bg-[#151515]/90' : 'bg-brand-white'
    }`}>
      {/* Loading Bar */}
      <div className={`h-1 bg-[#fe4a56] transition-all duration-300 ${loading ? 'loading-bar w-full' : 'w-0 opacity-0'}`}></div>
      
      <div className="py-2 lg:py-2">
        <div className="w-screen px-4 lg:px-8">
          <div className="flex items-center justify-between h-12 lg:h-20">
            {/* Desktop Navigation */}
            <nav className="hidden lg:flex w-full justify-between px-8">
              <button 
                onClick={() => handleNavigation('home')}
                className={`text-lg font-medium transition-all duration-300 hover:scale-110 ${
                  currentSection === 'home' ? 'text-[#fe4a56]' : 'text-brand-white hover:text-[#8c0505]'
                }`}
              >
                HOME
              </button>
              <button 
                onClick={() => handleNavigation('about')}
                className={`text-lg font-medium transition-all duration-300 hover:scale-110 ${
                  currentSection === 'about' ? 'text-[#fe4a56]' : 'text-brand-white hover:text-[#8c0505]'
                }`}
              >
                ABOUT US
              </button>
            </nav>

            {/* Mobile Logo */}
            <div className="lg:hidden flex items-center">
              <img 
                src="/yess_icon.png" 
                alt="YESS Logo" 
                className="h-10 w-auto pl-3 pt-2"
              />
              <div className={`overflow-hidden transition-all duration-500 ease-in-out ${
                isScrolled ? 'max-w-[120px] opacity-100' : 'max-w-0 opacity-0'
              }`}>
                <span className="text-brand-white text-xl font-bold ml-2 whitespace-nowrap inline-block">
                  YESS'25
                </span>
              </div>
            </div>

            {/* Mobile menu button */}
            <button 
              className="lg:hidden p-2 rounded-md text-brand-white hover:text-brand-darkred hover:bg-gray-100 focus:outline-none transition-colors relative z-50"
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
            className={`lg:hidden fixed inset-0 bg-black/90 z-40 transition-all duration-300 ease-in-out ${
              isMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
            }`}
          >
            <div className="h-full w-full flex flex-col items-center">
              <div className="flex-grow flex flex-col items-center justify-center space-y-4">
                <button 
                  onClick={() => handleNavigation('home')}
                  className={`block px-3 py-2 rounded-md font-medium transition-all duration-300 hover:scale-105 ${
                    location.pathname === '/' ? 'text-[#fe4a56] text-xl' : 'text-brand-white hover:text-brand-darkred text-lg'
                  }`}
                >
                  HOME
                </button>
                <button 
                  onClick={() => handleNavigation('about')}
                  className={`block px-3 py-2 rounded-md font-medium transition-all duration-300 hover:scale-105 ${
                    location.pathname === '/aboutus' ? 'text-[#fe4a56] text-xl' : 'text-brand-white hover:text-brand-darkred text-lg'
                  }`}
                >
                  ABOUT US
                </button>
                <button 
                  onClick={() => handleNavigation('highlights')}
                  className={`block px-3 py-2 rounded-md font-medium transition-all duration-300 hover:scale-105 ${
                    location.pathname === '/highlights24' ? 'text-[#fe4a56] text-xl' : 'text-brand-white hover:text-brand-darkred text-lg'
                  }`}
                >
                  HIGHLIGHTS'24
                </button>
               
                {/* <Link 
                  to="/events" 
                  className={`block px-3 py-2 rounded-md font-medium transition-all duration-300 hover:scale-105 ${
                    location.pathname === '/events' ? 'text-[#fe4a56] text-xl' : 'text-brand-white hover:text-brand-darkred text-lg'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  EVENTS
                </Link> */}
                <Link 
                  to="/tickets" 
                  className={`block px-3 py-2 rounded-md font-medium transition-all duration-300 hover:scale-105 ${
                    location.pathname === '/tickets' ? 'text-[#fe4a56] text-xl' : 'text-brand-white hover:text-brand-darkred text-lg'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  TICKETS
                </Link>
              </div>
              
              {/* Contact Section */}
              <div className="w-full max-w-sm px-4 py-6 bg-transparent rounded-lg mb-8">
                <div className="space-y-4 text-center">
                  <div>
                    <p className="text-white/80 mb-1">Email us at:</p>
                    <a href="mailto:ieeeyess2024@gmail.com" className="text-[#fe4a56] hover:text-[#8c0505] font-medium">
                      ieeeyess2024@gmail.com
                    </a>
                  </div>

                  <div>
                    <p className="text-white/80 mb-2">Follow us on social media:</p>
                    <div className="flex justify-center space-x-3">
                      <a
                        href="https://www.youtube.com/@IEEEYESS"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-[#fe4a56] hover:bg-[#8c0505] text-white rounded-full w-10 h-10 flex items-center justify-center transition-colors"
                        title="YouTube"
                      >
                        <FaYoutube className="w-6 h-6" />
                      </a>
                      <a
                        href="https://www.linkedin.com/company/ieeeyess"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-[#fe4a56] hover:bg-[#8c0505] text-white rounded-full w-10 h-10 flex items-center justify-center transition-colors"
                        title="LinkedIn"
                      >
                        <FaLinkedin className="w-6 h-6" />
                      </a>
                      <a
                        href="https://www.instagram.com/ieeeyess"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-[#fe4a56] hover:bg-[#8c0505] text-white rounded-full w-10 h-10 flex items-center justify-center transition-colors"
                        title="Instagram"
                      >
                        <FaInstagram className="w-6 h-6" />
                      </a>
                      <a
                        href="https://whatsapp.com/channel/0029VaeZIV217En1T1i38Y1X"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-[#fe4a56] hover:bg-[#8c0505] text-white rounded-full w-10 h-10 flex items-center justify-center transition-colors"
                        title="WhatsApp"
                      >
                        <FaWhatsapp className="w-6 h-6" />
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
