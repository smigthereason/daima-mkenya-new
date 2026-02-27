/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Sub-components
import GalleryHeader from "./gallery/GalleryHeader";
import GalleryItem from "./gallery/GalleryItem";
import EditorialSection from "./gallery/EditorialSection";

gsap.registerPlugin(ScrollTrigger);

// Define gallery image structure
interface GalleryImage {
  id: string;
  src: string;
  theme: "Earth" | "Urban" | "Verdant" | "Amber";
  series: string;
  aspectRatio: "portrait" | "panoramic" | "square";
  priority?: boolean;
  unoptimized?: boolean;
}

const GalleryPage = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [galleryItems, setGalleryItems] = useState<GalleryImage[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Dynamic gallery image configuration - ALL DUPLICATES REMOVED
    // Each image appears only once across ALL themes
    const galleryImages: GalleryImage[] = [
      // Earth Theme Images (Terrain) - 6 unique images
      {
        id: "earth-1",
        src: "/assets/Gallery/1000317885.jpg",
        theme: "Earth",
        series: "Terrain",
        aspectRatio: "square",
        priority: true,
        unoptimized: true,
      },
      {
        id: "earth-2",
        src: "/assets/Gallery/1000317888.jpg",
        theme: "Earth",
        series: "Terrain",
        aspectRatio: "square",
        priority: true,
        unoptimized: true,
      },
      {
        id: "earth-3",
        src: "/assets/Gallery/1000317894.jpg",
        theme: "Earth",
        series: "Terrain",
        aspectRatio: "portrait",
        priority: true,
        unoptimized: true,
      },
      {
        id: "earth-4",
        src: "/assets/Gallery/1000317924.jpg",
        theme: "Earth",
        series: "Terrain",
        aspectRatio: "square",
        priority: true,
        unoptimized: true,
      },
      {
        id: "earth-5",
        src: "/assets/Gallery/1000317943.jpg",
        theme: "Earth",
        series: "Terrain",
        aspectRatio: "panoramic",
        priority: true,
        unoptimized: true,
      },
      {
        id: "earth-6",
        src: "/assets/Gallery/1000317945.jpg",
        theme: "Earth",
        series: "Terrain",
        aspectRatio: "square",
        priority: true,
        unoptimized: true,
      },

      // Urban Theme Images (Architecture) - 9 unique images (no duplicates with other themes)
      {
        id: "urban-1",
        src: "/assets/Gallery/1000317966.jpg",
        theme: "Urban",
        series: "Architecture",
        aspectRatio: "square",
        unoptimized: true,
      },
      {
        id: "urban-2",
        src: "/assets/Gallery/1000317968.jpg",
        theme: "Urban",
        series: "Architecture",
        aspectRatio: "portrait",
        unoptimized: true,
      },
      {
        id: "urban-3",
        src: "/assets/Gallery/1000317970.jpg",
        theme: "Urban",
        series: "Architecture",
        aspectRatio: "square",
        unoptimized: true,
      },
      {
        id: "urban-4",
        src: "/assets/Gallery/1000317972.jpg",
        theme: "Urban",
        series: "Architecture",
        aspectRatio: "square",
        unoptimized: true,
      },
      {
        id: "urban-5",
        src: "/assets/Gallery/1000317974.jpg",
        theme: "Urban",
        series: "Architecture",
        aspectRatio: "panoramic",
        unoptimized: true,
      },
      {
        id: "urban-6",
        src: "/assets/Gallery/1000317976.jpg",
        theme: "Urban",
        series: "Architecture",
        aspectRatio: "square",
        unoptimized: true,
      },
      {
        id: "urban-7",
        src: "/assets/Gallery/1000317978.jpg",
        theme: "Urban",
        series: "Architecture",
        aspectRatio: "portrait",
        unoptimized: true,
      },
      {
        id: "urban-8",
        src: "/assets/Gallery/1000317982.jpg",
        theme: "Urban",
        series: "Architecture",
        aspectRatio: "square",
        unoptimized: true,
      },
      {
        id: "urban-9",
        src: "/assets/Gallery/1000317987.jpg",
        theme: "Urban",
        series: "Architecture",
        aspectRatio: "square",
        unoptimized: true,
      },

      // Verdant Theme Images (Botanical) - Only unique images that don't appear elsewhere
      // These are all WA files that are distinct from the Urban/1000 series
      {
        id: "verdant-1",
        src: "/assets/Gallery/IMG-20260225-WA0012.jpg",
        theme: "Verdant",
        series: "Botanical",
        aspectRatio: "portrait",
        unoptimized: true,
      },
      {
        id: "verdant-2",
        src: "/assets/Gallery/IMG-20260225-WA0013.jpg",
        theme: "Verdant",
        series: "Botanical",
        aspectRatio: "square",
        unoptimized: true,
      },
      {
        id: "verdant-3",
        src: "/assets/Gallery/IMG-20260225-WA0014.jpg",
        theme: "Verdant",
        series: "Botanical",
        aspectRatio: "square",
        unoptimized: true,
      },
      {
        id: "verdant-4",
        src: "/assets/Gallery/IMG-20260225-WA0015.jpg",
        theme: "Verdant",
        series: "Botanical",
        aspectRatio: "panoramic",
        unoptimized: true,
      },
      {
        id: "verdant-5",
        src: "/assets/Gallery/IMG-20260225-WA0016.jpg",
        theme: "Verdant",
        series: "Botanical",
        aspectRatio: "square",
        unoptimized: true,
      },
      {
        id: "verdant-6",
        src: "/assets/Gallery/IMG-20260225-WA0017.jpg",
        theme: "Verdant",
        series: "Botanical",
        aspectRatio: "portrait",
        unoptimized: true,
      },
      {
        id: "verdant-7",
        src: "/assets/Gallery/IMG-20260225-WA0018.jpg",
        theme: "Verdant",
        series: "Botanical",
        aspectRatio: "square",
        unoptimized: true,
      },
      {
        id: "verdant-8",
        src: "/assets/Gallery/IMG-20260225-WA0019.jpg",
        theme: "Verdant",
        series: "Botanical",
        aspectRatio: "square",
        unoptimized: true,
      },
      {
        id: "verdant-9",
        src: "/assets/Gallery/IMG-20260225-WA0020.jpg",
        theme: "Verdant",
        series: "Botanical",
        aspectRatio: "portrait",
        unoptimized: true,
      },
      {
        id: "verdant-10",
        src: "/assets/Gallery/IMG-20260225-WA0021.jpg",
        theme: "Verdant",
        series: "Botanical",
        aspectRatio: "square",
        unoptimized: true,
      },
      {
        id: "verdant-11",
        src: "/assets/Gallery/IMG-20260225-WA0022.jpg",
        theme: "Verdant",
        series: "Botanical",
        aspectRatio: "square",
        unoptimized: true,
      },
      {
        id: "verdant-12",
        src: "/assets/Gallery/IMG-20260225-WA0023.jpg",
        theme: "Verdant",
        series: "Botanical",
        aspectRatio: "panoramic",
        unoptimized: true,
      },
      {
        id: "verdant-13",
        src: "/assets/Gallery/IMG-20260225-WA0024.jpg",
        theme: "Verdant",
        series: "Botanical",
        aspectRatio: "square",
        unoptimized: true,
      },
      {
        id: "verdant-14",
        src: "/assets/Gallery/IMG-20260225-WA0028.jpg",
        theme: "Verdant",
        series: "Botanical",
        aspectRatio: "portrait",
        unoptimized: true,
      },
      {
        id: "verdant-15",
        src: "/assets/Gallery/IMG-20260225-WA0029.jpg",
        theme: "Verdant",
        series: "Botanical",
        aspectRatio: "square",
        unoptimized: true,
      },
      {
        id: "verdant-16",
        src: "/assets/Gallery/IMG-20260225-WA0034.jpg",
        theme: "Verdant",
        series: "Botanical",
        aspectRatio: "square",
        unoptimized: true,
      },
      {
        id: "verdant-17",
        src: "/assets/Gallery/IMG-20260225-WA0035.jpg",
        theme: "Verdant",
        series: "Botanical",
        aspectRatio: "portrait",
        unoptimized: true,
      },
      {
        id: "verdant-18",
        src: "/assets/Gallery/IMG-20260225-WA0037.jpg",
        theme: "Verdant",
        series: "Botanical",
        aspectRatio: "square",
        unoptimized: true,
      },
      {
        id: "verdant-19",
        src: "/assets/Gallery/IMG-20260225-WA0038.jpg",
        theme: "Verdant",
        series: "Botanical",
        aspectRatio: "panoramic",
        unoptimized: true,
      },
      {
        id: "verdant-20",
        src: "/assets/Gallery/IMG-20260225-WA0039.jpg",
        theme: "Verdant",
        series: "Botanical",
        aspectRatio: "square",
        unoptimized: true,
      },
      {
        id: "verdant-21",
        src: "/assets/Gallery/IMG-20260225-WA0040.jpg",
        theme: "Verdant",
        series: "Botanical",
        aspectRatio: "square",
        unoptimized: true,
      },
      {
        id: "verdant-22",
        src: "/assets/Gallery/IMG-20260225-WA0041.jpg",
        theme: "Verdant",
        series: "Botanical",
        aspectRatio: "portrait",
        unoptimized: true,
      },
      {
        id: "verdant-23",
        src: "/assets/Gallery/IMG-20260225-WA0043.jpg",
        theme: "Verdant",
        series: "Botanical",
        aspectRatio: "square",
        unoptimized: true,
      },
      {
        id: "verdant-24",
        src: "/assets/Gallery/IMG-20260225-WA0044.jpg",
        theme: "Verdant",
        series: "Botanical",
        aspectRatio: "square",
        unoptimized: true,
      },

      // Amber Theme Images (Golden Hour) - 4 unique images
      {
        id: "amber-1",
        src: "/assets/Gallery/IMG-20260225-WA0059.jpg",
        theme: "Amber",
        series: "Golden Hour",
        aspectRatio: "portrait",
        unoptimized: true,
      },
      {
        id: "amber-2",
        src: "/assets/Gallery/IMG-20260225-WA0060.jpg",
        theme: "Amber",
        series: "Golden Hour",
        aspectRatio: "square",
        unoptimized: true,
      },
      {
        id: "amber-3",
        src: "/assets/Gallery/IMG-20260225-WA0068.jpg",
        theme: "Amber",
        series: "Golden Hour",
        aspectRatio: "panoramic",
        unoptimized: true,
      },
      {
        id: "amber-4",
        src: "/assets/Gallery/IMG-20260225-WA0069.jpg",
        theme: "Amber",
        series: "Golden Hour",
        aspectRatio: "square",
        unoptimized: true,
      },
    ];

    // Verify no duplicates by creating a Set of src values
    const uniqueSrcs = new Set(galleryImages.map((img) => img.src));
    if (uniqueSrcs.size !== galleryImages.length) {
      console.warn("Duplicate images detected!", {
        total: galleryImages.length,
        unique: uniqueSrcs.size,
        duplicates: galleryImages.length - uniqueSrcs.size,
      });
    } else {
      console.log(`Gallery loaded with ${galleryImages.length} unique images`);
    }

    // Arrange images in the desired pattern
    const arrangedImages = arrangeGalleryPattern(galleryImages);
    setGalleryItems(arrangedImages);
    setIsLoading(false);
  }, []);

  // Function to arrange images in the specific pattern
  const arrangeGalleryPattern = (images: GalleryImage[]): GalleryImage[] => {
    const earthImages = images.filter((img) => img.theme === "Earth");
    const urbanImages = images.filter((img) => img.theme === "Urban");
    const verdantImages = images.filter((img) => img.theme === "Verdant");
    const amberImages = images.filter((img) => img.theme === "Amber");

    const arranged: GalleryImage[] = [];

    // Mix pattern for visual variety
    if (verdantImages.length >= 3) arranged.push(...verdantImages.slice(0, 3));
    if (earthImages.length >= 2) arranged.push(...earthImages.slice(0, 2));
    if (verdantImages.length >= 6) arranged.push(...verdantImages.slice(3, 6));
    if (urbanImages.length >= 3) arranged.push(...urbanImages.slice(0, 3));
    if (verdantImages.length >= 10)
      arranged.push(...verdantImages.slice(6, 10));
    if (amberImages.length >= 2) arranged.push(...amberImages.slice(0, 2));

    // Add remaining images
    const remainingVerdant = verdantImages.slice(10);
    const remainingEarth = earthImages.slice(2);
    const remainingUrban = urbanImages.slice(3);
    const remainingAmber = amberImages.slice(2);

    return [
      ...arranged,
      ...remainingVerdant,
      ...remainingEarth,
      ...remainingUrban,
      ...remainingAmber,
    ];
  };

  useEffect(() => {
    if (galleryItems.length === 0 || isLoading) return;

    // Small delay to ensure DOM is ready
    const timer = setTimeout(() => {
      const ctx = gsap.context(() => {
        gsap.from(".gallery-item", {
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 80%",
            toggleActions: "play none none reverse",
          },
          y: 100,
          opacity: 0,
          rotation: 2,
          duration: 1.5,
          stagger: { amount: 2, from: "random" },
          ease: "power3.out",
        });

        gsap.utils.toArray<HTMLElement>(".gallery-item").forEach((item) => {
          const img = item.querySelector("img");
          if (img) {
            gsap.fromTo(
              img,
              { y: 0 },
              {
                y: -40,
                ease: "none",
                scrollTrigger: {
                  trigger: item,
                  start: "top bottom",
                  end: "bottom top",
                  scrub: 1.5,
                },
              },
            );
          }
        });
      });

      return () => ctx.revert();
    }, 100);

    return () => clearTimeout(timer);
  }, [galleryItems, isLoading]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F8F8F8] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#B62025] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-neutral-600">Loading gallery...</p>
        </div>
      </div>
    );
  }

  return (
    <main
      ref={containerRef}
      className="min-h-screen bg-[#F8F8F8] pt-32 pb-20 px-4 md:px-12 mt-2"
    >
      <GalleryHeader />

      <section className="relative z-10 max-w-[2000px] mx-auto">
        <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-6 space-y-6">
          {galleryItems.map((item, index) => (
            <div
              key={item.id}
              className="gallery-item-wrapper break-inside-avoid"
            >
              {/* NO THEME OVERLAYS - NO FILTERS - ONLY SCALE HOVER ANIMATION */}
              <GalleryItem
                item={{
                  _id: item.id,
                  title: `${item.theme} ${item.series}`,
                  imageSrc: item.src,
                  theme: item.theme,
                  series: item.series,
                  aspectRatio: item.aspectRatio,
                  priority: item.priority,
                  unoptimized: item.unoptimized,
                }}
                index={index}
              />
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-[1800px] mx-auto py-32 px-6 md:px-12">
        <div className="border-t border-neutral-200 pt-24 text-center quote-content">
          <p className="text-[10px] tracking-[0.6em] text-neutral-400 mb-8 uppercase font-medium">
            The DMA Philosophy
          </p>
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-extralight tracking-tight leading-[1.1] text-neutral-900 max-w-5xl mx-auto italic">
            "Embrace your journey and <br className="hidden md:block" /> find
            beauty in where you are going"
          </h2>
          <div className="mt-12 flex flex-col items-center gap-4">
            <span className="h-px w-12 bg-[#B62025]" />
            <p className="text-[11px] tracking-[0.4em] text-neutral-500 uppercase font-bold">
              DMA Africa
            </p>
          </div>
        </div>
      </section>

      <EditorialSection />
    </main>
  );
};

export default GalleryPage;
