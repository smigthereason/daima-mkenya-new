// components/LatestTrends.tsx
"use client";

import { useState } from 'react';

interface TrendProduct {
  id: number;
  name: string;
  price: string;
  image: string;
}

interface LatestTrendsProps {
  title?: string;
  products: TrendProduct[];
}

export default function LatestTrends({ 
  title = 'LATEST TRENDS',
  products 
}: LatestTrendsProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;
  const totalPages = Math.ceil(products.length / itemsPerPage);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const displayedProducts = products.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="w-full py-12">
      <div className="max-w-7xl mx-auto px-4">
        {/* Title */}
        <h2 className="text-3xl md:text-4xl font-black mb-8 tracking-tight uppercase">
          {title}
        </h2>

        {/* 1x3 Grid */}
        <div className="grid grid-cols-3 gap-4 md:gap-6">
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
    </div>
  );
}