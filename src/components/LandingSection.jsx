import React from 'react';
import { FiMapPin, FiCalendar } from 'react-icons/fi';

const LandingSection = ({ scrollToSection, isScrolled, onOpenTicketForm, onOpenCheckStatus }) => {
  return (
    <div className="w-full h-screen relative z-10">
      <div id="landing" className="w-full h-full flex items-center justify-center">
        <div className="flex flex-col items-center justify-center text-center px-4 space-y-4">
          {/* YESS Logo - Only visible on desktop */}
          <div className=" mb-8">
            <img 
              src="/yess_icon.svg" 
              alt="IEEE YESS Logo" 
              className="w-32 lg:w-40 h-auto"
            />
          </div>
          <h1 className="text-4xl lg:text-6xl font-bold text-white">IEEE YESS'25</h1>
          <p className="text-lg lg:text-2xl text-white ">Yearly Engineering Students Summit</p>
          <p className="text-sm lg:text-base text-white/80 max-w-2xl nunito-sans-body">Join us for the most anticipated engineering summit of the year</p>
          {/* Event Location and Date - Single Line */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-6 mb-2 text-white/90 text-sm sm:text-base lg:text-lg">
            <span className="flex items-center gap-1"><FiMapPin className="inline-block text-[#fe4a56]" /><span>NIT Calicut, Kerala</span></span>
            <span className="flex items-center gap-1"><FiCalendar className="inline-block text-[#fe4a56]" /><span>20 September 2025</span></span>
          </div>
          <div className="pt-2">
            <button
              type="button"
              className="inline-block px-12 py-4 text-xl bg-[#fe4a56] text-white rounded-full font-semibold hover:bg-[#ea1212] transition-all duration-300 hover:scale-110"
              // onClick={onOpenTicketForm}
            >
              Coming Soon...
            </button>
            <div className="mt-3">
              <button
                type="button"
                className="text-white/70 underline hover:text-white transition-colors duration-200 text-base"
                onClick={onOpenCheckStatus}
              >
                Check Registration Status
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingSection; 