import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { API_ENDPOINTS } from '../config/api';

const UpdatesSection = () => {
  const navigate = useNavigate();
  const [latestUpdate, setLatestUpdate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  useEffect(() => {
    AOS.refresh();
  }, []);

  useEffect(() => {
    const fetchLatestUpdate = async () => {
      try {
        const response = await axios.get(API_ENDPOINTS.LATEST_UPDATE);
        setLatestUpdate(response.data);
      } catch (err) {
        setError('Failed to fetch latest update');
        console.error('Error fetching latest update:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchLatestUpdate();
  }, []);

  // Helper to format date as dd/mm/yyyy
  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    try {
      const [year, month, day] = dateStr.split('-');
      return `${day}/${month}/${year}`;
    } catch {
      return 'Invalid Date';
    }
  };

  return (
    <div>
      {/* Updates Section */}
      <div id="updates" className="w-full flex justify-center z-20 relative backdrop-blur-sm bg-black/20 pt-4">
        <div className="w-full px-4 lg:px-8 md:px-6 relative z-10" style={{maxWidth: 'min(1600px, 100vw)'}}>
          <div className="w-full flex flex-col md:flex-row gap-8 items-center justify-center py-12">
            {loading ? (
              <div className="w-full flex items-center justify-center py-16">
                <div className="animate-spin rounded-full h-8 w-8 border-2 border-[#fe4a56] border-t-transparent"></div>
                <span className="ml-3 text-white">Loading latest update...</span>
              </div>
            ) : error || !latestUpdate ? (
              // Fallback to default bulk registration content if no update or error
              <>
                {/* Mobile: Heading First */}
                <div className="w-full md:hidden mb-6" data-aos="fade-up">
                  <h3 className="text-lg font-semibold text-[#fe4a56] mb-3">Updates</h3>
                  <h2 className="text-2xl font-bold text-white mb-4">Bulk Registration is Now Open!</h2>
                </div>

                {/* Image - Mobile: Between heading and content, Desktop: Right side */}
                <div className="w-full md:w-1/2 rounded-xl overflow-hidden shadow-lg mb-6 md:mb-0 flex items-center justify-center order-1 md:order-2 max-w-xs mx-auto cursor-pointer" data-aos="zoom-in"
                     style={{
                       transform: 'scale(1)',
                       transition: 'transform 0.3s ease-out, box-shadow 0.3s ease-out'
                     }}
                     onMouseEnter={(e) => {
                       e.currentTarget.style.transform = 'scale(1.05)';
                     }}
                     onMouseLeave={(e) => {
                       e.currentTarget.style.transform = 'scale(1)';
                     }}>
                  <img 
                    src="/bulkregistration.webp" 
                    alt="Bulk Registration Poster" 
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Content - Desktop: Include heading, Mobile: Content only */}
                <div className="w-full md:w-1/2 flex flex-col justify-center items-start text-left order-2 md:order-1" data-aos="fade-right">
                  {/* Desktop: Show heading */}
                  <div className="hidden md:block">
                    <h3 className="text-lg lg:text-xl font-semibold text-[#fe4a56] mb-3 lg:mb-4">Updates</h3>
                    <h2 className="text-2xl lg:text-4xl font-bold text-white mb-4 lg:mb-6">Bulk Registration is Now Open!</h2>
                  </div>
                  
                  {/* Content */}
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
              </>
            ) : (
              // Display latest update from server
              <>
                {/* Mobile: Heading First */}
                <div className="w-full md:hidden mb-6" data-aos="fade-up">
                  <div className="flex items-center gap-2 mb-3">
                    <h3 className="text-lg font-semibold text-[#fe4a56]">Updates</h3>
                    {latestUpdate.date && (
                      <span className="text-sm text-gray-400">• {formatDate(latestUpdate.date)}</span>
                    )}
                  </div>
                  <h3 className="text-lg font-semibold text-[#fe4a56] mb-3">
                    {latestUpdate.title}
                  </h3>
                  {latestUpdate.subtitle && (
                    <h2 className="text-2xl font-bold text-white mb-4">
                      {latestUpdate.subtitle}
                    </h2>
                  )}
                </div>

                {/* Image - Mobile: Between heading and content, Desktop: Right side */}
                <div className="w-full md:w-1/2 rounded-xl overflow-hidden shadow-lg mb-6 md:mb-0 flex items-center justify-center order-1 md:order-2 max-w-xs mx-auto cursor-pointer" data-aos="zoom-in"
                     style={{
                       transform: 'scale(1)',
                       transition: 'transform 0.3s ease-out, box-shadow 0.3s ease-out'
                     }}
                     onMouseEnter={(e) => {
                       e.currentTarget.style.transform = 'scale(1.05)';
                     }}
                     onMouseLeave={(e) => {
                       e.currentTarget.style.transform = 'scale(1)';
                     }}>
                  <img 
                    src={latestUpdate.image || "/bulkregistration.webp"} 
                    alt={latestUpdate.title || "Latest Update"} 
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Content - Desktop: Include heading, Mobile: Content only */}
                <div className="w-full md:w-1/2 flex flex-col justify-center items-start text-left order-2 md:order-1" data-aos="fade-right">
                  {/* Desktop: Show heading */}
                  <div className="hidden md:block">
                    <div className="flex items-center gap-2 mb-3 lg:mb-4">
                      <h3 className="text-lg lg:text-xl font-semibold text-[#fe4a56]">Updates</h3>
                      {latestUpdate.date && (
                        <span className="text-sm text-gray-400">• {formatDate(latestUpdate.date)}</span>
                      )}
                    </div>
                    <h3 className="text-lg lg:text-xl font-semibold text-[#fe4a56] mb-3 lg:mb-4">
                      {latestUpdate.title}
                    </h3>
                    {latestUpdate.subtitle && (
                      <h2 className="text-2xl lg:text-4xl font-bold text-white mb-4 lg:mb-6">
                        {latestUpdate.subtitle}
                      </h2>
                    )}
                  </div>
                  
                  {/* Content */}
                  <p className="mb-4 text-base nunito-sans-body leading-relaxed text-white/90">
                    {latestUpdate.description}
                  </p>
                  <div className="flex flex-wrap gap-4 mt-2">
                    {latestUpdate.hasLink && latestUpdate.linkUrl && latestUpdate.linkTitle && (
                      <a
                        href={latestUpdate.linkUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block px-8 py-3 text-lg bg-[#fe4a56] text-white rounded-full font-semibold hover:bg-[#ea1212] transition-all duration-300 hover:scale-105 cursor-pointer"
                      >
                        {latestUpdate.linkTitle}
                      </a>
                    )}
                    <button
                      onClick={() => navigate('/updates')}
                      className="inline-block px-8 py-3 text-lg bg-transparent border-2 border-[#fe4a56] text-[#fe4a56] rounded-full font-semibold hover:bg-[#fe4a56] hover:text-white transition-all duration-300 hover:scale-105 cursor-pointer"
                    >
                      View All Updates
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Promo Video Section */}
      <div className="w-full backdrop-blur-xs">
        <div className="w-full py-16 flex flex-col items-center justify-center relative z-10 bg-black/20">
          <div className="w-full px-4 lg:px-8 md:px-6 flex flex-col min-h-0 flex-1" style={{maxWidth: 'min(1600px, 100vw)'}}>
            <div className="w-full flex flex-col lg:flex-row gap-8 items-center justify-center py-12">
              
              {/* Mobile: Headings Only */}
              <div className="w-full flex flex-col justify-center items-start px-0 lg:hidden order-1" data-aos="fade-right">
                <h3 className="text-lg lg:text-xl font-semibold text-[#fe4a56] mb-3 lg:mb-4">IEEE YESS'25</h3>
                <h2 className="text-2xl lg:text-4xl font-bold text-white mb-4 lg:mb-6">Watch Our Promo Video</h2>
              </div>

              {/* Video Content - Mobile: Between headings and text, Desktop: Right side */}
              <div className="w-full lg:w-1/2 flex items-center justify-center px-0 lg:px-8 order-2 lg:order-2" data-aos="zoom-in">
                <div className="w-full aspect-video rounded-xl overflow-hidden shadow-lg flex items-center justify-center bg-black">
                  <iframe
                    width="100%"
                    height="100%"
                    src="https://www.youtube.com/embed/BE7HODa3ESg?si=D3AxFNQUd373mCg9"
                    title="IEEE YESS'25 Promo Video"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                    className="w-full h-full"
                    style={{ minHeight: '220px', maxHeight: '420px' }}
                  ></iframe>
                </div>
              </div>

              {/* Text Content - Mobile: Bottom, Desktop: Left side with all content */}
              <div className="w-full lg:w-1/2 flex flex-col justify-center items-start px-0 order-3 lg:order-1" data-aos="fade-right">
                {/* Desktop: Show all content including headings */}
                <div className="hidden lg:block">
                  <h3 className="text-lg lg:text-xl font-semibold text-[#fe4a56] mb-3 lg:mb-4">IEEE YESS'25</h3>
                  <h2 className="text-2xl lg:text-4xl font-bold text-white mb-4 lg:mb-6">Watch Our Promo Video</h2>
                </div>
                
                {/* Content */}
                <p className="mb-6 text-base nunito-sans-body leading-relaxed">
                  Get excited for IEEE YESS'25! Watch our official promo video to discover what awaits you at one of India's premier engineering student symposiums. From technical workshops and research presentations to networking opportunities and cultural events, YESS'25 promises an unforgettable experience for every participant.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mascot Section */}
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

export default UpdatesSection;
