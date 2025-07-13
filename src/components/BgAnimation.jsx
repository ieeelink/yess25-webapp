import React, { useEffect, useRef } from 'react';
import NET from 'vanta/dist/vanta.net.min';

function BgAnimation() {
  const vantaRef = useRef(null);
  const vantaEffectRef = useRef(null);

  useEffect(() => {
    if (!vantaEffectRef.current) {
      vantaEffectRef.current = NET({
        el: vantaRef.current,
        mouseControls: true,
        touchControls: true,
        gyroControls: false,
        minHeight: 200.00,
        minWidth: 200.00,
        scale: 1.00,
        scaleMobile: 1.00,
        color: 0xe32b2b,
        backgroundColor: 0x101010,
        points: 20.00,
        maxDistance: 2.00,
        spacing: 13.00,
      });
    }
    return () => {
      if (vantaEffectRef.current) {
        vantaEffectRef.current.destroy();
        vantaEffectRef.current = null;
      }
    };
  }, []);

  return (
    <div className="absolute inset-0 z-0">
      <div ref={vantaRef} className="absolute inset-0 z-0" />
      <div className="absolute inset-0 z-10 bg-[#9f9f9f]/5 pointer-events-none" />
    </div>
  );
}

export default BgAnimation; 