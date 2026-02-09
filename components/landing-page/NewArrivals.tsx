"use client";
import React, { useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight, ArrowUpRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
// Importing from your Product.ts
import { getAllProducts, Product } from "@/types/Product"; 

const ProductCard = ({
  product,
  isActive,
}: {
  product: Product;
  isActive: boolean;
}) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className={`relative transition-all duration-700 ease-out h-[60vh] md:h-[70vh] shrink-0
                 ${isActive 
                    ? "w-[75vw] md:w-[40vw] scale-100 z-10" 
                    : "w-[15vw] md:w-[10vw] grayscale opacity-30 scale-90"}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative w-full h-full overflow-hidden rounded-2 bg-neutral-100 shadow-2xl">
        {/* Model Image - Using first thumbnail from Product.ts */}
        <div className="absolute inset-0 z-0">
          <Image
            src={product.images.thumbnails[0]} 
            alt={product.name}
            fill
            priority={isActive}
            className={`object-cover object-top transition-transform duration-1000 ease-in-out
                       ${isHovered ? "scale-110" : "scale-100"}`}
          />
        </div>

        <div className="absolute inset-0 bg-linear-to-b from-transparent via-transparent to-black/80 opacity-90" />

        {/* Floating Flat Lay */}
        <div
          className={`absolute top-4 right-4 md:top-6 md:right-6 z-20 w-20 md:w-32 aspect-3/4 bg-white p-1 rounded-sm shadow-xl transition-all duration-500 delay-100
                        ${isHovered ? "opacity-100 translate-x-0" : "opacity-0 translate-x-10"}`}
        >
          <Image
            src={product.images.hero}
            alt="product flat"
            fill
            className="object-cover"
          />
        </div>

        {/* Content Box */}
        <div
          className={`absolute bottom-0 left-0 right-0 p-6 md:p-10 transition-all duration-500
                        ${isActive ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"}`}
        >
          <div className="flex flex-col gap-1 md:gap-2">
            <span className="text-white/70 text-[10px] md:text-xs tracking-[0.3em] font-light">
              {product.category?.toUpperCase() || "NEW ARRIVAL"}
            </span>
            <h3 className="text-white text-xl md:text-3xl font-serif tracking-tight leading-tight uppercase">
              {product.name}
            </h3>
            <div className="flex items-center gap-3 mt-2">
              <span className="text-white font-medium text-lg">
                {product.price}
              </span>
              <div className="h-px w-8 md:w-12 bg-white/30" />
              <Link href={`/product/${product.id}`} className="flex items-center gap-2 text-white text-[10px] md:text-xs tracking-widest uppercase hover:text-neutral-300 transition-colors">
                SHOP NOW <ArrowUpRight size={14} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function NewArrivals() {
  const allProducts = getAllProducts(); // Using data from Product.ts
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % allProducts.length);
  }, [allProducts.length]);

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + allProducts.length) % allProducts.length);
  };

  // 5-Second Infinite Loop Logic
  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(nextSlide, 5000);
    return () => clearInterval(interval);
  }, [nextSlide, isPaused]);

  /**
   * Center Calculation Logic:
   * We calculate the offset to put the center of the active card 
   * exactly at the center of the screen.
   */
  const getTransformStyle = () => {
    const isMobile = typeof window !== "undefined" && window.innerWidth < 768;
    
    // Widths matching our Tailwind classes
    const activeWidth = isMobile ? 75 : 40; // vw
    const inactiveWidth = isMobile ? 15 : 10; // vw
    const gap = isMobile ? 3 : 5; // vw (match the gap-3 / gap-8)

    // Calculate how far the previous items push the current item
    const offset = (currentIndex * (inactiveWidth + gap));
    
    // Center the active item: (Half screen) - (Half of active item width) - (Items before it)
    return {
      transform: `translateX(calc(50vw - (${activeWidth / 2}vw) - ${offset}vw))`,
    };
  };

  return (
    <section 
      className="relative min-h-screen bg-white overflow-hidden flex flex-col"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Background Decor */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full pointer-events-none select-none opacity-[0.03] z-0">
        <h1 className="text-[25vw] font-black tracking-tighter italic uppercase text-center">
          Arrivals
        </h1>
      </div>

      <header className="relative z-10 pt-12 px-6 md:px-12 flex justify-between items-end">
        <div className="flex flex-col">
          <span className="text-neutral-900 text-[10px] md:text-xs tracking-[0.5em] mb-2">CURATED COLLECTION</span>
          <h2 className="text-neutral-900 text-5xl md:text-7xl font-serif font-black tracking-tighter leading-none">
            NEW<br />ARRIVALS
          </h2>
        </div>
        <div className="hidden md:block text-right">
          <Link href="/products" className="group flex items-center gap-4 border-b border-black pb-1 text-sm font-bold tracking-widest text-neutral-900">
            EXPLORE ALL <ArrowUpRight size={18} />
          </Link>
        </div>
      </header>

      {/* Centered Slider Container */}
      <div className="relative flex-1 flex items-center overflow-visible">
        <div 
          className="flex items-center gap-3 md:gap-12 transition-transform duration-1000 cubic-bezier(0.4, 0, 0.2, 1)"
          style={getTransformStyle()}
        >
          {allProducts.map((product, index) => (
            <ProductCard
              key={product.id}
              product={product}
              isActive={index === currentIndex}
            />
          ))}
        </div>
      </div>

      {/* Footer Navigation */}
      <footer className="relative z-10 px-6 md:px-12 pb-12 flex flex-col md:flex-row justify-between items-center gap-8">
        <div className="flex items-center gap-6">
          <span className="font-serif text-2xl">0{currentIndex + 1}</span>
          <div className="w-32 md:w-48 h-0.5 bg-neutral-100 relative">
            <div 
              className="absolute inset-y-0 left-0 bg-black transition-all duration-700"
              style={{ width: `${((currentIndex + 1) / allProducts.length) * 100}%` }}
            />
          </div>
          <span className="font-serif text-2xl">0{allProducts.length}</span>
        </div>

        <div className="flex gap-4">
          <button onClick={prevSlide} className="w-14 h-14 rounded-full border border-black flex items-center justify-center hover:bg-black hover:text-white transition-all">
            <ChevronLeft size={24} />
          </button>
          <button onClick={nextSlide} className="w-14 h-14 rounded-full border border-black flex items-center justify-center hover:bg-black hover:text-white transition-all">
            <ChevronRight size={24} />
          </button>
        </div>
      </footer>

      
    </section>
  );
}