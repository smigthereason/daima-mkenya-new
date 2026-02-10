/* eslint-disable react/no-unescaped-entities */
"use client";
import React from "react";
import Image from "next/image";
// Importing assets from the centralized index
import {
  SDG1,
  Hero33,
  Hero77,
  Hero55,
  Model12,
  Model15,
  HeroImage4,
} from "@/public/assets";

const SdgCommitment = () => {
  const essentials = [
    {
      title: "ELEGANT",
      subtitle: "SDG 8",
      color: "#000000",
      bgImage: SDG1,
    },
    {
      title: "INNOVATIVE",
      subtitle: "SDG 9",
      color: "#BB0000",
      bgImage: Hero33,
    },
    {
      title: "DELUXE",
      subtitle: "SDG 12",
      color: "#008000",
      bgImage: Hero77,
    },
    {
      title: "ACTIVE",
      subtitle: "SDG 13",
      color: "#E8E8E8",
      bgImage: Hero55,
    },
  ];

  const secondaryGallery = [
    { src: Model12, alt: "Heritage Collection Model 13" },
    { src: Model15, alt: "Heritage Collection Model 15" },
    { src: HeroImage4, alt: "Heritage Collection Lady White" },
  ];

  return (
    <section className="bg-[#e8e8e8] py-24 overflow-hidden border-b border-neutral-300">
      {/* Luxury Minimalist Header */}
      <div className="max-w-7xl mx-auto px-6 mb-24 text-center">
        <span className="text-[10px] tracking-[0.5em] text-neutral-400 uppercase block mb-4">
          The Commitment
        </span>
        <h2 className="text-4xl md:text-7xl font-serif tracking-tighter text-neutral-900 uppercase">
          SUSTAINABLE <br /> ELEGANCE
        </h2>
      </div>

      {/* Large Grid Cards with Background Images */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 bg-neutral-100 border-y border-neutral-200 mb-32 m-4 sm:m-0">
        {essentials.map((item, idx) => (
          <div
            key={idx}
            className="group relative aspect-4/5 sm:aspect-square lg:aspect-3/4 bg-neutral-900 flex flex-col justify-center items-center overflow-hidden"
          >
            {/* Background Image with Next Image */}
            <div className="absolute inset-0 z-0 overflow-hidden">
              <Image
                src={
                  typeof item.bgImage === "string"
                    ? item.bgImage
                    : item.bgImage.src
                }
                alt={item.title}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className="object-cover transition-all duration-1000 group-hover:scale-105 opacity-60 group-hover:opacity-80"
                priority={idx < 2}
              />
            </div>

            {/* Text Content */}
            <div className="relative z-10 text-center px-4">
              <h3 className="text-xl md:text-3xl font-serif tracking-[0.2em] text-white uppercase wrap-break-words">
                {item.title}
              </h3>
            </div>

            {/* Animated color bar at the bottom */}
            <div
              className="absolute bottom-0 left-0 w-full h-1.5 transition-transform duration-700 scale-x-0 group-hover:scale-x-100 origin-left z-20"
              style={{ backgroundColor: item.color }}
            />
          </div>
        ))}
      </div>

      {/* Heritage Gallery - Staggered Layout */}
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mt-10 mb-16">
          <span className="text-[18px] tracking-[0.6em] text-neutral-800 uppercase">
            The Heritage Collection
          </span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {secondaryGallery.map((item, i) => (
            <div
              key={i}
              className={`relative overflow-hidden transition-all duration-1000 ${i === 1 ? "md:translate-y-20" : ""}`}
            >
              <div className="relative w-full h-[70vh] overflow-hidden">
                <Image
                  src={typeof item.src === "string" ? item.src : item.src.src}
                  alt={item.alt}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-contain hover:scale-105 transition-transform duration-1000"
                  priority={i === 0} // Prioritize loading first image
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Brand Statement */}
      <div className="max-w-3xl mx-auto text-center px-6 mt-64 mb-20">
        <p className="text-xl md:text-2xl text-neutral-800 font-light leading-relaxed italic font-serif">
          "Identity is a story best worn. Born in Kenya, destined for the
          world."
        </p>
        <div className="mt-16 h-24 w-px bg-neutral-500 mx-auto" />
      </div>
    </section>
  );
};

export default SdgCommitment;
