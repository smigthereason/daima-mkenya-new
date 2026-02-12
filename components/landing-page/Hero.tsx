// "use client";

// import { useEffect, useRef } from "react";
// import Image from "next/image";
// import {
//   WomanHero,
//   ManHero,
//   Stripes,
//   Hero22,
//   Hero33,
//   Hero44,
//   Hero77,
// } from "@/public/assets";
// import gsap from "gsap";
// import Link from "next/link";

// export default function Hero() {
//   const manRef = useRef(null);
//   const womanRef = useRef(null);
//   const innerLeftRef = useRef(null);
//   const innerRightRef = useRef(null);
//   const outerLeftReplaceRef = useRef(null);
//   const outerRightReplaceRef = useRef(null);

//   const bgBlackRef = useRef(null);
//   const bgGreenRef = useRef(null);

//   useEffect(() => {
//     const ctx = gsap.context(() => {
//       const tl = gsap.timeline({
//         repeat: -1,
//         delay: 2,
//         repeatDelay: 2,
//       });

//       // 1. PUSH MODELS & SIDE BARS OUT
//       tl.to(manRef.current, { x: "-100%", duration: 1.5, ease: "expo.inOut" })
//         .to(
//           womanRef.current,
//           { x: "100%", duration: 1.5, ease: "expo.inOut" },
//           "<",
//         )
//         .to(
//           bgBlackRef.current,
//           { x: "-100%", duration: 1.5, ease: "expo.inOut" },
//           "<",
//         )
//         .to(
//           bgGreenRef.current,
//           { x: "100%", duration: 1.5, ease: "expo.inOut" },
//           "<",
//         )

//         // 2. INNER REPLACEMENTS SLIDE IN (Visual "Miniature" Slideshow)
//         .fromTo(
//           [innerLeftRef.current, innerRightRef.current],
//           { y: (i) => (i === 0 ? "-100%" : "100%"), opacity: 0 },
//           { y: "0%", opacity: 1, duration: 1.5, ease: "expo.out" },
//           "-=0.7",
//         )

//         // 3. SECONDARY SWAP
//         .to(
//           [manRef.current, womanRef.current],
//           {
//             y: (i) => (i === 0 ? "100%" : "-100%"),
//             opacity: 0,
//             duration: 1.2,
//             ease: "expo.in",
//           },
//           "+=1",
//         )
//         .fromTo(
//           [outerLeftReplaceRef.current, outerRightReplaceRef.current],
//           { y: (i) => (i === 0 ? "-100%" : "100%"), opacity: 0 },
//           { y: "0%", opacity: 1, duration: 1.2, ease: "expo.out" },
//           "<",
//         )

//         // 4. RESET TO ORIGINAL
//         .to(
//           [innerLeftRef.current, innerRightRef.current],
//           {
//             y: (i) => (i === 0 ? "100%" : "-100%"),
//             opacity: 0,
//             duration: 1.5,
//             ease: "expo.inOut",
//           },
//           "+=1",
//         )
//         .to(
//           [manRef.current, womanRef.current],
//           {
//             x: "0%",
//             y: "0%",
//             opacity: 1,
//             duration: 1.5,
//             ease: "expo.inOut",
//           },
//           "<",
//         )
//         .to(
//           [outerLeftReplaceRef.current, outerRightReplaceRef.current],
//           {
//             y: (i) => (i === 0 ? "100%" : "-100%"),
//             opacity: 0,
//             duration: 1.5,
//             ease: "expo.inOut",
//           },
//           "<",
//         )
//         .to(
//           [bgBlackRef.current, bgGreenRef.current],
//           {
//             x: "0%",
//             duration: 1.5,
//             ease: "expo.inOut",
//           },
//           "<",
//         );
//     });

//     return () => ctx.revert();
//   }, []);

//   return (
//     <section
//       className="relative min-h-screen w-full mt-20 md:mt-32 overflow-hidden bg-white flex flex-col items-center justify-center"
//       id="hero-section"
//     >
//       {/* ── BACKGROUND GRID (Adaptive Column Layout) ── */}
//       <div className="absolute inset-0 flex w-full h-full z-0">
//         {/* Left Panel: Black on Desktop & Mobile */}
//         <div ref={bgBlackRef} className="flex-1 h-full bg-black" />

//         {/* Desktop Only Columns (Hidden on Mobile) */}
//         <div className="hidden md:block flex-1 h-full bg-white" />
//         <div className="hidden md:block flex-1 h-full bg-[#991b1b]" />
//         <div className="hidden md:block flex-1 h-full bg-white" />

