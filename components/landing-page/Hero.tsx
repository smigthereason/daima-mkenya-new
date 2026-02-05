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
      className={` min-h-screen relative overflow-hidden ${isMobile ? "min-h-[85vh]" : ""
        }`}
      style={{
        fontFamily: "'Playfair Display', serif",
      }}
      id="hero-section"
    >
      {/* Left background (light on top on mobile, half-left on desktop) */}
      <div
        className="bg-left absolute inset-0 z-0 bg-[#e8e8e8]"
        style={{
          clipPath: isMobile
            ? "polygon(0 0, 100% 0, 100% 50%, 0 50%)" // top half light on mobile
            : isTablet
              ? "polygon(0 0, 55% 0, 55% 100%, 0 100%)" // left half on tablet
              : "polygon(0 0, 52% 0, 52% 100%, 0 100%)", // left half on desktop
        }}
      />

      {/* Right background (dark on bottom on mobile, half-right on desktop/tablet) */}
      <div
        className="bg-right absolute inset-0 z-0 bg-[#171717]"
        style={{
          clipPath: isMobile
            ? "polygon(0 50%, 100% 50%, 100% 100%, 0 100%)" // bottom half dark on mobile
            : isTablet
              ? "polygon(55% 0, 100% 0, 100% 100%, 55% 100%)"
              : "polygon(52% 0, 100% 0, 100% 100%, 52% 100%)",
        }}
      />

      {/* Daima / Mkenya text titles (always unskewed) */}
      <div
        className={`absolute ${isMobile
          ? "top-[28%] left-1/2 transform -translate-x-1/2 w-full px-4 text-center"
          : "top-[40%] left-0 right-0 flex justify-between px-4 sm:px-6 md:px-8 lg:px-10"
          } z-10 pointer-events-none`}
      >
        {isMobile ? (
          <div className="flex flex-col items-center">
            <span className="text-[clamp(60px,12vw,90px)] font-black leading-[0.85] text-[#2c2c2c]">
              Daima
            </span>
            <span className="text-[clamp(60px,12vw,90px)] font-black leading-[0.85] text-white mt-2">
              Mkenya
            </span>
          </div>
        ) : (
          <>
            <span className="text-[clamp(60px,10vw,180px)] md:text-[clamp(80px,14vw,180px)] lg:text-[clamp(100px,18vw,180px)] font-black leading-[0.85] tracking-[-2px] md:tracking-[-3px] lg:tracking-[-4px] text-[#2c2c2c]">
              Daima
            </span>
            <span className="text-[clamp(60px,10vw,180px)] md:text-[clamp(80px,14vw,180px)] lg:text-[clamp(100px,18vw,180px)] font-black leading-[0.85] tracking-[-2px] md:tracking-[-3px] lg:tracking-[-4px] text-white">
              Mkenya
            </span>
          </>
        )}
      </div>

      {/* Model Image - Centered, hidden on mobile */}
      <div
        className="absolute hidden md:block top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20 w-full h-full max-w-[90vw] sm:max-w-[85vw] md:max-w-200 lg:max-w-250 xl:max-w-300 overflow-hidden"
      >
        <Image
          src={HeroImage3}
          alt="model"
          fill
          className="object-contain"
          quality={100}
          priority
          sizes="(max-width: 768px) 85vw, (max-width: 1024px) 800px, (max-width: 1280px) 1000px, 1200px"
        />
      </div>

      {/* Body copy + Shop Now button (on the left side) */}
      <div
        className={`absolute ${isMobile
          ? "top-[54%] left-1/2 transform -translate-x-1/2 w-[85%] max-w-[300px] text-center"
          : "top-[60%] left-4 sm:left-6 md:left-8 lg:left-12 w-[220px] sm:w-[240px] md:w-1/4 "
          } z-25`}
      >
        <p className="w-full text-[14px] sm:text-[14px] md:text-[16px] leading-[1.5] sm:leading-[1.6] md:leading-[1.65] text-neutral-100 md:text-[#3a3a3a] mb-4 sm:mb-5 md:mb-6 lg:mb-7">
          Discover a world of effortless style where modern fashion meets timeless elegance. Our collection is
          thoughtfully designed for confident girls who love to express themselves through clothing that feels as good as
          it looks.
        </p>
        <button className=" bg-[#1e1e1e] text-white border-none py-3 px-8 text-[13px] sm:text-[13px] md:text-[14px] tracking-[0.4px] sm:tracking-[0.4px] md:tracking-[0.5px] cursor-pointer hover:bg-[#2a2a2a] transition-colors duration-300 block">
          Shop Now
        </button>
      </div>

      {/* Optional: custom styling for mobile height */}
      {isMobile && (
        <style jsx global>{`
          .hero-section {
            min-height: 85vh;
          }
        `}</style>
      )}
    </section>
  );
}
