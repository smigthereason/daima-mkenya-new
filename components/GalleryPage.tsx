"use client";

import React, { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowRight } from "lucide-react";

// Import all assets from your index file
import * as Assets from "@/public/assets";
// Import product data and utilities
import { getAllProducts } from "@/types/Product";

gsap.registerPlugin(ScrollTrigger);

const GalleryPage = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const allProducts = getAllProducts();

  // Mapping products to specific model images for the editorial look
  const galleryItems = allProducts.slice(0, 9).map((product) => {
    const modelKey = `Model${product.id}` as keyof typeof Assets;
    return {
      ...product,
      imageSrc: Assets[modelKey] || Assets.Model1,
    };
  });

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Entry animation for items
      gsap.from(".gallery-item", {
        y: 60,
        opacity: 0,
        duration: 1,
        stagger: 0.15,
        ease: "power4.out",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 85%",
        },
      });

      // Floating background text parallax (Hidden on small mobile for performance)
      if (window.innerWidth > 768) {
        gsap.to(".bg-floating-text", {
          x: -150,
          scrollTrigger: {
            trigger: containerRef.current,
            scrub: 1.5,
          },
        });
      }
    });
    return () => ctx.revert();
  }, []);

  return (
    <main 
      ref={containerRef} 
      className="min-h-screen bg-[#F8F8F8] text-black pt-20 md:pt-32 pb-20 px-4 md:px-8 lg:px-12 overflow-x-hidden mt-16 md:mt-32"
    >
      {/* BACKGROUND DECORATIVE TEXT - Desktop Only */}
      <div className="fixed top-1/2 left-0 -translate-y-1/2 pointer-events-none z-0 opacity-[0.03] select-none hidden lg:block">
        <h1 className="bg-floating-text text-[25vw] font-bold whitespace-nowrap leading-none uppercase">
          Daima Mkenya Studio
        </h1>
      </div>

      {/* HEADER SECTION */}
      <header className="relative z-10 max-w-[1800px] mx-auto mb-12 md:mb-24 grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8 items-end">
        <div className="md:col-span-8">
          <span className="text-[10px] md:text-xs uppercase tracking-[0.5em] text-[#be1e2d] font-bold block mb-4">
            Lookbook {new Date().getFullYear()}
          </span>
          <h2 className="text-4xl sm:text-6xl md:text-8xl lg:text-9xl font-light tracking-tighter leading-[0.9] md:leading-[0.85]">
            explore the <br />
            <span className="font-medium italic">heritage</span> 
          </h2>
        </div>
        <div className="md:col-span-4 pb-1 md:pb-2">
          <p className="text-xs md:text-[13px] text-neutral-500 max-w-xs leading-relaxed border-l border-neutral-300 pl-4 md:pl-6 uppercase tracking-wider">
            A curated visual journey through the soul of Kenyan craftsmanship. 
            Every piece tells a story of identity and pride.
          </p>
        </div>
      </header>

      {/* GALLERY GRID */}
      <div className="relative z-10 max-w-[1800px] mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 md:gap-x-10 gap-y-10 md:gap-y-32">
        {galleryItems.map((item, index) => (
          <div 
            key={item.id} 
            className={`gallery-item group relative flex flex-col ${
              // Even spacing on mobile/tablet (grid-cols-1 and sm:grid-cols-2)
              // Editorial stagger only applies on large screens (iPad Pro Landscape / Desktop)
              index % 2 !== 0 ? "lg:translate-y-24" : ""
            }`}
          >
            {/* Image Container */}
            <div className="relative overflow-hidden aspect-[4/5] bg-neutral-100 shadow-sm">
              <Image
                src={item.imageSrc}
                alt={item.name}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className="object-cover transition-transform duration-1000 ease-out group-hover:scale-110"
                priority={index < 2}
              />
              <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              {/* Vertical Category Text */}
              <div className="absolute top-4 right-4 md:top-8 md:right-8 overflow-hidden pointer-events-none">
                <span className="text-[9px] md:text-[10px] uppercase tracking-[0.4em] font-bold text-white [writing-mode:vertical-lr] rotate-180 drop-shadow-md">
                  {item.category || "Collection"}
                </span>
              </div>
            </div>

            {/* Content Metadata */}
            <div className="mt-5 md:mt-8 flex justify-between items-start">
              <div className="flex-1">
                <h3 className="text-lg md:text-xl lg:text-2xl font-light tracking-tight uppercase leading-tight max-w-[90%] md:max-w-[80%]">
                  {item.name}
                </h3>
                <p className="text-[9px] md:text-[10px] text-neutral-400 mt-1 uppercase tracking-widest italic">
                  {item.details.origin}
                </p>
                <Link 
                  href="/products"
                  className="inline-flex items-center gap-2 md:gap-3 text-[9px] md:text-[10px] uppercase tracking-[0.2em] text-[#be1e2d] font-bold mt-3 md:mt-4 transition-all hover:gap-5"
                >
                  Discover Item 
                  <ArrowRight size={14} />
                </Link>
              </div>
              <span className="text-[10px] md:text-xs font-serif italic text-neutral-300 transform translate-y-1 md:translate-y-2">
                {String(index + 1).padStart(2, '0')}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* EDITORIAL STRIPE (Bottom Section) */}
      <section className="mt-24 md:mt-60 border-t border-neutral-200 pt-16 md:pt-24 max-w-[1800px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
         <div className="lg:col-span-5 relative h-80 sm:h-96 lg:h-[500px] w-full group overflow-hidden shadow-xl">
            <Image 
                src={Assets.HeroImage || Assets.Model11} 
                alt="editorial focus" 
                fill
                sizes="(max-width: 1024px) 100vw, 40vw"
                className="object-cover transition-all duration-1000 scale-105 group-hover:scale-100"
            />
            <div className="absolute bottom-6 left-6 md:bottom-10 md:left-10 text-white z-10">
              <p className="text-[9px] md:text-[10px] uppercase tracking-[0.5em] font-bold">Studio Session</p>
              <h5 className="text-xl md:text-2xl font-light italic">Daima Mkenya 2026</h5>
            </div>
         </div>
         <div className="lg:col-span-7">
            <h4 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-light tracking-tighter mb-8 md:mb-10 leading-[0.9] md:leading-[0.85]">
                STAY ROOTED. <br />
                STAY <span className="text-[#be1e2d] font-medium italic">AUTHENTIC.</span>
            </h4>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 md:gap-12 border-l border-neutral-200 pl-6 md:pl-10">
                <div className="flex flex-col gap-2 md:gap-3">
                    <span className="text-[9px] md:text-[10px] uppercase tracking-[0.3em] font-bold text-neutral-400">Instagram</span>
                    <a href="#" className="text-xs md:text-sm font-medium hover:text-[#be1e2d] transition-colors uppercase tracking-widest">@daimastudio</a>
                </div>
                <div className="flex flex-col gap-2 md:gap-3">
                    <span className="text-[9px] md:text-[10px] uppercase tracking-[0.3em] font-bold text-neutral-400">Headquarters</span>
                    <span className="text-xs md:text-sm font-medium uppercase tracking-widest">Nairobi, Kenya</span>
                </div>
            </div>

            <div className="mt-10 md:mt-16">
              <Link 
                href="/products" 
                className="w-full sm:w-auto text-center px-8 md:px-10 py-4 md:py-5 bg-black text-white text-[10px] md:text-[11px] uppercase tracking-[0.3em] font-bold inline-block hover:bg-[#be1e2d] transition-all duration-500"
              >
                Shop Full Collection
              </Link>
            </div>
         </div>
      </section>

      {/* FOOTER STRIPE */}
      <footer className="mt-24 md:mt-40 text-center">
        <Image src={Assets.Logo} alt="Logo" width={60} height={60} className="mx-auto opacity-20" />
        <p className="text-[8px] md:text-[9px] uppercase tracking-[0.4em] text-neutral-400 mt-6 md:mt-8 px-4">
          © {new Date().getFullYear()} DAIMA MKENYA AFRICA — ALL RIGHTS RESERVED
        </p>
      </footer>
    </main>
  );
};

export default GalleryPage;