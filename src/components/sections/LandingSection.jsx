import React from 'react';
import { Link } from 'react-router-dom';

function LandingSection() {
  return (
    <div className="w-full h-full flex items-center justify-center">
      <div className="flex flex-col items-center justify-center text-center px-4 space-y-4">
        {/* YESS Logo - Only visible on desktop */}
        <div className="hidden lg:block mb-8">
          <img 
            src="/yess_icon.svg" 
            alt="IEEE YESS Logo" 
            className="w-32 lg:w-40 h-auto"
          />
        </div>
        
        <h1 className="text-5xl lg:text-7xl font-bold text-white">IEEE YESS'25</h1>
        <p className="text-xl lg:text-3xl text-white ">Yearly Engineering Students Summit</p>
        <p className="text-base lg:text-lg lg:text-xl text-white/80 max-w-2xl nunito-sans-body">Join us for the most anticipated engineering summit of the year</p>
        <div className="pt-2">
          <Link 
            // to="/tickets" 
            className="inline-block px-12 py-4 text-xl bg-[#fe4a56] text-white rounded-full font-semibold hover:bg-[#ea1212] transition-all duration-300 hover:scale-110"
          >
            Coming Soon...
          </Link>
        </div>
        {/* Secondary link for registration details or retry payment */}
        {/* <div className="pt-2">
          <Link
            to="/checkStatus"
            className="inline-block text-base text-white/80 underline hover:text-white transition-all duration-200"
          >
            Get Registration Details / Retry Payment
          </Link>
        </div> */}
      </div>
    </div>
  );
}

export default LandingSection; 