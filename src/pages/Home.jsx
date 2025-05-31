import React, {useState, useRef, useEffect} from 'react';
import Header from '../components/Header';
import SubFooter from '../components/SubFooter';
import BgAnimation from '../components/BgAnimation';
import { Link, useLocation } from 'react-router-dom';

function Home() {
  return (
    <div className="fixed inset-0 overflow-hidden">
      <div className="absolute inset-0 z-0">
        <BgAnimation/>
      </div>
      <div className="h-full flex flex-col relative z-10">
        <Header />     
        <div className="flex-1 flex flex-col items-center justify-center text-center px-4 relative">
          <div className="space-y-4">
            <h1 className="text-5xl md:text-7xl font-bold text-white">IEEE YESS'25</h1>
            <p className="text-xl md:text-3xl text-white">Yearly Engineering Students Summit</p>
            <p className="text-base sm:text-lg text-white/80 max-w-2xl">Join us for the most anticipated engineering summit of the year</p>
            <div className="pt-2">
              <Link 
                to="/tickets" 
                className="inline-block px-12 py-4 text-xl bg-[#fe4a56] text-white rounded-full font-semibold hover:bg-[#ea1212] transition-all duration-300 hover:scale-110"
              >
                Get Your Tickets
              </Link>
            </div>
          </div>
        </div>
        <SubFooter />
      </div>
    </div>
  );
}

export default Home;