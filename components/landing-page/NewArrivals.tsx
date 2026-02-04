"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollSmoother } from "gsap/ScrollSmoother";

/* ─────────────────────────── types ─────────────────────────── */
interface Product {
  id: number;
  name: string;
  price: string;
  modelImage: string;
  modelVideo: string;
  productImage: string;
}

/* ─────────────────────────── data ──────────────────────────── */
const products: Product[] = [
  {
    id: 1,
    name: "Royal Kitenge Mermaid Gown",
    price: "Ksh 15,000",
    modelImage: "/assets/afro_dress.png",
    modelVideo: "/assets/afro-dress.mp4",
    productImage: "/assets/afro_dress_1.png",
  },
  {
    id: 2,
    name: "Modern Senator Suit (Two-Piece)",
    price: "Ksh 21,000",
    modelImage: "/assets/afro_man.png",
    modelVideo: "/assets/afro_man.mp4",
    productImage: "/assets/afro_man_1.png",
  },
  {
    id: 3,
    name: "Fuchsia Goddess Corset Dress",
    price: "Ksh 10,000",
    modelImage: "/assets/afro_dress2.png",
    modelVideo: "/assets/afro_dress_2.mp4",
    productImage: "/assets/afro_dress_2.png",
  },
  {
    id: 4,
    name: "Traditional Dashiki Set",
    price: "Ksh 12,000",
    modelImage: "/assets/afro_dress.png",
    modelVideo: "/assets/afro-dress.mp4",
    productImage: "/assets/afro_dress_1.png",
  },
  {
    id: 5,
    name: "Ankara Office Wear",
    price: "Ksh 18,000",
    modelImage: "/assets/afro_man.png",
    modelVideo: "/assets/afro_man.mp4",
    productImage: "/assets/afro_man_1.png",
  },
  {
    id: 6,
    name: "Kitenge Evening Dress",
    price: "Ksh 22,000",
    modelImage: "/assets/afro_dress2.png",
    modelVideo: "/assets/afro_dress_2.mp4",
    productImage: "/assets/afro_dress_2.png",
  },
];

/* ────────────────── ProductMedia sub-component ─────────────── */
const MAX_PLAY_MS = 15000; // video auto-stops after 15 s

interface ProductMediaProps {
  image: string;
  video: string;
  alt: string;
  aspectClass: string;
}

function ProductMedia({ image, video, alt, aspectClass }: ProductMediaProps) {
  const [playing, setPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const stop = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    const v = videoRef.current;
    if (v) {
      v.pause();
      v.currentTime = 0;
    }
    setPlaying(false);
  }, []);

  const handleEnter = useCallback(() => {
    const v = videoRef.current;
    if (!v) return;
    v.currentTime = 0;
    v.play().catch(() => {});
    setPlaying(true);
    timerRef.current = setTimeout(stop, MAX_PLAY_MS);
  }, [stop]);

  return (
    <div
      className={`relative w-full ${aspectClass} overflow-hidden cursor-pointer group`}
      onMouseEnter={handleEnter}
      onMouseLeave={stop}
    >
      {/* still image – always present, fades out when video plays */}
      <Image
        src={image}
        alt={alt}
        fill
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        className="object-cover object-top transition-all duration-500 ease-out"
        style={{
          opacity: playing ? 0 : 1,
          transform: playing ? "scale(1.05)" : "scale(1)",
        }}
      />

      {/* video layer – fades in on hover */}
      <video
        ref={videoRef}
        src={video}
        muted
        playsInline
        loop={false}
        preload="metadata"
        className="absolute inset-0 w-full h-full object-cover object-top transition-all duration-500 ease-out"
        style={{
          opacity: playing ? 1 : 0,
          transform: playing ? "scale(1)" : "scale(1.05)",
        }}
      />

      {/* Overlay for extra smoothness */}
      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-all duration-500 ease-out z-10 pointer-events-none" />
    </div>
  );
}

