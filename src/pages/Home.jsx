import React, {useState, useRef, useEffect} from 'react';
import Header from '../components/Header';
import SubFooter from '../components/SubFooter';
import BgAnimation from '../components/BgAnimation';
import { Link, useLocation } from 'react-router-dom';


function Home() {
  

  return (
    <>
    <BgAnimation/>
    <div className="relative min-h-screen flex flex-col">
      <Header />     
      <div className="flex-grow flex flex-col items-center justify-center text-center px-4 z-10 relative">
        <h1 className="text-4xl font-bold mb-4 text-white">IEEE YESS'25</h1>
        <p className="text-lg text-white">Yearly Engineering Students Summit</p>
        <Link 
          to="/tickets" 
          className="mt-8 px-8 py-3 bg-[#fe4a56] text-white rounded-full font-medium hover:bg-[#ea1212] transition-all duration-300 hover:scale-110"
        >
          Get Your Tickets
        </Link>
      </div>
      
      <SubFooter />
    </div>
    </>
  );
}

export default Home;
