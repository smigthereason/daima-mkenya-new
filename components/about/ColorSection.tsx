"use client";

import React from "react";
import Image from "next/image";
import { SideStripe } from "@/public/assets";

interface ColorSectionProps {
  serifSubheader: string;
  serifBody: string;
}

const ColorSection = ({ serifSubheader, serifBody }: ColorSectionProps) => {
  return (
    <section
      aria-label="Color Symbolism"
      className="py-12 md:py-16 lg:py-20 xl:py-32 px-4 md:px-8 lg:px-12 xl:px-16 bg-[#F9F9F9]"
    >
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-10 lg:gap-12 xl:gap-20 items-stretch">
        <div className="space-y-4 md:space-y-6 lg:space-y-8 reveal order-1 lg:order-1 flex flex-col justify-center">
          <div className="flex items-center gap-3 md:gap-4">
            <div className="w-6 md:w-8 lg:w-10 xl:w-12 h-px bg-black" />
            <h2 className={serifSubheader}>Meaningful Color</h2>
          </div>

          {/* Fixed text sizes: text-base sm, md:text-lg lg, xl:text-2xl to match Hero/Quality */}
          <p
            className={`${serifBody} text-base md:text-lg lg:text-xl xl:text-2xl text-[#1d1d1d]`}
          >
            Our color palette draws inspiration from the colors of Kenya&apos;s
            flag — our symbol of unity and pride. Its colors are rich with
            meaning: <span className="text-black font-black">black</span>{" "}
            represents the people,{" "}
            <span className="text-[#be1e2d] font-black">red</span> symbolizes
            the struggle for freedom,
            <span className="text-[#006241] font-black"> green</span> celebrates
            the beauty of our land and natural wealth, and{" "}
            <span className="italic font-bold">white</span> stands for peace and
            unity. Together, they reflect the spirit and pride of Kenya.
          </p>
        </div>

        <div className="parallax-box relative order-2 lg:order-2 w-full flex">
          <div className="relative w-full min-h-[300px] md:min-h-[400px] lg:h-full lg:min-h-0 overflow-hidden ">
            <Image
              src={SideStripe}
              alt="Daima Mkenya Heritage Colors - Symbolism of the Kenyan Flag for Sustainable Design"
              fill
              priority
              className="object-contain mix-blend-multiply"
              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 80vw, 45vw"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default ColorSection;
