import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import ContactPopup from './ContactPopup';
import Overlay from './Overlay';

const SubFooter = ({ onNavigate, currentSection, onContactClick, isContactPopupOpen, onCloseContactPopup }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isOverlayOpen, setIsOverlayOpen] = React.useState(false);

  const handleNavigation = (sectionId) => {
    if (location.pathname !== '/') {
      navigate('/', { state: { section: sectionId } });
    } else if (onNavigate) {
      onNavigate(sectionId);
    }
  };

  // Desktop-only wheel handler to forward scroll to main container
  const handleFooterWheel = (e) => {
    if (window.innerWidth < 1024) return; // Only desktop
    e.preventDefault();
    const mainScrollContainer = document.querySelector('.scrollbar-hide');
    if (mainScrollContainer) {
      const simulatedEvent = new WheelEvent('wheel', {
        deltaY: e.deltaY,
        deltaX: e.deltaX,
        bubbles: true,
        cancelable: true
      });
      mainScrollContainer.dispatchEvent(simulatedEvent);
    }
  };

  return (
    <footer
      className="bg-brand-white text-brand-black pb-3"
      onWheel={handleFooterWheel}
    >
      <div className="w-screen px-4 lg:px-8">
        <div className="flex items-center justify-between h-12 lg:h-20">
          {/* Desktop Navigation */}
          <nav className="hidden lg:flex w-full justify-between px-8">
            <button 
              onClick={() => handleNavigation('highlights')}
              className={`text-lg font-medium transition-all duration-300 hover:scale-110 ${
                currentSection === 'highlights' ? 'text-[#fe4a56]' : 'text-white hover:text-[#8c0505]'
              }`}
            >
              HIGHLIGHTS'24
            </button>
            <div className="flex flex-col items-center">
              <div className="text-sm text-gray-400">
                <button
                  className="bg-transparent border-none p-0 m-0 text-inherit cursor-pointer"
                  style={{ background: 'none', border: 'none', padding: 0, margin: 0 }}
                  onClick={() => setIsOverlayOpen(true)}
                  type="button"
                >
                  {new Date().getFullYear()} IEEE LINK. All rights reserved.
                </button>
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
                onClick={onContactClick}
                className={`text-lg font-medium transition-all duration-300 hover:scale-110 ${
                  location.pathname === '/contact' ? 'text-[#fe4a56]' : 'text-white hover:text-[#8c0505]'
                }`}
              >
                CONTACT US
              </button>
              <ContactPopup isOpen={isContactPopupOpen} onClose={onCloseContactPopup} />
            </div>
          </nav>

          {/* Mobile Copyright */}
          <div className="lg:hidden w-full text-center">
            <div className="text-sm text-gray-400">
              <button
                className="bg-transparent border-none p-0 m-0 text-inherit cursor-pointer"
                style={{ background: 'none', border: 'none', padding: 0, margin: 0 }}
                onClick={() => setIsOverlayOpen(true)}
                type="button"
              >
                9 {new Date().getFullYear()} IEEE LINK. All rights reserved.
              </button>
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
      <Overlay visible={isOverlayOpen} />
      {isOverlayOpen && (
        <div
          className="fixed inset-0 z-[10000]"
          onClick={() => setIsOverlayOpen(false)}
          style={{ cursor: 'pointer' }}
        />
      )}
    </footer>
  );
};

export default SubFooter;
