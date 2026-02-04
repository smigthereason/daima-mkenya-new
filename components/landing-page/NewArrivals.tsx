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
    name: "NATIONAL PRIDE STRIPED SHIRT",
    price: "Ksh 5,800",
    modelImage: "/assets/14.jpg",
    modelVideo: "/assets/afro_dress_2.mp4",
    productImage: "/assets/14.142.png",
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

      {/* Header - Always at the top */}
      <div className="absolute top-0 left-0 right-0 z-50 px-4 sm:px-6 py-6">
        <h2
          className="new-arrivals-header text-black font-black uppercase tracking-tighter leading-none text-center"
          style={{
            fontSize: "clamp(2rem, 5vw, 3.5rem)",
            fontFamily: "'Playfair Display', serif",
            opacity: 0, // Start invisible - will be animated by GSAPProvider
            transform: "translateY(50px)", // Start below - will be animated by GSAPProvider
          }}
        >
          NEW ARRIVALS
        </h2>
      </div>

      {/* Horizontal Scrolling Gallery */}
      <div
        ref={horizontalWrapperRef}
        className="horiz-gallery-wrapper w-full h-[70vh] relative overflow-hidden mt-20"
      >
        <div
          ref={horizontalStripRef}
          className="horiz-gallery-strip flex items-center h-full will-change-transform py-8"
        >
          {/* Spacer for better centering */}
          <div className="w-[5vw] flex-shrink-0" />

          {/* Product Cards */}
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

      {/* SEE ALL Button - Always accessible at bottom center */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-50">
        <Link
          href="/products" 
          className="see-all-button flex items-center gap-3 text-black hover:opacity-80 transition-all duration-300 ease-out group px-6 py-3 bg-white/90 backdrop-blur-sm rounded-full shadow-lg"
          style={{ 
            fontFamily: "'Playfair Display', serif",
            textDecoration: "none",
          }}
        >
          <span className="text-sm uppercase tracking-widest group-hover:translate-x-1 transition-transform duration-300">
            SEE ALL PRODUCTS
          </span>
          <span
            className="text-xl transition-all duration-300 group-hover:-translate-y-1 group-hover:translate-x-1"
            style={{ transform: "rotate(-45deg)", display: "inline-block" }}
          >
            ↗
          </span>
        </Link>
      </div>
    </section>
  );
}