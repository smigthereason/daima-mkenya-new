"use client";
import React, { useState, useRef, useEffect } from "react";
import { ChevronLeft, ChevronRight, ArrowUpRight, Play, Volume2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

/* ─────────────────────────── types ─────────────────────────── */
interface Product {
  id: number;
  name: string;
  price: string;
  modelImage: string;
  modelVideo: string;
  productImage: string;
}

/* ─────────────────────────── data (YOUR LOCAL ASSETS) ──────────────────────────── */
const products: Product[] = [
  {
    id: 1,
    name: "MAASAI HERITAGE WRAP PASHMINA",
    price: "Ksh 8,500",
    modelImage: "/assets/1.jpg",
    modelVideo: "/assets/afro-dress.mp4",
    productImage: "/assets/1.12.png",
  },
  {
    id: 2,
    name: "SHIELD EMBLEM OVERSIZED HOODIE",
    price: "Ksh 7,200",
    modelImage: "/assets/2.webp",
    modelVideo: "/assets/afro_man.mp4",
    productImage: "/assets/2.12.png",
  },
  {
    id: 3,
    name: "RUNWAY POPLIN SHIRT & SHORT SET",
    price: "Ksh 12,500",
    modelImage: "/assets/3.jpg",
    modelVideo: "/assets/afro_dress_2.mp4",
    productImage: "/assets/3.32.png",
  },
  {
    id: 4,
    name: "STRIPED NATIONAL BUTTON-DOWN",
    price: "Ksh 6,800",
    modelImage: "/assets/4.jpg",
    modelVideo: "/assets/afro-dress.mp4",
    productImage: "/assets/4.42.png",
  },
  {
    id: 9,
    name: "HERITAGE STRIPE KAFTAN GOWN",
    price: "Ksh 11,500",
    modelImage: "/assets/9.jpg",
    modelVideo: "/assets/afro_man.mp4",
    productImage: "/assets/9.92.png",
  },
  {
    id: 14,
    name: "NATIONAL PRIDE STRIPE SHIRT",
    price: "Ksh 5,800",
    modelImage: "/assets/14.jpg",
    modelVideo: "/assets/afro_dress_2.mp4",
    productImage: "/assets/14.142.png",
  },
];

const ProductCard = ({ product, isActive }: { product: Product; isActive: boolean }) => {
  const [isHovered, setIsHovered] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    if (isHovered && videoRef.current) {
      videoRef.current.play().catch(() => { });
    } else if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  }, [isHovered]);

  return (
    <div
      className={`relative transition-all duration-700 ease-out h-[65vh] md:h-[75vh]
                 ${isActive ? "w-[70vw] md:w-[45vw] scale-100" : "w-[15vw] md:w-[10vw] grayscale opacity-40 scale-95"}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative w-full h-full overflow-hidden rounded-[2px] bg-neutral-100 shadow-2xl">
        {/* Model Media */}
        <div className="absolute inset-0 z-0">
          {/* Static Image */}
          <Image
            src={product.modelImage}
            alt={product.name}
            fill
            className={`object-cover object-top transition-transform duration-1000 ease-in-out
                       ${isHovered ? "scale-110" : "scale-100"}`}
          />

          {/* Video Layer */}
          <video
            ref={videoRef}
            src={product.modelVideo}
            muted
            loop
            playsInline
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500
                       ${isHovered ? "opacity-100" : "opacity-0"}`}
          />
        </div>

        {/* Overlay Gradients */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/60 opacity-60" />

        {/* Floating Product Flat Lay (Revealed on Hover) */}
        <div
          className={`absolute top-6 right-6 z-20 w-24 md:w-32 aspect-[3/4] bg-white p-1 rounded-sm shadow-xl transition-all duration-500 delay-100
                        ${isHovered ? "opacity-100 translate-x-0" : "opacity-0 translate-x-10"}`}
        >
          <Image
            src={product.productImage}
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
          <div className="flex flex-col gap-2">
            <span className="text-white/70 text-xs tracking-[0.3em] font-light">LIMITED RELEASE</span>
            <h3 className="text-white text-2xl md:text-4xl font-serif tracking-tight leading-tight uppercase max-w-[80%]">
              {product.name}
            </h3>
            <div className="flex items-center gap-4 mt-2">
              <span className="text-white font-medium text-lg">{product.price}</span>
              <div className="h-[1px] w-12 bg-white/30" />
              <button className="flex items-center gap-2 text-white text-xs tracking-widest uppercase hover:text-neutral-300 transition-colors">
                SHOP NOW <ArrowUpRight size={14} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function NewArrivals() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % products.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + products.length) % products.length);
  };

  return (
    <section className="relative min-h-screen bg-white overflow-hidden flex flex-col">
      {/* Background Large Text Decor */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full pointer-events-none select-none overflow-hidden whitespace-nowrap opacity-[0.03] z-0">
        <h1 className="text-[25vw] font-black tracking-tighter leading-none italic uppercase">
          Arrivals
        </h1>
      </div>

      {/* Header */}
      <header className="relative z-10 pt-12 pb-8 px-6 md:px-12 flex justify-between items-end">
        <div className="flex flex-col">
          <span className="text-neutral-900 text-xs tracking-[0.5em] mb-2">CURATED COLLECTION</span>
          <h2 className="text-neutral-900 text-5xl md:text-7xl font-serif font-black tracking-tighter leading-none">
            NEW<br />ARRIVALS
          </h2>
        </div>

        <div className="hidden md:flex flex-col items-end text-right">
          <p className="max-w-[300px] text-neutral-700 text-sm leading-relaxed mb-4">
            A fusion of traditional heritage and modern luxury silhouettes.
            Crafted for the bold, designed for the legacy.
          </p>
          <a
            href="/products"
            className="group flex items-center gap-4 border-b border-black pb-1 text-sm font-bold tracking-widest transition-all hover:gap-6 text-neutral-900"
          >
            EXPLORE ALL <ArrowUpRight size={18} />
          </a>
        </div>
      </header>

      {/* Main Slider Container */}
      <div className="relative flex-1 flex items-center justify-center py-10">
        <div className="flex items-center gap-4 md:gap-8 px-4 overflow-visible">
          {products.map((product, index) => (
            <ProductCard
              key={product.id}
              product={product}
              isActive={index === currentIndex}
            />
          ))}
        </div>
      </div>

      {/* Controls & Navigation */}
      <footer className="relative z-10 px-6 md:px-12 pb-12 flex flex-col md:flex-row justify-between items-center gap-8">
        {/* Progress bar and counter */}
        <div className="flex items-center gap-8 w-full md:w-auto">
          <div className="flex items-center gap-4">
            <span className="font-serif text-2xl text-neutral-900">0{currentIndex + 1}</span>
            <div className="w-48 h-[2px] bg-neutral-100 relative overflow-hidden">
              <div
                className="absolute inset-y-0 left-0 bg-black transition-all duration-700 ease-out"
                style={{ width: `${((currentIndex + 1) / products.length) * 100}%` }}
              />
            </div>
            <span className="font-serif text-2xl text-neutral-900">0{products.length}</span>
          </div>
        </div>

        {/* Directional buttons */}
        <div className="flex gap-4">
          <button
            onClick={prevSlide}
            className="w-14 h-14 rounded-full border border-neutral-900 flex items-center justify-center hover:bg-neutral-200 hover:text-white transition-all duration-300 group"
          >
            <ChevronLeft
              size={24}
              className="group-hover:-translate-x-1 transition-transform text-neutral-900"
            />
          </button>
          <button
            onClick={nextSlide}
            className="w-14 h-14 rounded-full border border-neutral-900 flex items-center justify-center hover:bg-neutral-200 hover:text-white transition-all duration-300 group"
          >
            <ChevronRight
              size={24}
              className="group-hover:translate-x-1 transition-transform text-neutral-900"
            />
          </button>
        </div>

        {/* Mobile CTA */}
        <div className="md:hidden">
          <Link
            href="/products"
            className="px-8 py-3 bg-black text-white rounded-full text-xs font-bold tracking-[0.2em] uppercase"
          >
            View All Series
          </Link>
        </div>
      </footer>

      {/* Font style (Playfair Display) */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
            @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,900;1,400&display=swap');
            .font-serif { font-family: 'Playfair Display', serif; }
          `,
        }}
      />
    </section>
  );
}
