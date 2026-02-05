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

    
        <ProductGrid products={relatedProducts} columns={3} />
      

      {/* Crossing Banners */}
      {/* <CrossingBanners /> */}

    
      {/* Product Hero */}
      <ProductHero />
    </div>
  );
}