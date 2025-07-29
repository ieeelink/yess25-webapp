import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import AOS from 'aos';
import 'aos/dist/aos.css';

const ExploreEventsSection = () => {
  useEffect(() => {
    AOS.refresh();
  }, []);

  return (
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

            {/* Right: Video Content */}
            <div className="w-full lg:w-1/2 flex items-center justify-center px-0 lg:px-8" data-aos="zoom-in">
              <div className="w-full aspect-video rounded-xl overflow-hidden shadow-lg flex items-center justify-center bg-black">
                <iframe
                  width="100%"
                  height="100%"
                  src="https://www.youtube.com/embed/BE7HODa3ESg?si=D3AxFNQUd373mCg9"
                  title="YouTube video player"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  className="w-full h-full"
                  style={{ minHeight: '220px', maxHeight: '420px' }}
                ></iframe>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExploreEventsSection; 