// components/ProductGrid.tsx
"use client";

import { useState } from 'react';
import { RelatedProduct } from '@/types/Product';

interface ProductGridProps {
  products: RelatedProduct[];
  columns?: 3 | 4;
}

export default function ProductGrid({ products, columns = 3 }: ProductGridProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;
  const totalPages = Math.ceil(products.length / itemsPerPage);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const displayedProducts = products.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="w-full">
      {/* Product Grid */}
      <div className={`grid ${columns === 3 ? 'grid-cols-3' : 'grid-cols-4'} gap-4 md:gap-6`}>
        {displayedProducts.map((product) => (
          <div key={product.id} className="group cursor-pointer">
            <div className="bg-gray-100 aspect-[3/4] relative overflow-hidden mb-3">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <div className="flex justify-between items-center">
              <h3 className="text-xs font-semibold tracking-wider uppercase">
                {product.name}
              </h3>
              <span className="text-xs bg-black text-white px-2 py-1 font-bold">
                {product.price}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-8">
          <button
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className="w-8 h-8 flex items-center justify-center text-xl disabled:opacity-30"
          >
            ◀
          </button>
          <div className="flex gap-1">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
              <button
                key={num}
                onClick={() => setCurrentPage(num)}
                className={`w-8 h-8 flex items-center justify-center text-sm font-bold transition-colors ${
                  currentPage === num
                    ? 'bg-black text-white'
                    : 'bg-gray-200 text-black hover:bg-gray-300'
                }`}
              >
                {num}
              </button>
            ))}
          </div>
          <button
            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
            className="w-8 h-8 flex items-center justify-center text-xl disabled:opacity-30"
          >
            ▶
          </button>
        </div>
      )}
    </div>
  );
}