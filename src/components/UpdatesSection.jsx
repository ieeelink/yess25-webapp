import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AOS from 'aos';
import 'aos/dist/aos.css';

const UpdatesSection = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    AOS.refresh();
  }, []);

  return (
    <div>
      {/* Original Updates Section - Commented Out
      <div id="updates" className="w-full flex justify-center z-20 relative backdrop-blur-sm bg-black/20 pt-4">
        <div className="w-full px-4 lg:px-8 md:px-6 relative z-10" style={{maxWidth: 'min(1600px, 100vw)'}}>
          <div className="w-full flex flex-col md:flex-row gap-8 items-center justify-center py-12">
            <div className="w-full md:w-1/2 flex flex-col justify-center items-start text-left order-2 md:order-1" data-aos="fade-right">
              <h3 className="text-lg lg:text-xl font-semibold text-[#fe4a56] mb-3 lg:mb-4">Updates</h3>
              <h2 className="text-2xl lg:text-4xl font-bold text-white mb-4 lg:mb-6">Latest Announcements & News</h2>
              <p className="mb-4 text-base nunito-sans-body leading-relaxed text-white/90">
                Stay informed with the newest announcements, event news, and important updates for YESS'25.
              </p>
              <ul className="list-disc list-inside text-base space-y-2 nunito-sans-body mb-6">
                <li>Registrations will be open soon</li>
                <li>Stay tuned for more announcements and schedules.</li>
              </ul>
              <button
                className="inline-block px-8 py-3 text-lg bg-[#fe4a56] text-white rounded-full font-semibold hover:bg-[#ea1212] transition-all duration-300 hover:scale-105 mt-2"
              >
                Updates Coming Soon
              </button>
            </div>

            <div className="w-full md:w-1/2 aspect-video rounded-xl overflow-hidden shadow-lg mb-6 md:mb-0 flex items-center justify-center order-1 md:order-2" data-aos="zoom-in">
              <iframe
                width="100%"
                height="100%"
                src="https://www.youtube.com/embed/BE7HODa3ESg"
                title="YouTube video player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                className="w-full h-full"
              ></iframe>
            </div>
          </div>
        </div>
      </div>
      */}

      {/* MASCOT UPDATES */}
      <div id="updates" className="w-full flex justify-center z-20 relative backdrop-blur-sm bg-black/20 pt-4">
        <div className="w-full px-4 lg:px-8 md:px-6 relative z-10" style={{maxWidth: 'min(1600px, 100vw)'}}>
          <div className="w-full flex flex-col md:flex-row gap-8 items-center justify-center py-12">
            <div className="w-full md:w-1/2 rounded-xl overflow-hidden shadow-lg mb-6 md:mb-0 flex items-center justify-center order-1 md:order-2 max-w-xs mx-auto" data-aos="zoom-in">
              <img 
                src="/bulkregistration.webp" 
                alt="Bulk Registration Poster" 
                className="w-full h-full object-cover"
              />
            </div>

            {/* Content */}
            <div className="w-full md:w-1/2 flex flex-col justify-center items-start text-left order-2 md:order-1" data-aos="fade-right">
            <h3 className="text-lg lg:text-xl font-semibold text-[#fe4a56] mb-3 lg:mb-4">Updates</h3>
              <h2 className="text-2xl lg:text-4xl font-bold text-white mb-4 lg:mb-6">Bulk Registration is Now Open!</h2>
              <p className="mb-4 text-base nunito-sans-body leading-relaxed text-white/90">
                We're excited to announce that bulk registration for YESS'25 has officially started! 
                    This is your opportunity to register multiple participants from your institution or organization 
                    with streamlined processes and special benefits.
              </p>
              <div className="flex flex-wrap gap-4 mt-2">
                <button
                  onClick={() => navigate('/bulk_registration')}
                  className="inline-block px-8 py-3 text-lg bg-[#fe4a56] text-white rounded-full font-semibold hover:bg-[#ea1212] transition-all duration-300 hover:scale-105 cursor-pointer"
                >
                  Bulk Registration Guidelines
                </button>
                <button
                  onClick={() => navigate('/updates')}
                  className="inline-block px-8 py-3 text-lg bg-[#fe4a56] text-white rounded-full font-semibold hover:bg-[#ea1212] transition-all duration-300 hover:scale-105 cursor-pointer"
                >
                  View More Updates
                </button>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdatesSection;
