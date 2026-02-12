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
  Stripes 
} from "@/public/assets";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function AboutSovereignGallery() {
  const containerRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline();
      tl.from(".title-part", {
        y: 100,
        opacity: 0,
        stagger: 0.2,
        duration: 1.5,
        ease: "expo.out"
      })
      .from(".accent-thread", {
        scaleX: 0,
        duration: 1.5,
        ease: "power4.inOut",
        stagger: 0.2
      }, "-=1");

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      gsap.utils.toArray(".gallery-img").forEach((img: any, i) => {
        gsap.to(img, {
          y: i % 2 === 0 ? -40 : -80,
          scrollTrigger: {
            trigger: img,
            start: "top bottom",
            scrub: 1.5,
          }
        });
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="bg-[#e8e8e8] text-[#1A1A1A] overflow-hidden selection:bg-[#be1e2d] selection:text-white mt-20">
      
      {/* ── ARCHITECTURAL ENTRANCE (PERFECTLY CENTERED) ── */}
      <section className="relative min-h-screen flex items-center justify-center px-6 md:px-12">
        
      

        <div className="max-w-7xl w-full flex flex-col items-center">
          <header className="w-full text-center mb-12 md:mb-16">
            
            
            <h1 className="text-[16vw] md:text-[10rem] lg:text-[12rem] font-serif leading-[0.85] md:leading-[0.8] tracking-tighter text-black flex flex-col items-center">
              <span className="title-part">Crafting</span>
              <span className="title-part italic text-[#be1e2d] md:translate-x-12 lg:translate-x-24">Identity</span>
              <span className="title-part">In Motion.</span>
            </h1>
          </header>

          <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="flex flex-col items-center md:items-start space-y-6 text-center md:text-left">
                <div className="h-px w-16 bg-black/20 accent-thread" />
                <p className="text-base md:text-lg font-light leading-relaxed text-neutral-600 max-w-sm">
                    A dialogue between the ancestral pulse of Kenya and the precision of contemporary couture. We weave heritage into every silhouette.
                </p>
            </div>
            
            <div className="hidden md:flex justify-end opacity-70">
                <Image src={Stripes} alt="Logo" width={160} height={80} className="object-contain" />
            </div>
          </div>
        </div>
      </section>

      {/* ── SECTION 2: THE TRICOLOR MOSAIC (Responsive Grid) ── */}
      <section className="py-24 md:py-48 px-6 md:px-12 lg:px-24 bg-white/80 backdrop-blur-sm">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12 md:gap-16 items-start">
          
          {/* Black Section */}
          <div className="space-y-8">
            <div className="gallery-img relative aspect-4/5 overflow-hidden shadow-2xl">
                <Image src={ManHero} alt="Black - Strength" fill priority className="object-contain grayscale" />
            </div>
            <h3 className="text-xl font-serif border-l-4 border-black pl-4">The People (Black)</h3>
            <p className="text-sm text-neutral-500 font-light leading-relaxed">
                Our silhouettes are anchored in the resilience of the Kenyan people. A foundation of power that informs every sharp shoulder.
            </p>
          </div>

          {/* Red Section - Offset on large screens */}
          <div className="space-y-8 lg:mt-24">
            <div className="gallery-img relative aspect-4/5 overflow-hidden shadow-2xl border-10 border-white">
                <Image src={WomanHero} alt="Red - Passion" fill priority className="object-contain" />
            </div>
            <h3 className="text-xl font-serif border-l-4 border-[#be1e2d] pl-4">The Blood (Red)</h3>
            <p className="text-sm text-neutral-500 font-light leading-relaxed">
                The literal thread of life. We use crimson accents to signify the passion and warmth that radiates from our atelier.
            </p>
          </div>

          {/* Green Section */}
          <div className="space-y-8 sm:col-span-2 lg:col-span-1 sm:max-w-md lg:max-w-none mx-auto w-full">
            <div className="gallery-img relative aspect-4/5 overflow-hidden shadow-2xl">
                <Image src={Hero77} alt="Green - Land" fill priority className="object-contain" />
            </div>
            <h3 className="text-xl font-serif border-l-4 border-[#006241] pl-4">The Land (Green)</h3>
            <p className="text-sm text-neutral-500 font-light leading-relaxed">
                Our materials are born of the earth. Sustainable, organic, and prosperous. We design for a lush, green future.
            </p>
          </div>
        </div>
      </section>

      {/* ── SECTION 3: THE ETHOS ── */}
      <section className=" bg-white/80 py-32 md:py-48 flex flex-col items-center text-center px-6">
        <div className="max-w-3xl space-y-10">
            <div className="flex justify-center gap-3">
                <div className="w-2 h-2 rounded-full bg-black" />
                <div className="w-2 h-2 rounded-full bg-[#be1e2d]" />
                <div className="w-2 h-2 rounded-full bg-[#006241]" />
            </div>
            <h2 className="text-4xl md:text-7xl font-serif tracking-tight leading-[1.1]">
                Every garment is a <br /> <span className="italic">Manifesto of Unity.</span>
            </h2>
            <p className="text-lg md:text-2xl font-light text-neutral-400 italic">
                &quot;Our identity is never an afterthought.&quot;
            </p>
            <div className="pt-10">
                 <Link href="/products" className="group relative px-12 md:px-20 py-5 md:py-6 border border-neutral-200 overflow-hidden inline-block transition-all hover:border-black">
                    <span className="relative z-10 text-[11px] uppercase tracking-[0.6em] font-bold transition-colors group-hover:text-white">Shop Collection</span>
                    <span className="absolute inset-0 bg-black translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                 </Link>
            </div>
        </div>
      </section>

      {/* ── FINAL CALL ── */}
      <section className="py-32 md:py-48 bg-white text-center px-4">
        <h2 className="text-[15vw] md:text-[12rem] font-black uppercase tracking-tighter text-black/5 leading-none mb-12 select-none">
            DAIMA MKENYA
        </h2>
        <div className="flex flex-wrap justify-center gap-8 md:gap-12 text-[10px] uppercase tracking-[0.4em] font-bold text-neutral-400">
            <span>Always</span>
            <span className="text-[#be1e2d] hidden xs:inline">●</span>
            <span>Kenyan</span>
            <span className="text-[#006241] hidden xs:inline">●</span>
            <span>Forever</span>
        </div>
      </section>
    </div>
  );
}