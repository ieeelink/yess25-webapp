import React from 'react';
import { Link } from 'react-router-dom';

const ExploreEventsSection = () => (
  <div id="events" className="w-full backdrop-blur-xs">
    <div className="w-full py-16 flex flex-col items-center justify-center relative z-10 bg-black/20">
      <div className="w-full px-4 lg:px-8 md:px-6 flex flex-col min-h-0 flex-1" style={{maxWidth: 'min(1600px, 100vw)'}}>
        <div className="w-full flex flex-col lg:flex-row gap-8 items-center justify-center py-12">
          {/* Left: Text Content */}
          <div className="w-full lg:w-1/2 flex flex-col justify-center items-start px-0" data-aos="fade-right">
            <h3 className="text-lg lg:text-xl font-semibold text-[#fe4a56] mb-3 lg:mb-4">Explore Events</h3>
            <h2 className="text-2xl lg:text-4xl font-bold text-white mb-4 lg:mb-6">Discover What Awaits You</h2>
            <p className="mb-6 text-base nunito-sans-body leading-relaxed">
              IEEE YESS'25 brings you an exciting lineup of events designed to inspire, educate, and connect engineering students from across India. From technical workshops to networking sessions, there's something for everyone.
            </p>
            <Link 
              className="inline-block px-8 py-3 text-lg bg-[#fe4a56] text-white rounded-full font-semibold hover:bg-[#ea1212] transition-all duration-300 hover:scale-105"
            >
              Coming Soon...
            </Link>
          </div>
          
          {/* Right: Images Grid (commented out) */}
          <div className="w-full lg:w-1/2 flex items-center justify-center p-4 lg:py-8" data-aos="zoom-in">
            {/* Images grid is commented out in original */}
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default ExploreEventsSection; 