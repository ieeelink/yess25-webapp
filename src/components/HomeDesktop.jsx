import React, { useRef, useEffect, useState } from 'react';
import Header from './Header';
import SubFooter from './SubFooter';
import BgAnimation from './BgAnimation';
import LandingSection from './sections/LandingSection';
import AboutSection from './sections/AboutSection';
import Highlights from './sections/Highlights';
import PricingSection from './sections/PricingSection';

function HomeDesktop({ onContactClick, isContactPopupOpen, onCloseContactPopup }) {
  const scrollContainerRef = useRef(null);
  const [isScrollingAboutContent, setIsScrollingAboutContent] = useState(false);
  const [currentSection, setCurrentSection] = useState('home');

  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;

    const handleWheel = (e) => {
      // Check if we're currently scrolling About section content
      const aboutSection = document.querySelector('[data-about-section]');
      if (aboutSection) {
        const aboutRect = aboutSection.getBoundingClientRect();
        const isAtLeftBorder = aboutRect.left <= 0 && aboutRect.right > 0;
        const isAtRightBorder = aboutRect.right >= window.innerWidth && aboutRect.left < window.innerWidth;
        
        if (isAtLeftBorder || isAtRightBorder) {
          // Let the About section handle the scroll
          return;
        }
      }

      e.preventDefault();
      const container = scrollContainer;
      const scrollAmount = e.deltaY;
      container.scrollLeft += scrollAmount;
    };

    const handleScroll = () => {
      if (!scrollContainer) return;
      const sections = ['home', 'about', 'highlights'];
      let minDiff = Infinity;
      let activeSection = 'home';
      sections.forEach((id) => {
        const el = document.getElementById(id);
        if (el) {
          const rect = el.getBoundingClientRect();
          // Find the section whose left edge is closest to the viewport's left
          const diff = Math.abs(rect.left);
          if (diff < minDiff) {
            minDiff = diff;
            activeSection = id;
          }
        }
      });
      setCurrentSection(activeSection);
    };

    scrollContainer.addEventListener('wheel', handleWheel, { passive: false });
    scrollContainer.addEventListener('scroll', handleScroll);
    // Initial check
    handleScroll();

    return () => {
      scrollContainer.removeEventListener('wheel', handleWheel);
      scrollContainer.removeEventListener('scroll', handleScroll);
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
        <Header onNavigate={scrollToSection} currentSection={currentSection} />
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
            {/* <div className="flex-none w-full h-full">
              <PricingSection />
            </div> */}
            <div id="highlights" className="flex-none w-full h-full">
              <Highlights />
            </div>
          </div>
        </div>
        <SubFooter 
          onNavigate={scrollToSection} 
          currentSection={currentSection}
          onContactClick={typeof onContactClick === 'function' ? onContactClick : undefined}
          isContactPopupOpen={isContactPopupOpen}
          onCloseContactPopup={onCloseContactPopup}
        />
      </div>
    </div>
  );
}

export default HomeDesktop; 