// "use client";

// import { useState } from "react";
// import { Product } from "@/types/Product";
// import Image from "next/image";
// import { urlFor } from "@/sanity/lib/image";

// interface ProductGridProps {
//   products: Product[];
//   columns?: 3 | 4;
//   onQuickView?: (productId: string) => void;
// }

// export default function ProductGrid({
//   products,
//   columns = 3,
//   onQuickView,
// }: ProductGridProps) {
//   const [displayLimit, setDisplayLimit] = useState(8);
//   const displayedProducts = products.slice(0, displayLimit);
//   const hasMore = displayLimit < products.length;

//   const handleQuickViewClick = (productId: string) => {
//     if (onQuickView) {
//       onQuickView(productId);
//     }
//   };

//   return (
//     <div className="w-full bg-[#e8e8e8] py-10 md:py-20 px-4 sm:px-8 lg:px-16 text-black antialiased">
//       {/* ── GRID HEADER ── */}
//       <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 md:mb-16 border-b-2 border-neutral-300 pb-8 gap-6">
//         <div>
//           <span className="text-[11px] md:text-[12px] uppercase tracking-[0.5em] text-zinc-400 block mb-3 font-bold">
//             The Selection
//           </span>
//           <h2 className="text-lg md:text-2xl uppercase tracking-[0.2em] font-black text-zinc-900">
//             Current Collection{" "}
//             <span className="text-zinc-400 ml-2 font-light">
//               ({products.length})
//             </span>
//           </h2>
//         </div>
//       </div>

//       {/* ── PRODUCT GRID ── */}
//       <div
//         className={`grid gap-x-6 gap-y-16 sm:gap-x-10 sm:gap-y-24 
//           grid-cols-1                
//           sm:grid-cols-2             
//           ${columns === 3 ? "lg:grid-cols-3" : "lg:grid-cols-4"}
//         `}
//       >
//         {displayedProducts.map((product) => (
//           <div key={product._id} className="group cursor-pointer flex flex-col">
//             {/* Image Container */}
//             <div className="bg-[#F9F9F9] aspect-3/4 relative overflow-hidden mb-6 md:mb-8 border border-transparent transition-colors duration-700 ease-in-out hover:border-neutral-400 group-hover:bg-[#F2F2F2]">
//               {/* Logic Fix: Using first thumbnail instead of hero */}
//               {product.images?.thumbnails?.[0] && (
//                 <Image
//                   src={urlFor(product.images.thumbnails[0]).url()}
//                   alt={product.name}
//                   fill
//                   unoptimized // Fix for rendering
//                   className="object-contain p-8 md:p-12 transition-transform duration-[2s] ease-out group-hover:scale-110"
//                   sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
//                 />
//               )}

//               <div className="hidden lg:flex absolute inset-0 bg-black/5 items-end justify-center pb-12 opacity-0 group-hover:opacity-100 transition-all duration-500">
//                 <button
//                   onClick={() => handleQuickViewClick(product._id)}
//                   className="group relative overflow-hidden border-2 border-zinc-900 bg-zinc-900 px-10 py-5 text-[11px] font-black uppercase tracking-[0.4em] shadow-2xl transition-colors duration-300"
//                 >
//                   <span className="absolute inset-0 z-0 translate-y-full bg-white transition-transform duration-500 ease-out group-hover:translate-y-0" />
//                   <span className="relative z-10 text-white transition-colors duration-500 group-hover:text-zinc-900">
//                     Quick View
//                   </span>
//                 </button>
//               </div>
//             </div>

//             {/* Product Info */}
//             <div className="flex flex-col items-center text-center space-y-3 px-4">
//               <span className="text-[10px] md:text-[11px] uppercase tracking-[0.4em] text-zinc-500 font-bold">
//                 {product.category || "New Arrival"}
//               </span>
//               <h3 className="text-[13px] md:text-[16px] font-black tracking-widest uppercase text-zinc-900 leading-[1.3] line-clamp-2 min-h-[2.6em]">
//                 {product.name}
//               </h3>
//               <p className="text-[14px] md:text-[18px] font-medium tracking-widest text-zinc-900">
//                 {product.price}
//               </p>
//             </div>

//             {/* Color Swatches */}
//             <div className="mt-6 flex justify-center gap-3 lg:opacity-0 lg:group-hover:opacity-100 transition-all duration-500">
//               {product.colors?.slice(0, 4).map((color, idx) => (
//                 <div
//                   key={`${product._id}-color-${idx}`}
//                   className="w-3.5 h-3.5 md:w-4 md:h-4 rounded-full ring-1 ring-offset-4 ring-transparent group-hover:ring-zinc-900 shadow-sm"
//                   style={{ backgroundColor: color.hex }}
//                 />
//               ))}
//             </div>
//           </div>
//         ))}
//       </div>

