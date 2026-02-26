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
  theme: 'Earth' | 'Urban' | 'Verdant' | 'Amber';
  series: string;
  aspectRatio: 'portrait' | 'panoramic' | 'square';
}

const GalleryPage = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [galleryItems, setGalleryItems] = useState<GalleryImage[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Dynamic gallery image configuration
    // This approach uses public URLs instead of static imports
    const galleryImages: GalleryImage[] = [
      // Earth Theme Images (Terrain)
      { id: 'earth-1', src: '/assets/gallery/1000317885.webp', theme: 'Earth', series: 'Terrain', aspectRatio: 'square' },
      { id: 'earth-2', src: '/assets/gallery/1000317888.webp', theme: 'Earth', series: 'Terrain', aspectRatio: 'square' },
      { id: 'earth-3', src: '/assets/gallery/1000317894.webp', theme: 'Earth', series: 'Terrain', aspectRatio: 'portrait' },
      { id: 'earth-4', src: '/assets/gallery/1000317924.webp', theme: 'Earth', series: 'Terrain', aspectRatio: 'square' },
      { id: 'earth-5', src: '/assets/gallery/1000317943.webp', theme: 'Earth', series: 'Terrain', aspectRatio: 'panoramic' },
      { id: 'earth-6', src: '/assets/gallery/1000317945.webp', theme: 'Earth', series: 'Terrain', aspectRatio: 'square' },
      
      // Urban Theme Images (Architecture)
      { id: 'urban-1', src: '/assets/gallery/1000317966.webp', theme: 'Urban', series: 'Architecture', aspectRatio: 'square' },
      { id: 'urban-2', src: '/assets/gallery/1000317968.webp', theme: 'Urban', series: 'Architecture', aspectRatio: 'portrait' },
      { id: 'urban-3', src: '/assets/gallery/1000317970.webp', theme: 'Urban', series: 'Architecture', aspectRatio: 'square' },
      { id: 'urban-4', src: '/assets/gallery/1000317972.webp', theme: 'Urban', series: 'Architecture', aspectRatio: 'square' },
      { id: 'urban-5', src: '/assets/gallery/1000317974.webp', theme: 'Urban', series: 'Architecture', aspectRatio: 'panoramic' },
      { id: 'urban-6', src: '/assets/gallery/1000317976.webp', theme: 'Urban', series: 'Architecture', aspectRatio: 'square' },
      { id: 'urban-7', src: '/assets/gallery/1000317978.webp', theme: 'Urban', series: 'Architecture', aspectRatio: 'portrait' },
      { id: 'urban-8', src: '/assets/gallery/1000317982.webp', theme: 'Urban', series: 'Architecture', aspectRatio: 'square' },
      { id: 'urban-9', src: '/assets/gallery/1000317987.webp', theme: 'Urban', series: 'Architecture', aspectRatio: 'square' },
      
      // Verdant Theme Images (Botanical)
      { id: 'verdant-1', src: '/assets/gallery/IMG-20260225-WA0012.webp', theme: 'Verdant', series: 'Botanical', aspectRatio: 'portrait' },
      { id: 'verdant-2', src: '/assets/gallery/IMG-20260225-WA0013.webp', theme: 'Verdant', series: 'Botanical', aspectRatio: 'square' },
      { id: 'verdant-3', src: '/assets/gallery/IMG-20260225-WA0014.webp', theme: 'Verdant', series: 'Botanical', aspectRatio: 'square' },
      { id: 'verdant-4', src: '/assets/gallery/IMG-20260225-WA0015.webp', theme: 'Verdant', series: 'Botanical', aspectRatio: 'panoramic' },
      { id: 'verdant-5', src: '/assets/gallery/IMG-20260225-WA0016.webp', theme: 'Verdant', series: 'Botanical', aspectRatio: 'square' },
      { id: 'verdant-6', src: '/assets/gallery/IMG-20260225-WA0017.webp', theme: 'Verdant', series: 'Botanical', aspectRatio: 'portrait' },
      { id: 'verdant-7', src: '/assets/gallery/IMG-20260225-WA0018.webp', theme: 'Verdant', series: 'Botanical', aspectRatio: 'square' },
      { id: 'verdant-8', src: '/assets/gallery/IMG-20260225-WA0019.webp', theme: 'Verdant', series: 'Botanical', aspectRatio: 'square' },
      { id: 'verdant-9', src: '/assets/gallery/IMG-20260225-WA0020.webp', theme: 'Verdant', series: 'Botanical', aspectRatio: 'portrait' },
      { id: 'verdant-10', src: '/assets/gallery/IMG-20260225-WA0021.webp', theme: 'Verdant', series: 'Botanical', aspectRatio: 'square' },
      { id: 'verdant-11', src: '/assets/gallery/IMG-20260225-WA0022.webp', theme: 'Verdant', series: 'Botanical', aspectRatio: 'square' },
      { id: 'verdant-12', src: '/assets/gallery/IMG-20260225-WA0023.webp', theme: 'Verdant', series: 'Botanical', aspectRatio: 'panoramic' },
      { id: 'verdant-13', src: '/assets/gallery/IMG-20260225-WA0024.webp', theme: 'Verdant', series: 'Botanical', aspectRatio: 'square' },
      { id: 'verdant-14', src: '/assets/gallery/IMG-20260225-WA0028.webp', theme: 'Verdant', series: 'Botanical', aspectRatio: 'portrait' },
      { id: 'verdant-15', src: '/assets/gallery/IMG-20260225-WA0029.webp', theme: 'Verdant', series: 'Botanical', aspectRatio: 'square' },
      { id: 'verdant-16', src: '/assets/gallery/IMG-20260225-WA0034.webp', theme: 'Verdant', series: 'Botanical', aspectRatio: 'square' },
      { id: 'verdant-17', src: '/assets/gallery/IMG-20260225-WA0035.webp', theme: 'Verdant', series: 'Botanical', aspectRatio: 'portrait' },
      { id: 'verdant-18', src: '/assets/gallery/IMG-20260225-WA0037.webp', theme: 'Verdant', series: 'Botanical', aspectRatio: 'square' },
      { id: 'verdant-19', src: '/assets/gallery/IMG-20260225-WA0038.webp', theme: 'Verdant', series: 'Botanical', aspectRatio: 'panoramic' },
      { id: 'verdant-20', src: '/assets/gallery/IMG-20260225-WA0039.webp', theme: 'Verdant', series: 'Botanical', aspectRatio: 'square' },
      { id: 'verdant-21', src: '/assets/gallery/IMG-20260225-WA0040.webp', theme: 'Verdant', series: 'Botanical', aspectRatio: 'square' },
      { id: 'verdant-22', src: '/assets/gallery/IMG-20260225-WA0041.webp', theme: 'Verdant', series: 'Botanical', aspectRatio: 'portrait' },
      { id: 'verdant-23', src: '/assets/gallery/IMG-20260225-WA0043.webp', theme: 'Verdant', series: 'Botanical', aspectRatio: 'square' },
      { id: 'verdant-24', src: '/assets/gallery/IMG-20260225-WA0044.webp', theme: 'Verdant', series: 'Botanical', aspectRatio: 'square' },
      
      // Amber Theme Images (Golden Hour)
      { id: 'amber-1', src: '/assets/gallery/IMG-20260225-WA0059.webp', theme: 'Amber', series: 'Golden Hour', aspectRatio: 'portrait' },
      { id: 'amber-2', src: '/assets/gallery/IMG-20260225-WA0060.webp', theme: 'Amber', series: 'Golden Hour', aspectRatio: 'square' },
      { id: 'amber-3', src: '/assets/gallery/IMG-20260225-WA0068.webp', theme: 'Amber', series: 'Golden Hour', aspectRatio: 'panoramic' },
      { id: 'amber-4', src: '/assets/gallery/IMG-20260225-WA0069.webp', theme: 'Amber', series: 'Golden Hour', aspectRatio: 'square' },
    ];

    // Function to check if image exists and filter out broken ones
    const validateImages = async () => {
      const validatedImages: GalleryImage[] = [];
      
      for (const image of galleryImages) {
        try {
          // Attempt to load the image to check if it exists
          const img = new Image();
          await new Promise((resolve, reject) => {
            img.onload = resolve;
            img.onerror = reject;
            img.src = image.src;
          });
          validatedImages.push(image);
        } catch (error) {
          console.warn(`Image not found: ${image.src}`);
          // Optionally add a fallback image here
        }
      }
      
      // Arrange images in the desired pattern
      const arrangedImages = arrangeGalleryPattern(validatedImages);
      setGalleryItems(arrangedImages);
      setIsLoading(false);
    };

    validateImages();
  }, []);

  // Function to arrange images in the specific pattern
  const arrangeGalleryPattern = (images: GalleryImage[]): GalleryImage[] => {
    const earthImages = images.filter(img => img.theme === 'Earth');
    const urbanImages = images.filter(img => img.theme === 'Urban');
    const verdantImages = images.filter(img => img.theme === 'Verdant');
    const amberImages = images.filter(img => img.theme === 'Amber');

    const arranged: GalleryImage[] = [];

    // Mix pattern as per original design
    if (verdantImages.length >= 3) arranged.push(...verdantImages.slice(0, 3));
    if (earthImages.length >= 2) arranged.push(...earthImages.slice(0, 2));
    if (verdantImages.length >= 6) arranged.push(...verdantImages.slice(3, 6));
    if (urbanImages.length >= 3) arranged.push(...urbanImages.slice(0, 3));
    if (verdantImages.length >= 10) arranged.push(...verdantImages.slice(6, 10));
    if (amberImages.length >= 2) arranged.push(...amberImages.slice(0, 2));

    // Add remaining images
    const remainingVerdant = verdantImages.slice(10);
    const remainingEarth = earthImages.slice(2);
    const remainingUrban = urbanImages.slice(3);
    const remainingAmber = amberImages.slice(2);

    return [...arranged, ...remainingVerdant, ...remainingEarth, ...remainingUrban, ...remainingAmber];
  };

  useEffect(() => {
    if (galleryItems.length === 0 || isLoading) return;

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
          gsap.fromTo(img, { y: 0 }, {
            y: -40,
            ease: "none",
            scrollTrigger: {
              trigger: item,
              start: "top bottom",
              end: "bottom top",
              scrub: 1.5,
            },
          });
        }
      });
    });

    return () => ctx.revert();
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
    <main ref={containerRef} className="min-h-screen bg-[#F8F8F8] pt-32 pb-20 px-4 md:px-12 mt-2">
      <GalleryHeader />

      <section className="relative z-10 max-w-[2000px] mx-auto">
        <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-6 space-y-6">
          {galleryItems.map((item, index) => (
            <div key={item.id} className="gallery-item-wrapper break-inside-avoid">
              <div className={`
                ${item.theme === "Verdant" ? "transform hover:scale-[1.02] transition-transform duration-700" : ""}
                ${item.theme === "Amber" ? "border-2 border-amber-200/20 p-1 bg-amber-50/10" : ""}
                ${item.theme === "Urban" ? "grayscale hover:grayscale-0 transition-all duration-1000" : ""}
                ${item.theme === "Earth" ? "sepia hover:sepia-0 transition-all duration-1000" : ""}
              `}>
                <GalleryItem 
                  item={{
                    _id: item.id,
                    title: `${item.theme} ${item.series}`,
                    imageSrc: item.src,
                    theme: item.theme,
                    series: item.series,
                    aspectRatio: item.aspectRatio
                  }} 
                  index={index} 
                />
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-[1800px] mx-auto py-32 px-6 md:px-12">
        <div className="border-t border-neutral-200 pt-24 text-center quote-content">
          <p className="text-[10px] tracking-[0.6em] text-neutral-400 mb-8 uppercase font-medium">The DMA Philosophy</p>
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-extralight tracking-tight leading-[1.1] text-neutral-900 max-w-5xl mx-auto italic">
            "Cherish where you come from and <br className="hidden md:block" /> you'll cherish everywhere you go"
          </h2>
          <div className="mt-12 flex flex-col items-center gap-4">
            <span className="h-px w-12 bg-[#B62025]" />
            <p className="text-[11px] tracking-[0.4em] text-neutral-500 uppercase font-bold">DMA Africa</p>
          </div>
        </div>
      </section>

      <EditorialSection />
    </main>
  );
};

export default GalleryPage;