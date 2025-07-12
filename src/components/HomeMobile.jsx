import React from 'react';
import Header from './Header';
import SubFooter from './SubFooter';
import BgAnimation from './BgAnimation';
import LandingSection from './sections/LandingSection';
import AboutSection from './sections/AboutSection';
import Highlights from './sections/Highlights';
import PricingSection from './sections/PricingSection';

function HomeMobile({ onContactClick, isContactPopupOpen, onCloseContactPopup }) {
  const scrollToSection = (sectionId) => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white overflow-y-auto">
      <div className="fixed inset-0 z-0">
        <BgAnimation/>
      </div>
      <div className="relative z-10 bg-white/5">
        <Header onNavigate={scrollToSection} />
        <main>
          <section id="home" className="h-screen">
            <LandingSection />
          </section>
          <section id="about" className="backdrop-blur-sm bg-black/5">
            <AboutSection />
          </section>
          {/* <PricingSection /> */}
          <section id="highlights" className="backdrop-blur-sm bg-black/5">
            <Highlights />
          </section>
        </main>
        <SubFooter 
          onNavigate={scrollToSection}
          onContactClick={typeof onContactClick === 'function' ? onContactClick : undefined}
          isContactPopupOpen={isContactPopupOpen}
          onCloseContactPopup={onCloseContactPopup}
        />
      </div>
    </div>
  );
}

export default HomeMobile; 