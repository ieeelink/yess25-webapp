import React, { useState, useEffect } from 'react';
import HomeDesktop from './HomeDesktop';
import HomeMobile from './HomeMobile';

function ResponsiveHome({ onContactClick, isContactPopupOpen, onCloseContactPopup }) {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return isMobile ? (
    <HomeMobile
      onContactClick={onContactClick}
      isContactPopupOpen={isContactPopupOpen}
      onCloseContactPopup={onCloseContactPopup}
    />
  ) : (
    <HomeDesktop
      onContactClick={onContactClick}
      isContactPopupOpen={isContactPopupOpen}
      onCloseContactPopup={onCloseContactPopup}
    />
  );
}

export default ResponsiveHome; 