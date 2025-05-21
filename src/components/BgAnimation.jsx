import React, { useEffect, useRef, useState } from 'react';
import NET from 'vanta/dist/vanta.net.min';

function BgAnimation() {
  const [vantaEffect, setVantaEffect] = useState(null);
  const vantaRef = useRef(null);
  useEffect(() => {
    if (!vantaEffect) {
      setVantaEffect(
        NET({
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
          maxDistance: 5.00,
          spacing: 15.00
        })
      );
    }
    return () => {
      if (vantaEffect) vantaEffect.destroy();
    };
  }, [vantaEffect]);

  return <div ref={vantaRef} className="absolute inset-0 z-0" />;
}

export default BgAnimation; 