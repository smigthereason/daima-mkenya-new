/* eslint-disable react/no-unescaped-entities */
// "use client";

// import React, { useEffect, useRef } from "react";
// import Image from "next/image";
// import Link from "next/link";
// import gsap from "gsap";
// import { ScrollTrigger } from "gsap/ScrollTrigger";
// import { ArrowDown } from "lucide-react";
// import {
//   Hero77,
//   Model5,
//   Model9,
//   Hero44,
//   Hero22,
//   Hero66,
//   Model4,
//   SideStripe,
//   HeroImage,
// } from "@/public/assets";

// if (typeof window !== "undefined") {
//   gsap.registerPlugin(ScrollTrigger);
// }

// export default function AboutPage() {
//   const containerRef = useRef(null);

//   useEffect(() => {
//     const ctx = gsap.context(() => {
//       // Clean architectural reveal - mobile optimized
//       gsap.from(".reveal", {
//         y: 30,
//         opacity: 0,
//         duration: 1,
//         stagger: 0.15,
//         ease: "power3.out",
//         scrollTrigger: {
//           trigger: ".reveal",
//           start: "top 90%",
//         },
//       });

//       // Parallax for the overlapping image containers - disabled on mobile for performance
//       gsap.utils.toArray(".parallax-box").forEach((box: any) => {
//         gsap.to(box.querySelector("img"), {
//           yPercent: 10,
//           ease: "none",
//           scrollTrigger: {
//             trigger: box,
//             scrub: true,
//             start: "top bottom",
//             end: "bottom top",
//           },
//         });
//       });
//     }, containerRef);
//     return () => ctx.revert();
//   }, []);

//   // Typography strictly using Playfair variations for consistency
//   const serifDisplay = "font-serif tracking-tighter leading-[0.85]";
//   const serifSubheader =
//     "font-serif font-black uppercase tracking-[0.2em] text-[12px]";
//   const serifBody =
//     "font-serif font-normal tracking-tight leading-relaxed text-neutral-600";

//   return (
//     <div
//       ref={containerRef}
//       className="bg-white text-[#1d1d1d] selection:bg-[#be1e2d] selection:text-white mt-16 md:mt-20 lg:mt-24 xl:mt-32"
//     >
//       {/* ── SECTION 1: HERO & IDENTITY ── */}
//       <section className="relative min-h-[70vh] md:min-h-[60vh] lg:min-h-[70vh] xl:min-h-screen flex flex-col justify-center px-4 md:px-8 lg:px-12 xl:px-16 pt-16 md:pt-20 lg:pt-24 xl:pt-32 pb-12 md:pb-16 lg:pb-20">
//         <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8 lg:gap-10 xl:gap-12 items-center">
//           <div className="lg:col-span-7 space-y-4 md:space-y-6 lg:space-y-8 xl:space-y-10">
//             <h1
//               className={`${serifDisplay} text-5xl sm:text-6xl md:text-7xl lg:text-7xl xl:text-8xl 2xl:text-[10vw] reveal`}
//             >
//               Daima <br /> Mkenya <br /> Africa
//             </h1>
//             <p
//               className={`${serifBody} text-base md:text-lg lg:text-xl xl:text-2xl max-w-xl reveal `}
//             >
//               Daima Mkenya Africa is a celebration of identity, crafted with
//               intention.
//               <br />
//               Our approach is deliberate:
//             </p>
//             <div className="max-w-xl">
//               <div className="flex items-start gap-2 mt-2 reveal">
//                 <span className="font-semibold leading-none mt-1.5">•</span>
//                 <span
//                   className={`${serifBody} text-base md:text-lg lg:text-xl xl:text-2xl`}
//                 >
//                   Meaningful color
//                 </span>
//               </div>
//               <div className="flex items-start gap-2 reveal">
//                 <span className="font-semibold leading-none mt-1.5">•</span>
//                 <span
//                   className={`${serifBody} text-base md:text-lg lg:text-xl xl:text-2xl`}
//                 >
//                   Uncompromising quality
//                 </span>
//               </div>
//               <div className="flex items-start gap-2 reveal">
//                 <span className="font-semibold leading-none mt-1.5">•</span>
//                 <span
//                   className={`${serifBody} text-base md:text-lg lg:text-xl xl:text-2xl`}
//                 >
//                   Considered design
//                 </span>
//               </div>
//             </div>
//           </div>

