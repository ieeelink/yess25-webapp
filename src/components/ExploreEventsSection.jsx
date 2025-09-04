import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { API_ENDPOINTS } from '../config/api';

const ExploreEventsSection = () => {
  const [latestEvent, setLatestEvent] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fallback content
  const fallbackContent = {
    title: "Discover What Awaits You",
    description: "IEEE YESS'25 brings you an exciting lineup of events designed to inspire, educate, and connect engineering students from across India. From technical workshops to networking sessions, there's something for everyone.",
    buttonText: "Coming Soon..."
  };

  useEffect(() => {
    AOS.refresh();
    fetchLatestEvent();
  }, []);

  const fetchLatestEvent = async () => {
    try {
      setLoading(true);
      const response = await axios.get(API_ENDPOINTS.PUBLIC_LATEST_EVENT);
      if (response.data) {
        setLatestEvent(response.data);
      }
    } catch (error) {
      console.error('Error fetching latest event:', error);
      // Use fallback content if API fails
    } finally {
      setLoading(false);
    }
  };

  const formatDateTime = (dateTimeString) => {
    if (!dateTimeString) return '';
    const date = new Date(dateTimeString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getEventContent = () => {
    if (loading) {
      return {
        title: "Loading Latest Event...",
        description: "Fetching the latest event information for you.",
        buttonText: "Loading..."
      };
    }

    if (latestEvent) {
      let description = latestEvent.description;
                 
      // Add location if available
      if (latestEvent.location) {
        description += `\nLocation: ${latestEvent.location}`;
      }

      return {
        title: latestEvent.title,
        description: description,
        buttonText: "Explore more Events"
      };
    }

    return fallbackContent;
  };

  const eventContent = getEventContent();

  return (
    <div id="events" className="w-full backdrop-blur-xs">
      <div className="w-full py-16 flex flex-col items-center justify-center relative z-10 bg-black/20">
        <div className="w-full px-4 lg:px-8 md:px-6 flex flex-col min-h-0 flex-1" style={{maxWidth: 'min(1600px, 100vw)'}}>
          <div className="w-full flex flex-col lg:flex-row gap-8 items-center justify-center py-12">
            
            {/* Mobile: Headings Only */}
            <div className="w-full flex flex-col justify-center items-start px-0 lg:hidden order-1" data-aos="fade-right">
              <h3 className="text-lg lg:text-xl font-semibold text-[#fe4a56] mb-3 lg:mb-4">Explore Events</h3>
              <h2 className="text-2xl lg:text-4xl font-bold text-white mb-4 lg:mb-6">{eventContent.title}</h2>
            </div>

            {/* Event Poster - Mobile: Between headings and text, Desktop: Right side */}
            <div className="w-full lg:w-1/2 rounded-xl overflow-hidden shadow-lg mb-6 lg:mb-0 flex items-center justify-center order-2 lg:order-2 max-w-xs mx-auto cursor-pointer" data-aos="zoom-in"
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
                src={latestEvent?.image || "/poster1.webp"} 
                alt={latestEvent?.title || "Latest Event Poster"} 
                className="w-full h-full object-cover"
              />
            </div>

            {/* Text Content - Mobile: Bottom, Desktop: Left side with all content */}
            <div className="w-full lg:w-1/2 flex flex-col justify-center items-start px-0 order-3 lg:order-1" data-aos="fade-right">
              {/* Desktop: Show all content including headings */}
              <div className="hidden lg:block">
                <h3 className="text-lg lg:text-xl font-semibold text-[#fe4a56] mb-3 lg:mb-4">Explore Events</h3>
                <h2 className="text-2xl lg:text-4xl font-bold text-white mb-4 lg:mb-6">{eventContent.title}</h2>
              </div>
              
              {/* Mobile: Only paragraph and button */}
              <p className="mb-6 text-base nunito-sans-body leading-relaxed whitespace-pre-line">
                {eventContent.description}
              </p>
              <Link 
                to="/events"
                className={`inline-block px-8 py-3 text-lg text-white rounded-full font-semibold transition-all duration-300 hover:scale-105 ${
                  loading ? 'bg-gray-500 cursor-not-allowed' : 'bg-[#fe4a56] hover:bg-[#ea1212]'
                }`}
                style={{ pointerEvents: loading ? 'none' : 'auto' }}
              >
                {eventContent.buttonText}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExploreEventsSection; 