//       {/* ── PAGINATION ── */}
//       {hasMore && (
//         <div className="flex flex-col items-center mt-20 md:mt-32 space-y-8">
//           <div className="w-0.5 h-20 bg-zinc-900" />
//           <button
//             onClick={() => setDisplayLimit((prev) => prev + 4)}
//             className="group relative overflow-hidden border-2 border-zinc-900 bg-zinc-900 px-16 py-6 text-[14px] font-black tracking-[0.5em] uppercase text-white transition-colors duration-500"
//           >
//             <span className="relative z-10 group-hover:text-zinc-900 transition-colors duration-500">
//               Load More
//             </span>
//             <div className="absolute inset-0 bg-white translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out" />
//           </button>
//           <p className="text-[11px] uppercase tracking-[0.3em] text-zinc-400 font-bold">
//             Showing {displayedProducts.length} of {products.length} Items
//           </p>
//         </div>
//       )}
//     </div>
//   );
// }

"use client";

import { useState, useMemo } from "react";
import { Product } from "@/types/Product";
import Image from "next/image";
import { urlFor } from "@/sanity/lib/image";
import { ChevronDown } from "lucide-react";
import Link from "next/link";

interface ProductGridProps {
  products: Product[];
  columns?: 3 | 4;
  onQuickView?: (productId: string) => void;
}

