import React, { useRef, useEffect } from 'react';
import Header from './Header';
import SubFooter from './SubFooter';
import BgAnimation from './BgAnimation';
import LandingSection from './sections/LandingSection';
import AboutSection from './sections/AboutSection';
import Highlights from './sections/Highlights';

function HomeDesktop() {
  const scrollContainerRef = useRef(null);

  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;

    const handleWheel = (e) => {
      e.preventDefault();
      const container = scrollContainer;
      const scrollAmount = e.deltaY;
      container.scrollLeft += scrollAmount;
    };

    scrollContainer.addEventListener('wheel', handleWheel, { passive: false });

    return () => {
      scrollContainer.removeEventListener('wheel', handleWheel);
    };
  }, []);

  const scrollToSection = (sectionId) => {
    const container = scrollContainerRef.current;
    const section = document.getElementById(sectionId);
    if (container && section) {
      container.scrollTo({
        left: section.offsetLeft,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="fixed inset-0 overflow-hidden">
      <div className="absolute inset-0 z-0">
        <BgAnimation/>
      </div>
      <div className="h-full flex flex-col relative z-10 bg-white/5">
        <Header onNavigate={scrollToSection} />
        <div 
          ref={scrollContainerRef}
          className="flex-1 overflow-x-auto overflow-y-hidden scrollbar-hide"
        >
          <div className="flex h-full">
            <div id="home" className="flex-none w-full h-full">
              <LandingSection />
            </div>
            <div id="about" className="flex-none w-full h-full">
              <AboutSection />
            </div>
            <div id="highlights" className="flex-none w-full h-full">
              <Highlights />
            </div>
          </div>
        </div>
        <SubFooter onNavigate={scrollToSection} />
      </div>
    </div>
  );
}

export default HomeDesktop; 