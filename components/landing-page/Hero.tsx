// components/landing-page/Hero.tsx
"use client";

import { HeroImage3 } from "@/public/assets";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function Hero() {
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      const width = window.innerWidth;
      setIsMobile(width < 768);
      setIsTablet(width >= 768 && width < 1024);
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  return (
    <section
      className="hero-section min-h-screen relative overflow-hidden"
      style={{
        fontFamily: "'Playfair Display', serif",
      }}
      id="hero-section"
    >
      {/* Split Background */}
      <div 
        className="bg-left-animated absolute inset-0 z-0 bg-[#e8e8e8]"
        style={{ 
          clipPath: isMobile 
            ? 'polygon(0 0, 100% 0, 100% 50%, 0 100%)' 
            : isTablet 
              ? 'polygon(0 0, 55% 0, 55% 100%, 0 100%)'
              : 'polygon(0 0, 52% 0, 52% 100%, 0 100%)' 
        }} 
      />
      
      <div 
        className="bg-right-animated absolute top-0 right-0 w-full h-full z-0 bg-[#171717]"
        style={{ 
          clipPath: isMobile 
            ? 'polygon(0 50%, 100% 0, 100% 100%, 0 100%)'
            : isTablet 
              ? 'polygon(55% 0, 100% 0, 100% 100%, 55% 100%)'
              : 'polygon(52% 0, 100% 0, 100% 100%, 52% 100%)' 
        }}
      />

      {/* Hero Titles - Stacked on mobile, side by side on desktop */}
      <div className={`absolute ${isMobile ? 'top-[35%] left-1/2 transform -translate-x-1/2 w-full px-4 text-center' : 'top-[42%] left-0 right-0 flex justify-between px-4 sm:px-6 md:px-8 lg:px-10'} z-10 pointer-events-none`}>
        {isMobile ? (
          <div className="flex flex-col items-center">
            <span className="hero-title-left text-[clamp(70px,15vw,100px)] font-black leading-[0.9] tracking-[-2px] text-[#2c2c2c] block">
              Daima
            </span>
            <span className="hero-title-right text-[clamp(70px,15vw,100px)] font-black leading-[0.9] tracking-[-2px] text-white block mt-2">
              Mkenya
            </span>
          </div>
        ) : (
          <>
            <span className="hero-title-left text-[clamp(60px,10vw,180px)] md:text-[clamp(80px,14vw,180px)] lg:text-[clamp(100px,18vw,180px)] font-black leading-[0.85] tracking-[-2px] md:tracking-[-3px] lg:tracking-[-4px] text-[#2c2c2c]">
              Daima
            </span>
            <span className="hero-title-right text-[clamp(60px,10vw,180px)] md:text-[clamp(80px,14vw,180px)] lg:text-[clamp(100px,18vw,180px)] font-black leading-[0.85] tracking-[-2px] md:tracking-[-3px] lg:tracking-[-4px] text-white">
              Mkenya
            </span>
          </>
        )}
      </div>

      {/* Model Image - Hidden on mobile */}
      {!isMobile && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20 w-full h-full max-w-[90vw] sm:max-w-[85vw] md:max-w-[800px] lg:max-w-[1000px] xl:max-w-[1200px] overflow-hidden">
          <Image
            src={HeroImage3}
            alt="model"
            fill
            className="model-image object-contain"
            quality={100}
            priority
            sizes="(max-width: 768px) 85vw, (max-width: 1024px) 800px, (max-width: 1280px) 1000px, 1200px"
          />
        </div>
      )}

      {/* Body Copy - Adjusted for mobile */}
      <div className={`hero-copy ${isMobile ? 'top-[55%] left-1/2 transform -translate-x-1/2 w-[85%] max-w-[300px] text-center' : 'top-[60%] left-4 sm:left-6 md:left-8 lg:left-12 w-[220px] sm:w-[240px] md:w-[260px] lg:w-[280px]'} z-25 absolute`}>
        <p className="font-georgia text-[12px] sm:text-[12px] md:text-[13px] leading-[1.5] sm:leading-[1.6] md:leading-[1.65] text-[#3a3a3a] mb-4 sm:mb-5 md:mb-6 lg:mb-7">
          Discover a world of effortless style where modern fashion meets timeless elegance. Our collection is
          thoughtfully designed for confident girls who love to express themselves through clothing that feels as good as
          it looks.
        </p>
        <button className="shop-now-btn bg-[#1e1e1e] text-white border-none rounded-[20px] sm:rounded-[22px] md:rounded-[24px] py-3 px-8 text-[13px] sm:text-[13px] md:text-[14px] font-georgia tracking-[0.4px] sm:tracking-[0.4px] md:tracking-[0.5px] cursor-pointer hover:bg-[#2a2a2a] transition-colors duration-300 mx-auto block">
          Shop Now
        </button>
      </div>

      {/* Mobile-specific spacing adjustment */}
      {isMobile && (
        <style jsx>{`
          @media (max-width: 767px) {
            .hero-section {
              min-height: 85vh;
            }
          }
        `}</style>
      )}
    </section>
  );
}