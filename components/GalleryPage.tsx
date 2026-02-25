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

const GalleryPage = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [galleryItems, setGalleryItems] = useState<any[]>([]);

  useEffect(() => {
    // Get all image files from the directory (based on your ls output)
    const imageFiles = [
      // Series 1: Earth Tones / Studio (warm, neutral backgrounds)
      {
        file: "1000317885.jpg",
        theme: "Earth",
        series: "Terrain",
        mood: "warm",
      },
      {
        file: "1000317888.jpg",
        theme: "Earth",
        series: "Terrain",
        mood: "warm",
      },
      {
        file: "1000317894.jpg",
        theme: "Earth",
        series: "Terrain",
        mood: "warm",
      },
      {
        file: "1000317924.jpg",
        theme: "Earth",
        series: "Terrain",
        mood: "warm",
      },
      {
        file: "1000317943.jpg",
        theme: "Earth",
        series: "Terrain",
        mood: "warm",
      },
      {
        file: "1000317945.jpg",
        theme: "Earth",
        series: "Terrain",
        mood: "warm",
      },

      // Series 2: Urban / Architectural (cool tones, structured)
      {
        file: "1000317966.jpg",
        theme: "Urban",
        series: "Architecture",
        mood: "cool",
      },
      {
        file: "1000317968.jpg",
        theme: "Urban",
        series: "Architecture",
        mood: "cool",
      },
      {
        file: "1000317970.jpg",
        theme: "Urban",
        series: "Architecture",
        mood: "cool",
      },
      {
        file: "1000317972.jpg",
        theme: "Urban",
        series: "Architecture",
        mood: "cool",
      },
      {
        file: "1000317974.jpg",
        theme: "Urban",
        series: "Architecture",
        mood: "cool",
      },
      {
        file: "1000317976.jpg",
        theme: "Urban",
        series: "Architecture",
        mood: "cool",
      },
      {
        file: "1000317978.jpg",
        theme: "Urban",
        series: "Architecture",
        mood: "cool",
      },
      {
        file: "1000317982.jpg",
        theme: "Urban",
        series: "Architecture",
        mood: "cool",
      },
      {
        file: "1000317987.jpg",
        theme: "Urban",
        series: "Architecture",
        mood: "cool",
      },

      // Series 3: Green / Natural (these appear to have green backgrounds from your screenshots)
      {
        file: "IMG-20260225-WA0012.jpg",
        theme: "Verdant",
        series: "Botanical",
        mood: "natural",
      },
      {
        file: "IMG-20260225-WA0013.jpg",
        theme: "Verdant",
        series: "Botanical",
        mood: "natural",
      },
      {
        file: "IMG-20260225-WA0014.jpg",
        theme: "Verdant",
        series: "Botanical",
        mood: "natural",
      },
      {
        file: "IMG-20260225-WA0015.jpg",
        theme: "Verdant",
        series: "Botanical",
        mood: "natural",
      },
      {
        file: "IMG-20260225-WA0016.jpg",
        theme: "Verdant",
        series: "Botanical",
        mood: "natural",
      },
      {
        file: "IMG-20260225-WA0017.jpg",
        theme: "Verdant",
        series: "Botanical",
        mood: "natural",
      },
      {
        file: "IMG-20260225-WA0018.jpg",
        theme: "Verdant",
        series: "Botanical",
        mood: "natural",
      },
      {
        file: "IMG-20260225-WA0019.jpg",
        theme: "Verdant",
        series: "Botanical",
        mood: "natural",
      },
      {
        file: "IMG-20260225-WA0020.jpg",
        theme: "Verdant",
        series: "Botanical",
        mood: "natural",
      },
      {
        file: "IMG-20260225-WA0021.jpg",
        theme: "Verdant",
        series: "Botanical",
        mood: "natural",
      },
      {
        file: "IMG-20260225-WA0022.jpg",
        theme: "Verdant",
        series: "Botanical",
        mood: "natural",
      },
      {
        file: "IMG-20260225-WA0023.jpg",
        theme: "Verdant",
        series: "Botanical",
        mood: "natural",
      },
      {
        file: "IMG-20260225-WA0024.jpg",
        theme: "Verdant",
        series: "Botanical",
        mood: "natural",
      },
      {
        file: "IMG-20260225-WA0028.jpg",
        theme: "Verdant",
        series: "Botanical",
        mood: "natural",
      },
      {
        file: "IMG-20260225-WA0029.jpg",
        theme: "Verdant",
        series: "Botanical",
        mood: "natural",
      },
      {
        file: "IMG-20260225-WA0034.jpg",
        theme: "Verdant",
        series: "Botanical",
        mood: "natural",
      },
      {
        file: "IMG-20260225-WA0035.jpg",
        theme: "Verdant",
        series: "Botanical",
        mood: "natural",
      },
      {
        file: "IMG-20260225-WA0037.jpg",
        theme: "Verdant",
        series: "Botanical",
        mood: "natural",
      },
      {
        file: "IMG-20260225-WA0038.jpg",
        theme: "Verdant",
        series: "Botanical",
        mood: "natural",
      },
      {
        file: "IMG-20260225-WA0039.jpg",
        theme: "Verdant",
        series: "Botanical",
        mood: "natural",
      },
      {
        file: "IMG-20260225-WA0040.jpg",
        theme: "Verdant",
        series: "Botanical",
        mood: "natural",
      },
      {
        file: "IMG-20260225-WA0041.jpg",
        theme: "Verdant",
        series: "Botanical",
        mood: "natural",
      },
      {
        file: "IMG-20260225-WA0043.jpg",
        theme: "Verdant",
        series: "Botanical",
        mood: "natural",
      },
      {
        file: "IMG-20260225-WA0044.jpg",
        theme: "Verdant",
        series: "Botanical",
        mood: "natural",
      },

      // Series 4: Golden Hour / Warm Tones
      {
        file: "IMG-20260225-WA0059.jpg",
        theme: "Amber",
        series: "Golden Hour",
        mood: "warm",
      },
      {
        file: "IMG-20260225-WA0060.jpg",
        theme: "Amber",
        series: "Golden Hour",
        mood: "warm",
      },
      {
        file: "IMG-20260225-WA0068.jpg",
        theme: "Amber",
        series: "Golden Hour",
        mood: "warm",
      },
      {
        file: "IMG-20260225-WA0069.jpg",
        theme: "Amber",
        series: "Golden Hour",
        mood: "warm",
      },
    ];

    // Arrange in a visually interesting pattern (alternating themes)
    const arrangedImages = [
      // Start with a strong opening - use Verdant (green) as it's striking
      ...imageFiles.filter((f) => f.theme === "Verdant").slice(0, 3),

      // Intersperse with Earth tones
      ...imageFiles.filter((f) => f.theme === "Earth").slice(0, 2),

      // More Verdant
      ...imageFiles.filter((f) => f.theme === "Verdant").slice(3, 6),

      // Urban break
      ...imageFiles.filter((f) => f.theme === "Urban").slice(0, 3),

      // Back to Verdant
      ...imageFiles.filter((f) => f.theme === "Verdant").slice(6, 10),

      // Golden Hour accent
      ...imageFiles.filter((f) => f.theme === "Amber").slice(0, 2),

      // Continue with pattern
      ...imageFiles.filter((f) => f.theme === "Earth").slice(2, 5),
      ...imageFiles.filter((f) => f.theme === "Verdant").slice(10, 15),
      ...imageFiles.filter((f) => f.theme === "Urban").slice(3, 7),
      ...imageFiles.filter((f) => f.theme === "Verdant").slice(15, 20),
      ...imageFiles.filter((f) => f.theme === "Amber").slice(2, 4),
      ...imageFiles.filter((f) => f.theme === "Earth").slice(5, 8),
      ...imageFiles.filter((f) => f.theme === "Urban").slice(7, 10),
      ...imageFiles.filter((f) => f.theme === "Verdant").slice(20),
    ];

    // Format for the gallery
    const formatted = arrangedImages
      .filter((item) => item) // Remove any undefined
      .map((item, index) => ({
        _id: `gallery-${index}`,
        title: `${item.theme} ${item.series}`,
        imageSrc: `/assets/gallery/${item.file}`,
        theme: item.theme,
        series: item.series,
        mood: item.mood,
        // Add aspect ratio hints for masonry (can be customized per image)
        aspectRatio:
          index % 5 === 0
            ? "portrait"
            : index % 7 === 0
              ? "panoramic"
              : "square",
      }));

    setGalleryItems(formatted);
  }, []);

  useEffect(() => {
    if (galleryItems.length === 0) return;

    const ctx = gsap.context(() => {
      // Initial fade-in with staggered reveal based on theme
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
        stagger: {
          amount: 2,
          from: "random",
        },
        ease: "power3.out",
      });

      // Parallax effect on scroll for each image
      gsap.utils.toArray<HTMLElement>(".gallery-item").forEach((item, i) => {
        const img = item.querySelector("img");
        if (img) {
          gsap.fromTo(
            img,
            { y: 0 },
            {
              y: -50,
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
  }, [galleryItems]);

  return (
    <main
      ref={containerRef}
      className="min-h-screen bg-[#F8F8F8] pt-32 pb-20 px-4 md:px-12 mt-2"
    >
      <GalleryHeader />

      {/* Themed Masonry Grid with artistic arrangement */}
      <section className="relative z-10 max-w-[2000px] mx-auto">
        <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-6 space-y-6">
          {galleryItems.map((item, index) => (
            <div
              key={item._id}
              className="gallery-item-wrapper break-inside-avoid"
            >
              {/* Add different sizes based on theme for visual interest */}
              <div
                className={`
                ${item.theme === "Verdant" ? "transform hover:scale-[1.02] transition-transform duration-700" : ""}
                ${item.theme === "Amber" ? "border-2 border-amber-200/20 p-1 bg-amber-50/10" : ""}
                ${item.theme === "Urban" ? "grayscale hover:grayscale-0 transition-all duration-1000" : ""}
                ${item.theme === "Earth" ? "sepia hover:sepia-0 transition-all duration-1000" : ""}
              `}
              >
                <GalleryItem item={item} index={index} />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Add a thematic divider */}
      <section className="max-w-[1800px] mx-auto py-32 px-6 md:px-12">
        <div className="border-t border-neutral-200 pt-24 text-center quote-content">
          <p className="text-[10px] tracking-[0.6em] text-neutral-400 mb-8 uppercase font-medium">
            The DMA Philosophy
          </p>

          <h2 className="text-3xl md:text-5xl lg:text-6xl font-extralight tracking-tight leading-[1.1] text-neutral-900 max-w-5xl mx-auto italic">
            "Cherish where you come from and <br className="hidden md:block" />
            you'll cherish everywhere you go"
          </h2>

          <div className="mt-12 flex flex-col items-center gap-4">
            <span className="h-px w-12 bg-[#B62025]" />{" "}
            {/* Maasai Red Accent */}
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
