"use client";

import React from "react";

interface BrandMissionProps {
  serifDisplay: string;
  serifBody: string;
  serifSubheader: string;
}

const BrandMission = ({
  serifDisplay,
  serifBody,
  serifSubheader,
}: BrandMissionProps) => {
  return (
    <section
      aria-label="Brand Mission and Origin"
      className="relative py-20 md:py-32 lg:py-40 xl:py-48 px-6 md:px-12 lg:px-16 xl:px-24 bg-white overflow-hidden"
    >
      <div className="max-w-7xl mx-auto">
        {/* Changed grid from lg:grid-cols-12 to xl:grid-cols-12 to give iPad Pro (lg) more vertical room */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-12 lg:gap-20 xl:gap-16 items-start">
          {/* Left Side: Headline */}
          <div className="xl:col-span-5 space-y-8 md:space-y-12">
            <div className="reveal flex items-center gap-4">
              <div className="w-12 h-px bg-[#be1e2d]" />
              <h2 className={serifSubheader}>The Mission</h2>
            </div>

            {/* Adjusted text sizes for iPad (text-6xl) vs Desktop (text-7xl+) */}
            <h3
              className={`${serifDisplay} text-5xl md:text-6xl lg:text-7xl xl:text-8xl reveal leading-[1.1]`}
            >
              Crafting <br />
              <span className="">with</span> <br />
              Intention.
            </h3>
          </div>

          {/* Right Side: Detailed Copy */}
          <div className="xl:col-span-7 xl:pt-24">
            <div className="space-y-10 md:space-y-16 max-w-3xl">
              <p
                className={`${serifBody} text-2xl md:text-3xl lg:text-4xl xl:text-4xl text-neutral-900 leading-tight reveal`}
              >
                Daima Mkenya Africa is a Kenyan-owned apparel and fabric brand
                dedicated to celebrating identity and pride through design.
                Kenya&apos;s beauty is in its people. The deeper you cherish who
                you are, the more open you are to the beauty of others.
              </p>

              {/* Grid for Inspiration/Impact: Stays 2 columns on iPad Pro but 1 column on smaller tablets */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-12 xl:gap-16">
                <div className="space-y-4 reveal">
                  <p
                    className={`${serifBody} text-xs md:text-sm text-neutral-500 uppercase tracking-[0.3em] font-bold`}
                  >
                    Inspiration
                  </p>
                  <p
                    className={`${serifBody} text-lg md:text-xl leading-relaxed`}
                  >
                    The brand is inspired by the colors of Kenya&apos;s flag,
                    and the beauty of our land. Crafted primarily from Kenyan
                    cotton and produced by skilled local artisans.
                  </p>
                </div>

                <div className="space-y-4 reveal">
                  <p
                    className={`${serifBody} text-xs md:text-sm text-neutral-500 uppercase tracking-[0.3em] font-bold`}
                  >
                    Impact
                  </p>
                  <p
                    className={`${serifBody} text-lg md:text-xl leading-relaxed`}
                  >
                    The collection represents empowerment, sustainability, and
                    community development, positioning Kenyan craftsmanship on
                    the global stage.
                  </p>
                </div>
              </div>

              {/* Mission Statement Quote */}
              <div className="relative flex gap-6 md:gap-10 lg:gap-12 reveal pt-8 md:pt-12 border-t border-neutral-100">
                {/* The Gradient Line - Ensured it scales with text height */}
                <div className="w-1 md:w-1.5 shrink-0 bg-gradient-to-b from-[#006241] via-[#be1e2d] to-black" />

                <blockquote className="py-2">
                  <p
                    className={`${serifBody} text-xl md:text-2xl lg:text-3xl italic text-neutral-800 leading-snug`}
                  >
                    Daima Mkenya Africa seeks to position Kenyan craftsmanship
                    on the global stage, fostering pride, unity, and a deeper
                    appreciation of Kenya’s cultural legacy.
                  </p>
                </blockquote>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative Text: Hidden on mobile, shown on Tablet and above with responsive sizing */}
      {/* Subtle Background Text - Optimized for iPad Pro & Laptops */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 select-none pointer-events-none opacity-[0.03] z-0 overflow-hidden w-full flex justify-center">
        <span
          className={`${serifDisplay}
      /* Mobile/Small Tablet: smaller scale */
      text-[22vw]
      /* iPad Pro (1024px): scale up slightly, stay centered */
      lg:text-[20vw]
      /* Laptops (1366px): scale to preferred desktop size */
      xl:text-[20vw]
      leading-none whitespace-nowrap translate-y-1/4`}
        >
          HERITAGE
        </span>
      </div>
    </section>
  );
};

export default BrandMission;