/* ──────────────────── main component ───────────────────────── */
export default function NewArrivals() {
  const [hoveredId, setHoveredId] = useState<number | null>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const horizontalWrapperRef = useRef<HTMLDivElement>(null);
  const horizontalStripRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  // Inline SVG pattern as a separate variable to avoid parsing issues
  const patternSVG = `data:image/svg+xml,%3Csvg width='100' height='100' xmlns='http://www.w3.org/2000/svg'%3E%3Cdefs%3E%3Cpattern id='grid' width='20' height='20' patternUnits='userSpaceOnUse'%3E%3Ccircle cx='10' cy='10' r='0.5' fill='rgba(0,0,0,0.05)'/%3E%3C/pattern%3E%3C/defs%3E%3Crect width='100%25' height='100%25' fill='url(%23grid)'/%3E%3C/svg%3E`;

  useEffect(() => {
    // Register GSAP plugins
    if (typeof window !== "undefined") {
      gsap.registerPlugin(ScrollTrigger, ScrollSmoother);
    }

    // Initialize GSAP context
    const ctx = gsap.context(() => {
      // Horizontal scrolling animation
      if (horizontalWrapperRef.current && horizontalStripRef.current) {
        const pinWrap = horizontalStripRef.current;

        // Function to calculate horizontal scroll length
        const refresh = () => {
          const pinWrapWidth = pinWrap.scrollWidth;
          const horizontalScrollLength = pinWrapWidth - window.innerWidth;
          return { pinWrapWidth, horizontalScrollLength };
        };

        // Initial calculation
        const { pinWrapWidth, horizontalScrollLength } = refresh();

        // Create horizontal scroll animation WITHOUT opacity changes
        gsap.to(pinWrap, {
          x: () => -horizontalScrollLength,
          ease: "none",
          scrollTrigger: {
            trigger: horizontalWrapperRef.current,
            pin: true,
            scrub: 1,
            start: "center center",
            end: () => `+=${pinWrapWidth}`,
            invalidateOnRefresh: true,
            anticipatePin: 1,
          },
        });

        // Refresh on window resize
        ScrollTrigger.addEventListener("refreshInit", refresh);

        // Animate individual cards as they come into view
        cardRefs.current.forEach((card, index) => {
          if (card) {
            gsap.from(card, {
              y: 100,
              opacity: 0,
              rotationY: 20,
              duration: 1,
              delay: index * 0.1,
              ease: "back.out(1.7)",
              scrollTrigger: {
                trigger: card,
                start: "left 90%",
                end: "left 20%",
                toggleActions: "play none none reverse",
              },
            });

            // Hover animation for product images (original behavior)
            const productImage = card.querySelector(".product-image-flat");
            if (productImage) {
              // Initial state for product image
              gsap.set(productImage, {
                y: 20,
                opacity: 0,
                rotate: 5,
                scale: 0.9,
              });

              // Animation for product image on card hover
              const mouseEnter = () => {
                gsap.to(productImage, {
                  y: -5,
                  opacity: 1,
                  rotate: 0,
                  scale: 1.05,
                  duration: 0.5,
                  ease: "power3.out",
                });
              };

              const mouseLeave = () => {
                gsap.to(productImage, {
                  y: 20,
                  opacity: 0,
                  rotate: 5,
                  scale: 0.9,
                  duration: 0.5,
                  ease: "power3.in",
                });
              };

              card.addEventListener("mouseenter", mouseEnter);
              card.addEventListener("mouseleave", mouseLeave);

              // Cleanup event listeners
              return () => {
                card.removeEventListener("mouseenter", mouseEnter);
                card.removeEventListener("mouseleave", mouseLeave);
              };
            }
          }
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="scroll-section new-arrivals-section bg-[#e8e8e8] w-full min-h-screen px-4 sm:px-6 py-8 overflow-hidden relative"
      style={{
        opacity: 0, // Start invisible - will be animated by GSAPProvider
        transform: "translateY(100px)", // Start below - will be animated by GSAPProvider
        marginTop: "-100vh", // Pull up to overlap with Hero section
        position: "relative",
        zIndex: 20,
      }}
    >
      {/* Subtle background pattern for depth */}
      <div
        ref={containerRef}
        className="absolute inset-0 opacity-[0.02] pointer-events-none"
        style={{
          backgroundImage: `url("${patternSVG}")`,
        }}
      />

      {/* Header - Updated with better visibility */}
      <div className="flex items-start justify-between mb-8 max-w-7xl mx-auto relative z-10 px-4 sm:px-6">
        <h2
          className="new-arrivals-header text-black font-black uppercase tracking-tighter leading-none"
          style={{
            fontSize: "clamp(2rem, 5vw, 3.5rem)",
            fontFamily: "'Playfair Display', serif",
            opacity: 0, // Start invisible - will be animated by GSAPProvider
            transform: "translateY(50px)", // Start below - will be animated by GSAPProvider
          }}
        >
          NEW ARRIVALS
        </h2>
        <Link
          href="/products" 
          className="see-all-link flex items-center gap-1 text-black text-sm uppercase tracking-widest hover:opacity-80 transition-all duration-300 ease-out mt-2 group"
          style={{ 
            fontFamily: "'Playfair Display', serif",
            opacity: 0, // Start invisible - will be animated by GSAPProvider
            transform: "translateY(50px)", // Start below - will be animated by GSAPProvider
            textDecoration: "none",
          }}
        >
          <span className="group-hover:translate-x-1 transition-transform duration-300">
            SEE ALL
          </span>
          <span
            className="text-base transition-all duration-300 group-hover:-translate-y-1 group-hover:translate-x-1"
            style={{ transform: "rotate(-45deg)", display: "inline-block" }}
          >
            ↗
          </span>
        </Link>
      </div>

      {/* Horizontal Scrolling Gallery */}
      <div
        ref={horizontalWrapperRef}
        className="horiz-gallery-wrapper w-full h-[70vh] relative overflow-hidden"
      >
        <div
          ref={horizontalStripRef}
          className="horiz-gallery-strip flex items-center h-full will-change-transform py-8"
        >
          {/* Spacer for better centering */}
          <div className="w-[5vw] flex-shrink-0" />

          {/* Product Cards - Original design */}
          {products.map((product, index) => (
            <div
              key={product.id}
              ref={(el) => {
                cardRefs.current[index] = el;
              }}
              className="product-card relative flex flex-col group flex-shrink-0 mx-4"
              style={{ width: "clamp(300px, 30vw, 400px)" }}
              onMouseEnter={() => setHoveredId(product.id)}
              onMouseLeave={() => setHoveredId(null)}
            >
              <div className="relative z-10 flex-1">
                <ProductMedia
                  image={product.modelImage}
                  video={product.modelVideo}
                  alt={product.name}
                  aspectClass="aspect-[3/4]"
                />
                {/* Product flat image with GSAP animation - Original position */}
                <div
                  className="product-image-flat absolute z-20 hidden md:block"
                  style={{
                    top: "20%",
                    right: "-5%",
                    width: "clamp(80px, 15vw, 120px)",
                    height: "clamp(120px, 20vw, 180px)",
                  }}
                >
                  <div className="relative w-full h-full">
                    <Image
                      src={product.productImage}
                      alt={`${product.name} flat`}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover shadow-lg bg-gray-50 transition-all duration-500"
                    />
                  </div>
                </div>
              </div>

              <div className="relative z-10 mt-4">
                <p
                  className="text-black text-lg font-medium tracking-wide transition-all duration-300 group-hover:translate-x-1"
                  style={{ fontFamily: "'Playfair Display', serif" }}
                >
                  {product.price}
                </p>
                <p
                  className="text-black text-sm uppercase tracking-widest mt-1 font-medium transition-all duration-300 group-hover:translate-x-1 line-clamp-2"
                  style={{ fontFamily: "'Playfair Display', serif" }}
                >
                  {product.name}
                </p>
              </div>
            </div>
          ))}

          {/* End spacer */}
          <div className="w-[5vw] flex-shrink-0" />
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10 flex items-center gap-3 text-black/50 text-xs uppercase tracking-widest">
        <svg
          className="w-4 h-4 animate-pulse"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M7 16l-4-4m0 0l4-4m-4 4h18"
          />
        </svg>
        <span>SCROLL TO NAVIGATE</span>
        <svg
          className="w-4 h-4 animate-pulse"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M17 8l4 4m0 0l-4 4m4-4H3"
          />
        </svg>
      </div>
    </section>
  );
}