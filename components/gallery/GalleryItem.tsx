"use client";

import React, { useState } from "react";
import Image from "next/image";

interface GalleryItemProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  item: any;
  index: number;
}

const GalleryItem = ({ item, index }: GalleryItemProps) => {
  const [imgError, setImgError] = useState(false);

  // Determine image dimensions based on aspect ratio
  const getImageDimensions = () => {
    switch (item.aspectRatio) {
      case 'portrait':
        return { width: 800, height: 1000 };
      case 'panoramic':
        return { width: 1200, height: 600 };
      default: // square
        return { width: 800, height: 800 };
    }
  };

  const { width, height } = getImageDimensions();

  // Create a data URL for a colored placeholder in case image fails to load
  const getPlaceholderColor = () => {
    switch (item.theme) {
      case 'Earth':
        return 'bg-amber-800';
      case 'Urban':
        return 'bg-slate-600';
      case 'Verdant':
        return 'bg-emerald-700';
      case 'Amber':
        return 'bg-amber-600';
      default:
        return 'bg-neutral-400';
    }
  };

  return (
    <article className="gallery-item group relative break-inside-avoid flex flex-col mb-6 md:mb-10">
      <div className="relative overflow-hidden bg-neutral-100 shadow-sm aspect-square sm:aspect-auto">
        {item.imageSrc && !imgError ? (
          <Image
            src={item.imageSrc}
            alt={item.title || "Gallery Image"}
            width={width}
            height={height}
            className="w-full h-auto object-cover transition-transform duration-1000 ease-out group-hover:scale-110"
            priority={index < 6}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            onError={() => setImgError(true)}
          />
        ) : (
          // Fallback placeholder when image fails to load
          <div 
            className={`w-full ${getPlaceholderColor()} flex items-center justify-center`}
            style={{ 
              aspectRatio: item.aspectRatio === 'portrait' ? '4/5' : 
                          item.aspectRatio === 'panoramic' ? '2/1' : '1/1',
              minHeight: '200px'
            }}
          >
            <div className="text-white text-center p-4">
              <p className="text-xs uppercase tracking-wider opacity-70">
                {item.theme || "Daima Mkenya"}
              </p>
              <p className="text-[10px] mt-2 opacity-50">
                Image Loading...
              </p>
            </div>
          </div>
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