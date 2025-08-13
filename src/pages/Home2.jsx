import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import BgAnimation from '../components/BgAnimation';
import Header2 from "../components/Header2";
import LandingSection from '../components/LandingSection';
import PartnersSection from '../components/PartnersSection';
import ExploreEventsSection from '../components/ExploreEventsSection';
import AboutSection from '../components/AboutSection';
import HighlightsSection from '../components/HighlightsSection';
import TicketForm from '../components/TicketForm';
import CheckStatus from '../pages/CheckStatus';
import UpdatesSection from '../components/UpdatesSection';
import MascotSection from '../components/MascotSection';

const Home2 = ({
  showTicketForm,
  setShowTicketForm,
  showCheckStatus,
  setShowCheckStatus
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  const partnerImages = [
    '/IEEE.png',
    '/KS White.png',
    '/LINK White.png',
    '/nitc.png',
  ];

  const highlightImages = [
    {
      src: '/images/Highlight21.jpeg',
      alt: 'Inaugration',
    },
    {
      src: '/images/Highlight20.jpeg',
      alt: 'The Dignitaries',
    },
    {
      src: '/images/Highlight1.webp',
      alt: "Drone and RC Car Show",
    },
    {
      src: '/images/Highlight9.webp',
      alt: 'INARA: When Fashion meets Technology',
    },
    {
      src: '/images/Highlight10.jpeg',
      alt: "INARA: The world's first AI-designed, VR-powered fashion show",
    },
    {
      src: '/images/Highlight6.webp',
      alt: "Automotive Expo by VTS Kerala Chapter",
    },
    {
      src: '/images/Highlight12.jpeg',
      alt: 'Industry Mentoring Program',
    },
    {
      src: '/images/Highlight13.jpeg',
      alt: 'Industry Mentoring Program',
    },
    {
      src: '/images/Highlight18.jpeg',
      alt: 'Steel and Motion Expo by IEEE RAS Kerala Chapter',
    },
    {
      src: '/images/Highlight19.jpeg',
      alt: 'Assistive Technology Makethon',
    },
    {
      src: '/images/Highlight2.webp',
      alt: "LINK Team 2024",
    },
    {
      src: '/images/Highlight5.webp',
      alt: 'Crazy Vibes...',
    },
  ];

  const scrollToSection = (sectionId) => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const landingHeight = window.innerHeight; // Height of the landing section
      
      if (scrollPosition > landingHeight * 0.5) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Handle navigation state when component mounts
  useEffect(() => {
    // Check if this is a page refresh (no navigation state) vs redirect from another page
    const isPageRefresh = !location.state && !sessionStorage.getItem('hasNavigated');
    
    if (isPageRefresh) {
      // On page refresh, scroll to landing section
      setTimeout(() => {
        scrollToSection('landing');
      }, 100);
    } else if (location.state?.section) {
      // When redirected from another page with specific section
      setTimeout(() => {
        scrollToSection(location.state.section);
      }, 100);
      // Mark that we've navigated to prevent this from running on refresh
      sessionStorage.setItem('hasNavigated', 'true');
    } else if (location.state?.scrollToFooter) {
      // When redirected from another page to scroll to footer
      setTimeout(() => {
        const footer = document.querySelector('footer');
        if (footer) {
          footer.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
      // Mark that we've navigated to prevent this from running on refresh
      sessionStorage.setItem('hasNavigated', 'true');
    }
  }, [location.state]);

  // Handle hash-based navigation (e.g., /#about)
  useEffect(() => {
    if (location.hash) {
      let sectionId = location.hash.replace('#', '');
      if (sectionId === 'home') sectionId = 'landing';
      if (sectionId === 'contact') {
        setTimeout(() => {
          const footer = document.querySelector('footer');
          if (footer) {
            footer.scrollIntoView({ behavior: 'smooth' });
          }
        }, 100);
        return;
      }
      setTimeout(() => {
        scrollToSection(sectionId);
      }, 100);
    }
  }, [location.hash]);

  // Clear navigation flag when component unmounts
  useEffect(() => {
    return () => {
      sessionStorage.removeItem('hasNavigated');
    };
  }, []);

  return (
    <>
      <div className="min-h-screen bg-[#0a0a0a] text-white relative overflow-x-hidden">
        {/* Background Animation */}
        <div className="fixed inset-0 z-0">
          <BgAnimation />
        </div>
        <Header2 isScrolled={isScrolled} onNavigate={scrollToSection}/>
        <LandingSection scrollToSection={scrollToSection} isScrolled={isScrolled} onOpenTicketForm={() => setShowTicketForm(true)} onOpenCheckStatus={() => setShowCheckStatus(true)} />
        <PartnersSection images={partnerImages} />
        <UpdatesSection />
        <MascotSection />
        <ExploreEventsSection />
        <AboutSection />
        <HighlightsSection highlightImages={highlightImages} />
        {showTicketForm && (
          <div className="fixed inset-0 z-[9999] flex items-start px-2 md:items-center justify-center bg-black/70 backdrop-blur-sm overflow-y-auto py-8 md:pt-0">
              <TicketForm onClose={() => setShowTicketForm(false)} />
          </div>
        )}
        {showCheckStatus && (
          <div className="fixed inset-0 z-[9999] flex items-start px-2 md:items-center justify-center bg-black/70 backdrop-blur-sm overflow-y-auto py-8 md:pt-0">
              <CheckStatus onClose={() => setShowCheckStatus(false)} />
          </div>
        )}
      </div>
      {/* Styles remain unchanged */}
    <style>{`
      /* Custom Scrollbar Styles */
      ::-webkit-scrollbar {
        width: 12px;
      }
      
      ::-webkit-scrollbar-track {
        background: rgba(0, 0, 0, 0.1);
        border-radius: 10px;
      }
      
      ::-webkit-scrollbar-thumb {
        background: linear-gradient(180deg, #fe4a56 0%, #ea1212 100%);
        border-radius: 10px;
        border: 2px solid rgba(0, 0, 0, 0.1);
        transition: all 0.3s ease;
      }
      
      ::-webkit-scrollbar-thumb:hover {
        background: linear-gradient(180deg, #ea1212 0%, #fe4a56 100%);
        transform: scale(1.05);
      }
      
      ::-webkit-scrollbar-thumb:active {
        background: linear-gradient(180deg, #d41010 0%, #ea1212 100%);
      }
      
      /* Firefox Scrollbar */
      * {
        scrollbar-width: thin;
        scrollbar-color: #fe4a56 rgba(0, 0, 0, 0.1);
      }
      
      /* Smooth scrolling for the entire page */
      html {
        scroll-behavior: smooth;
      }
      
      /* Swiper Styles */
      .swiper {
        width: 100%;
        height: 100%;
        padding-top: 0;
        padding-bottom: 0;
      }
      
      .swiper-slide {
        background-position: center;
        background-size: cover;
        width: 100%;
        height: 100%;
      }
      
      .swiper-slide img {
        display: block;
        width: 100%;
        height: 100%;
      }
      
      .custom-swiper-button {
        position: static !important;
        width: 36px !important;
        height: 36px !important;
        margin: 0 !important;
        z-index: 30 !important;
      }
      
      @media (min-width: 640px) {
        .custom-swiper-button {
          width: 42px !important;
          height: 42px !important;
        }
      }
      
      @media (min-width: 768px) {
        .custom-swiper-button {
          width: 48px !important;
          height: 48px !important;
        }
      }
      
      .custom-swiper-button::after {
        display: none;
      }
      
      .swiper-pagination-bullet {
        background: #FE4A56 !important;
      }
      
      .swiper-pagination-bullet-active {
        background: #FE4A56 !important;
      }
    `}</style>
    </>
  );
};

export default Home2; 