//           <div className="lg:col-span-5 relative mt-6 md:mt-8 lg:mt-0">
//             <div className="parallax-box aspect-[3/4] md:aspect-[4/5] lg:aspect-[3/4] xl:aspect-4/5 relative overflow-hidden rounded-sm shadow-2xl z-10 max-w-md lg:max-w-lg mx-auto lg:mx-0">
//               <Image
//                 src={Hero44}
//                 alt="Identity"
//                 fill
//                 className="object-cover scale-110"
//                 priority
//                 sizes="(max-width: 768px) 100vw, (max-width: 1024px) 80vw, (max-width: 1366px) 40vw, 35vw"
//               />
//             </div>
//             {/* Architectural Overlap Box - hidden on mobile/tablet, visible on desktop only */}
//             <div className="absolute -bottom-8 md:-bottom-10 xl:-bottom-10 -left-6 md:-left-8 xl:-left-10 w-2/3 aspect-square border-4 md:border-8 xl:border-10 border-white shadow-xl z-20 hidden xl:block overflow-hidden">
//               <Image
//                 src={Hero22}
//                 alt="Color"
//                 fill
//                 priority
//                 className="object-cover"
//                 sizes="(max-width: 1366px) 20vw, 15vw"
//               />
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* ── SECTION 2: MEANINGFUL COLOR ── */}
//       <section className="py-12 md:py-16 lg:py-20 xl:py-32 px-4 md:px-8 lg:px-12 xl:px-16 bg-[#F9F9F9]">
//         <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-10 lg:gap-12 xl:gap-20 items-stretch">
//           {/* items-stretch ensures the image container matches the text column height on iPad/Laptop */}

//           {/* Text - First on mobile, left on desktop */}
//           <div className="space-y-4 md:space-y-6 lg:space-y-8 reveal order-1 lg:order-1 flex flex-col justify-center">
//             <div className="flex items-center gap-3 md:gap-4">
//               <div className="w-6 md:w-8 lg:w-10 xl:w-12 h-px bg-black" />
//               <h2 className={serifSubheader}>Meaningful Color</h2>
//             </div>
//             <p
//               className={`${serifBody} text-sm md:text-base lg:text-lg xl:text-xl`}
//             >
//               Our color palette draws inspiration from the colors of the Kenyan
//               flag - our symbol of unity and pride. Its colours are rich with
//               meaning: <span className="text-black font-black">black</span>{" "}
//               represents the people,{" "}
//               <span className="text-[#be1e2d] font-black">red</span> symbolizes
//               the struggle for freedom,
//               <span className="text-[#006241] font-black"> green</span>{" "}
//               celebrates our land and natural wealth, and{" "}
//               <span className="italic font-bold">white</span> stands for peace
//               and unity. Together, they reflect the spirit and pride of Kenya.
//             </p>
//           </div>

