import React from 'react';
import { Link } from 'react-router-dom';

function LandingSection() {
  return (
    <div className="w-full h-full flex items-center justify-center">
      <div className="flex flex-col items-center justify-center text-center px-4 space-y-4">
        <h1 className="text-5xl md:text-7xl font-bold text-white">IEEE YESS'25</h1>
        <p className="text-xl md:text-3xl text-white ">Yearly Engineering Students Summit</p>
        <p className="text-base sm:text-lg md:text-xl text-white/80 max-w-2xl nunito-sans-body">Join us for the most anticipated engineering summit of the year</p>
        <div className="pt-2">
          <Link 
            to="/tickets" 
            className="inline-block px-12 py-4 text-xl bg-[#fe4a56] text-white rounded-full font-semibold hover:bg-[#ea1212] transition-all duration-300 hover:scale-110"
          >
            Get your Tickets
          </Link>
        </div>
      </div>
    </div>
  );
}

export default LandingSection; 