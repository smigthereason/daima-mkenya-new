// components/ProductPage.tsx
"use client";

import ProductCard from "@/components/ProductCard";
import ProductGrid from "./products/ProductGrid";
import CrossingBanners from "./products/CrossingBanners";
import ProductHero from "./products/ProductHero";
import { relatedProducts } from "../types/Product";

/* ─────────────────────────── product data ─────────────────────────── */
const productData = {
  name: "CAMILLE HENROT ARTWORK TROUSERS",
  price: "1.150,00€",
  description: [
    "Black Wide Leg Pants In Technical Nylon",
    "Elasticated Waist Band",
    "Side Slit Pockets With Zip",
    "Drawstring On Hem To Adjust The Leg",
    "Zip-Off System Below The Knee",
  ],
  details: {
    material: "100% Technical Nylon",
    care: "Dry Clean Only",
    origin: "Made in Italy",
  },
  colors: [
    { label: "BLACK", hex: "#000000" },
    { label: "WHITE", hex: "#f0f0f0" },
  ],
  sizes: ["36", "38", "40"],
  images: {
    thumbnails: [
      "https://images.unsplash.com/photo-1552902865-b72c031ac5ea?w=160&h=280&fit=crop&crop=top",
      "https://images.unsplash.com/photo-1552902865-b72c031ac5ea?w=160&h=280&fit=crop&crop=center",
      "https://images.unsplash.com/photo-1552902865-b72c031ac5ea?w=160&h=280&fit=crop&crop=bottom",
    ],
    hero: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=680&h=900&fit=crop&crop=top",
  },
};

/* ─────────────────────────── main component ────────────────── */
export default function ProductPage() {
  return (
    <div className="min-h-screen mt-16 bg-white">
      {/* Main Product Card - matches the top half of your image */}
      <ProductCard
        name={productData.name}
        price={productData.price}
        description={productData.description}
        details={productData.details}
        colors={productData.colors}
        sizes={productData.sizes}
        images={productData.images}
      />

      {/* Product Grid - PASS THE PRODUCTS PROP! */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <h2 className="text-3xl md:text-4xl font-black text-black mb-8 tracking-tight uppercase">
          You May Also Like
        </h2>
        <ProductGrid products={relatedProducts} columns={3} />
      </div>

      {/* Crossing Banners */}
      <CrossingBanners />

    
      {/* Product Hero */}
      <ProductHero />
    </div>
  );
}