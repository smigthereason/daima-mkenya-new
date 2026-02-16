"use client";

import React, { useEffect, useRef } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import * as Assets from "@/public/assets";
import { getAllProducts } from "@/types/Product";

// Sub-components
import GalleryHeader from "./gallery/GalleryHeader";
import GalleryItem from "./gallery/GalleryItem";
import EditorialSection from "./gallery/EditorialSection";

gsap.registerPlugin(ScrollTrigger);

const GalleryPage = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const galleryItems = getAllProducts().slice(0, 9).map((product) => ({
    ...product,
    imageSrc: Assets[`Model${product.id}` as keyof typeof Assets] || Assets.Model1,
  }));

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "Daima Mkenya Lookbook 2026 | Heritage Fashion Nairobi",
    "description": "A visual journey through Kenyan craftsmanship.",
    "publisher": { "@type": "Organization", "name": "Daima Mkenya Studio" }
  };

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".gallery-item", {
        y: 60, opacity: 0, duration: 1, stagger: 0.15, ease: "power4.out",
        scrollTrigger: { trigger: containerRef.current, start: "top 85%" }
      });
      if (window.innerWidth > 768) {
        gsap.to(".bg-floating-text", {
          x: -150, scrollTrigger: { trigger: containerRef.current, scrub: 1.5 }
        });
      }
    });
    return () => ctx.revert();
  }, []);

  return (
    <main ref={containerRef} className="min-h-screen bg-[#F8F8F8] text-black pt-20 md:pt-32 pb-20 px-4 md:px-8 lg:px-12 mt-16 md:mt-32 overflow-x-hidden">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* Floating Background */}
      <div className="fixed top-1/2 left-0 -translate-y-1/2 pointer-events-none z-0 opacity-[0.03] hidden lg:block" aria-hidden="true">
        <h1 className="bg-floating-text text-[25vw] font-bold leading-none uppercase">Daima Mkenya Studio</h1>
      </div>

      <GalleryHeader />

      <section className="relative z-10 max-w-[1800px] mx-auto columns-1 sm:columns-2 lg:columns-3 gap-6 md:gap-10 space-y-6 md:space-y-10">
        {galleryItems.map((item, index) => (
          <GalleryItem key={item.id} item={item} index={index} />
        ))}
      </section>

      <EditorialSection />

      <footer className="mt-24 md:mt-40 text-center border-t border-neutral-100 pt-10">
        <Image src={Assets.Logo} alt="Logo" width={60} height={60} className="mx-auto opacity-20" />
        <p className="text-[8px] md:text-[9px] uppercase tracking-[0.4em] text-neutral-400 mt-6 px-4">
          © {new Date().getFullYear()} DAIMA MKENYA AFRICA
        </p>
      </footer>
    </main>
  );
};

export default GalleryPage;