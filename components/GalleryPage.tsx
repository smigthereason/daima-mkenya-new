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
    // Map imported assets to the gallery structure
    const imageFiles = [
      // Series 1: Earth Tones
      { img: Assets.G_Earth1, theme: "Earth", series: "Terrain", mood: "warm" },
      { img: Assets.G_Earth2, theme: "Earth", series: "Terrain", mood: "warm" },
      { img: Assets.G_Earth3, theme: "Earth", series: "Terrain", mood: "warm" },
      { img: Assets.G_Earth4, theme: "Earth", series: "Terrain", mood: "warm" },
      { img: Assets.G_Earth5, theme: "Earth", series: "Terrain", mood: "warm" },
      { img: Assets.G_Earth6, theme: "Earth", series: "Terrain", mood: "warm" },

      // Series 2: Urban
      { img: Assets.G_Urban1, theme: "Urban", series: "Architecture", mood: "cool" },
      { img: Assets.G_Urban2, theme: "Urban", series: "Architecture", mood: "cool" },
      { img: Assets.G_Urban3, theme: "Urban", series: "Architecture", mood: "cool" },
      { img: Assets.G_Urban4, theme: "Urban", series: "Architecture", mood: "cool" },
      { img: Assets.G_Urban5, theme: "Urban", series: "Architecture", mood: "cool" },
      { img: Assets.G_Urban6, theme: "Urban", series: "Architecture", mood: "cool" },
      { img: Assets.G_Urban7, theme: "Urban", series: "Architecture", mood: "cool" },
      { img: Assets.G_Urban8, theme: "Urban", series: "Architecture", mood: "cool" },
      { img: Assets.G_Urban9, theme: "Urban", series: "Architecture", mood: "cool" },

      // Series 3: Verdant
      { img: Assets.G_Verdant1, theme: "Verdant", series: "Botanical", mood: "natural" },
      { img: Assets.G_Verdant2, theme: "Verdant", series: "Botanical", mood: "natural" },
      { img: Assets.G_Verdant3, theme: "Verdant", series: "Botanical", mood: "natural" },
      { img: Assets.G_Verdant4, theme: "Verdant", series: "Botanical", mood: "natural" },
      { img: Assets.G_Verdant5, theme: "Verdant", series: "Botanical", mood: "natural" },
      { img: Assets.G_Verdant6, theme: "Verdant", series: "Botanical", mood: "natural" },
      { img: Assets.G_Verdant7, theme: "Verdant", series: "Botanical", mood: "natural" },
      { img: Assets.G_Verdant8, theme: "Verdant", series: "Botanical", mood: "natural" },
      { img: Assets.G_Verdant9, theme: "Verdant", series: "Botanical", mood: "natural" },
      { img: Assets.G_Verdant10, theme: "Verdant", series: "Botanical", mood: "natural" },
      { img: Assets.G_Verdant11, theme: "Verdant", series: "Botanical", mood: "natural" },
      { img: Assets.G_Verdant12, theme: "Verdant", series: "Botanical", mood: "natural" },
      { img: Assets.G_Verdant13, theme: "Verdant", series: "Botanical", mood: "natural" },
      { img: Assets.G_Verdant14, theme: "Verdant", series: "Botanical", mood: "natural" },
      { img: Assets.G_Verdant15, theme: "Verdant", series: "Botanical", mood: "natural" },
      { img: Assets.G_Verdant16, theme: "Verdant", series: "Botanical", mood: "natural" },
      { img: Assets.G_Verdant17, theme: "Verdant", series: "Botanical", mood: "natural" },
      { img: Assets.G_Verdant18, theme: "Verdant", series: "Botanical", mood: "natural" },
      { img: Assets.G_Verdant19, theme: "Verdant", series: "Botanical", mood: "natural" },
      { img: Assets.G_Verdant20, theme: "Verdant", series: "Botanical", mood: "natural" },
      { img: Assets.G_Verdant21, theme: "Verdant", series: "Botanical", mood: "natural" },
      { img: Assets.G_Verdant22, theme: "Verdant", series: "Botanical", mood: "natural" },
      { img: Assets.G_Verdant23, theme: "Verdant", series: "Botanical", mood: "natural" },
      { img: Assets.G_Verdant24, theme: "Verdant", series: "Botanical", mood: "natural" },

      // Series 4: Amber
      { img: Assets.G_Amber1, theme: "Amber", series: "Golden Hour", mood: "warm" },
      { img: Assets.G_Amber2, theme: "Amber", series: "Golden Hour", mood: "warm" },
      { img: Assets.G_Amber3, theme: "Amber", series: "Golden Hour", mood: "warm" },
      { img: Assets.G_Amber4, theme: "Amber", series: "Golden Hour", mood: "warm" },
    ];

    const arrangedImages = [
      ...imageFiles.filter((f) => f.theme === "Verdant").slice(0, 3),
      ...imageFiles.filter((f) => f.theme === "Earth").slice(0, 2),
      ...imageFiles.filter((f) => f.theme === "Verdant").slice(3, 6),
      ...imageFiles.filter((f) => f.theme === "Urban").slice(0, 3),
      ...imageFiles.filter((f) => f.theme === "Verdant").slice(6, 10),
      ...imageFiles.filter((f) => f.theme === "Amber").slice(0, 2),
      ...imageFiles.filter((f) => f.theme === "Earth").slice(2, 5),
      ...imageFiles.filter((f) => f.theme === "Verdant").slice(10, 15),
      ...imageFiles.filter((f) => f.theme === "Urban").slice(3, 7),
      ...imageFiles.filter((f) => f.theme === "Verdant").slice(15, 20),
      ...imageFiles.filter((f) => f.theme === "Amber").slice(2, 4),
      ...imageFiles.filter((f) => f.theme === "Earth").slice(5, 8),
      ...imageFiles.filter((f) => f.theme === "Urban").slice(7, 10),
      ...imageFiles.filter((f) => f.theme === "Verdant").slice(20),
    ];

    const formatted = arrangedImages
      .filter((item) => item.img) // Safety check
      .map((item, index) => ({
        _id: `gallery-${index}`,
        title: `${item.theme} ${item.series}`,
        imageSrc: item.img, // Now using the StaticImageData object
        theme: item.theme,
        series: item.series,
        mood: item.mood,
        aspectRatio:
          index % 5 === 0 ? "portrait" : index % 7 === 0 ? "panoramic" : "square",
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
            y: -50,
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
