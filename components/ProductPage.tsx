"use client";

import { useState, useRef } from "react";
import ProductCard from "@/components/ProductCard";
import ProductGrid from "./products/ProductGrid";
import ProductHero from "./products/ProductHero";
import CheckOutPage from "@/components/CheckOutPage"; // Ensure this import is correct
import { relatedProducts, Product } from "../types/Product";

export default function ProductPage() {
  const [selectedId, setSelectedId] = useState(1);
  // State to hold the data for the item being purchased
  const [checkoutData, setCheckoutData] = useState<{
    product: Product;
    size: string;
    color: { name: string; hex: string };
  } | null>(null);

  const detailViewRef = useRef<HTMLDivElement>(null);

  const handleQuickView = (id: number) => {
    setSelectedId(id);
    detailViewRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  // Logic to trigger the view change
  const handlePurchase = (product: Product, size: string, color: { name: string; hex: string }) => {
    setCheckoutData({ product, size, color });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // If the user has clicked purchase, show the Checkout Page instead
  if (checkoutData) {
    return (
      <CheckOutPage
        product={checkoutData.product}
        selectedSize={checkoutData.size}
        selectedColor={checkoutData.color}
        onBack={() => setCheckoutData(null)}
      />
    );
  }

  return (
    <div className="min-h-screen mt-16 bg-[#e8e8e8]">
      <div ref={detailViewRef}>
        <ProductCard 
          productId={selectedId} 
          onPurchase={handlePurchase} // Pass the handler to the card
        />
      </div>

      <ProductGrid 
        products={relatedProducts} 
        columns={3} 
        onQuickView={handleQuickView}
      />

      <ProductHero />
    </div>
  );
}