//           {/* Image - Fixed for "Fullness" on iPad Pro and Laptops */}
//           <div className="parallax-box relative order-2 lg:order-2 w-full flex">
//             {/* FIX: Removed aspect-[4/3] and max-h-[500px] on large screens.
//         Using h-full inside a flex container allows the image to occupy
//         the total vertical space of the grid.
//       */}
//             <div className="relative w-full min-h-[200px] md:min-h-[400px] lg:h-full lg:min-h-0 overflow-hidden shadow-lg bg-[#F9F9F9]">
//               <Image
//                 src={SideStripe}
//                 alt="Daima Mkenya Heritage Colors - Symbolism of the Kenyan Flag"
//                 fill
//                 priority
//                 className="object-contain mix-blend-multiply"
//                 sizes="(max-width: 768px) 100vw, (max-width: 1024px) 80vw, 45vw"
//               />
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* ── SECTION 3: UNCOMPROMISING QUALITY ── */}
//       <section className="py-12 md:py-16 lg:py-20 xl:py-32 px-4 md:px-8 lg:px-12 xl:px-16 max-w-7xl mx-auto">
//         <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8 lg:gap-10 xl:gap-16 items-center">
//           <div className="lg:col-span-5 order-2 lg:order-1">
//             <div className="parallax-box aspect-[3/4] md:aspect-[4/5] lg:aspect-[4/5] xl:aspect-3/4 relative overflow-hidden shadow-2xl max-w-sm md:max-w-md lg:max-w-lg mx-auto lg:mx-0 bg-transparent">
//               <Image
//                 src={Model5}
//                 alt="Quality"
//                 fill
//                 priority
//                 quality={100}
//                 className="object-cover"
//                 sizes="(max-width: 768px) 80vw, (max-width: 1024px) 60vw, (max-width: 1366px) 35vw, 30vw"
//               />
//             </div>
//           </div>
//           <div className="lg:col-span-7 order-1 lg:order-2 space-y-4 md:space-y-6 lg:space-y-8 reveal">
//             <div className="flex items-center gap-3 md:gap-4">
//               <div className="w-6 md:w-8 lg:w-10 xl:w-12 h-px bg-black" />
//               <h2 className={serifSubheader}>Uncompromising Quality</h2>
//             </div>
//             <p
//               className={`${serifBody} text-base md:text-lg lg:text-xl xl:text-2xl text-[#1d1d1d]`}
//             >
//               We work exclusively with sustainable natural fibres, honoring the
//               purity of material and the integrity of craft, where texture,
//               color, and meaning come together to create pieces that are worn
//               with comfort and quiet confidence.
//             </p>
//           </div>
//         </div>
//       </section>

//       {/* ── SECTION 4: CONSIDERED DESIGN ── */}
//       <section className="py-12 md:py-16 lg:py-20 xl:py-32 px-4 md:px-8 lg:px-12 xl:px-16 bg-[#1d1d1d] text-white overflow-hidden">
//         <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-10 lg:gap-12 xl:gap-24 items-start">
//           <div className="space-y-6 md:space-y-8 lg:space-y-10 xl:space-y-12 reveal order-2 lg:order-1">
//             <div className="flex items-center gap-3 md:gap-4">
//               <div className="w-6 md:w-8 lg:w-10 xl:w-12 h-px bg-white" />
//               <h2 className={serifSubheader}>Considered Design</h2>
//             </div>
//             <div className="space-y-4 md:space-y-5 lg:space-y-6 xl:space-y-8">
//               <p className="font-serif font-light text-base md:text-lg lg:text-xl xl:text-2xl text-neutral-400">
//                 At Daima Mkenya Africa, we believe that identity is a story best
//                 worn. Born in Kenya, yet destined for the world, our collection
//                 carry pride, passion, and timeless elegance that transcend
//                 borders.
//               </p>
//               <p className="font-serif font-light text-base md:text-lg lg:text-xl text-neutral-400 italic border-l-2 border-[#be1e2d] pl-3 md:pl-4 lg:pl-5 xl:pl-6">
//                 Each design is thoughtfully conceived, drawing inspiration from
//                 the stories they carry, while balancing heritage with
//                 contemporary sophistication.
//               </p>
//               <p className=" font-serif font-light text-base md:text-lg lg:text-xl xl:text-2xl text-neutral-400 ">
//                 We invite you to wear more than a design. Wear a connection, a
//                 legacy, a statement that is meaningful, considered, and
//                 enduring.
//               </p>
//             </div>
//           </div>
//           <div className="parallax-box h-[35vh] md:h-[40vh] lg:h-[45vh] xl:h-[60vh] relative overflow-hidden bg-white transition-all duration-1000 border border-white/10 order-1 lg:order-2">
//             {/* Paint Brush Strokes Background - Textured and Organic */}
//             <div className="absolute inset-0 opacity-40 md:opacity-50 mix-blend-multiply">
//               {/* Black strokes - thick, bold, textured */}
//               <div className="absolute top-5 right-10 w-72 h-32">
//                 <div
//                   className="absolute inset-0 bg-black blur-md"
//                   style={{
//                     clipPath:
//                       "path('M10,30 Q40,10 80,20 Q120,30 160,15 Q200,0 240,20 Q280,40 300,30 L290,70 Q250,90 200,75 Q150,60 100,80 Q50,100 20,70 Z')",
//                     transform: "rotate(5deg)",
//                   }}
//                 />
//               </div>

