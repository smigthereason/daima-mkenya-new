import React from "react";
import Image from "next/image";
import Link from "next/link";
import * as Assets from "@/public/assets";

const EditorialSection = () => (
  <section className="mt-24 md:mt-40 border-t border-neutral-200 pt-16 md:pt-24 max-w-[1800px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
    <div className="lg:col-span-5 relative h-80 sm:h-96 lg:h-[500px] w-full group overflow-hidden shadow-xl">
      <Image
        src={Assets.HeroImage}
        alt="Daima Mkenya Studio session 2026 - Kenyan Heritage Fashion Editorial Nairobi"
        fill
        priority
        className="object-cover transition-all duration-1000 scale-105 group-hover:scale-100"
      />
      <div className="absolute bottom-6 left-6 md:bottom-10 md:left-10 text-white z-10">
        <div className="bg-gradient-to-r from-black/70 to-transparent p-3 rounded">
          <p className="text-[9px] md:text-[10px] uppercase tracking-[0.5em] font-bold">Studio Session</p>
          <h5 className="text-xl md:text-2xl font-light italic">Daima Mkenya 2026</h5>
        </div>
      </div>
    </div>
    <div className="lg:col-span-7">
      <h4 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-light tracking-tighter mb-8 md:mb-10 leading-[0.9] md:leading-[0.85]">
        STAY ROOTED. <br />
        STAY <span className="text-[#be1e2d] font-medium italic">AUTHENTIC.</span>
      </h4>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 md:gap-12 border-l border-neutral-200 pl-6 md:pl-10">
        <address className="not-italic flex flex-col gap-2 md:gap-3">
          <span className="text-[9px] md:text-[10px] uppercase tracking-[0.3em] font-bold text-neutral-400">Instagram</span>
          <a href="https://instagram.com/daimastudio" className="text-xs md:text-sm font-medium hover:text-[#be1e2d] uppercase tracking-widest">@daimastudio</a>
        </address>
        <address className="not-italic flex flex-col gap-2 md:gap-3">
          <span className="text-[9px] md:text-[10px] uppercase tracking-[0.3em] font-bold text-neutral-400">Headquarters</span>
          <span className="text-xs md:text-sm font-medium uppercase tracking-widest">Nairobi, Kenya</span>
        </address>
      </div>
      <div className="mt-10 md:mt-16">
        <Link
            href="/products"
            className="group relative inline-flex items-center gap-3 md:gap-4 lg:gap-6 xl:gap-8 py-4 md:py-5 lg:py-6 xl:py-8 px-8 md:px-10 lg:px-12 xl:px-16 border border-black/10 overflow-hidden transition-all hover:border-black mt-6 md:mt-7 lg:mt-8 xl:mt-10"
          >
            <span className="relative z-10 text-[9px] md:text-[10px] lg:text-[11px] xl:text-[11px] font-bold uppercase tracking-[0.3em] md:tracking-[0.4em] lg:tracking-[0.5em] xl:tracking-[0.8em] group-hover:text-white transition-colors duration-500">
              Shop Full Collection
            </span>
            <div className="absolute inset-0 bg-black translate-y-full group-hover:translate-y-0 transition-transform duration-700 ease-[cubic-bezier(0.19,1,0.22,1)]" />
          </Link>
      </div>
    </div>
  </section>
);

export default EditorialSection;