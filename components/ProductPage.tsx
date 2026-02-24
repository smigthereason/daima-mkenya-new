"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import ProductGrid from "./products/ProductGrid";
import ProductHero from "./products/ProductHero";
import { Product, getAllProducts } from "@/types/Product";

export default function ProductPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Fetch all products from Sanity on mount
  useEffect(() => {
    const loadProducts = async () => {
      try {
        const data = await getAllProducts();
        setProducts(data);
      } catch (error) {
        console.error("Failed to fetch products:", error);
      } finally {
        setLoading(false);
      }
    };
    loadProducts();
  }, []);

  const handleQuickView = (id: string, slug?: string) => {
    // Navigate to product detail page using slug
    const path = slug || id;
    router.push(`/products/${path}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#e8e8e8]">
        <p className="text-[14px] uppercase tracking-[0.5em] animate-pulse">Loading Collection...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen mt-16 bg-[#e8e8e8]">
      <ProductGrid
        products={products}
        columns={3}
        onQuickView={handleQuickView}
      />
      <ProductHero />
    </div>
  );
}