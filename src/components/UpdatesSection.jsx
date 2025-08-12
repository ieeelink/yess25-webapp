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
              </>
            ) : (
              // Display latest update from server
              <>
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

                <div className="w-full md:w-1/2 flex flex-col justify-center items-start text-left order-2 md:order-1" data-aos="fade-right">
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
    </div>
  );
};

export default UpdatesSection;
