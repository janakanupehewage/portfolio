"use client";
import React, { useRef, useEffect } from 'react';
import HeroContent from '../sub/HeroContent';

function Hero() {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    const playVideo = () => {
      if (videoRef.current) {
        videoRef.current.volume = 0.1; // Ensure full volume
        videoRef.current
          .play()
          .then(() => {
            console.log("Video autoplayed successfully with sound.");
          })
          .catch((error) => {
            console.log("Autoplay with sound failed. Waiting for user interaction...", error);
            document.addEventListener("click", playVideo, { once: true });
            document.addEventListener("keydown", playVideo, { once: true });
          });
      }
    };

    playVideo(); // Try autoplay on mount

    return () => {
      document.removeEventListener("click", playVideo);
      document.removeEventListener("keydown", playVideo);
    };
  }, []);

  return (
    <div className="relative flex flex-col h-full w-full">
      <video
        //ref={videoRef}
        autoPlay
        loop
        muted
        className="absolute top-[-440px] left-0 w-full h-full object-cover z-[-1]"
      >
        <source src="/blackhole.webm" type="video/webm" />
      </video>
      
      <HeroContent />
    </div>
  );
}

export default Hero;
