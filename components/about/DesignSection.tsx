"use client";

import React from "react";
import Image from "next/image";
import { HeroImage } from "@/public/assets";

interface DesignSectionProps {
  serifSubheader: string;
}

const DesignSection = ({ serifSubheader }: DesignSectionProps) => {
  return (
    <section
      aria-label="Contemporary Kenyan Design"
      className="py-12 md:py-16 lg:py-20 xl:py-32 px-4 md:px-8 lg:px-12 xl:px-16 bg-[#1d1d1d] text-white overflow-hidden"
    >
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-10 lg:gap-12 xl:gap-24 items-start">
        <div className="space-y-6 md:space-y-8 lg:space-y-10 xl:space-y-12 reveal order-2 lg:order-1">
          <div className="flex items-center gap-3 md:gap-4">
            <div className="w-6 md:w-8 lg:w-10 xl:w-12 h-px bg-white" />
            <h2 className={serifSubheader}>Considered Design</h2>
          </div>
          <div className="space-y-4 md:space-y-5 lg:space-y-6 xl:space-y-8">
            <p className="font-serif font-light text-base md:text-lg lg:text-xl xl:text-2xl text-neutral-400">
              At Daima Mkenya Africa, we believe that identity is a story best
              worn. Born in Kenya, yet destined for the world, our collection
              carry pride, passion, and timeless elegance that transcend
              borders.
            </p>
            <p className="font-serif font-light text-base md:text-lg lg:text-xl text-neutral-400 italic border-l-2 border-[#be1e2d] pl-3 md:pl-4 lg:pl-5 xl:pl-6">
              Each design is thoughtfully conceived, drawing inspiration from
              the stories they carry, while balancing heritage with contemporary
              sophistication.
            </p>
            <p className=" font-serif font-light text-base md:text-lg lg:text-xl xl:text-2xl text-neutral-400 ">
              We invite you to wear more than a design. Wear a connection, a
              legacy, a statement that is meaningful, considered, and enduring.
            </p>
          </div>
        </div>
        <div className="parallax-box h-[35vh] md:h-[40vh] lg:h-[45vh] xl:h-[60vh] relative overflow-hidden bg-white transition-all duration-1000 border border-white/10 order-1 lg:order-2">
          {/* Paint Brush Strokes Background - Textured and Organic */}
          <div className="absolute inset-0 opacity-40 md:opacity-50 mix-blend-multiply">
            {/* Black strokes - thick, bold, textured */}
            <div className="absolute top-5 right-10 w-72 h-32">
              <div
                className="absolute inset-0 bg-black blur-md"
                style={{
                  clipPath:
                    "path('M10,30 Q40,10 80,20 Q120,30 160,15 Q200,0 240,20 Q280,40 300,30 L290,70 Q250,90 200,75 Q150,60 100,80 Q50,100 20,70 Z')",
                  transform: "rotate(5deg)",
                }}
              />
            </div>

            <div className="absolute bottom-20 left-5 w-96 h-40">
              <div
                className="absolute inset-0 bg-black blur-md"
                style={{
                  clipPath:
                    "path('M20,50 Q60,20 120,30 Q180,40 240,20 Q300,0 340,30 Q360,50 340,80 Q300,110 240,100 Q180,90 120,110 Q60,130 30,90 Z')",
                  transform: "rotate(-8deg)",
                }}
              />
            </div>

            {/* Red strokes - dynamic, sweeping like real brush marks */}
            <div className="absolute top-1/3 left-10 w-80 h-24">
              <div
                className="absolute inset-0 bg-[#be1e2d] blur-md"
                style={{
                  clipPath:
                    "path('M5,40 Q30,10 80,20 Q130,30 180,10 Q230,-10 280,20 Q320,40 300,70 Q260,100 200,85 Q140,70 80,90 Q30,110 15,70 Z')",
                  transform: "rotate(-3deg) scaleX(1.2)",
                }}
              />
            </div>

            <div className="absolute bottom-1/3 right-5 w-64 h-20">
              <div
                className="absolute inset-0 bg-[#be1e2d] blur-md"
                style={{
                  clipPath:
                    "path('M0,30 Q40,0 90,20 Q140,40 190,10 Q220,0 240,30 Q250,60 210,80 Q160,100 100,75 Q40,50 10,50 Z')",
                  transform: "rotate(15deg)",
                }}
              />
            </div>

            {/* Green strokes - organic, leaf-like brush strokes */}
            <div className="absolute top-40 right-20 w-96 h-28">
              <div
                className="absolute inset-0 bg-[#006241] blur-md"
                style={{
                  clipPath:
                    "path('M30,20 Q80,0 150,20 Q220,40 280,10 Q320,20 300,60 Q260,100 190,80 Q120,60 50,90 Q10,100 20,50 Z')",
                  transform: "rotate(8deg)",
                }}
              />
            </div>

            <div className="absolute bottom-10 left-1/3 w-72 h-24">
              <div
                className="absolute inset-0 bg-[#006241] blur-md"
                style={{
                  clipPath:
                    "path('M40,10 Q100,-10 170,20 Q240,50 300,30 Q330,50 290,80 Q230,110 150,90 Q70,70 20,50 Z')",
                  transform: "rotate(-12deg)",
                }}
              />
            </div>

            {/* White strokes - light, dry brush effect */}
            <div className="absolute top-0 left-0 w-full h-40">
              <div
                className="absolute inset-0 bg-white/60 blur-xl"
                style={{
                  clipPath:
                    "path('M0,20 Q200,0 400,40 Q600,80 800,30 Q1000,0 1200,50 L1200,120 Q1000,80 800,100 Q600,120 400,90 Q200,60 0,80 Z')",
                  transform: "rotate(-1deg)",
                }}
              />
            </div>

            <div className="absolute bottom-0 right-0 w-full h-36">
              <div
                className="absolute inset-0 bg-white/50 blur-lg"
                style={{
                  clipPath:
                    "path('M0,0 Q300,30 600,10 Q900,-10 1200,20 L1200,80 Q900,60 600,70 Q300,80 0,50 Z')",
                  transform: "rotate(2deg)",
                }}
              />
            </div>
          </div>

          {/* Image */}
          <Image
            src={HeroImage}
            alt="Heritage"
            fill
            priority
            className="object-contain scale-110 relative z-10"
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 80vw, (max-width: 1366px) 45vw, 40vw"
          />
        </div>
      </div>
    </section>
  );
};

export default DesignSection;
