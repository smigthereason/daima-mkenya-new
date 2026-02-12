"use client";

import React, { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  ManHero,
  WomanHero,
  Hero77,
  Stripes,
  Hero33,
  Hero44,
  Hero22,
  Hero66,
  Model4,
  Model5,
} from "@/public/assets";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function RedesignedAboutPage() {
  const containerRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // High-fashion reveal: Large text sliding up
      gsap.from(".reveal-up", {
        y: 100,
        opacity: 0,
        duration: 1.5,
        ease: "expo.out",
        stagger: 0.2,
        scrollTrigger: {
          trigger: ".reveal-up",
          start: "top 90%",
        },
      });

      // Parallax for high-fashion "Editorial" impact
      gsap.utils.toArray(".parallax-img").forEach((img: any) => {
        gsap.to(img, {
          y: -80,
          scrollTrigger: {
            trigger: img,
            scrub: true,
            start: "top bottom",
            end: "bottom top",
          },
        });
      });

      // Versace-style Scale Entrance
      gsap.from(".luxury-header", {
        scale: 1.05,
        opacity: 0,
        duration: 2.5,
        ease: "power4.out",
      });
    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={containerRef}
      className="bg-white text-black overflow-hidden font-sans mt-32"
    >
      {/* ── SECTION 1: THE MANIFESTO (EDITORIAL COVER) ── */}
      <section className="relative min-h-svh flex items-center px-6 md:px-12 lg:px-20 pt-24 pb-12 overflow-hidden">
        {/* Background Monogram Accent - Adaptive width */}
        <div className="absolute top-0 right-0 w-full lg:w-1/2 h-full bg-[#f8f8f8] -z-10" />

        {/* Watermark: Centered on mobile since image is hidden */}
        <div className="absolute top-1/2 left-0 w-full -translate-y-1/2 opacity-[0.03] select-none pointer-events-none">
          <h1 className="text-[28vw] md:text-[22vw] lg:text-[25vw] font-black leading-none uppercase tracking-tighter text-center lg:text-left lg:ml-[-2vw]">
            Kenya
          </h1>
        </div>

        <div className="max-w-7xl w-full mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-center">
          {/* Image Column: HIDDEN ON MOBILE (hidden), VISIBLE ON IPAD/DESKTOP (lg:block) */}
          <div className="hidden lg:block lg:col-span-5 order-1 lg:order-2 w-full max-w-112.5 md:max-w-150 lg:max-w-none mx-auto">
            <div className="relative lg:h-[80vh] w-full group">
              {/* Frame */}
              <div className="absolute inset-0 border-12 md:border-16 lg:border-24 border-white z-20 shadow-2xl" />

              <Image
                src={Hero44}
                alt="Editorial"
                fill
                className="object-cover transition-all duration-1000 group-hover:scale-105"
                priority
                sizes="(max-width: 1366px) 50vw, 33vw"
              />

              {/* Tricolor Tagging */}
              <div className="absolute -bottom-4 -left-4 z-30 flex flex-col shadow-xl scale-90 lg:scale-110 origin-bottom-left">
                <div className="w-14 md:w-16 h-14 md:h-16 bg-black flex items-center justify-center text-white text-[9px] md:text-[10px] font-bold tracking-widest">
                  2024
                </div>
                <div className="w-14 md:w-16 h-1 bg-[#be1e2d]" />
                <div className="w-14 md:w-16 h-1 bg-white" />
                <div className="w-14 md:w-16 h-1 bg-[#006241]" />
              </div>
            </div>
          </div>

          {/* Text Content: Takes full width on mobile when image is hidden */}
          <div className="lg:col-span-7 z-10 text-center lg:text-left order-2 lg:order-1">
            <span className="text-[10px] md:text-xs tracking-[0.8em] text-[#be1e2d] uppercase font-bold mb-4 md:mb-6 block">
              The Sovereign Collection
            </span>

            <h1 className="text-[15vw] sm:text-7xl md:text-8xl lg:text-[8.5rem] xl:text-[10rem] font-serif leading-[0.85] lg:leading-[0.8] tracking-tighter uppercase mb-6">
              Legacy <br />
              <span className="italic text-transparent bg-clip-text bg-linear-to-r from-black via-[#006241] to-black">
                Woven.
              </span>
            </h1>

            <p className="max-w-md mx-auto lg:mx-0 text-sm md:text-lg lg:text-xl font-light leading-relaxed text-neutral-600 px-4 md:px-0">
              Where the ancestral pulse of the Rift Valley meets the sharp
              precision of modern couture. We write history in silk and thread.
            </p>
          </div>
        </div>
      </section>

      {/* ── SECTION 2: THE GRAND ENTRANCE (VERSACE VIBE) ── */}
      <section className="relative h-screen flex items-center justify-center bg-black overflow-hidden mt-20">
        <div className="absolute inset-0 opacity-40">
          <video
            autoPlay
            loop
            muted
            playsInline
            preload="auto" // Forces the browser to start downloading immediately
            className="h-full w-full object-cover opacity-100 grayscale-20% brightness-[0.7]"
          >
            <source src="/assets/Kenya_Flag.mp4" type="video/mp4" />
          </video>

          {/* Luxury Vignette Overlay */}
          <div className="absolute inset-0 bg-linear-to-b from-black/60 via-transparent to-black/80" />
        </div>

        {/* Luxury Borders */}
        <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-black via-[#be1e2d] to-[#006241]" />
        <div className="absolute bottom-0 left-0 w-full h-1 bg-linear-to-r from-[#006241] via-[#be1e2d] to-black" />

        <div className="relative z-10 text-center px-4 luxury-header">
          <h2 className="text-white text-[12vw] md:text-[8rem] font-serif uppercase tracking-[-0.05em] leading-[0.8] mb-6">
            Sovereign <br />{" "}
            <span className="text-[#be1e2d] italic">Style.</span>
          </h2>
          <p className="text-white text-[10px] md:text-xs tracking-[1em] uppercase opacity-60">
            • Nairobi •
          </p>
        </div>
      </section>

      {/* ── SECTION 3: THE ANATOMY OF UNITY (LV TRUNK STYLE) ── */}
      <section className="py-32 md:py-48 bg-white text-black">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center md:items-end mb-24 gap-8">
            {/* Header: Centered on mobile, Left-aligned on desktop */}
            <h2 className="text-6xl md:text-8xl font-serif tracking-tighter reveal-up uppercase text-center md:text-left">
              Our <span className="text-[#006241]">Ethos</span>
            </h2>

            {/* Decorative Line: Centered on mobile, Right-aligned on desktop */}
            <div className="h-px w-full md:w-1/3 bg-black/10 mb-4 mx-auto md:mx-0" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-16 md:gap-12">
            <div className="space-y-8 group">
              <div className="relative aspect-3/4 overflow-hidden bg-white border border-neutral-200">
                <Image
                  src={Model4}
                  alt="Detail"
                  fill
                  priority
                  className="object-contain transition-transform duration-1000 scale-110 group-hover:scale-125"
                />
                <div className="absolute top-4 right-4 text-[10px] font-mono opacity-40">
                  01 / Materiality
                </div>
              </div>
              <h4 className="text-xs tracking-[0.6em] uppercase font-bold text-[#be1e2d]">
                Sustainable Luxury
              </h4>
              <p className="text-neutral-500 font-light leading-loose text-sm italic font-serif">
                "Fibers sourced from the heart of the Rift Valley, treated with
                the reverence of high-luxury craftsmanship."
              </p>
            </div>

            <div className="space-y-8 group md:translate-y-24">
              <div className="relative aspect-3/4 overflow-hidden bg-white border-x-4 border-[#006241]">
                <Image
                  src={Hero66}
                  alt="Detail"
                  fill
                  priority
                  quality={100}
                  className="object-cover transition-transform duration-1000 group-hover:scale-110"
                />
                <div className="absolute top-4 right-4 text-[10px] font-mono opacity-40">
                  02 / Identity
                </div>
              </div>
              <h4 className="text-xs tracking-[0.6em] uppercase font-bold">
                Maasai Geometry
              </h4>
              <p className="text-neutral-500 font-light leading-loose text-sm">
                Every silhouette is a dialogue. We incorporate Maasai geometric
                principles into European structural tailoring.
              </p>
            </div>

            <div className="space-y-8 group">
              <div className="relative aspect-[3/4] overflow-hidden bg-white border border-neutral-200">
                <Image
                  src={Model5}
                  alt="Detail"
                  fill
                  priority
                  className="object-contain scale-110 transition-transform duration-1000 group-hover:scale-125"
                />
                <div className="absolute top-4 right-4 text-[10px] font-mono opacity-40">
                  03 / Integrity
                </div>
              </div>
              <h4 className="text-xs tracking-[0.6em] uppercase font-bold text-[#006241]">
                Forever Kenyan
              </h4>
              <p className="text-neutral-500 font-light leading-loose text-sm">
                Produced in limited runs. We reject the fast-fashion cycle in
                favor of the 'Forever Kenyan' philosophy.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── SECTION 4: THE RED GALLERY (UNIFORM EDITORIAL GRID) ── */}
      {/* Added 'group' here so the text responds when any part of the section is hovered */}
      <section className="group relative h-[60vh] md:h-[80vh] bg-[#47393a] mt-24 overflow-hidden">
        <div className="absolute inset-0 grid grid-cols-2 md:grid-cols-4">
          {[Hero33, Hero22, Hero77, Hero44].map((img, i) => (
            <div
              key={i}
              className="relative h-full border-r border-white/10 grayscale hover:grayscale-0 opacity-50 hover:opacity-100 transition-all duration-1000 ease-in-out"
            >
              <Image
                src={img}
                alt={`Gallery Image ${i}`}
                fill
                className="object-cover transition-transform duration-[2000ms] hover:scale-110"
              />
              <div className="absolute inset-0 bg-[#be1e2d]/10 transition-colors duration-700 hover:bg-transparent" />
            </div>
          ))}
        </div>

        {/* Central Brand Statement */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
          <h2
            className="text-white text-[12vw] font-serif tracking-tighter uppercase leading-none transition-all duration-700
                         mix-blend-difference
                         group-hover:mix-blend-normal
                         group-hover:text-transparent group-hover:bg-clip-text 
                         group-hover:bg-gradient-to-r group-hover:from-black group-hover:via-[#be1e2d] group-hover:to-[#006241]"
          >
            Aesthetic
          </h2>
        </div>

        {/* Kenyan Flag Accent Thread */}
        <div className="absolute bottom-0 left-0 w-full h-1.5 flex">
          <div className="flex-1 bg-black" />
          <div className="flex-1 bg-[#be1e2d]" />
          <div className="flex-1 bg-[#006241]" />
        </div>
      </section>

      {/* ── SECTION 5: THE ATELIER CALL ── */}
      <section className="py-48 bg-white text-black text-center relative">
        <div className="max-w-4xl mx-auto px-6 reveal-up">
          <span className="text-[10px] tracking-[1em] uppercase mb-12 block text-neutral-400 font-bold">
            Join the Legacy
          </span>
          <h2 className="text-5xl md:text-8xl font-serif mb-20 leading-[0.9] tracking-tighter">
            Crafted for those who <br />{" "}
            <span className="italic ">lead the world.</span>
          </h2>

          <Link
            href="/products"
            className="group relative inline-flex items-center gap-8 py-8 px-16 border border-black/10 overflow-hidden transition-all hover:border-black"
          >
            <span className="relative z-10 text-[11px] font-bold uppercase tracking-[0.8em] group-hover:text-white transition-colors duration-500">
              Enter The Atelier
            </span>
            <div className="absolute inset-0 bg-black translate-y-full group-hover:translate-y-0 transition-transform duration-700 ease-[cubic-bezier(0.19,1,0.22,1)]" />
          </Link>
        </div>
      </section>

      {/* ── FOOTER: TRICOLOR SIGNATURE ── */}
      <footer className="py-20 md:py-32 bg-[#e8e8e8] border-t border-black/5 text-center px-6 overflow-hidden">
        {/* Logo: Scaled down slightly for mobile */}
        <Image
          src={Stripes}
          alt="Logo"
          width={180}
          height={90}
          className="w-32 md:w-[180px] object-contain opacity-15 mx-auto mb-10 md:mb-12"
        />

        {/* Background Text: Adjusted font size and leading for mobile/tablet */}
        <h3 className="text-[18vw] md:text-[14vw] lg:text-[12vw] font-serif uppercase tracking-tighter text-black/5 leading-[0.8] mb-12 select-none pointer-events-none break-words">
          Daima <br className="md:hidden" /> Mkenya
        </h3>

        {/* Motto: Flex-col on mobile to prevent overflow, Flex-row on Tablet/iPad Pro */}
        <div className="flex flex-col md:flex-row justify-center items-center gap-6 md:gap-8 lg:gap-16 text-[9px] md:text-[10px] uppercase tracking-[0.4em] md:tracking-[0.6em] font-black text-neutral-400">
          <span className="hover:text-black cursor-crosshair transition-colors">
            Always
          </span>

          {/* Dots: Hidden on mobile to keep the stack clean */}
          <span className="hidden md:block text-[#be1e2d] text-lg">●</span>

          <span className="hover:text-black cursor-crosshair transition-colors">
            Kenyan
          </span>

          <span className="hidden md:block text-[#006241] text-lg">●</span>

          <span className="hover:text-black cursor-crosshair transition-colors">
            Forever
          </span>
        </div>

        {/* Coordinates: Responsive margin and font scaling */}
        <div className="mt-16 md:mt-24 space-y-2">
          <p className="text-[8px] md:text-[9px] tracking-[0.3em] text-neutral-400 uppercase">
            © 2024 Daima Mkenya Ltd.
          </p>
          <p className="text-[8px] md:text-[9px] tracking-[0.3em] text-neutral-300 uppercase">
            Nairobi HQ • 1.2921° S, 36.8219° E
          </p>
        </div>
      </footer>
    </div>
  );
}