//         {/* Right Panel: Green on Desktop & Mobile */}
//         <div ref={bgGreenRef} className="flex-1 h-full bg-[#346511]" />
//       </div>

//       {/* ── MODELS / IMAGE SLIDESHOW LAYER ── */}
//       <div className="absolute inset-0 z-20 w-full h-full">
//         {/* ORIGINAL PAIR: Positions adapted for 2-col on mobile, 5-col on desktop */}
//         <div
//           ref={manRef}
//           className="absolute left-0 md:left-[20%] w-1/2 md:w-[20%] h-full z-20"
//         >
//           <Image
//             src={ManHero}
//             alt="Man"
//             fill
//             className="object-cover "
//             priority
//           />
//         </div>
//         <div
//           ref={womanRef}
//           className="absolute left-1/2 md:left-[60%] w-1/2 md:w-[20%] h-full z-20"
//         >
//           <Image
//             src={WomanHero}
//             alt="Woman"
//             fill
//             className="object-cover "
//             priority
//           />
//         </div>

//         {/* INNER REPLACEMENTS (The Slideshow Images) */}
//         <div
//           ref={innerLeftRef}
//           className="absolute left-0 md:left-[20%] w-1/2 md:w-[20%] h-full bottom-0 opacity-0 pointer-events-none"
//         >
//           <Image
//             src={Hero22}
//             alt="Inner Left"
//             fill
//             priority
//             className="object-cover"
//           />
//         </div>
//         <div
//           ref={innerRightRef}
//           className="absolute left-1/2 md:left-[60%] w-1/2 md:w-[20%] h-full top-0 opacity-0 pointer-events-none"
//         >
//           <Image
//             src={Hero33}
//             alt="Inner Right"
//             fill
//             priority
//             className="object-cover"
//           />
//         </div>

//         {/* OUTER EDGE REPLACEMENTS (Secondary Slide) */}
//         <div
//           ref={outerLeftReplaceRef}
//           className="absolute left-0 md:left-[0%] w-1/2 md:w-[20%] h-full opacity-0 pointer-events-none"
//         >
//           <Image
//             src={Hero77}
//             alt="Outer Left"
//             fill
//             priority
//             className="object-cover"
//           />
//         </div>
//         <div
//           ref={outerRightReplaceRef}
//           className="absolute left-1/2 md:left-[80%] w-1/2 md:w-[20%] h-full opacity-0 pointer-events-none"
//         >
//           <Image
//             src={Hero44}
//             alt="Outer Right"
//             fill
//             priority
//             className="object-cover"
//           />
//         </div>
//       </div>

//       {/* Scrim for text readability */}
//       <div className="absolute inset-0 z-25 bg-black/30 md:bg-black/20 pointer-events-none" />

//       {/* ── CENTERED CONTENT ── */}
//       <div
//         className="relative z-30 flex flex-col items-center text-center w-[90%] md:w-full max-w-125 md:max-w-none 
//                       bg-[#171717]/10 md:bg-transparent 
//                       border border-white md:border-none 
//                       p-8 md:p-8 
//                        md:rounded-none 
//                       pointer-events-none 
//                       backdrop-blur-sm md:backdrop-blur-none"
//       >
//         {/* Content goes here */}

//         <div className="relative w-40 h-20 md:w-64 md:h-32 lg:w-160 lg:h-100 mb-2 md:mb-6">
//           <Image
//             src={Stripes}
//             alt="Logo"
//             priority
//             fill
//             className="object-contain brightness-200 md:brightness-100 md:mix-blend-multiply"
//           />
//         </div>
        
//         <h1 className="text-[10vw] sm:text-5xl md:text-7xl lg:text-[7rem] font-serif mb-4 md:mb-6 tracking-tighter text-white">
//           <span className="flex justify-center items-baseline gap-x-0.5 md:gap-x-2 whitespace-nowrap">
//             <span className="text-[#be1e2d] drop-shadow-[0_2px_2px_rgba(255,255,255,0.2)]">
//               D
//             </span>
//             <span>a</span>
//             <span className="text-white md:text-black">i</span>
//             <span>m</span>
//             <span className="text-[#006241]">a</span>
//             <span className="ml-2 md:ml-4 text-white md:text-black drop-shadow-[0_2px_2px_rgba(255,255,255,0.2)]">
//               M
//             </span>
//             <span>K</span>
//             <span className="text-[#006241]">e</span>
//             <span>n</span>
//             <span className="text-[#be1e2d]">y</span>
//             <span>a</span>
//           </span>
//         </h1>

