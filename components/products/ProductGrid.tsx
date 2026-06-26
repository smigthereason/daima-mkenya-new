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
  onQuickView?: (productId: string, slug?: string) => void;
}

export default function ProductGrid({
  products,
  columns = 3,
  onQuickView,
}: ProductGridProps) {
  const [displayLimit, setDisplayLimit] = useState(8);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const categories = [
    "All",
    "Accessories",
    "Collections", // Special: shows products with a collection reference
    "Streetwear",
    "Sets",
    "Shirts",
    "Tops",
    "Skirts",
    "Dresses",
    "Jackets",
    "Trousers",
    "Knitwear",
  ];

  // Filter and Sort logic
  const filteredProducts = useMemo(() => {
    let result = products;

    if (selectedCategory !== "All") {
      if (selectedCategory === "Collections") {
        // Show products that are part of any collection
        result = result.filter((p) => p.collection != null);
      } else {
        // Normal category filter: check if categories array includes the selected category
        result = result.filter(
          (p) => p.categories && p.categories.includes(selectedCategory),
        );
      }
    }

    // Dynamic Sorting based on active filter
    return [...result].sort((a, b) => {
      if (selectedCategory === "Collections") {
        // Sort alphabetically by product name (A-Z)
        const nameA = a.name ? a.name.toLowerCase() : "";
        const nameB = b.name ? b.name.toLowerCase() : "";
        return nameA.localeCompare(nameB);
      } else {
        // Default Sort: new arrivals first
        if (a.isNew === true && b.isNew !== true) return -1;
        if (b.isNew === true && a.isNew !== true) return 1;
        return 0;
      }
    });
  }, [products, selectedCategory]);

  const displayedProducts = filteredProducts.slice(0, displayLimit);
  const hasMore = displayLimit < filteredProducts.length;

  const handleQuickViewClick = (productId: string, slug?: string) => {
    if (onQuickView) onQuickView(productId, slug);
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setDisplayLimit(8);
    setIsFilterOpen(false);
  };

  const isOutOfStock = (product: Product) => product.stock === 0;

  return (
    <div className="w-full bg-[#e8e8e8] py-10 md:py-20 px-4 sm:px-8 lg:px-16 text-black antialiased">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 md:mb-16 border-b-2 border-neutral-300 pb-8 gap-6">
        <div>
          <span className="text-[11px] md:text-[12px] uppercase tracking-[0.5em] text-zinc-400 block mb-3 font-bold">
            The Selection
          </span>
          <h2 className="text-lg md:text-2xl uppercase tracking-[0.2em] font-black text-zinc-900">
            {selectedCategory === "All"
              ? "Current Collection"
              : selectedCategory}{" "}
            <span className="text-zinc-400 ml-2 font-light">
              ({filteredProducts.length})
            </span>
          </h2>
        </div>

        {/* Filter Dropdown */}
        <div className="relative w-full md:w-64">
          <button
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className="w-full flex justify-between items-center border border-zinc-900/10 bg-white/50 backdrop-blur-sm px-6 py-4 text-[11px] font-black uppercase tracking-[0.3em] transition-all hover:bg-white"
          >
            Filter: {selectedCategory}
            <ChevronDown
              size={14}
              className={`transition-transform duration-300 ${isFilterOpen ? "rotate-180" : ""}`}
            />
          </button>

          {isFilterOpen && (
            <div className="absolute top-full right-0 left-0 mt-2 bg-white shadow-2xl z-50 border border-neutral-200">
              <div className="max-h-60 overflow-y-auto">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => handleCategoryChange(cat)}
                    className={`w-full text-left px-6 py-4 text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-zinc-900 hover:text-white transition-colors
                      ${selectedCategory === cat ? "bg-zinc-100" : ""}`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Product Grid or Empty State */}
      {filteredProducts.length > 0 ? (
        <div
          className={`grid gap-x-6 gap-y-12 sm:gap-x-8 sm:gap-y-16
            grid-cols-1
            sm:grid-cols-2
            ${columns === 3 ? "lg:grid-cols-3" : "lg:grid-cols-4"}
          `}
        >
          {displayedProducts.map((product) => {
            const outOfStock = isOutOfStock(product);
            return (
              <div
                key={product._id}
                className={`group cursor-pointer flex flex-col w-full ${
                  outOfStock ? "opacity-70" : ""
                }`}
              >
                <Link
                  href={`/products/${product.slug?.current || product._id}`}
                  className="block w-full"
                >
                  <div className="relative w-full aspect-[3/4] bg-[#F9F9F9] overflow-hidden mb-5 md:mb-6">
                    {product.images?.hero && (
                      <Image
                        src={urlFor(product.images.hero).url()}
                        alt={product.name}
                        fill
                        unoptimized
                        className={`object-cover transition-transform duration-700 ease-out ${
                          !outOfStock ? "group-hover:scale-105" : ""
                        }`}
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      />
                    )}

                    {outOfStock && (
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-10">
                        <span className="bg-white text-black text-[11px] font-black uppercase tracking-[0.3em] px-4 py-2 shadow-lg">
                          SOLD OUT
                        </span>
                      </div>
                    )}

                    {product.isNew === true && !outOfStock && (
                      <div className="absolute top-3 left-3 z-10">
                        <span className="bg-black text-white text-[9px] font-black uppercase tracking-[0.2em] px-2 py-1">
                          NEW
                        </span>
                      </div>
                    )}

                    {!outOfStock && (
                      <div className="hidden lg:flex absolute inset-0 bg-black/5 items-end justify-center pb-12 opacity-0 group-hover:opacity-100 transition-all duration-500">
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleQuickViewClick(
                              product._id,
                              product.slug?.current,
                            );
                          }}
                          className="group relative overflow-hidden border-2 border-zinc-900 bg-zinc-900 px-10 py-5 text-[11px] font-black uppercase tracking-[0.4em] shadow-2xl transition-colors duration-300"
                        >
                          <span className="absolute inset-0 z-0 translate-y-full bg-white transition-transform duration-500 ease-out group-hover:translate-y-0" />
                          <span className="relative z-10 text-white transition-colors duration-500 group-hover:text-zinc-900">
                            View Piece
                          </span>
                        </button>
                      </div>
                    )}
                  </div>
                </Link>

                <div className="flex flex-col items-center text-center space-y-2 px-2">
                  <span className="text-[9px] md:text-[10px] uppercase tracking-[0.3em] text-zinc-500 font-bold">
                    {product.categories?.[0] || "New Arrival"}
                  </span>
                  <h3 className="text-[13px] md:text-[15px] font-black tracking-wider  text-zinc-900 leading-tight min-h-[2.5rem] line-clamp-2">
                    {product.name}
                  </h3>
                  <p className="text-[14px] md:text-[16px] font-medium tracking-wide text-zinc-900">
                    {product.price}
                  </p>
                  {outOfStock && (
                    <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-red-600 mt-1">
                      Out of Stock
                    </span>
                  )}
                </div>

                <div className="mt-4 flex justify-center gap-2 min-h-[1.5rem] lg:opacity-0 lg:group-hover:opacity-100 transition-all duration-500">
                  {product.colors?.slice(0, 4).map((color, idx) => (
                    <div
                      key={`${product._id}-color-${idx}`}
                      className="w-3 h-3 md:w-3.5 md:h-3.5 rounded-full ring-1 ring-offset-4 ring-transparent group-hover:ring-zinc-900 shadow-sm"
                      style={{ backgroundColor: color.hex }}
                      title={color.label}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-40 text-center">
          <p className="text-[12px] md:text-[14px] uppercase tracking-[0.5em] text-zinc-400 font-bold mb-4">
            Collection Update
          </p>
          <h3 className="text-lg md:text-xl font-black uppercase tracking-[0.2em] text-zinc-900">
            There are currently no items in the{" "}
            <span className="text-zinc-400">{selectedCategory}</span> category.
          </h3>
          <button
            onClick={() => setSelectedCategory("All")}
            className="mt-8 text-[11px] font-black uppercase tracking-[0.3em] border-b border-black pb-1 hover:text-zinc-400 hover:border-zinc-400 transition-all"
          >
            View Full Collection
          </button>
        </div>
      )}

      {hasMore && (
        <div className="flex flex-col items-center mt-16 md:mt-24 space-y-6">
          <div className="w-0.5 h-16 bg-zinc-900" />
          <button
            onClick={() => setDisplayLimit((prev) => prev + 8)}
            className="group relative overflow-hidden border-2 border-zinc-900 bg-zinc-900 px-12 py-5 text-[11px] font-black tracking-[0.4em] uppercase text-white transition-colors duration-500 hover:bg-white hover:text-zinc-900"
          >
            <span className="relative z-10">Load More</span>
          </button>
          <p className="text-[10px] uppercase tracking-[0.3em] text-zinc-400 font-bold">
            Showing {displayedProducts.length} of {filteredProducts.length}{" "}
            Items
          </p>
        </div>
      )}
    </div>
  );
}
