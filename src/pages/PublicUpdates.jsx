import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiCalendar, FiBell, FiImage, FiClock, FiDownload } from 'react-icons/fi';
import axios from 'axios';
import { API_ENDPOINTS } from '../config/api';
import AOS from 'aos';
import 'aos/dist/aos.css';
import Header2 from '../components/Header2';

function PublicUpdates() {
  const navigate = useNavigate();
  const [updates, setUpdates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

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
        const response = await axios.get(API_ENDPOINTS.UPDATES);
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

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white relative pt-20">
      {/* Header */}
      <div className="fixed top-0 left-0 right-0 z-50">
        <Header2 />
      </div>

      {/* Main Content */}
      <div className="w-full flex justify-center relative z-10 backdrop-blur-sm bg-black/20 pt-4">
        <div className="w-full px-4 lg:px-8 md:px-6 relative" style={{maxWidth: 'min(1600px, 100vw)'}}>
          
          {/* Page Header Section */}
            

          {/* Bulk Registration Announcement Section */}
          <div className="w-full flex flex-col md:flex-row gap-8 items-center justify-center py-12 mt-16">
            <div className="w-full md:w-1/2 flex flex-col justify-center items-start text-left order-2 md:order-1" data-aos="fade-right">
              <h3 className="text-lg lg:text-xl font-semibold text-[#fe4a56] mb-3 lg:mb-4">Bulk Registration</h3>
              <h2 className="text-2xl lg:text-4xl font-bold text-white mb-4 lg:mb-6"> Bulk Registration is Now Open!</h2>
              <p className="mb-4 text-base nunito-sans-body leading-relaxed text-white/90">
                We're excited to announce that bulk registration for YESS'25 has officially started! 
                This is your opportunity to register multiple participants from your institution or organization 
                with streamlined processes and special benefits.
              </p>
              <button
                className="inline-block px-8 py-3 text-lg bg-[#fe4a56] text-white rounded-full font-semibold hover:bg-[#ea1212] transition-all duration-300 hover:scale-105 mt-2 cursor-pointer"
                onClick={() => window.open('https://docs.google.com/document/d/135kyrUojhxwm9QXA9xS7G9WSnenRHTQTvP3cerSMr-M/edit?tab=t.0', '_blank')}
              >
                
                Bulk Registration Guidelines
              </button>
            </div>

            <div className="w-full md:w-1/2 rounded-xl overflow-hidden shadow-lg mb-6 md:mb-0 flex items-center justify-center order-1 md:order-2 max-w-sm mx-auto" data-aos="zoom-in">
              <img 
                src="/bulkregistration.webp" 
                alt="Bulk Registration Poster" 
                className="w-full h-full object-cover"
              />
            </div>
          </div>


        </div>
      </div>
    </div>
  );
}

export default PublicUpdates;
