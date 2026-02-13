"use client";

import { useState, useRef } from "react";
import ProductCard from "@/components/ProductCard";
import ProductGrid from "./products/ProductGrid";
import ProductHero from "./products/ProductHero";
import { relatedProducts } from "../types/Product";

export default function ProductPage() {
  const [selectedId, setSelectedId] = useState(1);
  const detailViewRef = useRef<HTMLDivElement>(null);

  const handleQuickView = (id: number) => {
    setSelectedId(id);
    detailViewRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="min-h-screen mt-16 bg-[#e8e8e8]">
      <div ref={detailViewRef}>
        <ProductCard productId={selectedId} />
      </div>
      <ProductGrid products={relatedProducts} columns={3} onQuickView={handleQuickView} />
      <ProductHero />
    </div>
  );
}