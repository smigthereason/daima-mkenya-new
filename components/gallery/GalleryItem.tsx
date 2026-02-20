
// import React from "react";
// import Image from "next/image";
// import Link from "next/link";
// import { ArrowRight } from "lucide-react";

// interface GalleryItemProps {
//   // eslint-disable-next-line @typescript-eslint/no-explicit-any
//   item: any;
//   index: number;
// }

// const GalleryItem = ({ item, index }: GalleryItemProps) => {
//   // Guard clause: If there is no imageSrc, we can't render the image
//   const validImageSrc = item.imageSrc || "/assets/placeholder.jpg";

//   return (
//     <article className="gallery-item group relative break-inside-avoid flex flex-col mb-6 md:mb-10">
//       <div className="relative overflow-hidden bg-neutral-100 shadow-sm aspect-square sm:aspect-auto">
//         <Image
//           src={validImageSrc}
//           alt={`${item.name || 'Product'} - Authentic ${item.category || 'Item'} handcrafted in ${item.details?.origin || 'Kenya'}`}
//           width={800}
//           height={1000}
//           className="w-full h-auto object-cover transition-transform duration-1000 ease-out group-hover:scale-110"
//           priority={index < 3}
//           unoptimized={true} // Helps with external Sanity URLs
//           sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
//         />
//         <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 lg:group-hover:opacity-100 transition-opacity duration-500" />
        
//         {/* Vertical Category */}
//         <div className="absolute top-4 right-4 md:top-8 md:right-8 overflow-hidden pointer-events-none z-20">
//           <span className="text-[9px] md:text-[10px] uppercase tracking-[0.4em] font-bold text-white [writing-mode:vertical-lr] rotate-180 drop-shadow-md">
//             {item.category || "Collection"}
//           </span>
//         </div>

//         {/* Desktop Info Overlay */}
//         <div className="absolute inset-x-0 bottom-0 p-6 md:p-10 text-white translate-y-4 opacity-0 lg:group-hover:translate-y-0 lg:group-hover:opacity-100 transition-all duration-500 z-20 hidden lg:block">
//           <p className="text-[10px] text-neutral-300 uppercase tracking-widest italic mb-2">
//             {item.details?.origin}
//           </p>
//           <h3 className="text-2xl font-light tracking-tight uppercase leading-tight mb-4">
//             {item.name}
//           </h3>
//           <Link
//             href={`/products/${item.id || item._id}`}
//             className="inline-flex items-center gap-3 text-[10px] uppercase tracking-[0.2em] text-[#be1e2d] font-bold transition-all hover:gap-5"
//           >
//             Discover Item <ArrowRight size={14} />
//           </Link>
//         </div>
//       </div>

//       {/* Mobile Info */}
//       <div className="mt-5 flex justify-between items-start lg:hidden">
//         <div className="flex-1">
//           <h3 className="text-lg font-light tracking-tight uppercase leading-tight">{item.name}</h3>
//           <p className="text-[9px] text-neutral-400 mt-1 uppercase tracking-widest italic">{item.details?.origin}</p>
//           <Link href={`/products/${item.id || item._id}`} className="inline-flex items-center gap-2 text-[9px] uppercase tracking-[0.2em] text-[#be1e2d] font-bold mt-3">
//             Discover Item <ArrowRight size={12} />
//           </Link>
//         </div>
//         <span className="text-[10px] font-serif italic text-neutral-300">
//           {String(index + 1).padStart(2, "0")}
//         </span>
//       </div>
//     </article>
//   );
// };

// export default GalleryItem;

"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface GalleryItemProps {
  item: any;
  index: number;
}

const GalleryItem = ({ item, index }: GalleryItemProps) => {
  // Use slug for cleaner routing, fallback to ID
  const productSlug = item.slug?.current || item.slug || item._id || item.id;
  const quickViewHref = `/products?view=${productSlug}`;

  // Handle both local imports (objects) and Sanity URLs (strings)
  const imageSrc = typeof item.imageSrc === 'string' ? item.imageSrc : item.imageSrc?.src || item.imageSrc;

  return (
    <article className="gallery-item group relative break-inside-avoid flex flex-col mb-6 md:mb-10">
      <div className="relative overflow-hidden bg-neutral-100 shadow-sm aspect-square sm:aspect-auto">
        {imageSrc && (
           <Image
           src={imageSrc}
           alt={item.name || "DMA Piece"}
           width={800}
           height={1000}
           className="w-full h-auto object-cover transition-transform duration-1000 ease-out group-hover:scale-110"
           priority={index < 3}
           unoptimized={true} // Ensures Sanity/External images load without config errors
           sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
         />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 lg:group-hover:opacity-100 transition-all duration-500 z-10" />
        
        {/* Desktop Overlay */}
        <div className="absolute bottom-8 left-8 right-8 text-white translate-y-4 opacity-0 lg:group-hover:translate-y-0 lg:group-hover:opacity-100 transition-all duration-500 z-20 hidden lg:block">
          <p className="text-[10px] text-neutral-300 uppercase tracking-widest italic mb-2">
            {item.details?.origin || "Kenya"}
          </p>
          <h3 className="text-2xl font-light tracking-tight uppercase leading-tight mb-4">
            {item.name}
          </h3>
          <Link href={`/products/${item._id}`}
            className="inline-flex items-center gap-3 text-[10px] uppercase tracking-[0.2em] text-[#be1e2d] font-bold transition-all hover:gap-5"
          >
            View Piece <ArrowRight size={14} />
          </Link>
        </div>
      </div>

      {/* Mobile Info */}
      <div className="mt-5 flex justify-between items-start lg:hidden">
        <div className="flex-1">
          <h3 className="text-lg font-light tracking-tight uppercase leading-tight">{item.name}</h3>
          <p className="text-[9px] text-neutral-400 mt-1 uppercase tracking-widest italic">{item.details?.origin || "Kenya"}</p>
         <Link href={`/products/${item._id}`}
            className="inline-flex items-center gap-2 text-[9px] uppercase tracking-[0.2em] text-[#be1e2d] font-bold mt-3"
          >
            View Piece <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </article>
  );
};

export default GalleryItem;