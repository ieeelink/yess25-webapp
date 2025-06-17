import React from 'react';
import InfiniteScroll from '../InfiniteScroll';

function AboutSection() {
  const partnerImages = [
    '/IEEE.png',
    '/KS White.png',
    '/LINK White.png',
    '/nitc2.svg',
    '/sb_nitc.svg',
  ];

  return (
    <div className="w-full h-full flex flex-col">
      <main className="flex-grow flex flex-col md:flex-row items-center justify-center mt-12 md:mt-25 pt-2 md:pt-5 z-10 relative w-screen">
        <div className="w-full max-w-7xl px-6 md:px-8">
          {/* Infinite Scroll Section - Moved to top */}
          <div className="mb-8 md:hidden">
            <InfiniteScroll images={partnerImages} />
          </div>

          <div className="w-full mb-6 md:mb-8">
            <h1 className="text-3xl md:text-5xl font-bold text-white text-right">About Us</h1>
          </div>
          <div className="w-full mb-8 md:mb-4">
            <h3 className="text-xl md:text-2xl font-semibold text-white mb-3 md:mb-4">About YESS</h3>
            <p className="text-white text-base md:text-lg leading-relaxed nunito-sans-body">
              IEEE YESS'25, the largest engineering students summit by IEEE, is a collaborative initiative of IEEE India Council and IEEE Kerala Section. Set to take place on August 16th at NIT Calicut, this summit will bring together over 5,000 participants from across India, creating a platform for students to connect with industry professionals and enhance their professional development.
            </p>
          </div>
          <div className="flex flex-col md:grid md:grid-cols-2 gap-6 md:gap-8 w-full">
            <div className="flex flex-col justify-center w-full">
              <h3 className="text-xl md:text-2xl font-semibold text-white mb-3 md:mb-4">Our Host</h3>
              <div className="md:hidden w-full relative group mb-6 md:mb-8">
                <h2 className="absolute top-0 left-0 flex items-center right-0 justify-center text-3xl md:text-6xl font-bold text-[#ec4a56] transform translate-y-2 md:translate-y-4 -ml-7 drop-shadow-[0_2px_2px_rgba(254,74,86,0.6)] transition-all duration-300 group-hover:scale-105">
                  NIT, CALICUT
                </h2>
                <img 
                  src="/nit_bgremove (1).webp" 
                  alt="IEEE LINK Logo" 
                  className="w-full h-auto object-contain relative z-10 drop-shadow-[0_8px_16px_rgba(254,74,86,0.3)] hover:drop-shadow-[0_8px_16px_rgba(254,74,86,0.5)] hover:scale-105 transition-all duration-300 rounded-2xl"
                />
              </div>
              <p className="text-white text-base md:text-lg leading-relaxed nunito-sans-body">
                National Institute of Technology Calicut (NITC), established in 1961, is a premier technical institution under the Ministry of Education, Government of India. Renowned for excellence in engineering and research, NITC offers comprehensive undergraduate, postgraduate, and doctoral programs. Consistently ranked among India's top engineering colleges, it provides a nurturing environment for academic excellence and innovation.
              </p>
            </div>
            <div className="hidden md:flex flex-col justify-center w-full">
              <div className="w-full relative group">
                <h2 className="absolute top-0 left-0 flex items-center justify-center text-4xl sm:text-5xl md:text-6xl font-bold text-[#ec4a56] transform translate-y-2 sm:translate-y-4 drop-shadow-[0_2px_2px_rgba(254,74,86,0.6)] transition-all duration-300 group-hover:scale-105">
                  NIT, CALICUT
                </h2>
                <img 
                  src="/nit_bgremove (1).webp" 
                  alt="IEEE LINK Logo" 
                  className="w-full h-auto object-contain relative z-10 drop-shadow-[0_8px_16px_rgba(254,74,86,0.3)] hover:drop-shadow-[0_8px_16px_rgba(254,74,86,0.5)] hover:scale-105 transition-all duration-300 rounded-2xl"
                />
              </div>
            </div>
          </div>

          {/* Desktop Infinite Scroll Section */}
          <div className="hidden md:block mt-12">
            <InfiniteScroll images={partnerImages} />
          </div>
        </div>
      </main>
    </div>
  );
}

export default AboutSection; 