//               <div className="absolute bottom-20 left-5 w-96 h-40">
//                 <div
//                   className="absolute inset-0 bg-black blur-md"
//                   style={{
//                     clipPath:
//                       "path('M20,50 Q60,20 120,30 Q180,40 240,20 Q300,0 340,30 Q360,50 340,80 Q300,110 240,100 Q180,90 120,110 Q60,130 30,90 Z')",
//                     transform: "rotate(-8deg)",
//                   }}
//                 />
//               </div>

//               {/* Red strokes - dynamic, sweeping like real brush marks */}
//               <div className="absolute top-1/3 left-10 w-80 h-24">
//                 <div
//                   className="absolute inset-0 bg-[#be1e2d] blur-md"
//                   style={{
//                     clipPath:
//                       "path('M5,40 Q30,10 80,20 Q130,30 180,10 Q230,-10 280,20 Q320,40 300,70 Q260,100 200,85 Q140,70 80,90 Q30,110 15,70 Z')",
//                     transform: "rotate(-3deg) scaleX(1.2)",
//                   }}
//                 />
//               </div>

//               <div className="absolute bottom-1/3 right-5 w-64 h-20">
//                 <div
//                   className="absolute inset-0 bg-[#be1e2d] blur-md"
//                   style={{
//                     clipPath:
//                       "path('M0,30 Q40,0 90,20 Q140,40 190,10 Q220,0 240,30 Q250,60 210,80 Q160,100 100,75 Q40,50 10,50 Z')",
//                     transform: "rotate(15deg)",
//                   }}
//                 />
//               </div>

//               {/* Green strokes - organic, leaf-like brush strokes */}
//               <div className="absolute top-40 right-20 w-96 h-28">
//                 <div
//                   className="absolute inset-0 bg-[#006241] blur-md"
//                   style={{
//                     clipPath:
//                       "path('M30,20 Q80,0 150,20 Q220,40 280,10 Q320,20 300,60 Q260,100 190,80 Q120,60 50,90 Q10,100 20,50 Z')",
//                     transform: "rotate(8deg)",
//                   }}
//                 />
//               </div>

//               <div className="absolute bottom-10 left-1/3 w-72 h-24">
//                 <div
//                   className="absolute inset-0 bg-[#006241] blur-md"
//                   style={{
//                     clipPath:
//                       "path('M40,10 Q100,-10 170,20 Q240,50 300,30 Q330,50 290,80 Q230,110 150,90 Q70,70 20,50 Z')",
//                     transform: "rotate(-12deg)",
//                   }}
//                 />
//               </div>

//               {/* White strokes - light, dry brush effect */}
//               <div className="absolute top-0 left-0 w-full h-40">
//                 <div
//                   className="absolute inset-0 bg-white/60 blur-xl"
//                   style={{
//                     clipPath:
//                       "path('M0,20 Q200,0 400,40 Q600,80 800,30 Q1000,0 1200,50 L1200,120 Q1000,80 800,100 Q600,120 400,90 Q200,60 0,80 Z')",
//                     transform: "rotate(-1deg)",
//                   }}
//                 />
//               </div>

