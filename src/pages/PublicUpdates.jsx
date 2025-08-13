import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiCalendar, FiBell, FiImage, FiClock, FiDownload, FiX } from 'react-icons/fi';
import axios from 'axios';
import { API_ENDPOINTS } from '../config/api';
import AOS from 'aos';
import 'aos/dist/aos.css';
import BgAnimation from '../components/BgAnimation';
import Header2 from '../components/Header2';

function PublicUpdates() {
  const navigate = useNavigate();
  const [updates, setUpdates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isScrolled, setIsScrolled] = useState(true); // Default to true for static pages
  const [selectedUpdate, setSelectedUpdate] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      
      if (scrollPosition > 100) {
        setIsScrolled(true);
      } else {
        setIsScrolled(true); // Keep semi-transparent background even at top
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId) => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(() => {
    AOS.init({
      once: true,
      duration: 500,
      offset: 80,
    });
    
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
    
    const fetchUpdates = async () => {
      setLoading(true);
      setError('');
      try {
        const response = await axios.get(API_ENDPOINTS.PUBLIC_UPDATES);
        setUpdates(response.data);
      } catch (err) {
        setError('Failed to fetch updates. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    fetchUpdates();
  }, []);

  // Helper to format date as dd/mm/yyyy
  function formatDate(dateStr) {
    if (!dateStr) return '';
    try {
      const [year, month, day] = dateStr.split('-');
      return `${day}/${month}/${year}`;
    } catch {
      return 'Invalid Date';
    }
  }

  // Helper to get relative time
  function getRelativeTime(dateStr) {
    if (!dateStr) return '';
    try {
      const date = new Date(dateStr);
      const now = new Date();
      const diffTime = Math.abs(now - date);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays === 1) return 'Yesterday';
      if (diffDays < 7) return `${diffDays} days ago`;
      if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks ago`;
      if (diffDays < 365) return `${Math.ceil(diffDays / 30)} months ago`;
      return `${Math.ceil(diffDays / 365)} years ago`;
    } catch {
      return '';
    }
  }

  // Handle update click
  const handleUpdateClick = (update) => {
    setSelectedUpdate(update);
    setShowModal(true);
    document.body.style.overflow = 'hidden'; // Prevent background scrolling
  };

  // Handle modal close
  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedUpdate(null);
    document.body.style.overflow = 'unset'; // Restore scrolling
  };

  // Close modal on escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        handleCloseModal();
      }
    };

    if (showModal) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [showModal]);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white relative overflow-x-hidden">
      <div className="fixed inset-0 z-0">
        <BgAnimation />
      </div>
      <div className="w-full relative z-10">
        <Header2 isScrolled={isScrolled} onNavigate={scrollToSection} />
        <div className="md:mt-20 mt-15 min-h-screen bg-black/20 backdrop-blur-sm [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-red-500/50 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-red-500/70">
          {/* Main Content */}
          <div className="w-full flex justify-center relative z-10 pt-4">
            <div className="w-full px-4 lg:px-8 md:px-6 relative" style={{maxWidth: 'min(1600px, 100vw)'}}>
              
              {/* Page Header Section */}
              <div className="text-center py-8" data-aos="fade-up">
                <div className="flex items-center justify-center gap-3 mb-4">
                  <FiBell className="text-3xl text-[#fe4a56]" />
                  <h2 className="text-3xl lg:text-4xl font-bold text-white">Latest Updates</h2>
                </div>
                <p className="text-lg text-white/80 max-w-2xl mx-auto">
                  Stay informed with the newest announcements, event news, and important updates for YESS'25.
                </p>
              </div>

              {/* Updates Content */}
              {loading ? (
                <div className="flex items-center justify-center py-16">
                  <div className="animate-spin rounded-full h-8 w-8 border-2 border-[#fe4a56] border-t-transparent"></div>
                  <span className="ml-3 text-white">Loading updates...</span>
                </div>
              ) : error ? (
                <div className="text-center py-16">
                  <FiBell className="mx-auto text-6xl text-gray-500 mb-4 opacity-50" />
                  <h3 className="text-xl font-semibold text-gray-400 mb-2">{error}</h3>
                  <button
                    onClick={() => window.location.reload()}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-[#fe4a56] text-white rounded-lg hover:bg-[#ea1212] transition-colors"
                  >
                    Try Again
                  </button>
                </div>
              ) : updates.length === 0 ? (
                <div className="text-center py-16">
                  <FiBell className="mx-auto text-6xl text-gray-500 mb-4 opacity-50" />
                  <h3 className="text-xl font-semibold text-gray-400 mb-2">No Updates Available</h3>
                  <p className="text-gray-500 mb-6">Check back later for the latest announcements and news.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 py-8">
                  {updates.map((update, index) => (
                    <div 
                      key={update.id || update._id || index} 
                      className="bg-black/40 backdrop-blur-sm rounded-xl border border-gray-700/50 overflow-hidden hover:border-[#fe4a56]/50 transition-all duration-300 ease-out hover:shadow-2xl hover:shadow-[#fe4a56]/20 cursor-pointer group"
                      data-aos="fade-up"
                      data-aos-delay={index * 100}
                      style={{
                        transform: 'scale(1)',
                        transition: 'transform 0.3s ease-out, border-color 0.3s ease-out, box-shadow 0.3s ease-out'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'scale(1.05)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'scale(1)';
                      }}
                      onClick={() => handleUpdateClick(update)}
                    >
                      <div className="aspect-square bg-gray-800 relative overflow-hidden">
                        {update.image ? (
                          <img 
                            src={update.image} 
                            alt={update.title} 
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-800 to-gray-900">
                            <FiImage className="text-4xl text-gray-500" />
                          </div>
                        )}
                        <div className="absolute top-2 left-2">
                          <div className="flex items-center gap-1 bg-black/70 backdrop-blur-sm rounded-full px-2 py-0.5">
                            <FiCalendar className="text-xs text-[#fe4a56]" />
                            <span className="text-xs text-white font-medium">
                              {formatDate(update.date)}
                            </span>
                          </div>
                        </div>
                        {update.date && (
                          <div className="absolute top-2 right-2">
                            <div className="flex items-center gap-1 bg-black/70 backdrop-blur-sm rounded-full px-2 py-0.5">
                              <FiClock className="text-xs text-gray-300" />
                              <span className="text-xs text-gray-300">
                                {getRelativeTime(update.date)}
                              </span>
                            </div>
                          </div>
                        )}
                      </div>
                      
                      <div className="p-4">
                        <h3 className="text-lg font-bold text-white mb-1 line-clamp-2">
                          {update.title}
                        </h3>
                        
                        {update.subtitle && (
                          <h4 className="text-sm font-semibold text-white/80 mb-2 line-clamp-1">
                            {update.subtitle}
                          </h4>
                        )}
                        
                        <p className="text-gray-300 text-xs mb-3 line-clamp-2 leading-relaxed">
                          {update.description}
                        </p>
                        
                        {update.hasLink && update.linkUrl && update.linkTitle && (
                          <div className="flex items-center gap-2 mt-3">
                            <a
                              href={update.linkUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 px-3 py-1.5 bg-[#fe4a56] text-white rounded-lg hover:bg-[#ea1212] transition-colors text-xs font-semibold"
                            >
                              <FiDownload className="text-xs" />
                              {update.linkTitle}
                            </a>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}

            </div>
          </div>

        </div>
      </div>

      {/* Modal for Update Details */}
      {showModal && selectedUpdate && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-black/90 backdrop-blur-sm rounded-2xl border border-gray-700/50 max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-700/50">
              <div className="flex items-center gap-3">
                <FiBell className="text-2xl text-[#fe4a56]" />
                <h2 className="text-2xl font-bold text-white">Update Details</h2>
              </div>
              <button
                onClick={handleCloseModal}
                className="p-2 hover:bg-gray-700/50 rounded-full transition-colors"
              >
                <FiX className="text-xl text-gray-400 hover:text-white" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Image Section */}
                <div className="space-y-4">
                  <div className="aspect-square bg-gray-800 rounded-xl overflow-hidden">
                    {selectedUpdate.image ? (
                      <img 
                        src={selectedUpdate.image} 
                        alt={selectedUpdate.title} 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-800 to-gray-900">
                        <FiImage className="text-6xl text-gray-500" />
                      </div>
                    )}
                  </div>
                  
                  {/* Date and Time Info */}
                  <div className="flex flex-wrap gap-4">
                    <div className="flex items-center gap-2 bg-black/50 backdrop-blur-sm rounded-full px-4 py-2">
                      <FiCalendar className="text-[#fe4a56]" />
                      <span className="text-white font-medium">
                        {formatDate(selectedUpdate.date)}
                      </span>
                    </div>
                    {selectedUpdate.date && (
                      <div className="flex items-center gap-2 bg-black/50 backdrop-blur-sm rounded-full px-4 py-2">
                        <FiClock className="text-gray-300" />
                        <span className="text-gray-300">
                          {getRelativeTime(selectedUpdate.date)}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Content Section */}
                <div className="space-y-6">
                  <div>
                    <h1 className="text-3xl lg:text-4xl font-bold text-white mb-4">
                      {selectedUpdate.title}
                    </h1>
                    
                    {selectedUpdate.subtitle && (
                      <h2 className="text-xl lg:text-2xl font-semibold text-white/80 mb-4">
                        {selectedUpdate.subtitle}
                      </h2>
                    )}
                  </div>
                  
                  <div className="prose prose-invert max-w-none">
                    <p className="text-gray-300 text-lg leading-relaxed whitespace-pre-wrap">
                      {selectedUpdate.description}
                    </p>
                  </div>
                  
                  {selectedUpdate.hasLink && selectedUpdate.linkUrl && selectedUpdate.linkTitle && (
                    <div className="pt-6">
                      <a
                        href={selectedUpdate.linkUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-3 px-8 py-4 bg-[#fe4a56] text-white rounded-xl hover:bg-[#ea1212] transition-all duration-300 hover:scale-105 font-semibold text-lg"
                      >
                        <FiDownload className="text-xl" />
                        {selectedUpdate.linkTitle}
                      </a>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default PublicUpdates;
