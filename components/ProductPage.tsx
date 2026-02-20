// "use client";

// import { useState, useRef } from "react";
// import ProductCard from "@/components/ProductCard";
// import ProductGrid from "./products/ProductGrid";
// import ProductHero from "./products/ProductHero";
// import { relatedProducts } from "../types/Product";

// export default function ProductPage() {
//   const [selectedId, setSelectedId] = useState(1);
//   const detailViewRef = useRef<HTMLDivElement>(null);

//   const handleQuickView = (id: number) => {
//     setSelectedId(id);
//     detailViewRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
//   };

//   return (
//     <div className="min-h-screen mt-16 bg-[#e8e8e8]">
//       <div ref={detailViewRef}>
//         <ProductCard productId={selectedId} />
//       </div>
//       <ProductGrid products={relatedProducts} columns={3} onQuickView={handleQuickView} />
//       <ProductHero />
//     </div>
//   );
// }

"use client";

import { useState, useEffect, useRef } from "react";
import ProductCard from "@/components/ProductCard";
import ProductGrid from "./products/ProductGrid";
import ProductHero from "./products/ProductHero";
import { Product, getAllProducts } from "@/types/Product";

export default function ProductPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedId, setSelectedId] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const detailViewRef = useRef<HTMLDivElement>(null);


  // 1. Fetch all products from Sanity on mount
  useEffect(() => {
    const loadProducts = async () => {
      try {
        const data = await getAllProducts();
        setProducts(data);
        if (data.length > 0) {
          setSelectedId(data[0]._id); // Set the first product as default
        }
      } catch (error) {
        console.error("Failed to fetch products:", error);
      } finally {
        setLoading(false);
      }
    };
    loadProducts();
  }, []);

  const handleQuickView = (id: string) => {
    setSelectedId(id);
    detailViewRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
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


      {/* 2. Pass the fetched products array to the Grid */}
      <ProductGrid
        products={products}
        columns={3}
        onQuickView={handleQuickView}
      />

      <div ref={detailViewRef}>
        {/* Pass the dynamic ID to the Card */}
        <ProductCard productId={selectedId} />
      </div>

      <ProductHero />
    </div>
  );
}