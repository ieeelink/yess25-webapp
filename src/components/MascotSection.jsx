import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AOS from 'aos';
import 'aos/dist/aos.css';

const MascotSection = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    AOS.refresh();
  }, []);

  return (
    <div>
      <div id="mascot" className="w-full flex justify-center z-20 relative backdrop-blur-sm bg-black/20 pt-4">
        <div className="w-full px-4 lg:px-8 md:px-6 relative z-10" style={{maxWidth: 'min(1600px, 100vw)'}}>
          <div className="w-full flex flex-col md:flex-row gap-8 items-center justify-center py-12">
            
            {/* Headings Section - Mobile Only */}
            <div className="w-full md:hidden flex flex-col justify-center items-start text-left order-1" data-aos="fade-right">
              <h3 className="text-lg lg:text-xl font-semibold text-[#fe4a56] mb-3 lg:mb-4">Our Mascot</h3>
              <h2 className="text-2xl lg:text-4xl font-bold text-white mb-4 lg:mb-6">Meet ZERO – The Official Mascot of IEEE YESS 2025!</h2>
            </div>

            {/* YouTube Video */}
            <div className="w-full md:w-1/2 flex items-center justify-center px-0 lg:px-8 order-2 md:order-1" data-aos="zoom-in">
              <div className="w-full aspect-video rounded-xl overflow-hidden shadow-lg flex items-center justify-center bg-black">
                <iframe
                  width="100%"
                  height="100%"
                  src="https://www.youtube.com/embed/umxOc70Wlas"
                  title="YouTube video player"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  className="w-full h-full"
                  style={{ minHeight: '220px', maxHeight: '420px' }}
                ></iframe>
              </div>
            </div>

            {/* Content */}
            <div className="w-full md:w-1/2 flex flex-col justify-center items-start text-left order-3 md:order-2" data-aos="fade-right">
              <div className="hidden md:block">
                <h3 className="text-lg lg:text-xl font-semibold text-[#fe4a56] mb-3 lg:mb-4">Our Mascot</h3>
                <h2 className="text-2xl lg:text-4xl font-bold text-white mb-4 lg:mb-6">Meet ZERO – The Official Mascot of IEEE YESS 2025!</h2>
              </div>
                            <p className="mb-4 text-base nunito-sans-body leading-relaxed text-white/90">
                We're thrilled to unveil ZERO – the Zonal Envoy for Revolutionary Outreach – the brand-new mascot of IEEE YESS 2025, 
                launched on 23rd July 2025 at Hotel Renai, Cochin, in the honorable presence of Dr. Kathleen A Kramer, IEEE President and CEO.
              </p>
              <p className="mb-4 text-base nunito-sans-body leading-relaxed text-white/90">
                ZERO is more than a mascot — he's a symbol of unity, innovation, and the bold spirit of YESS. With antennas tuned to tech and a mission to inspire, ZERO proves that starting from nothing can lead to everything.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MascotSection;
