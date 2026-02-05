"use client";

import { useMemo } from "react";
import DottedMap from "dotted-map";

export default function AfricaDottedMap() {
   const svgMap = useMemo(() => {
      const map = new DottedMap({
         height: 60,
         grid: "diagonal",
         region: {
            lat: { min: -35, max: 37 },
            lng: { min: -20, max: 55 }
         }
      });

      // Nairobi Pin - Deep Black focal point
      map.addPin({
         lat: -1.286389,
         lng: 36.817223,
         svgOptions: { 
            color: "#000000",
            radius: 0.8
         }
      });

      return map.getSVG({
         radius: 0.18,
         color: "#262626", 
         shape: "circle",
         backgroundColor: "transparent", 
      });
   }, []);

   return (
      <section className="relative py-40 overflow-hidden flex flex-col items-center min-h-screen justify-center bg-gradient-to-r from-[#BB0000] via-white to-[#008000]">
         
         

         {/* 2. Scattered Luxury Text Elements (Distributed Layout) */}
         
         {/* Top-Left: Origin Details */}
         <div className="absolute top-24 left-10 md:left-24 z-10">
            <span className="text-[10px] tracking-[0.6em] text-neutral-400 uppercase block mb-2">The Source</span>
            <h3 className="text-2xl font-serif italic text-white">Nairobi Heritage</h3>
            <div className="w-12 h-[1px] bg-white/20 mt-6" />
         </div>

         {/* Top-Right: Season Label */}
         <div className="absolute top-24 right-10 md:right-24 z-10 text-right">
            <span className="text-[10px] tracking-[0.5em] text-neutral-200 uppercase block mb-2">Collection</span>
            <p className="text-xs font-medium tracking-[0.2em] text-white">IDENTITY • 2026</p>
         </div>

         {/* Center: Main Branding */}
         <div className="text-center mb-16 z-10 px-6 relative">
            <h2 className="text-5xl md:text-8xl font-serif tracking-tighter text-neutral-600 uppercase leading-[0.85] mb-6">
               Unity in Every <br /> <span className="italic font-light">Every </span>
            </h2>
            <div className="h-20 w-px bg-neutral-200 mx-auto" />
         </div>

         {/* 3. The Map (Centerpiece) */}
         <div className="relative w-full max-w-6xl flex justify-center items-center z-10 mt-10">
            <img
               src={`data:image/svg+xml;utf8,${encodeURIComponent(svgMap)}`}
               alt="Dotted map of Africa"
               className="w-[90%] md:w-[70%] h-auto select-none pointer-events-none drop-shadow-2xl"
            />
            
            {/* Nairobi Marker with Text Overlay */}
            <div className="absolute top-[52%] left-[63%] flex items-center gap-6">
               <div className="relative">
                  <div className="absolute -inset-4 bg-black/5 rounded-full animate-pulse" />
                  <div className="w-3.5 h-3.5 bg-black rounded-full border-2 border-white shadow-xl" />
               </div>
               <div className="flex flex-col bg-gradient-to-r from-[#BB0000] via-white to-[#008000]  backdrop-blur-md px-4 py-2 rounded-sm border border-white/20">
                  <span className="text-[10px] tracking-[0.4em] font-bold text-white uppercase">Daima Mkenya HQ</span>
                  <span className="text-[9px] text-neutral-500 font-mono tracking-tighter">1.2921° S, 36.8219° E</span>
               </div>
            </div>
         </div>

         {/* 4. Bottom Elements: Philosophy & Coordinates */}
         
         {/* Bottom-Left: Philosophy */}
         <div className="absolute bottom-24 left-10 md:left-24 z-10 max-w-lg hidden lg:block">
            <p className="text-[20px] leading-relaxed text-neutral-300 tracking-wide uppercase italic">
               "A stitch that binds a continent, a design that speaks to the world."
            </p>
         </div>

         {/* Bottom-Right: Technical Coordinates */}
         <div className="absolute bottom-24 right-10 md:right-24 z-10 text-right">
            <div className="w-16 h-px bg-white/30 mb-6 ml-auto" />
            <p className="text-[14px] font-mono text-neutral-400 tracking-[0.3em] uppercase">
               Crafted in Kenya
            </p>
            <p className="text-[16px] text-neutral-300 uppercase tracking-[0.5em] mt-2 font-bold">
               For the Global Citizen
            </p>
         </div>

       
      </section>
   );
}