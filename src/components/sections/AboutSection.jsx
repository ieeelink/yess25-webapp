import React from 'react';
import Header from '../Header';
import SubFooter from '../SubFooter';
import BgAnimation from '../BgAnimation';

function AboutSection() {
  return (
    <>
      <div className="fixed inset-0 z-0">
        <BgAnimation />
      </div>
      <div className="relative min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow flex flex-col items-center justify-center mt-25 pt-5 z-10 relative">
          <div className="w-full max-w-7xl mx-auto px-6 md:px-8">
            <div className="w-full mb-12">
              <h1 className="text-4xl md:text-5xl font-bold text-white text-right">About Us</h1>
            </div>
            <div className="w-full mb-12">
              <h3 className="text-2xl font-semibold text-white mb-4">About YESS</h3>
              <p className="text-white/80 text-lg leading-relaxed text-justify">
                IEEE YESS'25 - Yearly Engineering Students Summit 2025, the largest engineering students summit by IEEE, which is organised jointly by the IEEE India Council and IEEE Kerala Section. This event aims to engage over 5,000 participants from across India. This year, IEEE YESS will take place in Kerala on August 16th at National Institute of Technology, Calicut. The summit aims to connect engineering students with industry professionals, providing a platform for networking, learning, and professional development.
              </p>
            </div>
            <div className="flex flex-col md:grid md:grid-cols-2 gap-8 w-full">
              <div className="flex flex-col justify-center w-full">
                <h3 className="text-2xl font-semibold text-white mb-4">Our Host</h3>
                <div className="md:hidden w-full relative group mb-8">
                  <h2 className="absolute top-0 left-0 flex items-center right-0 justify-center text-4xl sm:text-5xl md:text-6xl font-bold text-[#ec4a56] transform translate-y-2 sm:translate-y-4 -ml-7 drop-shadow-[0_2px_2px_rgba(254,74,86,0.6)] transition-all duration-300 group-hover:scale-105">
                    NIT, CALICUT
                  </h2>
                  <img 
                    src="/nit_bgremove (1).webp" 
                    alt="IEEE LINK Logo" 
                    className="w-full h-auto object-contain relative z-10 drop-shadow-[0_8px_16px_rgba(254,74,86,0.3)] hover:drop-shadow-[0_8px_16px_rgba(254,74,86,0.5)] hover:scale-105 transition-all duration-300 rounded-2xl"
                  />
                </div>
                <p className="text-white/80 text-lg leading-relaxed text-justify">
                  National Institute of Technology Calicut (NITC) is one of India's premier technical institutions. Established in 1961, NITC is an Institute recognized for its excellence in engineering, technology, and research. Affiliated directly under the Ministry of Education, Government of India, NITC offers a wide range of undergraduate, postgraduate, and doctoral programs. The institute is consistently ranked among the top engineering colleges in the country, reflecting its commitment to academic rigor, cutting-edge research, and a nurturing ecosystem for student development.
                </p>
              </div>
              <div className="hidden md:flex flex-col justify-center w-full">
                <div className="w-full relative group">
                  <h2 className="absolute top-0 left-0 flex items-center right-0 justify-center text-4xl sm:text-5xl md:text-6xl font-bold text-[#ec4a56] transform translate-y-2 sm:translate-y-4 -ml-7 drop-shadow-[0_2px_2px_rgba(254,74,86,0.6)] transition-all duration-300 group-hover:scale-105">
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
          </div>
        </main>
        <SubFooter />
      </div>
    </>
  );
}

export default AboutSection; 