//               <div className="absolute bottom-0 right-0 w-full h-36">
//                 <div
//                   className="absolute inset-0 bg-white/50 blur-lg"
//                   style={{
//                     clipPath:
//                       "path('M0,0 Q300,30 600,10 Q900,-10 1200,20 L1200,80 Q900,60 600,70 Q300,80 0,50 Z')",
//                     transform: "rotate(2deg)",
//                   }}
//                 />
//               </div>
//             </div>

//             {/* Image */}
//             <Image
//               src={HeroImage}
//               alt="Heritage"
//               fill
//               priority
//               className="object-contain scale-110 relative z-10"
//               sizes="(max-width: 768px) 100vw, (max-width: 1024px) 80vw, (max-width: 1366px) 45vw, 40vw"
//             />
//           </div>
//         </div>
//       </section>

//       {/* ── SECTION 6: THE GRAND ENTRANCE (VERSACE VIBE) ── */}
//       <section className="relative h-[60vh] md:h-[50vh] lg:h-[60vh] xl:h-screen flex items-center justify-center bg-black overflow-hidden font-serif">
//         <div className="absolute inset-0 opacity-40">
//           <video
//             autoPlay
//             loop
//             muted
//             playsInline
//             preload="auto"
//             className="h-full w-full object-cover opacity-100 grayscale-20% brightness-[0.7]"
//           >
//             <source src="/assets/Kenya_Flag.mp4" type="video/mp4" />
//           </video>
//           <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/80" />
//         </div>

//         <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-black via-[#be1e2d] to-[#006241]" />
//         <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-[#006241] via-[#be1e2d] to-black" />

//         <div className="relative z-10 text-center px-4 max-w-4xl lg:max-w-5xl mx-auto">
//           <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-5xl 2xl:text-7xl font-serif tracking-[-0.05em] leading-[1.4] text-white mb-3 md:mb-4 lg:mb-5 xl:mb-6">
//             Born from the colors of our nation, Daima Mkenya weaves identity,
//             unity, and pride into every thread.
//           </h2>
//           <p className="text-white text-[10px] md:text-xs lg:text-sm xl:text-base tracking-[0.3em] md:tracking-[0.4em] lg:tracking-[0.5em] xl:tracking-[1em] uppercase opacity-70 font-bold">
//             • Born Here • <br className="block sm:hidden" />• Worn Everywhere •
//           </p>
//         </div>
//       </section>

//       {/* ── SECTION 5: FINAL STATEMENT (THE HEARTBEAT) ── */}
//       <section className="py-16 md:py-20 lg:py-24 xl:py-40 px-4 text-center bg-white relative overflow-hidden">
//         {/* Subtle background pattern */}
//         <div
//           className="absolute inset-0 opacity-[0.02]"
//           style={{
//             backgroundImage: `radial-gradient(circle at 1px 1px, #000 1px, transparent 0)`,
//             backgroundSize: "40px 40px",
//           }}
//         />

//         {/* Decorative top line */}
//         <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-12 md:h-14 lg:h-16 xl:h-20 bg-gradient-to-b from-transparent via-neutral-300 to-black" />

//         {/* Brand Statement */}
//         <div className="max-w-3xl mx-auto text-center px-4 relative z-10">
//           {/* Opening quote mark */}
//           <span className="block text-4xl md:text-5xl lg:text-6xl text-red-500 font-serif mb-3 md:mb-4 lg:mb-5 xl:mb-6">
//             "
//           </span>

//           <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl text-neutral-800 font-light leading-relaxed font-serif">
//             Each piece is our heartbeat worn proudly,
//             <span className="block mt-1 md:mt-2 text-neutral-900 font-medium">
//               carrying Kenya's spirit wherever it goes.
//             </span>
//           </p>

