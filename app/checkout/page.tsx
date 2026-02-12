"use client"; // Change to client component to manage view state

import { useState } from "react";
import ProductCard from "@/components/ProductCard";
import CheckOutPage from "@/components/CheckOutPage";
import { getAllProducts, Product } from "@/types/Product";

export default function Page() {
  const [view, setView] = useState<"product" | "checkout">("product");
  const [orderData, setOrderData] = useState<{
    product: Product;
    size: string;
    color: { name: string; hex: string };
  } | null>(null);

  const handlePurchase = (product: Product, size: string, color: { name: string; hex: string }) => {
    setOrderData({ product, size, color });
    setView("checkout");
  };

  if (view === "checkout" && orderData) {
    return (
      <CheckOutPage
        product={orderData.product}
        selectedSize={orderData.size}
        selectedColor={orderData.color}
        onBack={() => setView("product")}
      />
    );
  }

  return <ProductCard onPurchase={handlePurchase} />;
}