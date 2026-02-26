/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import * as Assets from "@/public/assets";

// Sub-components
import GalleryHeader from "./gallery/GalleryHeader";
import GalleryItem from "./gallery/GalleryItem";
import EditorialSection from "./gallery/EditorialSection";

gsap.registerPlugin(ScrollTrigger);

const GalleryPage = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [galleryItems, setGalleryItems] = useState<any[]>([]);

  useEffect(() => {
    // Helper to filter out any assets that failed to import (undefined)
    const getValidAssets = (prefix: string, count: number) => {
      const valid: any[] = [];
      for (let i = 1; i <= count; i++) {
        const asset = (Assets as any)[`${prefix}${i}`];
        if (asset) valid.push(asset);
      }
      return valid;
    };

    const earthAssets = getValidAssets("G_Earth", 6);
    const urbanAssets = getValidAssets("G_Urban", 9);
    const verdantAssets = getValidAssets("G_Verdant", 24);
    const amberAssets = getValidAssets("G_Amber", 4);

    // Build the arrangement logic only with confirmed valid assets
    const rawData: any[] = [];
    
    // Mix pattern
    if (verdantAssets.length >= 3) rawData.push(...verdantAssets.slice(0, 3).map(img => ({ img, theme: "Verdant", series: "Botanical" })));
    if (earthAssets.length >= 2) rawData.push(...earthAssets.slice(0, 2).map(img => ({ img, theme: "Earth", series: "Terrain" })));
    if (verdantAssets.length >= 6) rawData.push(...verdantAssets.slice(3, 6).map(img => ({ img, theme: "Verdant", series: "Botanical" })));
    if (urbanAssets.length >= 3) rawData.push(...urbanAssets.slice(0, 3).map(img => ({ img, theme: "Urban", series: "Architecture" })));
    if (verdantAssets.length >= 10) rawData.push(...verdantAssets.slice(6, 10).map(img => ({ img, theme: "Verdant", series: "Botanical" })));
    if (amberAssets.length >= 2) rawData.push(...amberAssets.slice(0, 2).map(img => ({ img, theme: "Amber", series: "Golden Hour" })));
    
    // Catch-all for any remaining images to ensure gallery is full
    const remainingVerdant = verdantAssets.slice(10).map(img => ({ img, theme: "Verdant", series: "Botanical" }));
    const remainingEarth = earthAssets.slice(2).map(img => ({ img, theme: "Earth", series: "Terrain" }));
    const remainingUrban = urbanAssets.slice(3).map(img => ({ img, theme: "Urban", series: "Architecture" }));
    const remainingAmber = amberAssets.slice(2).map(img => ({ img, theme: "Amber", series: "Golden Hour" }));

    const finalData = [...rawData, ...remainingVerdant, ...remainingEarth, ...remainingUrban, ...remainingAmber];

    const formatted = finalData.map((item, index) => ({
      _id: `gallery-${index}`,
      title: `${item.theme} ${item.series}`,
      imageSrc: item.img,
      theme: item.theme,
      series: item.series,
      aspectRatio: index % 5 === 0 ? "portrait" : index % 7 === 0 ? "panoramic" : "square",
    }));

    setGalleryItems(formatted);
  }, []);

  useEffect(() => {
    if (galleryItems.length === 0) return;

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
  }, [galleryItems]);

  return (
    <main ref={containerRef} className="min-h-screen bg-[#F8F8F8] pt-32 pb-20 px-4 md:px-12 mt-2">
      <GalleryHeader />

      <section className="relative z-10 max-w-[2000px] mx-auto">
        <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-6 space-y-6">
          {galleryItems.map((item, index) => (
            <div key={item._id} className="gallery-item-wrapper break-inside-avoid">
              <div className={`
                ${item.theme === "Verdant" ? "transform hover:scale-[1.02] transition-transform duration-700" : ""}
                ${item.theme === "Amber" ? "border-2 border-amber-200/20 p-1 bg-amber-50/10" : ""}
                ${item.theme === "Urban" ? "grayscale hover:grayscale-0 transition-all duration-1000" : ""}
                ${item.theme === "Earth" ? "sepia hover:sepia-0 transition-all duration-1000" : ""}
              `}>
                <GalleryItem item={item} index={index} />
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