//           {/* Closing quote mark */}
//           <span className="block text-4xl md:text-5xl lg:text-6xl text-green-600 font-serif mt-3 md:mt-4 lg:mt-5 xl:mt-6 rotate-180">
//             "
//           </span>

//           {/* Decorative divider */}
//           <div className="mt-12 md:mt-14 lg:mt-16 xl:mt-20 flex items-center justify-center gap-2 md:gap-2 lg:gap-2 xl:gap-3">
//             <div className="w-6 md:w-8 lg:w-10 xl:w-12 h-px bg-neutral-400" />
//             <div className="w-1 md:w-1.5 lg:w-1.5 xl:w-2 h-1 md:h-1.5 lg:h-1.5 xl:h-2 rounded-full bg-neutral-500" />
//             <div className="w-6 md:w-8 lg:w-10 xl:w-12 h-px bg-neutral-400" />
//           </div>

//           {/* Optional: Small brand signature */}
//           <p className="mt-4 md:mt-5 lg:mt-6 xl:mt-8 text-[9px] md:text-[10px] lg:text-[11px] xl:text-xs uppercase tracking-[0.15em] md:tracking-[0.2em] lg:tracking-[0.25em] xl:tracking-[0.3em] text-neutral-400 font-light">
//             — Daima MKenya —
//           </p>

//           <Link
//             href="/gallery"
//             className="group relative inline-flex items-center gap-3 md:gap-4 lg:gap-6 xl:gap-8 py-4 md:py-5 lg:py-6 xl:py-8 px-8 md:px-10 lg:px-12 xl:px-16 border border-black/10 overflow-hidden transition-all hover:border-black mt-6 md:mt-7 lg:mt-8 xl:mt-10"
//           >
//             <span className="relative z-10 text-[9px] md:text-[10px] lg:text-[11px] xl:text-[11px] font-bold uppercase tracking-[0.3em] md:tracking-[0.4em] lg:tracking-[0.5em] xl:tracking-[0.8em] group-hover:text-white transition-colors duration-500">
//               Enter The Atelier
//             </span>
//             <div className="absolute inset-0 bg-black translate-y-full group-hover:translate-y-0 transition-transform duration-700 ease-[cubic-bezier(0.19,1,0.22,1)]" />
//           </Link>
//         </div>
//       </section>
//     </div>
//   );
// }
"use client";

