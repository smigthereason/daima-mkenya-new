// components/ProductPage.tsx
"use client";

import ProductCard from "@/components/ProductCard";
import ProductGrid from "./products/ProductGrid";
// import CrossingBanners from "./products/CrossingBanners";
import ProductHero from "./products/ProductHero";
import { relatedProducts } from "../types/Product";



/* ─────────────────────────── main component ────────────────── */
export default function ProductPage() {
  return (
    <div className="min-h-screen mt-16 bg-white">
      {/* Main Product Card - matches the top half of your image */}
      <ProductCard
        
      />

      {/* Product Grid - PASS THE PRODUCTS PROP! */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <h2 className="text-3xl md:text-4xl font-black text-black mb-8 tracking-tight uppercase">
          You May Also Like
        </h2>
        <ProductGrid products={relatedProducts} columns={3} />
      </div>

      {/* Crossing Banners */}
      {/* <CrossingBanners /> */}

    
      {/* Product Hero */}
      <ProductHero />
    </div>
  );
}