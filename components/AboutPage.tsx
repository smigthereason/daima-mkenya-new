/* eslint-disable react/no-unescaped-entities */
"use client";

import React, { useEffect, useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Import broken-down sections
import AboutHero from "@/components/about/AboutHero";
import BrandMission from "./about/BrandMission";
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

      <BrandMission 
  serifDisplay={serifDisplay} 
  serifBody={serifBody} 
  serifSubheader={serifSubheader} 
/>

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