export default function ProductGrid({
  products,
  columns = 3,
  onQuickView,
}: ProductGridProps) {
  const [displayLimit, setDisplayLimit] = useState(8);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Categories from your schema
  const categories = ["All", "Accessories", "Streetwear", "Sets", "Shirts", "Tops", "Skirts", "Dresses", "Jackets", "Trousers", "Knitwear"];

  // Filter Logic
  const filteredProducts = useMemo(() => {
    if (selectedCategory === "All") return products;
    return products.filter((p) => p.category === selectedCategory);
  }, [products, selectedCategory]);

  const displayedProducts = filteredProducts.slice(0, displayLimit);
  const hasMore = displayLimit < filteredProducts.length;

  const handleQuickViewClick = (productId: string) => {
    if (onQuickView) {
      onQuickView(productId);
    }
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setDisplayLimit(8); // Reset pagination on filter change
    setIsFilterOpen(false);
  };

  return (
    <div className="w-full bg-[#e8e8e8] py-10 md:py-20 px-4 sm:px-8 lg:px-16 text-black antialiased mt-32">
      {/* ── GRID HEADER ── */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 md:mb-16 border-b-2 border-neutral-300 pb-8 gap-6">
        <div>
          <span className="text-[11px] md:text-[12px] uppercase tracking-[0.5em] text-zinc-400 block mb-3 font-bold">
            The Selection
          </span>
          <h2 className="text-lg md:text-2xl uppercase tracking-[0.2em] font-black text-zinc-900">
            {selectedCategory === "All" ? "Current Collection" : selectedCategory}{" "}
            <span className="text-zinc-400 ml-2 font-light">
              ({filteredProducts.length})
            </span>
          </h2>
        </div>

        {/* ── FILTER DROPDOWN ── */}
        <div className="relative w-full md:w-64">
          <button
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className="w-full flex justify-between items-center border border-zinc-900/10 bg-white/50 backdrop-blur-sm px-6 py-4 text-[11px] font-black uppercase tracking-[0.3em] transition-all hover:bg-white"
          >
            Filter: {selectedCategory}
            <ChevronDown size={14} className={`transition-transform duration-300 ${isFilterOpen ? 'rotate-180' : ''}`} />
          </button>

          {isFilterOpen && (
            <div className="absolute top-full right-0 left-0 mt-2 bg-white shadow-2xl z-50 border border-neutral-200">
              <div className="max-h-60 overflow-y-auto">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => handleCategoryChange(cat)}
                    className={`w-full text-left px-6 py-4 text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-zinc-900 hover:text-white transition-colors
                      ${selectedCategory === cat ? 'bg-zinc-100' : ''}`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── PRODUCT GRID OR EMPTY STATE ── */}
      {filteredProducts.length > 0 ? (
        <div
          className={`grid gap-x-6 gap-y-16 sm:gap-x-10 sm:gap-y-24 
            grid-cols-1                
            sm:grid-cols-2             
            ${columns === 3 ? "lg:grid-cols-3" : "lg:grid-cols-4"}
          `}
        >
          {displayedProducts.map((product) => (
            <div key={product._id} className="group cursor-pointer flex flex-col">

              <Link href={`/products/${product.slug?.current || product._id}`} className="block">
                {/* Image Container */}
                <div className="bg-[#F9F9F9] aspect-3/4 relative overflow-hidden mb-6 md:mb-8 border border-transparent transition-colors duration-700 ease-in-out hover:border-neutral-400 group-hover:bg-[#F2F2F2]">
                  {product.images?.thumbnails?.[0] && (
                    <Image
                      src={urlFor(product.images.thumbnails[0]).url()}
                      alt={product.name}
                      fill
                      unoptimized
                      className="object-contain p-8 md:p-12 transition-transform duration-[2s] ease-out group-hover:scale-110"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                  )}

                  <div className="hidden lg:flex absolute inset-0 bg-black/5 items-end justify-center pb-12 opacity-0 group-hover:opacity-100 transition-all duration-500">
                    <button
                      onClick={(e) => {
                        e.preventDefault(); 
                        e.stopPropagation();
                        handleQuickViewClick(product._id)
                      }}
                      className="group relative overflow-hidden border-2 border-zinc-900 bg-zinc-900 px-10 py-5 text-[11px] font-black uppercase tracking-[0.4em] shadow-2xl transition-colors duration-300"
                    >
                      <span className="absolute inset-0 z-0 translate-y-full bg-white transition-transform duration-500 ease-out group-hover:translate-y-0" />
                      <span className="relative z-10 text-white transition-colors duration-500 group-hover:text-zinc-900">
                        Quick View
                      </span>
                    </button>
                  </div>
                </div>
                </Link>

                {/* Product Info */}
                <div className="flex flex-col items-center text-center space-y-3 px-4">
                  <span className="text-[10px] md:text-[11px] uppercase tracking-[0.4em] text-zinc-500 font-bold">
                    {product.category || "New Arrival"}
                  </span>
                  <h3 className="text-[13px] md:text-[16px] font-black tracking-widest uppercase text-zinc-900 leading-[1.3] line-clamp-2 min-h-[2.6em]">
                    {product.name}
                  </h3>
                  <p className="text-[14px] md:text-[18px] font-medium tracking-widest text-zinc-900">
                    {product.price}
                  </p>
                </div>

                {/* Color Swatches */}
                <div className="mt-6 flex justify-center gap-3 lg:opacity-0 lg:group-hover:opacity-100 transition-all duration-500">
                  {product.colors?.slice(0, 4).map((color, idx) => (
                    <div
                      key={`${product._id}-color-${idx}`}
                      className="w-3.5 h-3.5 md:w-4 md:h-4 rounded-full ring-1 ring-offset-4 ring-transparent group-hover:ring-zinc-900 shadow-sm"
                      style={{ backgroundColor: color.hex }}
                    />
                  ))}
                </div>
            </div>
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="flex flex-col items-center justify-center py-40 text-center">
          <p className="text-[12px] md:text-[14px] uppercase tracking-[0.5em] text-zinc-400 font-bold mb-4">
            Collection Update
          </p>
          <h3 className="text-lg md:text-xl font-black uppercase tracking-[0.2em] text-zinc-900">
            There are currently no items in the <span className="text-zinc-400">{selectedCategory}</span> category.
          </h3>
          <button
            onClick={() => setSelectedCategory("All")}
            className="mt-8 text-[11px] font-black uppercase tracking-[0.3em] border-b border-black pb-1 hover:text-zinc-400 hover:border-zinc-400 transition-all"
          >
            View Full Collection
          </button>
        </div>
      )}

      {/* ── PAGINATION ── */}
      {hasMore && (
        <div className="flex flex-col items-center mt-20 md:mt-32 space-y-8">
          <div className="w-0.5 h-20 bg-zinc-900" />
          <button
            onClick={() => setDisplayLimit((prev) => prev + 4)}
            className="group relative overflow-hidden border-2 border-zinc-900 bg-zinc-900 px-16 py-6 text-[14px] font-black tracking-[0.5em] uppercase text-white transition-colors duration-500"
          >
            <span className="relative z-10 group-hover:text-zinc-900 transition-colors duration-500">
              Load More
            </span>
            <div className="absolute inset-0 bg-white translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out" />
          </button>
          <p className="text-[11px] uppercase tracking-[0.3em] text-zinc-400 font-bold">
            Showing {displayedProducts.length} of {filteredProducts.length} Items
          </p>
        </div>
      )}
    </div>
  );
}