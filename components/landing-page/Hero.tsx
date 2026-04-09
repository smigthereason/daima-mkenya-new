"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import {
  WomanHero,
  ManHero,
  HeroStripe,
  Hero22,
  Hero88,
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
        .fromTo(
          [innerLeftRef.current, innerRightRef.current],
          { y: (i) => (i === 0 ? "-100%" : "100%"), opacity: 0 },
          { y: "0%", opacity: 1, duration: 1.5, ease: "expo.out" },
          "-=0.7",
        )
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
          { x: "0%", y: "0%", opacity: 1, duration: 1.5, ease: "expo.inOut" },
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
          { x: "0%", duration: 1.5, ease: "expo.inOut" },
          "<",
        );
    });

    return () => ctx.revert();
  }, []);

  return (
    <section
      className="relative min-h-screen w-full mt-0 md:mt-0 overflow-hidden bg-white flex flex-col items-center justify-center"
      id="hero-section"
    >
      <div className="absolute inset-0 flex w-full h-full z-0">
        <div ref={bgBlackRef} className="flex-1 h-full bg-black" />
        <div className="hidden md:block flex-1 h-full bg-white" />
        <div className="hidden md:block flex-1 h-full bg-[#991b1b]" />
        <div className="hidden md:block flex-1 h-full bg-white" />
        <div ref={bgGreenRef} className="flex-1 h-full bg-[#346511]" />
      </div>

      <div className="absolute inset-0 z-20 w-full h-full">
        <div
          ref={manRef}
          className="absolute left-0 md:left-[20%] w-1/2 md:w-[20%] h-full z-20"
        >
          <Image
            src={ManHero}
            alt="Man"
            fill
            className="object-cover"
            priority
            sizes="(max-width: 768px) 50vw, 20vw"
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
            className="object-cover"
            priority
            sizes="(max-width: 768px) 50vw, 20vw"
          />
        </div>

        <div
          ref={innerLeftRef}
          className="absolute left-0 md:left-[20%] w-1/2 md:w-[20%] h-full bottom-0 opacity-0 pointer-events-none"
        >
          <Image
            src={Hero22}
            alt="Inner Left"
            fill
            className="object-cover"
            sizes="(max-width: 768px) 50vw, 20vw"
          />
        </div>
        <div
          ref={innerRightRef}
          className="absolute left-1/2 md:left-[60%] w-1/2 md:w-[20%] h-full top-0 opacity-0 pointer-events-none "
        >
          <Image
            src={Hero88}
            alt="Inner Right"
            fill
            className="object-cover"
            sizes="(max-width: 768px) 50vw, 20vw"
          />
        </div>

        <div
          ref={outerLeftReplaceRef}
          className="absolute left-0 md:left-[0%] w-1/2 md:w-[20%] h-full opacity-0 pointer-events-none"
        >
          <Image
            src={Hero77}
            alt="Outer Left"
            fill
            className="object-cover"
            sizes="(max-width: 768px) 50vw, 20vw"
          />
        </div>
        <div
          ref={outerRightReplaceRef}
          className="absolute left-1/2 md:left-[80%] w-1/2 md:w-[20%] h-full opacity-0 pointer-events-none"
        >
          <Image
            src={Hero44}
            alt="Outer Right"
            fill
            className="object-cover"
            sizes="(max-width: 768px) 50vw, 20vw"
          />
        </div>
      </div>

      <div className="absolute inset-0 z-25 bg-[radial-gradient(circle,rgba(0,0,0,0.5)_0%,rgba(0,0,0,0.1)_90%)] md:bg-black/20 pointer-events-none" />

      <div className="relative z-30 flex flex-col items-center text-center w-[90%] md:w-full pointer-events-none">
        <div className="relative hidden md:block w-40 h-20 md:w-64 md:h-32 lg:w-160 lg:h-100 mb-2 md:mb-6 drop-shadow-[0_10px_10px_rgba(0,0,0,0.5)]">
          <Image
            src={HeroStripe}
            alt="Logo"
            priority
            fill
            className="object-contain brightness-200 md:brightness-100 md:mix-blend-multiply"
            sizes="(max-width: 768px) 160px, 256px"
          />
        </div>

        <h1 className="text-[12vw] sm:text-5xl md:text-7xl lg:text-[7.5rem] font-serif mb-4 md:mb-6 tracking-[-0.02em] text-white drop-shadow-2xl">
          Daima MKenya
        </h1>

        <p className="text-white text-[9px] md:text-[12px] uppercase tracking-[0.6em] md:tracking-[0.8em] mb-10 md:mb-12 font-medium opacity-90 drop-shadow-md">
          Unity in Every Thread
        </p>

        <Link href="/products" className="pointer-events-auto">
          <button className="group relative overflow-hidden cursor-pointer border-[1px] border-white bg-white/10 px-14 py-5 text-[11px] font-bold tracking-[0.5em] uppercase text-white transition-all duration-500 backdrop-blur-sm hover:bg-white hover:text-black">
            <span className="absolute inset-0 z-0 translate-y-full bg-white transition-transform duration-500 ease-[cubic-bezier(0.19,1,0.22,1)] group-hover:translate-y-0" />
            <span className="relative z-10 transition-colors duration-500 group-hover:text-black">
              Shop Now
            </span>
          </button>
        </Link>
      </div>
    </section>
  );
}
