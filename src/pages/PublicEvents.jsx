import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiCalendar, FiMapPin, FiImage, FiClock, FiX, FiExternalLink } from 'react-icons/fi';
import axios from 'axios';
import { API_ENDPOINTS } from '../config/api';
import AOS from 'aos';
import 'aos/dist/aos.css';
import BgAnimation from '../components/BgAnimation';
import Header2 from '../components/Header2';

function PublicEvents() {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isScrolled, setIsScrolled] = useState(true); // Default to true for static pages
  const [selectedEvent, setSelectedEvent] = useState(null);
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
    
    const fetchEvents = async () => {
      setLoading(true);
      setError('');
      try {
        const response = await axios.get(API_ENDPOINTS.PUBLIC_EVENTS);
        setEvents(response.data);
      } catch (err) {
        setError('Failed to fetch events. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  // Helper to format time only
  const formatTime = (dateTimeString) => {
    if (!dateTimeString) return '';
    try {
      const date = new Date(dateTimeString);
      return date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      });
    } catch {
      return 'Invalid Time';
    }
  };

  // Helper to format date only
  const formatDate = (dateTimeString) => {
    if (!dateTimeString) return '';
    try {
      const date = new Date(dateTimeString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch {
      return 'Invalid Date';
    }
  };

  // Helper to get relative time
  function getRelativeTime(dateStr) {
    if (!dateStr) return '';
    try {
      const date = new Date(dateStr);
      const now = new Date();
      const diffTime = date - now;
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays < 0) return 'Past Event';
      if (diffDays === 0) return 'Today';
      if (diffDays === 1) return 'Tomorrow';
      if (diffDays < 7) return `In ${diffDays} days`;
      if (diffDays < 30) return `In ${Math.ceil(diffDays / 7)} weeks`;
      if (diffDays < 365) return `In ${Math.ceil(diffDays / 30)} months`;
      return `In ${Math.ceil(diffDays / 365)} years`;
    } catch {
      return '';
    }
  }

  // Handle event click
  const handleEventClick = (event) => {
    setSelectedEvent(event);
    setShowModal(true);
    document.body.style.overflow = 'hidden'; // Prevent background scrolling
  };

  // Handle modal close
  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedEvent(null);
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
      <div className="relative z-10 w-full">
        <Header2 isScrolled={isScrolled} onNavigate={scrollToSection} />
        <div className="md:mt-20 mt-15 min-h-screen bg-black/20 backdrop-blur-sm [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-red-500/50 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-red-500/70">
          {/* Main Content */}
          <div className="relative z-10 flex justify-center w-full pt-4">
            <div className="relative w-full px-4 lg:px-8 md:px-6" style={{maxWidth: 'min(1600px, 100vw)'}}>
              
              {/* Page Header Section */}
              <div className="py-8 text-center" data-aos="fade-up">
                <div className="flex items-center justify-center gap-3 mb-4">
                  <FiCalendar className="text-3xl text-[#fe4a56]" />
                  <h2 className="text-3xl font-bold text-white lg:text-4xl">Upcoming Events</h2>
                </div>
                <p className="max-w-2xl mx-auto text-lg text-white/80">
                  Discover exciting events, workshops, and activities planned for YESS'25. Join us for an unforgettable experience.
                </p>
              </div>

              {/* Events Content */}
              {loading ? (
                <div className="flex items-center justify-center py-16">
                  <div className="animate-spin rounded-full h-8 w-8 border-2 border-[#fe4a56] border-t-transparent"></div>
                  <span className="ml-3 text-white">Loading events...</span>
                </div>
              ) : error ? (
                <div className="py-16 text-center">
                  <FiCalendar className="mx-auto mb-4 text-6xl text-gray-500 opacity-50" />
                  <h3 className="mb-2 text-xl font-semibold text-gray-400">{error}</h3>
                  <button
                    onClick={() => window.location.reload()}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-[#fe4a56] text-white rounded-lg hover:bg-[#ea1212] transition-colors"
                  >
                    Try Again
                  </button>
                </div>
              ) : events.length === 0 ? (
                <div className="py-16 text-center">
                  <FiCalendar className="mx-auto mb-4 text-6xl text-gray-500 opacity-50" />
                  <h3 className="mb-2 text-xl font-semibold text-gray-400">No Events Available</h3>
                  <p className="mb-6 text-gray-500">Check back later for upcoming events and activities.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-6 py-8 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {events.map((event, index) => (
                    <div 
                      key={event.id || event._id || index} 
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
                      onClick={() => handleEventClick(event)}
                    >
                      <div className="relative overflow-hidden bg-gray-800 ">
                        {event.image ? (
                          <img 
                            src={event.image} 
                            alt={event.title} 
                            className="w-full"
                          />
                        ) : (
                          <div className="flex items-center justify-center w-full h-full bg-gradient-to-br from-gray-800 to-gray-900">
                            <FiCalendar className="text-4xl text-gray-500" />
                          </div>
                        )}
                        {event.startTime && (
                          <div className="absolute top-2 left-2">
                            <div className="flex items-center gap-1 bg-black/70 backdrop-blur-sm rounded-full px-2 py-0.5">
                              <FiClock className="text-xs text-[#fe4a56]" />
                              <span className="text-xs font-medium text-white">
                                {formatTime(event.startTime)}
                                {event.endTime && ` - ${formatTime(event.endTime)}`}
                              </span>
                            </div>
                          </div>
                        )}
                        {event.startTime && (
                          <div className="absolute top-2 right-2">
                            <div className="flex items-center gap-1 bg-black/70 backdrop-blur-sm rounded-full px-2 py-0.5">
                              <FiCalendar className="text-xs text-gray-300" />
                              <span className="text-xs text-gray-300">
                                {getRelativeTime(event.startTime)}
                              </span>
                            </div>
                          </div>
                        )}
                      </div>
                      
                      <div className="p-4">
                        <h3 className="mb-2 text-lg font-bold text-white line-clamp-2">
                          {event.title}
                        </h3>
                        
                        <p className="mb-3 text-sm leading-relaxed text-gray-300 line-clamp-3">
                          {event.description}
                        </p>
                        
                        <div className="space-y-2 text-xs">
                          {event.startTime && (
                            <div className="flex items-center gap-2 text-gray-400">
                              <FiClock className="text-[#fe4a56]" />
                              <span>
                                {formatTime(event.startTime)}
                                {event.endTime && ` - ${formatTime(event.endTime)}`}
                              </span>
                            </div>
                          )}
                          
                          {event.location && (
                            <div className="flex items-center gap-2 text-gray-400">
                              <FiMapPin className="text-[#fe4a56]" />
                              <span className="line-clamp-1">{event.location}</span>
                            </div>
                          )}
                        </div>
                        
                        {event.registrationLink && (
                          <div className="mt-3">
                            <a
                              href={event.registrationLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#fe4a56] text-white rounded-lg hover:bg-[#ea1212] transition-colors text-xs font-semibold"
                              onClick={(e) => e.stopPropagation()} // Prevent modal opening when clicking the button
                            >
                              <FiExternalLink className="text-xs" />
                              Register Now
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

      {/* Modal for Event Details */}
      {showModal && selectedEvent && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-black/90 backdrop-blur-sm rounded-2xl border border-gray-700/50 max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-700/50">
              <div className="flex items-center gap-3">
                <FiCalendar className="text-2xl text-[#fe4a56]" />
                <h2 className="text-2xl font-bold text-white">Event Details</h2>
              </div>
              <button
                onClick={handleCloseModal}
                className="p-2 transition-colors rounded-full hover:bg-gray-700/50"
              >
                <FiX className="text-xl text-gray-400 hover:text-white" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
              <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
                {/* Image Section */}
                <div className="space-y-4">
                  <div className="aspect-[4/3] flex justify-center rounded-xl overflow-hidden">
                    {selectedEvent.image ? (
                      <img 
                        src={selectedEvent.image} 
                        alt={selectedEvent.title} 
                        className="object-contain h-full "
                      />
                    ) : (
                      <div className="flex items-center justify-center w-full h-full bg-gradient-to-br from-gray-800 to-gray-900">
                        <FiCalendar className="text-6xl text-gray-500" />
                      </div>
                    )}
                  </div>
                  
                  {/* Event Info Cards */}
                  <div className="space-y-3">
                    {selectedEvent.startTime && (
                      <div className="flex items-center gap-3 px-4 py-3 bg-black/50 backdrop-blur-sm rounded-xl">
                        <FiClock className="text-[#fe4a56] text-xl" />
                        <div>
                          <p className="font-medium text-white">Time</p>
                          <p className="text-sm text-gray-300">
                            {formatTime(selectedEvent.startTime)}
                            {selectedEvent.endTime && ` - ${formatTime(selectedEvent.endTime)}`}
                          </p>
                        </div>
                      </div>
                    )}
                    
                    {selectedEvent.location && (
                      <div className="flex items-center gap-3 px-4 py-3 bg-black/50 backdrop-blur-sm rounded-xl">
                        <FiMapPin className="text-[#fe4a56] text-xl" />
                        <div>
                          <p className="font-medium text-white">Location</p>
                          <p className="text-sm text-gray-300">{selectedEvent.location}</p>
                        </div>
                      </div>
                    )}
                    
                    {selectedEvent.registrationLink && (
                      <div className="mt-4">
                        <a
                          href={selectedEvent.registrationLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-3 px-6 py-3 bg-[#fe4a56] text-white rounded-xl hover:bg-[#ea1212] transition-all duration-300 hover:scale-105 font-semibold text-lg w-full justify-center"
                        >
                          <FiExternalLink className="text-xl" />
                          Register for this Event
                        </a>
                      </div>
                    )}
                  </div>
                </div>

                {/* Content Section */}
                <div className="space-y-6">
                  <div>
                    <h1 className="mb-4 text-3xl font-bold text-white lg:text-4xl">
                      {selectedEvent.title}
                    </h1>
                  </div>
                  
                  <div className="prose prose-invert max-w-none">
                    <p className="text-lg leading-relaxed text-gray-300 whitespace-pre-wrap">
                      {selectedEvent.description}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default PublicEvents;
