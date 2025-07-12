import React, { useEffect, useState, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import ResponsiveHome from '../components/ResponsiveHome';
import ContactPopup from '../components/ContactPopup';

function Home() {
  const location = useLocation();
  const [showContactPopup, setShowContactPopup] = useState(false);

  // Handler to open popup (for SubFooter)
  const handleContactClick = useCallback(() => setShowContactPopup(true), []);
  const handleCloseContactPopup = useCallback(() => setShowContactPopup(false), []);

  useEffect(() => {
    if (location.hash === '#about') {
      setTimeout(() => {
        const aboutSection = document.getElementById('about');
        if (aboutSection) {
          aboutSection.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    } else if (location.hash === '#contact') {
      setTimeout(() => {
        const landingSection = document.getElementById('landing');
        if (landingSection) {
          landingSection.scrollIntoView({ behavior: 'smooth' });
        }
        setShowContactPopup(true);
      }, 100);
    }
  }, [location]);

  return (
    <>
      <ResponsiveHome
        onContactClick={handleContactClick}
        isContactPopupOpen={showContactPopup}
        onCloseContactPopup={handleCloseContactPopup}
      />
      <ContactPopup isOpen={showContactPopup} onClose={handleCloseContactPopup} />
    </>
  );
}

export default Home;