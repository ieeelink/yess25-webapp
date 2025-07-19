import React from "react";
import BgAnimation from '../components/BgAnimation';
import AboutSection from '../components/AboutSection';
import Header2 from '../components/Header2';

const About = () => (
  <div className="min-h-screen bg-[#0a0a0a] text-white relative overflow-x-hidden pt-18">
    <div className="fixed inset-0 z-0">
      <BgAnimation />
    </div>
    <div className="w-full relative z-10">
    <Header2/>
      <div className="md:mt-20 mt-15 min-h-screen bg-black/20 flex flex-col items-center justify-center px-4 py-12">
        <h1 className="text-3xl font-bold text-white mb-8 text-center">About US</h1>
        <AboutSection />
      </div>
    </div>
  </div>
);

export default About; 