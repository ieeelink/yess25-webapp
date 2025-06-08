import React, { useState, useEffect } from 'react';
import HomeDesktop from './HomeDesktop';
import HomeMobile from './HomeMobile';

function ResponsiveHome() {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return isMobile ? <HomeMobile /> : <HomeDesktop />;
}

export default ResponsiveHome; 