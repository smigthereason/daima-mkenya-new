"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import {
  WomanHero,
  ManHero,
  Stripes,
  Hero22,
  Hero33,
  Hero44,
  Hero77,
} from "@/public/assets";
import gsap from "gsap";

export default function Hero() {
  const manRef = useRef(null);
  const womanRef = useRef(null);
  const innerLeftRef = useRef(null);
  const innerRightRef = useRef(null);
  const outerLeftReplaceRef = useRef(null);
  const outerRightReplaceRef = useRef(null);

  const bgBlackRef = useRef(null);
  const bgGreenRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        repeat: -1,
        delay: 2,
        repeatDelay: 2,
      });

      // 1. PUSH MODELS & SIDE BARS OUT
      tl.to(manRef.current, { x: "-100%", duration: 1.5, ease: "expo.inOut" })
        .to(
          womanRef.current,
          { x: "100%", duration: 1.5, ease: "expo.inOut" },
          "<",
        )
        .to(
          bgBlackRef.current,
          { x: "-100%", duration: 1.5, ease: "expo.inOut" },
          "<",
        )
        .to(
          bgGreenRef.current,
          { x: "100%", duration: 1.5, ease: "expo.inOut" },
          "<",
        )

        // 2. INNER REPLACEMENTS SLIDE IN (Visual "Miniature" Slideshow)
        .fromTo(
          [innerLeftRef.current, innerRightRef.current],
          { y: (i) => (i === 0 ? "-100%" : "100%"), opacity: 0 },
          { y: "0%", opacity: 1, duration: 1.5, ease: "expo.out" },
          "-=0.7",
        )

        // 3. SECONDARY SWAP
        .to(
          [manRef.current, womanRef.current],
          {
            y: (i) => (i === 0 ? "100%" : "-100%"),
            opacity: 0,
            duration: 1.2,
            ease: "expo.in",
          },
          "+=1",
        )
        .fromTo(
          [outerLeftReplaceRef.current, outerRightReplaceRef.current],
          { y: (i) => (i === 0 ? "-100%" : "100%"), opacity: 0 },
          { y: "0%", opacity: 1, duration: 1.2, ease: "expo.out" },
          "<",
        )

        // 4. RESET TO ORIGINAL
        .to(
          [innerLeftRef.current, innerRightRef.current],
          {
            y: (i) => (i === 0 ? "100%" : "-100%"),
            opacity: 0,
            duration: 1.5,
            ease: "expo.inOut",
          },
          "+=1",
        )
        .to(
          [manRef.current, womanRef.current],
          {
            x: "0%",
            y: "0%",
            opacity: 1,
            duration: 1.5,
            ease: "expo.inOut",
          },
          "<",
        )
        .to(
          [outerLeftReplaceRef.current, outerRightReplaceRef.current],
          {
            y: (i) => (i === 0 ? "100%" : "-100%"),
            opacity: 0,
            duration: 1.5,
            ease: "expo.inOut",
          },
          "<",
        )
        .to(
          [bgBlackRef.current, bgGreenRef.current],
          {
            x: "0%",
            duration: 1.5,
            ease: "expo.inOut",
          },
          "<",
        );
    });

    return () => ctx.revert();
  }, []);

  return (
    <section
      className="relative min-h-screen w-full mt-20 md:mt-32 overflow-hidden bg-white flex flex-col items-center justify-center"
      id="hero-section"
    >
      {/* ── BACKGROUND GRID (Adaptive Column Layout) ── */}
      <div className="absolute inset-0 flex w-full h-full z-0">
        {/* Left Panel: Black on Desktop & Mobile */}
        <div ref={bgBlackRef} className="flex-1 h-full bg-black" />

        {/* Desktop Only Columns (Hidden on Mobile) */}
        <div className="hidden md:block flex-1 h-full bg-white" />
        <div className="hidden md:block flex-1 h-full bg-[#991b1b]" />
        <div className="hidden md:block flex-1 h-full bg-white" />

        {/* Right Panel: Green on Desktop & Mobile */}
        <div ref={bgGreenRef} className="flex-1 h-full bg-[#346511]" />
      </div>

      {/* ── MODELS / IMAGE SLIDESHOW LAYER ── */}
      <div className="absolute inset-0 z-20 w-full h-full">
        {/* ORIGINAL PAIR: Positions adapted for 2-col on mobile, 5-col on desktop */}
        <div
          ref={manRef}
          className="absolute left-0 md:left-[20%] w-1/2 md:w-[20%] h-full z-20"
        >
          <Image
            src={ManHero}
            alt="Man"
            fill
            className="object-cover "
            priority
          />
        </div>
        <div
          ref={womanRef}
          className="absolute left-1/2 md:left-[60%] w-1/2 md:w-[20%] h-full z-20"
        >
          <Image
            src={WomanHero}
            alt="Woman"
            fill
            className="object-cover "
            priority
          />
        </div>

        {/* INNER REPLACEMENTS (The Slideshow Images) */}
        <div
          ref={innerLeftRef}
          className="absolute left-0 md:left-[20%] w-1/2 md:w-[20%] h-full bottom-0 opacity-0 pointer-events-none"
        >
          <Image src={Hero22} alt="Inner Left" fill className="object-cover" />
        </div>
        <div
          ref={innerRightRef}
          className="absolute left-1/2 md:left-[60%] w-1/2 md:w-[20%] h-full top-0 opacity-0 pointer-events-none"
        >
          <Image src={Hero33} alt="Inner Right" fill className="object-cover" />
        </div>

        {/* OUTER EDGE REPLACEMENTS (Secondary Slide) */}
        <div
          ref={outerLeftReplaceRef}
          className="absolute left-0 md:left-[0%] w-1/2 md:w-[20%] h-full opacity-0 pointer-events-none"
        >
          <Image src={Hero77} alt="Outer Left" fill className="object-cover" />
        </div>
        <div
          ref={outerRightReplaceRef}
          className="absolute left-1/2 md:left-[80%] w-1/2 md:w-[20%] h-full opacity-0 pointer-events-none"
        >
          <Image src={Hero44} alt="Outer Right" fill className="object-cover" />
        </div>
      </div>

      {/* Scrim for text readability */}
      <div className="absolute inset-0 z-25 bg-black/30 md:bg-black/20 pointer-events-none" />

      {/* ── CENTERED CONTENT ── */}
      <div
        className="relative z-30 flex flex-col items-center text-center w-[90%] md:w-full max-w-125 md:max-w-none 
                      bg-[#171717]/10 md:bg-transparent 
                      border border-white md:border-none 
                      p-8 md:p-8 
                       md:rounded-none 
                      pointer-events-none 
                      backdrop-blur-sm md:backdrop-blur-none"
      >
        {/* Content goes here */}

        <div className="relative w-40 h-20 md:w-64 md:h-32 lg:w-160 lg:h-100 mb-2 md:mb-6">
          <Image
            src={Stripes}
            alt="Logo"
            fill
            className="object-contain brightness-200 md:brightness-100 md:mix-blend-multiply"
          />
        </div>

        <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-[7rem] font-serif mb-4 md:mb-6 tracking-tighter text-white">
          <span className="flex flex-wrap justify-center items-baseline gap-x-1 md:gap-x-2">
            <span className="text-[#be1e2d] drop-shadow-[0_2px_2px_rgba(255,255,255,0.2)]">
              D
            </span>
            <span>a</span>
            <span className="text-white md:text-black">i</span>
            <span>m</span>
            <span className="text-[#006241]">a</span>
            <span className="ml-2 md:ml-0 text-white md:text-black drop-shadow-[0_2px_2px_rgba(255,255,255,0.2)]">
              M
            </span>
            <span>K</span>
            <span className="text-[#006241]">e</span>
            <span>n</span>
            <span className="text-[#be1e2d]">y</span>
            <span>a</span>
          </span>
        </h1>

        <p className="text-white/90 text-[10px] md:text-[12px] uppercase tracking-[0.4em] md:tracking-[0.8em] mb-8 md:mb-12">
          Unity in Every Thread
        </p>

        <button className="pointer-events-auto relative group bg-white text-black px-10 py-4 md:px-16 md:py-6 overflow-hidden transition-all shadow-2xl uppercase tracking-[0.3em] font-bold text-[10px] md:text-[12px]">
          <span className="relative z-10 group-hover:text-white transition-colors duration-300">
            Shop now
          </span>
          <div className="absolute inset-0 bg-black translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out" />
        </button>
      </div>
    </section>
  );
}
