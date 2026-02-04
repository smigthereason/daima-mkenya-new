// components/landing-page/Hero.tsx
"use client";

import { HeroImage3 } from "@/public/assets";
import Image from "next/image";

export default function Hero() {
  return (
    <section
      className="hero-section min-h-screen relative overflow-hidden"
      style={{
        fontFamily: "'Playfair Display', serif",
      }}
      id="hero-section"
    >
      {/* Google font import */}
      <link
        href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400&display=swap"
        rel="stylesheet"
      />

      {/* Split Background */}
      <div className="bg-left-animated absolute inset-0 z-0 bg-[#e8e8e8]"
        style={{ clipPath: 'polygon(0 0, 52% 0, 52% 100%, 0 100%)' }} 
      />
      
      <div className="bg-right-animated absolute top-0 right-0 w-full h-full z-0 bg-[#171717]"
        style={{ clipPath: 'polygon(52% 0, 100% 0, 100% 100%, 52% 100%)' }}
      />

      {/* Hero Titles */}
      <div className="absolute top-[42%] left-0 right-0 z-10 pointer-events-none flex justify-between px-10">
        <span className="hero-title-left text-[clamp(100px,18vw,180px)] font-black leading-[0.85] tracking-[-4px] text-[#2c2c2c]">
          Daima
        </span>
        <span className="hero-title-right text-[clamp(100px,18vw,180px)] font-black leading-[0.85] tracking-[-4px] text-white">
          Mkenya
        </span>
      </div>

      {/* Model Image */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20 w-full h-full max-w-[1200px] overflow-hidden">
        <Image
          src={HeroImage3}
          alt="model"
          fill
          className="model-image object-contain"
          quality={100}
          priority
          sizes="(max-width: 768px) 100vw, 1200px"
        />
      </div>

      {/* Left Body Copy */}
      <div className="hero-copy absolute top-[60%] left-12 w-[260px] z-25">
        <p className="font-georgia text-[13px] leading-[1.65] text-[#3a3a3a] mb-7">
          Discover a world of effortless style where modern fashion meets timeless elegance. Our collection is
          thoughtfully designed for confident girls who love to express themselves through clothing that feels as good as
          it looks.
        </p>
        <button className="shop-now-btn bg-[#1e1e1e] text-white border-none rounded-[24px] py-3 px-8 text-[14px] font-georgia tracking-[0.5px] cursor-pointer">
          Shop Now
        </button>
      </div>
    </section>
  );
}