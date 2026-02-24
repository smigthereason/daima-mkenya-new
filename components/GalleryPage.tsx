/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import * as Assets from "@/public/assets";
import { getAllProducts } from "@/types/Product";
import { urlFor } from "@/sanity/lib/image";
import { StaticImageData } from "next/image";

// Sub-components
import GalleryHeader from "./gallery/GalleryHeader";
import GalleryItem from "./gallery/GalleryItem";
import EditorialSection from "./gallery/EditorialSection";

gsap.registerPlugin(ScrollTrigger);

const GalleryPage = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [galleryItems, setGalleryItems] = useState<any[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getAllProducts();
        const productsArray = Array.isArray(data) ? data : [];
        
        const formattedItems = productsArray.map((product) => {
          let imageSource = "";

          // Check for Sanity Image
          if (product.images?.hero) {
            imageSource = urlFor(product.images.hero).url();
          } 
          // Check for fallback static asset
          else if (Assets[`Model${product._id}` as keyof typeof Assets]) {
            const asset = Assets[`Model${product._id}` as keyof typeof Assets];
            // Handle both string and StaticImageData
            imageSource = typeof asset === 'string' ? asset : asset.src;
          } 
          // Default Fallback
          else {
            const defaultAsset = Assets.Model1;
            // Handle both string and StaticImageData
            imageSource = typeof defaultAsset === 'string' ? defaultAsset : defaultAsset.src;
          }

          return {
            ...product,
            imageSrc: imageSource,
          };
        });
        
        setGalleryItems(formattedItems.slice(0, 9));
      } catch (error) {
        console.error("Failed to fetch gallery items:", error);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    if (galleryItems.length === 0) return;

    const ctx = gsap.context(() => {
      gsap.from(".gallery-item", {
        y: 60,
        opacity: 0,
        duration: 1,
        stagger: 0.15,
        ease: "power4.out",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 85%",
        },
      });
    });
    return () => ctx.revert();
  }, [galleryItems]);

  return (
    <main ref={containerRef} className="min-h-screen bg-[#F8F8F8] pt-32 pb-20 px-4  md:px-12 mt-2">
      <GalleryHeader />

      {/* Masonry Grid Restored */}
      <section className="relative z-10 max-w-[1800px] mx-auto columns-1 sm:columns-2 lg:columns-3 gap-10 space-y-10">
        {galleryItems.map((item, index) => (
          <GalleryItem key={item._id || item.id || index} item={item} index={index} />
        ))}
      </section>

      <EditorialSection />
    </main>
  );
};

export default GalleryPage;