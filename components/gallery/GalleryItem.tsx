"use client";

import React from "react";
import Image from "next/image";

interface GalleryItemProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  item: any;
  index: number;
}

const GalleryItem = ({ item, index }: GalleryItemProps) => {
  return (
    <article className="gallery-item group relative break-inside-avoid flex flex-col mb-6 md:mb-10">
      <div className="relative overflow-hidden bg-neutral-100 shadow-sm aspect-square sm:aspect-auto">
        {item.imageSrc && (
          <Image
            src={item.imageSrc}
            alt={item.title || "Gallery Image"}
            width={800}
            height={1000}
            className="w-full h-auto object-cover transition-transform duration-1000 ease-out group-hover:scale-110"
            priority={index < 6}
            unoptimized={true}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        )}

        {/* Subtle overlay on hover - more artistic */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 lg:group-hover:opacity-100 transition-all duration-700 z-10" />

        {/* Minimal caption that appears on hover - more editorial feel */}
        <div className="absolute bottom-6 left-6 right-6 text-white translate-y-4 opacity-0 lg:group-hover:translate-y-0 lg:group-hover:opacity-100 transition-all duration-500 z-20 hidden lg:block">
          <p className="text-[9px] text-white/80 uppercase tracking-[0.3em] font-light">
            {item.theme || "Daima Mkenya"} • {item.series || "Collection"}
          </p>
        </div>
      </div>

      {/* Mobile minimal info - just the title if needed */}
      <div className="mt-3 flex justify-between items-start lg:hidden">
        <p className="text-[8px] text-neutral-500 uppercase tracking-[0.2em]">
          {item.theme || "Gallery"} • {item.series || "Collection"}
        </p>
      </div>
    </article>
  );
};

export default GalleryItem;
