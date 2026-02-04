// components/ProductGrid.tsx
"use client";

import { useState } from 'react';
import { Product } from '@/types/Product';

interface ProductGridProps {
  products: Product[];
  columns?: 3 | 4;
}

export default function ProductGrid({ products, columns = 3 }: ProductGridProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;
  const totalPages = Math.ceil(products.length / itemsPerPage);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const displayedProducts = products.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="w-full px-3 sm:px-4 md:px-6 lg:px-8">
      {/* Product Grid */}
      <div 
        className={`grid gap-3 sm:gap-4 md:gap-5 lg:gap-6 
          grid-cols-1 
          sm:grid-cols-2 
          ${columns === 3 ? 'lg:grid-cols-3' : 'lg:grid-cols-4'}
          ${columns === 3 ? 'md:grid-cols-2 lg:grid-cols-3' : 'md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'}
        `}
      >
        {displayedProducts.map((product) => (
          <div key={product.id} className="group cursor-pointer">
            <div className="bg-[#e8e8e8] aspect-[3/4] relative overflow-hidden mb-2 sm:mb-3 md:mb-4">
              <img
                src={product.images.hero}
                alt={product.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <div className="flex justify-between items-start sm:items-center gap-2">
              <h3 className="text-xs sm:text-sm md:text-base lg:text-lg font-semibold tracking-wider uppercase text-black leading-tight line-clamp-2">
                {product.name}
              </h3>
              <span className="text-xs sm:text-sm md:text-base text-black px-1.5 sm:px-2 py-0.5 sm:py-1 font-bold flex-shrink-0">
                {product.price}
              </span>
            </div>
            <div className="mt-1.5 sm:mt-2 md:mt-3">
              <div className="flex gap-1">
                {product.colors.slice(0, 3).map((color) => (
                  <div
                    key={color.hex}
                    className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4 rounded-full border border-gray-300"
                    style={{ backgroundColor: color.hex }}
                    title={color.label}
                  />
                ))}
                {product.colors.length > 3 && (
                  <div className="text-[10px] sm:text-xs text-gray-500 flex items-center">
                    +{product.colors.length - 3}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-1.5 sm:gap-2 md:gap-3 mt-6 sm:mt-8 md:mt-10">
          <button
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 flex items-center justify-center text-sm sm:text-base md:text-lg disabled:opacity-30 hover:bg-gray-100 rounded transition-colors"
            aria-label="Previous page"
          >
            ◀
          </button>
          <div className="flex gap-0.5 sm:gap-1 md:gap-1.5">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
              <button
                key={num}
                onClick={() => setCurrentPage(num)}
                className={`w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 flex items-center justify-center text-xs sm:text-sm font-medium transition-colors rounded ${
                  currentPage === num
                    ? 'bg-black text-white'
                    : 'bg-gray-100 text-black hover:bg-gray-200'
                }`}
              >
                {num}
              </button>
            ))}
          </div>
          <button
            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
            className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 flex items-center justify-center text-sm sm:text-base md:text-lg disabled:opacity-30 hover:bg-gray-100 rounded transition-colors"
            aria-label="Next page"
          >
            ▶
          </button>
        </div>
      )}
    </div>
  );
}