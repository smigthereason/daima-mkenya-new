"use client";

import React from "react";
import Image from "next/image";
import { Model5 } from "@/public/assets";

interface QualitySectionProps {
  serifSubheader: string;
  serifBody: string;
}

const QualitySection = ({ serifSubheader, serifBody }: QualitySectionProps) => {
  return (
    <section
      aria-label="Sustainability and Quality"
      className="py-12 md:py-16 lg:py-20 xl:py-32 px-4 md:px-8 lg:px-12 xl:px-16 max-w-7xl mx-auto"
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8 lg:gap-10 xl:gap-16 items-center">
        <div className="lg:col-span-5 order-2 lg:order-1">
          <div className="parallax-box aspect-[3/4] md:aspect-[4/5] lg:aspect-[4/5] xl:aspect-3/4 relative overflow-hidden shadow-2xl max-w-sm md:max-w-md lg:max-w-lg mx-auto lg:mx-0 ">
            <Image
              src={Model5}
              alt="Quality"
              fill
              priority
              quality={100}
              className="object-cover"
              sizes="(max-width: 768px) 80vw, (max-width: 1024px) 60vw, (max-width: 1366px) 35vw, 30vw"
            />
          </div>
        </div>
        <div className="lg:col-span-7 order-1 lg:order-2 space-y-4 md:space-y-6 lg:space-y-8 reveal">
          <div className="flex items-center gap-3 md:gap-4">
            <div className="w-6 md:w-8 lg:w-10 xl:w-12 h-px bg-black" />
            <h2 className={serifSubheader}>Uncompromising Quality</h2>
          </div>
          <p
            className={`${serifBody} text-base md:text-lg lg:text-xl xl:text-2xl text-[#1d1d1d]`}
          >
            We work exclusively with sustainable natural fibres, honoring the
            purity of material and the integrity of craft, where texture, color,
            and meaning come together to create pieces that are worn with
            comfort and quiet confidence.
          </p>
        </div>
      </div>
    </section>
  );
};

export default QualitySection;