import React, { useEffect, useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Import broken-down sections
import AboutHero from "@/components/about/AboutHero";
import ColorSection from "@/components/about/ColorSection";
import QualitySection from "@/components/about/QualitySection";
import DesignSection from "@/components/about/DesignSection";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function AboutPage() {
  const containerRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // reveal animations
      gsap.from(".reveal", {
        y: 30,
        opacity: 0,
        duration: 1,
        stagger: 0.15,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".reveal",
          start: "top 90%",
        },
      });

      // parallax logic
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      gsap.utils.toArray(".parallax-box").forEach((box: any) => {
        gsap.to(box.querySelector("img"), {
          yPercent: 10,
          ease: "none",
          scrollTrigger: {
            trigger: box,
            scrub: true,
            start: "top bottom",
            end: "bottom top",
          },
        });
      });
    }, containerRef);
    return () => ctx.revert();
  }, []);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    mainEntity: {
      "@type": "Organization",
      name: "Daima Mkenya Africa",
      description:
        "Daima Mkenya Africa is a premium heritage fashion brand based in Nairobi, Kenya, celebrating identity through sustainable design and cultural pride.",
      url: "https://daimamkenya.com/about",
      logo: "https://daimamkenya.com/logo.png",
      address: {
        "@type": "PostalAddress",
        addressLocality: "Nairobi",
        addressCountry: "KE",
      },
      knowsAbout: [
        "Kenyan Fashion",
        "Sustainable Textiles",
        "African Heritage Design",
      ],
    },
  };

  // Shared Styles
  const serifDisplay = "font-serif tracking-tighter leading-[0.85]";
  const serifSubheader =
    "font-serif font-black uppercase tracking-[0.2em] text-[12px]";
  const serifBody =
    "font-serif font-normal tracking-tight leading-relaxed text-neutral-600";

  return (
    <div
      ref={containerRef}
      className="bg-white text-[#1d1d1d] selection:bg-[#be1e2d] selection:text-white mt-16 md:mt-20 lg:mt-24 xl:mt-32"
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <AboutHero serifDisplay={serifDisplay} serifBody={serifBody} />

      <ColorSection serifSubheader={serifSubheader} serifBody={serifBody} />

      <QualitySection serifSubheader={serifSubheader} serifBody={serifBody} />

      <DesignSection serifSubheader={serifSubheader} />

      {/* ── SECTION 6: THE GRAND ENTRANCE (VERSACE VIBE) ── */}
      <section className="relative h-[60vh] md:h-[50vh] lg:h-[60vh] xl:h-screen flex items-center justify-center bg-black overflow-hidden font-serif">
        <div className="absolute inset-0 opacity-40">
          <video
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
            className="h-full w-full object-cover opacity-100 grayscale-20% brightness-[0.7]"
          >
            <source src="/assets/Kenya_Flag.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/80" />
        </div>

        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-black via-[#be1e2d] to-[#006241]" />
        <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-[#006241] via-[#be1e2d] to-black" />

        <div className="relative z-10 text-center px-4 max-w-4xl lg:max-w-5xl mx-auto">
          <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-5xl 2xl:text-7xl font-serif tracking-[-0.05em] leading-[1.4] text-white mb-3 md:mb-4 lg:mb-5 xl:mb-6">
            Born from the colors of our nation, Daima Mkenya weaves identity,
            unity, and pride into every thread.
          </h2>
          <p className="text-white text-[10px] md:text-xs lg:text-sm xl:text-base leading-[1.8] tracking-[0.3em] md:tracking-[0.4em] lg:tracking-[0.5em] xl:tracking-[1em] uppercase opacity-70 font-bold">
            • Born Here • <br className="block " />• Worn Everywhere •
          </p>
        </div>
      </section>

      {/* ── SECTION 5: FINAL STATEMENT ── */}
      <section className="py-16 md:py-20 lg:py-40 px-4 text-center bg-white relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.02]"
          aria-hidden="true"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, #000 1px, transparent 0)`,
            backgroundSize: "40px 40px",
          }}
        />
        <article className="max-w-3xl mx-auto text-center px-4 relative z-10">
          <span
            className="block text-4xl md:text-6xl text-red-500 font-serif mb-6"
            aria-hidden="true"
          >
            "
          </span>
          <p className="text-lg sm:text-xl md:text-4xl text-neutral-800 font-light leading-relaxed font-serif">
            Each piece is our heartbeat worn proudly,
            <span className="block mt-1 md:mt-2 text-neutral-900 font-medium">
              carrying Kenya's spirit wherever it goes.
            </span>
          </p>
          <span
            className="block text-4xl md:text-6xl text-green-600 font-serif mt-6 rotate-180"
            aria-hidden="true"
          >
            "
          </span>
          <Link
            href="/gallery"
            className="group relative inline-flex items-center gap-4 py-4 md:py-8 px-8 md:px-16 border border-black/10 overflow-hidden transition-all hover:border-black mt-6 md:mt-10"
          >
            <span className="relative z-10 text-[9px] md:text-[11px] font-bold uppercase tracking-[0.3em] xl:tracking-[0.8em] group-hover:text-white transition-colors duration-500">
              Enter The Atelier
            </span>
            <div className="absolute inset-0 bg-black translate-y-full group-hover:translate-y-0 transition-transform duration-700 ease-[cubic-bezier(0.19,1,0.22,1)]" />
          </Link>
        </article>
      </section>
    </div>
  );
}
