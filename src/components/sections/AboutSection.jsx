import React, { useRef, useEffect, useState } from 'react';
import InfiniteScroll from '../InfiniteScroll';

function AboutSection() {
  const aboutSectionRef = useRef(null);
  const contentContainerRef = useRef(null);
  const [isScrollingContent, setIsScrollingContent] = useState(false);

  const partnerImages = [
    '/IEEE.png',
    '/KS White.png',
    '/LINK White.png',
    '/nitc2.svg',
    '/nitc.png',
  ];

  useEffect(() => {
    const aboutSection = aboutSectionRef.current;
    const contentContainer = contentContainerRef.current;
    const mainScrollContainer = document.querySelector('.scrollbar-hide');

    if (!aboutSection || !contentContainer || !mainScrollContainer) return;

    // Only apply custom scroll behavior on desktop (width >= 1024px)
    const isDesktop = window.innerWidth >= 1024;
    if (!isDesktop) return;

    let isInAboutSection = false;
    let isScrollingAboutContent = false;

    const handleWheel = (e) => {
      e.preventDefault();

      // Check if About section is at the left border (forward scroll)
      const aboutRect = aboutSection.getBoundingClientRect();
      const isAtLeftBorder = aboutRect.left <= 0 && aboutRect.right > 0;
      
      // Check if About section is at the right border (backward scroll)
      const isAtRightBorder = aboutRect.right >= window.innerWidth && aboutRect.left < window.innerWidth;

      // If we're at either border and scrolling in the appropriate direction, handle About section scrolling
      if ((isAtLeftBorder && e.deltaY > 0) || (isAtRightBorder && e.deltaY < 0)) {
        if (!isScrollingAboutContent) {
          // Start scrolling About section content
          isScrollingAboutContent = true;
          setIsScrollingContent(true);
        }
        
        const contentScrollWidth = contentContainer.scrollWidth - contentContainer.clientWidth;
        const currentScrollLeft = contentContainer.scrollLeft;
        
        if (e.deltaY > 0) {
          // Forward scroll
          const scrollAmount = e.deltaY;
          const newScrollLeft = Math.max(0, Math.min(contentScrollWidth, currentScrollLeft + scrollAmount));
          contentContainer.scrollLeft = newScrollLeft;

          // Check if we've reached the end of About section content
          if (newScrollLeft >= contentScrollWidth) {
            isScrollingAboutContent = false;
            setIsScrollingContent(false);
            // Resume main page scrolling
            mainScrollContainer.scrollLeft += scrollAmount;
          }
        } else {
          // Backward scroll
          const scrollAmount = Math.abs(e.deltaY);
          const newScrollLeft = Math.max(0, currentScrollLeft - scrollAmount);
          contentContainer.scrollLeft = newScrollLeft;

          // Check if we've reached the beginning of About section content
          if (newScrollLeft <= 0) {
            isScrollingAboutContent = false;
            setIsScrollingContent(false);
            // Resume main page scrolling backward
            mainScrollContainer.scrollLeft -= scrollAmount;
          }
        }
      } else if (isScrollingAboutContent) {
        // Continue scrolling About section content
        const contentScrollWidth = contentContainer.scrollWidth - contentContainer.clientWidth;
        const currentScrollLeft = contentContainer.scrollLeft;
        const scrollAmount = e.deltaY;
        
        if (scrollAmount > 0) {
          // Forward scroll
          const newScrollLeft = Math.max(0, Math.min(contentScrollWidth, currentScrollLeft + scrollAmount));
          contentContainer.scrollLeft = newScrollLeft;

          // Check if we've reached the end of About section content
          if (newScrollLeft >= contentScrollWidth) {
            isScrollingAboutContent = false;
            setIsScrollingContent(false);
            // Resume main page scrolling
            mainScrollContainer.scrollLeft += scrollAmount;
          }
        } else {
          // Backward scroll
          const newScrollLeft = Math.max(0, currentScrollLeft - Math.abs(scrollAmount));
          contentContainer.scrollLeft = newScrollLeft;

          // Check if we've reached the beginning of About section content
          if (newScrollLeft <= 0) {
            isScrollingAboutContent = false;
            setIsScrollingContent(false);
            // Resume main page scrolling backward
            mainScrollContainer.scrollLeft -= Math.abs(scrollAmount);
          }
        }
      } else {
        // Normal main page scrolling - only when not at borders or not scrolling in the right direction
        mainScrollContainer.scrollLeft += e.deltaY;
      }
    };

    const handleScroll = () => {
      const aboutRect = aboutSection.getBoundingClientRect();
      const isAtLeftBorder = aboutRect.left <= 0 && aboutRect.right > 0;
      const isAtRightBorder = aboutRect.right >= window.innerWidth && aboutRect.left < window.innerWidth;
      
      if ((isAtLeftBorder || isAtRightBorder) && !isInAboutSection) {
        isInAboutSection = true;
      } else if (!isAtLeftBorder && !isAtRightBorder && isInAboutSection) {
        isInAboutSection = false;
        isScrollingAboutContent = false;
        setIsScrollingContent(false);
      }
    };

    mainScrollContainer.addEventListener('wheel', handleWheel, { passive: false });
    mainScrollContainer.addEventListener('scroll', handleScroll);

    return () => {
      mainScrollContainer.removeEventListener('wheel', handleWheel);
      mainScrollContainer.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div ref={aboutSectionRef} data-about-section className="w-full min-h-screen flex flex-col items-center justify-center">
      <main className="flex-grow flex flex-col lg:flex-row items-center justify-center min-h-0 w-screen relative z-10 lg:px-8">
        <div className="w-full px-4 lg:px-0 md:px-6 flex flex-col min-h-0 flex-1 aboutsection-text-responsive" style={{height: '100%', minHeight: 0, maxWidth: 'min(1600px, 100vw)'}}>
          {/* Infinite Scroll Section - Moved to top */}
          <div className="mb-8 lg:hidden">
            <InfiniteScroll images={partnerImages} />
          </div>

          <div className="w-full md:mb-4 ">
            <h1 className="text-3xl lg:text-5xl font-bold text-white text-right">About Us</h1>
          </div>

          {/* Content Scrollable Container - Desktop horizontal scroll */}
          <div 
            ref={contentContainerRef}
            className="w-full flex flex-col lg:flex-row lg:overflow-x-auto lg:gap-8 scrollbar-hide min-h-0 aboutsection-text-responsive"
            style={{minHeight: 0}}
          >
            {/* All About Content Container */}
            <div className="w-full lg:min-w-full lg:flex-shrink-0">
              <div className="w-full mb-8 lg:mb-4">
                <h3 className="text-xl lg:text-2xl font-semibold text-white mb-3 lg:mb-4">About YESS</h3>
                <p className="text-white text-base lg:text-lg leading-relaxed nunito-sans-body">
                  IEEE YESS'25, the largest engineering students summit by IEEE, is a collaborative initiative of IEEE India Council and IEEE Kerala Section. Set to take place on August 16th at NIT Calicut, this summit will bring together over 5,000 participants from across India, creating a platform for students to connect with industry professionals and enhance their professional development.
                </p>
              </div>
              
              <div className="flex flex-col lg:grid lg:grid-cols-2 gap-6 lg:gap-8 w-full mb-8 aboutsection-text-responsive">
                <div className="flex flex-col justify-center w-full aboutsection-text-responsive">
                  <h3 className="text-xl lg:text-2xl aboutsection-text-responsive font-semibold text-white mb-3 lg:mb-4">Our Host</h3>
                  <div className="lg:hidden w-full relative group mb-6 lg:mb-8">
                    <h2 className="absolute top-0 left-0 flex items-center right-0 justify-center text-3xl lg:text-6xl aboutsection-text-responsive nitcalicut-text-responsive font-bold text-[#ec4a56] transform translate-y-2 lg:translate-y-4 -ml-7 drop-shadow-[0_2px_2px_rgba(254,74,86,0.6)] transition-all duration-300 group-hover:scale-105">
                      NIT, CALICUT
                    </h2>
                    <img 
                      src="/nit_bgremove (1).webp" 
                      alt="IEEE LINK Logo" 
                      className="w-full h-auto object-contain relative z-10 drop-shadow-[0_8px_16px_rgba(31,41,55,0.7)] hover:drop-shadow-[0_8px_16px_rgba(31,41,55,0.9)] hover:scale-105 transition-all duration-300 rounded-2xl"
                    />
                  </div>
                  <p className="text-white text-lg aboutsection-text-responsive nunito-sans-body leading-relaxed">
                    National Institute of Technology Calicut (NITC), established in 1961, is a premier technical institution under the Ministry of Education, Government of India. Renowned for excellence in engineering and research, NITC offers comprehensive undergraduate, postgraduate, and doctoral programs. Consistently ranked among India's top engineering colleges, it provides a nurturing environment for academic excellence and innovation.
                  </p>
                </div>
                <div className="hidden lg:flex flex-col justify-center w-full aboutsection-text-responsive">
                  <div className="w-full relative group aboutsection-text-responsive">
                    <h2 className="absolute top-8 left-35 flex items-center justify-center text-4xl sm:text-5xl lg:text-6xl aboutsection-text-responsive nitcalicut-text-responsive font-bold text-[#ec4a56] transform translate-y-2 sm:translate-y-4 drop-shadow-[0_2px_2px_rgba(254,74,86,0.6)] transition-all duration-300 group-hover:scale-105">
                      NIT, CALICUT
                    </h2>
                    <img 
                      src="/nit_bgremove (1).webp" 
                      alt="IEEE LINK Logo" 
                      className="w-full h-auto object-contain relative lg:scale-80 aboutsection-text-responsive z-10 drop-shadow-[0_8px_16px_rgba(31,41,55,0.7)] hover:drop-shadow-[0_8px_16px_rgba(31,41,55,0.9)] hover:scale-85 transition-all duration-300 rounded-2xl"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* New IEEE Sections Container - Visible on all devices */}
            <div className="w-full mt-8 lg:mt-0 lg:min-w-full lg:flex-shrink-0">
              <div className="w-full mb-6">
                <h3 className="text-xl lg:text-2xl font-semibold text-white mb-3 lg:mb-4">About IEEE</h3>
                <p className="text-white text-base lg:text-lg leading-relaxed nunito-sans-body">
                  IEEE (Institute of Electrical and Electronics Engineers) is the world's largest technical professional organization dedicated to advancing technology for the benefit of humanity. With over 400,000 members in more than 160 countries, IEEE fosters innovation, education, and collaboration through conferences, publications, and standards.
                </p>
              </div>
              
              <div className="w-full mb-6">
                <h3 className="text-xl lg:text-2xl font-semibold text-white mb-3 lg:mb-4">About IEEE LINK</h3>
                <p className="text-white text-base lg:text-lg leading-relaxed nunito-sans-body">
                  IEEE LINK (Local Integrated Network of Kerala) is a unique initiative by the IEEE Kerala Section, designed to connect and empower IEEE student branches across the state. Established in 2000, LINK acts as a bridge between students and professionals, facilitating leadership development, technical training, and collaborative projects. Members also gain access to a vibrant community, mentorship, and exciting opportunities.
                </p>
              </div>
              
              <div className="w-full mb-6">
                <h3 className="text-xl lg:text-2xl font-semibold text-white mb-3 lg:mb-4">About IEEE Kerala Section</h3>
                <p className="text-white text-base lg:text-lg leading-relaxed nunito-sans-body">
                  IEEE Kerala Section, established in 1983, is one of the most active and innovative sections of IEEE in India. It serves as the regional hub for IEEE activities in Kerala, supporting over 10,000 members including professionals, academicians, and students. The section is renowned for its dynamic student network, technical conferences, workshops, and humanitarian initiatives.
                </p>
              </div>
            </div>
          </div>

          {/* Desktop Infinite Scroll Section - moved here to be below the scrollable content */}
          <div className="hidden lg:block">
            <InfiniteScroll images={partnerImages} />
          </div>
        </div>
      </main>
    </div>
  );
}

export default AboutSection; 