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

      // Floating background text parallax
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
      {/* BACKGROUND DECORATIVE TEXT */}
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

      {/* MASONRY GALLERY GRID */}
      <div className="relative z-10 max-w-[1800px] mx-auto columns-1 sm:columns-2 lg:columns-3 gap-6 md:gap-10 space-y-6 md:space-y-10">
        {galleryItems.map((item, index) => (
          <div 
            key={item.id} 
            className="gallery-item group relative break-inside-avoid flex flex-col mb-6 md:mb-10"
          >
            {/* Image Container */}
            <div className="relative overflow-hidden bg-neutral-100 shadow-sm aspect-square sm:aspect-auto">
              <Image
                src={item.imageSrc}
                alt={item.name}
                width={800}
                height={1000}
                className="w-full h-auto object-cover transition-transform duration-1000 ease-out group-hover:scale-110"
                priority
              />
              
              {/* Overlay Gradient (Desktop) */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 lg:group-hover:opacity-100 transition-opacity duration-500" />
              
              {/* Vertical Category Text (Always visible on mobile, hover on desktop) */}
              <div className="absolute top-4 right-4 md:top-8 md:right-8 overflow-hidden pointer-events-none z-20">
                <span className="text-[9px] md:text-[10px] uppercase tracking-[0.4em] font-bold text-white [writing-mode:vertical-lr] rotate-180 drop-shadow-md">
                  {item.category || "Collection"}
                </span>
              </div>

              {/* In-Image Metadata (Desktop Hover) */}
              <div className="absolute inset-x-0 bottom-0 p-6 md:p-10 text-white translate-y-4 opacity-0 lg:group-hover:translate-y-0 lg:group-hover:opacity-100 transition-all duration-500 z-20 hidden lg:block">
                 <p className="text-[10px] text-neutral-300 uppercase tracking-widest italic mb-2">
                    {item.details.origin}
                 </p>
                 <h3 className="text-2xl font-light tracking-tight uppercase leading-tight mb-4">
                    {item.name}
                 </h3>
                 <Link 
                    href="/products"
                    className="inline-flex items-center gap-3 text-[10px] uppercase tracking-[0.2em] text-[#be1e2d] font-bold transition-all hover:gap-5"
                  >
                    Discover Item 
                    <ArrowRight size={14} />
                  </Link>
              </div>
            </div>

            {/* Mobile/Tablet Metadata (Visible below image) */}
            <div className="mt-5 flex justify-between items-start lg:hidden">
              <div className="flex-1">
                <h3 className="text-lg font-light tracking-tight uppercase leading-tight">
                  {item.name}
                </h3>
                <p className="text-[9px] text-neutral-400 mt-1 uppercase tracking-widest italic">
                  {item.details.origin}
                </p>
                <Link 
                  href="/products"
                  className="inline-flex items-center gap-2 text-[9px] uppercase tracking-[0.2em] text-[#be1e2d] font-bold mt-3"
                >
                  Discover Item 
                  <ArrowRight size={12} />
                </Link>
              </div>
              <span className="text-[10px] font-serif italic text-neutral-300">
                {String(index + 1).padStart(2, '0')}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* EDITORIAL STRIPE */}
      <section className="mt-24 md:mt-40 border-t border-neutral-200 pt-16 md:pt-24 max-w-[1800px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
         <div className="lg:col-span-5 relative h-80 sm:h-96 lg:h-[500px] w-full group overflow-hidden shadow-xl">
            <Image 
                src={Assets.HeroImage || Assets.Model11} 
                alt="editorial focus" 
                fill
                priority
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

      <footer className="mt-24 md:mt-40 text-center">
        <Image src={Assets.Logo} alt="Logo" width={60} height={60} priority className="mx-auto opacity-20" />
        <p className="text-[8px] md:text-[9px] uppercase tracking-[0.4em] text-neutral-400 mt-6 md:mt-8 px-4">
          © {new Date().getFullYear()} DAIMA MKENYA AFRICA — ALL RIGHTS RESERVED
        </p>
      </footer>
    </main>
  );
};

export default GalleryPage;