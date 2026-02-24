/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { client } from "@/sanity/lib/client";
import { urlFor } from "@/sanity/lib/image";
import { Loader2, ChevronLeft, ArrowRight } from "lucide-react";

export default function SearchPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";
  
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchResults = async () => {
      if (!query) return;
      setLoading(true);
      
      const searchResults = await client.fetch(
        `*[_type == "product" && (name match $searchQuery || category match $searchQuery)] {
          _id,
          name,
          "slug": slug.current,
          price,
          "image": images.hero
        }`,
        { searchQuery: `*${query}*` } // FIXED: Changed from "query" to "searchQuery" to avoid conflict
      );
      
      setResults(searchResults);
      setLoading(false);
    };

    fetchResults();
  }, [query]);

  // Helper function to get product link - FIXED: Use slug if available, fallback to _id
  const getProductLink = (product: any) => {
    return product.slug ? `/products/${product.slug}` : `/products/${product._id}`;
  };

  return (
    <div className="min-h-screen bg-white text-black antialiased mt-24 md:mt-32 border-t border-neutral-200 font-serif">
      <nav className="sticky top-0 z-10 bg-white/80 backdrop-blur-md flex justify-between items-center px-4 md:px-16 py-6 border-b border-gray-100">
        <button onClick={() => router.back()} className="flex items-center gap-3 group">
          <ChevronLeft size={18} className="transition-transform group-hover:-translate-x-1" />
          <span className="text-[10px] md:text-[11px] uppercase tracking-[0.3em] font-bold font-sans">Back</span>
        </button>
        <span className="text-[10px] md:text-[11px] uppercase tracking-[0.5em] font-light text-gray-400 font-sans">Discovery</span>
      </nav>

      <div className="max-w-[1800px] mx-auto px-4 md:px-16 py-12 md:py-20">
        <div className="mb-16 md:mb-24">
          <h1 className="text-4xl md:text-7xl font-light tracking-tighter uppercase leading-tight">
            Finding <span className="font-black italic">"{query || "..."}"</span>
          </h1>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 gap-4">
            <Loader2 className="animate-spin text-neutral-200" size={40} />
          </div>
        ) : results.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-16">
            {results.map((product) => (
              <div key={product._id} className="group flex flex-col">
                <div className="relative aspect-[3/4] bg-[#F9F9F9] overflow-hidden mb-6 border border-transparent group-hover:border-neutral-100 transition-colors">
                  {product.image && (
                    <Image
                      src={urlFor(product.image).url()}
                      alt={product.name}
                      fill
                      unoptimized
                      className="object-contain p-8 group-hover:scale-105 transition-transform duration-1000 ease-out"
                    />
                  )}
                </div>
                <h3 className="text-[11px] md:text-xs font-black uppercase tracking-[0.2em] mb-2 font-sans">{product.name}</h3>
                <p className="text-sm font-light tracking-widest text-neutral-500 font-sans mb-4">{product.price}</p>
                <Link 
                  href={getProductLink(product)} // FIXED: Using helper function
                  className="inline-flex items-center gap-3 text-[10px] uppercase tracking-[0.2em] text-[#be1e2d] font-bold transition-all hover:gap-5"
                >
                  View Piece <ArrowRight size={14} />
                </Link>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-32 text-center">
             <p className="text-neutral-400 uppercase tracking-[0.4em] text-xs font-sans">No pieces found.</p>
          </div>
        )}
      </div>
    </div>
  );
}