//         <p className="text-white/90 text-[10px] md:text-[12px] uppercase tracking-[0.4em] md:tracking-[0.8em] mb-8 md:mb-12">
//           Unity in Every Thread
//         </p>
//         <Link href="/products" className="pointer-events-auto">
//           <button className="group relative overflow-hidden cursor-pointer border-2 border-white bg-white px-12 py-5 text-[12px] font-black tracking-[0.4em] uppercase text-black transition-colors duration-300">
//             {/* The "Grow" Background Layer */}
//             <span className="absolute inset-0 z-0 translate-y-full bg-black transition-transform duration-500 ease-out group-hover:translate-y-0" />

//             {/* The Text Layer */}
//             <span className="relative z-10 transition-colors duration-500 group-hover:text-white">
//               Shop now
//             </span>
//           </button>
//         </Link>
//       </div>
//     </section>
//   );
// }
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
import Link from "next/link";

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

      tl.to(manRef.current, { x: "-100%", duration: 1.5, ease: "expo.inOut" })
        .to(womanRef.current, { x: "100%", duration: 1.5, ease: "expo.inOut" }, "<")
        .to(bgBlackRef.current, { x: "-100%", duration: 1.5, ease: "expo.inOut" }, "<")
        .to(bgGreenRef.current, { x: "100%", duration: 1.5, ease: "expo.inOut" }, "<")
        .fromTo(
          [innerLeftRef.current, innerRightRef.current],
          { y: (i) => (i === 0 ? "-100%" : "100%"), opacity: 0 },
          { y: "0%", opacity: 1, duration: 1.5, ease: "expo.out" },
          "-=0.7",
        )
        .to(
          [manRef.current, womanRef.current],
          { y: (i) => (i === 0 ? "100%" : "-100%"), opacity: 0, duration: 1.2, ease: "expo.in" },
          "+=1",
        )
        .fromTo(
          [outerLeftReplaceRef.current, outerRightReplaceRef.current],
          { y: (i) => (i === 0 ? "-100%" : "100%"), opacity: 0 },
          { y: "0%", opacity: 1, duration: 1.2, ease: "expo.out" },
          "<",
        )
        .to(
          [innerLeftRef.current, innerRightRef.current],
          { y: (i) => (i === 0 ? "100%" : "-100%"), opacity: 0, duration: 1.5, ease: "expo.inOut" },
          "+=1",
        )
        .to([manRef.current, womanRef.current], { x: "0%", y: "0%", opacity: 1, duration: 1.5, ease: "expo.inOut" }, "<")
        .to([outerLeftReplaceRef.current, outerRightReplaceRef.current], { y: (i) => (i === 0 ? "100%" : "-100%"), opacity: 0, duration: 1.5, ease: "expo.inOut" }, "<")
        .to([bgBlackRef.current, bgGreenRef.current], { x: "0%", duration: 1.5, ease: "expo.inOut" }, "<");
    });

    return () => ctx.revert();
  }, []);

  return (
    <section
      className="relative min-h-screen w-full mt-20 md:mt-32 overflow-hidden bg-white flex flex-col items-center justify-center"
      id="hero-section"
    >
      {/* ── BACKGROUND GRID ── */}
      <div className="absolute inset-0 flex w-full h-full z-0">
        <div ref={bgBlackRef} className="flex-1 h-full bg-black" />
        <div className="hidden md:block flex-1 h-full bg-white" />
        <div className="hidden md:block flex-1 h-full bg-[#991b1b]" />
        <div className="hidden md:block flex-1 h-full bg-white" />
        <div ref={bgGreenRef} className="flex-1 h-full bg-[#346511]" />
      </div>

      {/* ── MODELS / IMAGE SLIDESHOW LAYER ── */}
      <div className="absolute inset-0 z-20 w-full h-full">
        <div ref={manRef} className="absolute left-0 md:left-[20%] w-1/2 md:w-[20%] h-full z-20">
          <Image src={ManHero} alt="Man" fill className="object-cover" priority />
        </div>
        <div ref={womanRef} className="absolute left-1/2 md:left-[60%] w-1/2 md:w-[20%] h-full z-20">
          <Image src={WomanHero} alt="Woman" fill className="object-cover" priority />
        </div>

        <div ref={innerLeftRef} className="absolute left-0 md:left-[20%] w-1/2 md:w-[20%] h-full bottom-0 opacity-0 pointer-events-none">
          <Image src={Hero22} alt="Inner Left" fill priority className="object-cover" />
        </div>
        <div ref={innerRightRef} className="absolute left-1/2 md:left-[60%] w-1/2 md:w-[20%] h-full top-0 opacity-0 pointer-events-none">
          <Image src={Hero33} alt="Inner Right" fill priority className="object-cover" />
        </div>

        <div ref={outerLeftReplaceRef} className="absolute left-0 md:left-[0%] w-1/2 md:w-[20%] h-full opacity-0 pointer-events-none">
          <Image src={Hero77} alt="Outer Left" fill priority className="object-cover" />
        </div>
        <div ref={outerRightReplaceRef} className="absolute left-1/2 md:left-[80%] w-1/2 md:w-[20%] h-full opacity-0 pointer-events-none">
          <Image src={Hero44} alt="Outer Right" fill priority className="object-cover" />
        </div>
      </div>

      {/* 1. REFINED SCRIM: 
          Instead of a solid color, we use a radial gradient that is darker in the center 
          where the text sits, but fades out to show the models clearly on the sides.
      */}
      <div className="absolute inset-0 z-25 bg-[radial-gradient(circle,rgba(0,0,0,0.5)_0%,rgba(0,0,0,0.1)_90%)] md:bg-black/20 pointer-events-none" />

      {/* ── CENTERED CONTENT ── */}
      <div className="relative z-30 flex flex-col items-center text-center w-[90%] md:w-full pointer-events-none">
        
        {/* LOGO STRIPES: Added a strong drop shadow for mobile pop */}
        <div className="relative w-40 h-20 md:w-64 md:h-32 lg:w-160 lg:h-100 mb-2 md:mb-6 drop-shadow-[0_10px_10px_rgba(0,0,0,0.5)]">
          <Image
            src={Stripes}
            alt="Logo"
            priority
            fill
            className="object-contain brightness-200 md:brightness-100 md:mix-blend-multiply"
          />
        </div>
        
        {/* 2. EDITORIAL TYPOGRAPHY:
            - Used a tighter tracking on mobile for that "Luxury Branding" feel.
            - Added 'drop-shadow-2xl' to ensure every letter is readable against the photos.
        */}
        <h1 className="text-[12vw] sm:text-5xl md:text-7xl lg:text-[7.5rem] font-serif mb-4 md:mb-6 tracking-[-0.02em] text-white drop-shadow-2xl">
          <span className="flex justify-center items-baseline gap-x-0.5 md:gap-x-2 whitespace-nowrap">
            <span className="text-[#be1e2d] md:drop-shadow-[0_2px_2px_rgba(255,255,255,0.2)]">D</span>
            <span>a</span>
            <span className="text-white md:text-black">i</span>
            <span>m</span>
            <span className="text-[#006241]">a</span>
            <span className="ml-2 md:ml-4 text-white md:text-black md:drop-shadow-[0_2px_2px_rgba(255,255,255,0.2)]">M</span>
            <span>K</span>
            <span className="text-[#006241]">e</span>
            <span>n</span>
            <span className="text-[#be1e2d]">y</span>
            <span>a</span>
          </span>
        </h1>

        {/* 3. SUBTITLE: 
            Increased tracking further for a "minimalist luxury" vibe. 
            The white text on black/gray shadow works universally.
        */}
        <p className="text-white text-[9px] md:text-[12px] uppercase tracking-[0.6em] md:tracking-[0.8em] mb-10 md:mb-12 font-medium opacity-90 drop-shadow-md">
          Unity in Every Thread
        </p>

        <Link href="/products" className="pointer-events-auto">
          {/* 4. THE BUTTON:
              Used a slightly thinner border (1px) and larger padding for a more "expensive" look.
          */}
          <button className="group relative overflow-hidden cursor-pointer border-[1px] border-white bg-white/10 px-14 py-5 text-[11px] font-bold tracking-[0.5em] uppercase text-white transition-all duration-500 backdrop-blur-sm hover:bg-white hover:text-black">
            {/* The "Grow" Background Layer */}
            <span className="absolute inset-0 z-0 translate-y-full bg-white transition-transform duration-500 ease-[cubic-bezier(0.19,1,0.22,1)] group-hover:translate-y-0" />

            {/* The Text Layer */}
            <span className="relative z-10 transition-colors duration-500 group-hover:text-black">
              Shop Now
            </span>
          </button>
        </Link>
      </div>
    </section>
  );
}