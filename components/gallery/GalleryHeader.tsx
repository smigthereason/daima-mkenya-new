import React from "react";

const GalleryHeader = () => (
  <header className="relative z-10 max-w-[1800px] mx-auto mb-12 md:mb-24 grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8 items-end">
    <div className="md:col-span-8">
      <span className="text-[10px] md:text-xs uppercase tracking-[0.5em] text-[#be1e2d] font-bold block mb-4">
        Lookbook {new Date().getFullYear()} — Nairobi, Kenya
      </span>
      <h2 className="text-4xl sm:text-6xl md:text-8xl lg:text-9xl font-light tracking-tighter leading-[0.9] md:leading-[0.85]">
        explore the <br />
        <span className="font-medium italic">heritage</span>
      </h2>
    </div>
    <div className="md:col-span-4 pb-1 md:pb-2">
      <p className="text-xs md:text-[13px] text-neutral-500 max-w-xs leading-relaxed border-l border-neutral-300 pl-4 md:pl-6 uppercase tracking-wider">
        A curated visual journey through the soul of Kenyan craftsmanship.
        Every piece tells a story of identity and pride.
      </p>
    </div>
  </header>
);

export default GalleryHeader;