"use client";

import React from "react";
import Image from "next/image";
import { Hero44, Hero22 } from "@/public/assets";

interface AboutHeroProps {
  serifDisplay: string;
  serifBody: string;
}

const AboutHero = ({ serifDisplay, serifBody }: AboutHeroProps) => {
  return (
    <section
      aria-label="Brand Identity"
      className="relative min-h-[70vh] md:min-h-[60vh] lg:min-h-[70vh] xl:min-h-screen flex flex-col justify-center px-4 md:px-8 lg:px-12 xl:px-16 pt-16 md:pt-20 lg:pt-24 xl:pt-32 pb-12 md:pb-16 lg:pb-20"
    >
      <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8 lg:gap-10 xl:gap-12 items-center">
        <div className="lg:col-span-7 space-y-4 md:space-y-6 lg:space-y-8 xl:space-y-10">
          <h1 className={`${serifDisplay} text-5xl sm:text-6xl md:text-7xl lg:text-7xl xl:text-8xl 2xl:text-[10vw] reveal`}>
            Daima <br /> Mkenya <br /> Africa
          </h1>
          <p className={`${serifBody} text-base md:text-lg lg:text-xl xl:text-2xl max-w-xl reveal `}>
            Daima Mkenya Africa is a celebration of identity, crafted with
            intention in the heart of Nairobi.
            <br />
            Our approach is deliberate:
          </p>
          <div className="max-w-xl" role="list">
            {[
              "Meaningful color",
              "Uncompromising quality",
              "Considered design",
            ].map((item, idx) => (
              <div key={idx} className="flex items-start gap-2 mt-2 reveal" role="listitem">
                <span className="font-semibold leading-none mt-1.5">•</span>
                <span className={`${serifBody} text-base md:text-lg lg:text-xl xl:text-2xl`}>
                  {item}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-5 relative mt-6 md:mt-8 lg:mt-0">
          <div className="parallax-box aspect-[3/4] md:aspect-[4/5] lg:aspect-[3/4] xl:aspect-4/5 relative overflow-hidden rounded-sm shadow-2xl z-10 max-w-md lg:max-w-lg mx-auto lg:mx-0">
            <Image
              src={Hero44}
              alt="Daima Mkenya Africa Identity - Heritage Fashion Kenya"
              fill
              className="object-cover scale-110"
              priority
              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 80vw, (max-width: 1366px) 40vw, 35vw"
            />
          </div>
          <div className="absolute -bottom-8 md:-bottom-10 xl:-bottom-10 -left-6 md:-left-8 xl:-left-10 w-2/3 aspect-square border-4 md:border-8 xl:border-10 border-white shadow-xl z-20 hidden xl:block overflow-hidden">
            <Image
              src={Hero22}
              alt="Authentic Kenyan craftsmanship and color"
              fill
              priority
              className="object-cover"
              sizes="(max-width: 1366px) 20vw, 15vw"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutHero;