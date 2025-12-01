'use client';

import { useEffect, useRef } from 'react';

interface StarfieldProps {
  className?: string;
}

export default function Starfield({ className = "" }: StarfieldProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Generate random star positions for more stars
    const generateStars = (count: number, size: number) => {
      const stars = [];
      for (let i = 0; i < count; i++) {
        const x = Math.random() * 2000;
        const y = Math.random() * 2000;
        stars.push(`${x}px ${y}px #FFF`);
      }
      return stars.join(', ');
    };

    if (containerRef.current) {
      const stars1 = containerRef.current.querySelector('#stars') as HTMLElement;
      const stars2 = containerRef.current.querySelector('#stars2') as HTMLElement;
      const stars3 = containerRef.current.querySelector('#stars3') as HTMLElement;

      if (stars1) {
        stars1.style.boxShadow = generateStars(700, 1);
        const after1 = stars1.querySelector('::after') as HTMLElement;
        if (after1) after1.style.boxShadow = generateStars(700, 1);
      }

      if (stars2) {
        stars2.style.boxShadow = generateStars(200, 2);
        const after2 = stars2.querySelector('::after') as HTMLElement;
        if (after2) after2.style.boxShadow = generateStars(200, 2);
      }

      if (stars3) {
        stars3.style.boxShadow = generateStars(100, 3);
        const after3 = stars3.querySelector('::after') as HTMLElement;
        if (after3) after3.style.boxShadow = generateStars(100, 3);
      }
    }
  }, []);

  return (
    <div
      ref={containerRef}
      className={`fixed inset-0 overflow-hidden pointer-events-none ${className}`}
      style={{
        background: 'radial-gradient(ellipse at bottom, #1B2735 0%, #090A0F 100%)',
        zIndex: -1
      }}
    >
      <div id="stars"></div>
      <div id="stars2"></div>
      <div id="stars3"></div>
    </div>
  );
}