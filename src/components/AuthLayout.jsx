// src/components/AuthLayout.jsx
import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import WAVES from 'vanta/dist/vanta.waves.min';

/**
 * Full‑screen auth layout with a dynamic Vanta.js waves background
 * and centered frosted‑glass card.
 */
export function AuthLayout({ children }) {
  const backgroundRef = useRef(null);
  const [vantaEffect, setVantaEffect] = useState(null);

  useEffect(() => {
    if (!vantaEffect) {
      setVantaEffect(
        WAVES({
          el: backgroundRef.current,
          THREE,
          color: 0x6366f1,         // brand-500
          shininess: 50,
          waveSpeed: 1.2,
          zoom: 1.1,
        })
      );
    }
    return () => vantaEffect && vantaEffect.destroy();
  }, [vantaEffect]);

  return (
    <div ref={backgroundRef} className="relative min-h-screen w-full flex items-center justify-center">
      <div className="relative bg-white/80 backdrop-blur-md rounded-xl shadow-lg w-full max-w-sm p-8 z-10">
        {children}
      </div>
    </div>
  );
}
