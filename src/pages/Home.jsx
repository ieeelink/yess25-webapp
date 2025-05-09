import React, { useRef, useEffect } from 'react';
import Header from '../components/Header';
import SubFooter from '../components/SubFooter';
import * as THREE from 'three';
import NET from 'vanta/dist/vanta.net.min';

function Home() {
  const homeContainerRef = useRef(null);
  useEffect(() => {
    const vantaEffect = NET({
      el: homeContainerRef.current,
      THREE: THREE,
      mouseControls: true,
      touchControls: true,
      gyroControls: false,
      minHeight: 200.00,
      minWidth: 200.00,
      scale: 1.00,
      scaleMobile: 1.00,
      color: 0xfe4a56,
      backgroundColor: 0x000000,
      points: 16.00,
      maxDistance: 13.00,
      spacing: 15.00 
    });
    return () => {
      if (vantaEffect) vantaEffect.destroy();
    };
  }, []);
  return (
    <div className="min-h-screen flex flex-col" ref={homeContainerRef}>
      <Header />
      <div className="flex-grow flex flex-col items-center justify-center text-center px-4">
        <h1 className="text-4xl font-bold mb-4">IEEE YESS'25</h1>
        <p className="text-lg">Yearly Engineering Students Summit</p>
      </div>
      <SubFooter />
    </div>
  );
}

export default Home; 