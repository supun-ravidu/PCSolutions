'use client';

import { useEffect, useRef } from 'react';

interface VideoBackgroundProps {
  videoId: string;
  className?: string;
}

export default function VideoBackground({ videoId, className = "" }: VideoBackgroundProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    // YouTube autoplay doesn't work reliably on mobile, so we'll handle that
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    );

    if (iframeRef.current && !isMobile) {
      // Force autoplay by reloading the iframe with autoplay parameter
      const currentSrc = iframeRef.current.src;
      if (!currentSrc.includes('autoplay=1')) {
        iframeRef.current.src = `${currentSrc}&autoplay=1&mute=1&loop=1&playlist=${videoId}&controls=0&showinfo=0&rel=0&modestbranding=1&playsinline=1`;
      }
    }
  }, [videoId]);

  return (
    <div className={`fixed inset-0 overflow-hidden pointer-events-none ${className}`}>
      {/* Fallback gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-purple-900 to-black"></div>

      <iframe
        ref={iframeRef}
        src={`https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&loop=1&playlist=${videoId}&controls=0&showinfo=0&rel=0&modestbranding=1&playsinline=1&disablekb=1&fs=0&iv_load_policy=3&start=0&end=0`}
        className="w-full h-full object-cover scale-110"
        style={{
          filter: 'brightness(0.3) contrast(0.9) saturate(1.1) blur(0.5px)',
          transform: 'scale(1.1)',
        }}
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen={false}
        title="Background Video"
        loading="lazy"
      />
      {/* Multiple overlays for better text readability */}
      <div className="absolute inset-0 bg-black/40"></div>
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30"></div>
    </div>
  );
}