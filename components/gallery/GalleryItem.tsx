// components/gallery/GalleryItem.tsx
"use client";

import React from "react";
import Image from "next/image";

interface GalleryItemProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  item: any;
  index: number;
}

const GalleryItem = ({ item, index }: GalleryItemProps) => {
  const getImageDimensions = () => {
    switch (item.aspectRatio) {
      case "portrait":
        return { width: 800, height: 1000 };
      case "panoramic":
        return { width: 1200, height: 600 };
      default:
        return { width: 800, height: 800 };
    }
  };

  const { width, height } = getImageDimensions();

  const theme = item.theme || "Daima Mkenya Africa";
  const series = item.series || "Collection";

  const altText =
    item.title ||
    `Daima Mkenya Africa ${theme} series – ${series} Kenyan heritage fashion`;

  return (
    <article className="gallery-item group relative break-inside-avoid flex flex-col mb-6 md:mb-10">
      <div className="relative overflow-hidden bg-neutral-100 aspect-square sm:aspect-auto">
        {item.imageSrc && (
          <Image
            src={item.imageSrc}
            alt={altText}
            width={width}
            height={height}
            className="w-full h-auto object-cover transition-transform duration-1000 ease-out group-hover:scale-110"
            priority={index < 6}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 lg:group-hover:opacity-100 transition-all duration-700 z-10" />

        <div className="absolute bottom-6 left-6 right-6 text-white translate-y-4 opacity-0 lg:group-hover:translate-y-0 lg:group-hover:opacity-100 transition-all duration-500 z-20 hidden lg:block">
          <p className="text-[9px] text-white/80 uppercase tracking-[0.3em] font-light">
            {theme} • {series}
          </p>
        </div>
      </div>

      <div className="mt-3 flex justify-between items-start lg:hidden">
        <p className="text-[8px] text-neutral-500 uppercase tracking-[0.2em]">
          {theme} • {series}
        </p>
      </div>
    </article>
  );
};

export default GalleryItem;
