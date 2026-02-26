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
    // Mapping static assets explicitly to avoid build-time undefined errors
    const earthSeries = [Assets.G_Earth1, Assets.G_Earth2, Assets.G_Earth3, Assets.G_Earth4, Assets.G_Earth5, Assets.G_Earth6];
    const urbanSeries = [Assets.G_Urban1, Assets.G_Urban2, Assets.G_Urban3, Assets.G_Urban4, Assets.G_Urban5, Assets.G_Urban6, Assets.G_Urban7, Assets.G_Urban8, Assets.G_Urban9];
    const verdantSeries = [Assets.G_Verdant1, Assets.G_Verdant2, Assets.G_Verdant3, Assets.G_Verdant4, Assets.G_Verdant5, Assets.G_Verdant6, Assets.G_Verdant7, Assets.G_Verdant8, Assets.G_Verdant9, Assets.G_Verdant10, Assets.G_Verdant11, Assets.G_Verdant12, Assets.G_Verdant13, Assets.G_Verdant14, Assets.G_Verdant15, Assets.G_Verdant16, Assets.G_Verdant17, Assets.G_Verdant18, Assets.G_Verdant19, Assets.G_Verdant20, Assets.G_Verdant21, Assets.G_Verdant22, Assets.G_Verdant23, Assets.G_Verdant24];
    const amberSeries = [Assets.G_Amber1, Assets.G_Amber2, Assets.G_Amber3, Assets.G_Amber4];

    // Combine them into a flat structure for the gallery
    const rawData = [
      ...verdantSeries.slice(0, 3).map(img => ({ img, theme: "Verdant", series: "Botanical" })),
      ...earthSeries.slice(0, 2).map(img => ({ img, theme: "Earth", series: "Terrain" })),
      ...verdantSeries.slice(3, 6).map(img => ({ img, theme: "Verdant", series: "Botanical" })),
      ...urbanSeries.slice(0, 3).map(img => ({ img, theme: "Urban", series: "Architecture" })),
      ...verdantSeries.slice(6, 10).map(img => ({ img, theme: "Verdant", series: "Botanical" })),
      ...amberSeries.slice(0, 2).map(img => ({ img, theme: "Amber", series: "Golden Hour" })),
      ...earthSeries.slice(2, 5).map(img => ({ img, theme: "Earth", series: "Terrain" })),
      ...verdantSeries.slice(10, 15).map(img => ({ img, theme: "Verdant", series: "Botanical" })),
      ...urbanSeries.slice(3, 7).map(img => ({ img, theme: "Urban", series: "Architecture" })),
      ...verdantSeries.slice(15, 20).map(img => ({ img, theme: "Verdant", series: "Botanical" })),
      ...amberSeries.slice(2, 4).map(img => ({ img, theme: "Amber", series: "Golden Hour" })),
      ...earthSeries.slice(5, 8).map(img => ({ img, theme: "Earth", series: "Terrain" })),
      ...urbanSeries.slice(7, 10).map(img => ({ img, theme: "Urban", series: "Architecture" })),
      ...verdantSeries.slice(20).map(img => ({ img, theme: "Verdant", series: "Botanical" })),
    ];

    const formatted = rawData
      .filter(item => item.img) // Critical: Removes any failed imports
      .map((item, index) => ({
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
        <div className="border-t border-neutral-200 pt-24 text-center">
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
