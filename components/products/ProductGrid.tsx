"use client";

import { useState } from "react";
import { Product } from "@/types/Product";
import Image from "next/image";

interface ProductGridProps {
  products: Product[];
  columns?: 3 | 4;
  onQuickView?: (productId: number) => void;
}

export default function ProductGrid({
  products,
  columns = 3,
  onQuickView,
}: ProductGridProps) {
  const [displayLimit, setDisplayLimit] = useState(8);
  const displayedProducts = products.slice(0, displayLimit);
  const hasMore = displayLimit < products.length;

  const handleQuickViewClick = (productId: number) => {
    if (onQuickView) {
      onQuickView(productId);
    }
  };

  return (
    <div className="w-full bg-[#e8e8e8] py-10 md:py-20 px-4 sm:px-8 lg:px-16 text-black antialiased">
      {/* ── GRID HEADER: Bolder & Larger ── */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 md:mb-16 border-b-2 border-neutral-300 pb-8 gap-6">
        <div>
          <span className="text-[11px] md:text-[12px] uppercase tracking-[0.5em] text-zinc-400 block mb-3 font-bold">
            The Selection
          </span>
          <h2 className="text-lg md:text-2xl uppercase tracking-[0.2em] font-black text-zinc-900">
            Current Collection{" "}
            <span className="text-zinc-400 ml-2 font-light">
              ({products.length})
            </span>
          </h2>
        </div>

       
      </div>

      {/* ── PRODUCT GRID ── */}
      <div
        className={`grid gap-x-6 gap-y-16 sm:gap-x-10 sm:gap-y-24 
          grid-cols-1                
          sm:grid-cols-2             
          ${columns === 3 ? "lg:grid-cols-3" : "lg:grid-cols-4"}
        `}
      >
        {displayedProducts.map((product) => (
          <div key={product.id} className="group cursor-pointer flex flex-col">
            {/* Image Container */}

            <div className="bg-[#F9F9F9] aspect-3/4 relative overflow-hidden mb-6 md:mb-8 border border-transparent transition-colors duration-700 ease-in-out hover:border-neutral-400 group-hover:bg-[#F2F2F2]">
              <Image
                src={product.images.hero}
                alt={product.name}
                fill
                className="object-contain p-8 md:p-12 transition-transform duration-[2s] ease-out group-hover:scale-110"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              />

              {/* Quick View Button: Bolder */}
              <div className="hidden lg:flex absolute inset-0 bg-black/5 items-end justify-center pb-12 opacity-0 group-hover:opacity-100 transition-all duration-500">
                <button 
                  onClick={() => handleQuickViewClick(product.id)}
                  className="bg-zinc-900 text-white text-[11px] font-bold uppercase tracking-[0.4em] px-10 py-5 shadow-2xl transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500 hover:bg-zinc-800"
                >
                  Quick View
                </button>
              </div>
            </div>

            {/* Product Info: Increased Size & Weight */}
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

            {/* Color Swatches: Slightly Larger */}
            <div className="mt-6 flex justify-center gap-3 lg:opacity-0 lg:group-hover:opacity-100 transition-all duration-500">
              {product.colors.slice(0, 4).map((color) => (
                <div
                  key={color.hex}
                  className="w-3.5 h-3.5 md:w-4 md:h-4 rounded-full ring-1 ring-offset-4 ring-transparent group-hover:ring-zinc-900 shadow-sm"
                  style={{ backgroundColor: color.hex }}
                />
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* ── BOLD PAGINATION ── */}
      {hasMore && (
        <div className="flex flex-col items-center mt-20 md:mt-32 space-y-8">
          <div className="w-0.5 h-20 bg-zinc-900" />
          <button
            onClick={() => setDisplayLimit((prev) => prev + 4)}
            className="text-[12px] md:text-[14px] uppercase tracking-[0.5em] font-black border-2 border-zinc-900 px-16 py-6 md:px-20 md:py-8 hover:bg-zinc-900 hover:text-white transition-all duration-500 active:scale-95 shadow-lg"
          >
            Load More
          </button>
          <p className="text-[11px] uppercase tracking-[0.3em] text-zinc-400 font-bold">
            Showing {displayedProducts.length} of {products.length} Items
          </p>
        </div>
      )}
    </div>
  );
}