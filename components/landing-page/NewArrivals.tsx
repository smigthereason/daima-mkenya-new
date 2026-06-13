// "use client";
// import React, { useState, useEffect, useCallback, useMemo } from "react";
// import { ChevronLeft, ChevronRight, ArrowUpRight } from "lucide-react";
// import Image from "next/image";
// import Link from "next/link";
// import { getNewArrivals, Product } from "@/types/Product"; // CHANGED: import getNewArrivals
// import { urlFor } from "@/sanity/lib/image";

// const ProductCard = ({
//   product,
//   isActive,
// }: {
//   product: Product;
//   isActive: boolean;
// }) => {
//   const [isHovered, setIsHovered] = useState(false);

//   // Use slug for the product link, fallback to ID
//   const productSlug = product.slug?.current || product._id;

//   // Logic fix: Swapped to ensure Hero is main and Thumbnail is the small popup
//   const heroImageUrl = product.images?.hero
//     ? urlFor(product.images.hero).url()
//     : "";
//   const thumbnailImageUrl = product.images?.thumbnails?.[0]
//     ? urlFor(product.images.thumbnails[0]).url()
//     : "";

//   return (
//     <div
//       className={`relative transition-all duration-1000 ease-out h-[60vh] md:h-[70vh] shrink-0
//                  ${
//                    isActive
//                      ? "w-[75vw] md:w-[40vw] scale-100 z-10"
//                      : "w-[15vw] md:w-[10vw] grayscale opacity-30 scale-90"
//                  }`}
//       onMouseEnter={() => setIsHovered(true)}
//       onMouseLeave={() => setIsHovered(false)}
//     >
//       <div className="relative w-full h-full overflow-hidden bg-neutral-100 shadow-2xl">
//         <div className="absolute inset-0 z-0">
//           {heroImageUrl && (
//             <Image
//               src={heroImageUrl}
//               alt={product.name}
//               fill
//               unoptimized
//               priority={isActive}
//               className={`object-cover object-top transition-transform duration-1000 ease-in-out
//                          ${isHovered ? "scale-110" : "scale-100"}`}
//             />
//           )}
//         </div>
//         <div className="absolute inset-0 bg-linear-to-b from-transparent via-transparent to-black/80 opacity-90" />

//         {/* Thumbnail Popup */}
//         <div
//           className={`absolute top-4 right-4 md:top-6 md:right-6 z-20 w-20 md:w-32 aspect-3/4 bg-white p-1 shadow-xl transition-all duration-500 delay-100
//                         ${isHovered ? "opacity-100 translate-x-0" : "opacity-0 translate-x-10"}`}
//         >
//           {thumbnailImageUrl && (
//             <Image
//               src={thumbnailImageUrl}
//               alt="product thumbnail"
//               fill
//               unoptimized
//               className="object-cover"
//             />
//           )}
//         </div>

//         <div
//           className={`absolute bottom-0 left-0 right-0 p-6 md:p-10 transition-all duration-500
//                         ${isActive ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"}`}
//         >
//           <div className="flex flex-col gap-1 md:gap-2">
//             <span className="text-white/70 text-[10px] md:text-xs tracking-[0.3em] font-light">
//               {product.category?.toUpperCase() || "NEW ARRIVAL"}
//             </span>
//             <h3 className="text-white text-xl md:text-3xl font-serif tracking-tight leading-tight uppercase">
//               {product.name}
//             </h3>
//             <div className="flex items-center gap-3 mt-2">
//               <span className="text-white font-medium text-lg">
//                 {product.price}
//               </span>
//               <div className="h-px w-8 md:w-12 bg-white/30" />
//               <Link
//                 href={`/products/${productSlug}`}
//                 className="flex items-center gap-2 text-white text-[10px] md:text-xs tracking-widest uppercase hover:text-neutral-300 transition-colors"
//               >
//                 SHOP NOW <ArrowUpRight size={14} />
//               </Link>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default function NewArrivals() {
//   const [products, setProducts] = useState<Product[]>([]);
//   const [order, setOrder] = useState<number[]>([]);
//   const [isPaused, setIsPaused] = useState(false);

//   const visualActiveIndex = 2;

//   useEffect(() => {
//     const fetchProducts = async () => {
//       const data = await getNewArrivals(); // CHANGED: Now only returns products with isNew == true
//       setProducts(data);
//       setOrder(Array.from({ length: data.length }, (_, i) => i));
//     };
//     fetchProducts();
//   }, []);

//   const rotate = useCallback((direction: "next" | "prev") => {
//     setOrder((prevOrder) => {
//       const newOrder = [...prevOrder];
//       if (direction === "next") {
//         const first = newOrder.shift()!;
//         newOrder.push(first);
//       } else {
//         const last = newOrder.pop()!;
//         newOrder.unshift(last);
//       }
//       return newOrder;
//     });
//   }, []);

//   useEffect(() => {
//     if (isPaused || products.length === 0) return;
//     const interval = setInterval(() => rotate("next"), 3000);
//     return () => clearInterval(interval);
//   }, [rotate, isPaused, products.length]);

//   const getTransformStyle = () => {
//     if (typeof window === "undefined") return {};

//     const isMobile = window.innerWidth < 768;
//     const activeWidthVw = isMobile ? 75 : 40;
//     const inactiveWidthVw = isMobile ? 15 : 10;
//     const gapVw = isMobile ? 3 : 5;

//     const offsetVw = visualActiveIndex * (inactiveWidthVw + gapVw);

//     return {
//       transform: `translateX(calc(50vw - (${activeWidthVw / 2}vw) - ${offsetVw}vw))`,
//     };
//   };

//   if (products.length === 0) return null;

//   return (
//     <section
//       className="relative min-h-screen bg-white overflow-hidden flex flex-col"
//       onMouseEnter={() => setIsPaused(true)}
//       onMouseLeave={() => setIsPaused(false)}
//     >
//       <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full pointer-events-none select-none opacity-[0.03] z-0">
//         <h1 className="text-[20vw] font-black tracking-tighter italic uppercase text-center leading-none">
//           Arrivals
//         </h1>
//       </div>

//       <header className="relative z-10 pt-12 px-6 md:px-12 flex justify-between items-end">
//         <div className="flex flex-col">
//           <span className="text-neutral-900 text-[10px] md:text-xs tracking-[0.5em] mb-2">
//             CURATED COLLECTION
//           </span>
//           <h2 className="text-neutral-900 text-5xl md:text-7xl font-serif font-black tracking-tighter leading-none">
//             NEW
//             <br />
//             ARRIVALS
//           </h2>
//         </div>
//         <div className="hidden md:block">
//           <Link
//             href="/products"
//             className="group flex items-center gap-4 border-b border-black pb-1 text-sm font-bold tracking-widest text-neutral-900"
//           >
//             EXPLORE ALL <ArrowUpRight size={18} />
//           </Link>
//         </div>
//       </header>

//       <div className="relative flex-1 flex items-center overflow-visible">
//         <div
//           className="flex items-center gap-3 md:gap-6 transition-transform duration-1000 cubic-bezier(1, 1, 1, 1)"
//           style={getTransformStyle()}
//         >
//           {order.map((originalIndex, visualPosition) => (
//             <ProductCard
//               key={products[originalIndex]._id}
//               product={products[originalIndex]}
//               isActive={visualPosition === visualActiveIndex}
//             />
//           ))}
//         </div>
//       </div>

//       <footer className="relative z-20 px-6 md:px-12 pb-12 flex flex-col md:flex-row justify-between items-center gap-8">
//         <div className="flex items-center gap-4">
//           <span className="font-serif text-2xl w-8">
//             0{order[visualActiveIndex] + 1}
//           </span>
//           <div className="w-32 md:w-48 h-0.5 bg-neutral-100 relative overflow-hidden">
//             <div
//               className="absolute inset-y-0 left-0 bg-black transition-all duration-1000 ease-out"
//               style={{
//                 width: `${((order[visualActiveIndex] + 1) / products.length) * 100}%`,
//               }}
//             />
//           </div>
//           <span className="font-serif text-2xl">0{products.length}</span>
//         </div>

//         <div className="flex gap-4">
//           <button
//             onClick={() => rotate("prev")}
//             className="w-14 h-14 border border-black/20 flex items-center justify-center hover:bg-black hover:text-white transition-all cursor-pointer active:scale-90"
//           >
//             <ChevronLeft size={24} />
//           </button>
//           <button
//             onClick={() => rotate("next")}
//             className="w-14 h-14 border border-black/20 flex items-center justify-center hover:bg-black hover:text-white transition-all cursor-pointer active:scale-90"
//           >
//             <ChevronRight size={24} />
//           </button>
//         </div>
//       </footer>
//     </section>
//   );
// }
"use client";
import React, { useState, useEffect, useCallback, useMemo } from "react";
import { ChevronLeft, ChevronRight, ArrowUpRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { getNewArrivals, Product } from "@/types/Product";
import { urlFor } from "@/sanity/lib/image";

const ProductCard = ({
  product,
  isActive,
}: {
  product: Product;
  isActive: boolean;
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const productSlug = product.slug?.current || product._id;

  const heroImageUrl = product.images?.hero
    ? urlFor(product.images.hero).url()
    : "";
  const thumbnailImageUrl = product.images?.thumbnails?.[0]
    ? urlFor(product.images.thumbnails[0]).url()
    : "";

  return (
    <div
      className={`relative transition-all duration-1000 ease-out h-[60vh] md:h-[70vh] shrink-0
                 ${
                   isActive
                     ? "w-[75vw] md:w-[40vw] scale-100 z-10"
                     : "w-[15vw] md:w-[10vw] grayscale opacity-30 scale-90"
                 }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative w-full h-full overflow-hidden bg-neutral-100 shadow-2xl">
        <div className="absolute inset-0 z-0">
          {heroImageUrl && (
            <Image
              src={heroImageUrl}
              alt={product.name}
              fill
              unoptimized
              priority={isActive}
              className={`object-cover object-top transition-transform duration-1000 ease-in-out
                         ${isHovered ? "scale-110" : "scale-100"}`}
            />
          )}
        </div>
        <div className="absolute inset-0 bg-linear-to-b from-transparent via-transparent to-black/80 opacity-90" />

        {/* Thumbnail Popup */}
        <div
          className={`absolute top-4 right-4 md:top-6 md:right-6 z-20 w-20 md:w-32 aspect-3/4 bg-white p-1 shadow-xl transition-all duration-500 delay-100
                        ${isHovered ? "opacity-100 translate-x-0" : "opacity-0 translate-x-10"}`}
        >
          {thumbnailImageUrl && (
            <Image
              src={thumbnailImageUrl}
              alt="product thumbnail"
              fill
              unoptimized
              className="object-cover"
            />
          )}
        </div>

        <div
          className={`absolute bottom-0 left-0 right-0 p-6 md:p-10 transition-all duration-500
                        ${isActive ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"}`}
        >
          <div className="flex flex-col gap-1 md:gap-2">
            <span className="text-white/70 text-[10px] md:text-xs tracking-[0.3em] font-light">
              {/* FIXED: use categories array instead of category string */}
              {product.categories?.[0]?.toUpperCase() || "NEW ARRIVAL"}
            </span>
            <h3 className="text-white text-xl md:text-3xl font-serif tracking-tight leading-tight uppercase">
              {product.name}
            </h3>
            <div className="flex items-center gap-3 mt-2">
              <span className="text-white font-medium text-lg">
                {product.price}
              </span>
              <div className="h-px w-8 md:w-12 bg-white/30" />
              <Link
                href={`/products/${productSlug}`}
                className="flex items-center gap-2 text-white text-[10px] md:text-xs tracking-widest uppercase hover:text-neutral-300 transition-colors"
              >
                SHOP NOW <ArrowUpRight size={14} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function NewArrivals() {
  const [products, setProducts] = useState<Product[]>([]);
  const [order, setOrder] = useState<number[]>([]);
  const [isPaused, setIsPaused] = useState(false);

  const visualActiveIndex = 2;

  useEffect(() => {
    const fetchProducts = async () => {
      const data = await getNewArrivals();
      setProducts(data);
      setOrder(Array.from({ length: data.length }, (_, i) => i));
    };
    fetchProducts();
  }, []);

  const rotate = useCallback((direction: "next" | "prev") => {
    setOrder((prevOrder) => {
      const newOrder = [...prevOrder];
      if (direction === "next") {
        const first = newOrder.shift()!;
        newOrder.push(first);
      } else {
        const last = newOrder.pop()!;
        newOrder.unshift(last);
      }
      return newOrder;
    });
  }, []);

  useEffect(() => {
    if (isPaused || products.length === 0) return;
    const interval = setInterval(() => rotate("next"), 3000);
    return () => clearInterval(interval);
  }, [rotate, isPaused, products.length]);

  const getTransformStyle = () => {
    if (typeof window === "undefined") return {};

    const isMobile = window.innerWidth < 768;
    const activeWidthVw = isMobile ? 75 : 40;
    const inactiveWidthVw = isMobile ? 15 : 10;
    const gapVw = isMobile ? 3 : 5;

    const offsetVw = visualActiveIndex * (inactiveWidthVw + gapVw);

    return {
      transform: `translateX(calc(50vw - (${activeWidthVw / 2}vw) - ${offsetVw}vw))`,
    };
  };

  if (products.length === 0) return null;

  return (
    <section
      className="relative min-h-screen bg-white overflow-hidden flex flex-col"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full pointer-events-none select-none opacity-[0.03] z-0">
        <h1 className="text-[20vw] font-black tracking-tighter italic uppercase text-center leading-none">
          Arrivals
        </h1>
      </div>

      <header className="relative z-10 pt-12 px-6 md:px-12 flex justify-between items-end">
        <div className="flex flex-col">
          <span className="text-neutral-900 text-[10px] md:text-xs tracking-[0.5em] mb-2">
            CURATED COLLECTION
          </span>
          <h2 className="text-neutral-900 text-5xl md:text-7xl font-serif font-black tracking-tighter leading-none">
            NEW
            <br />
            ARRIVALS
          </h2>
        </div>
        <div className="hidden md:block">
          <Link
            href="/products"
            className="group flex items-center gap-4 border-b border-black pb-1 text-sm font-bold tracking-widest text-neutral-900"
          >
            EXPLORE ALL <ArrowUpRight size={18} />
          </Link>
        </div>
      </header>

      <div className="relative flex-1 flex items-center overflow-visible">
        <div
          className="flex items-center gap-3 md:gap-6 transition-transform duration-1000 cubic-bezier(1, 1, 1, 1)"
          style={getTransformStyle()}
        >
          {order.map((originalIndex, visualPosition) => (
            <ProductCard
              key={products[originalIndex]._id}
              product={products[originalIndex]}
              isActive={visualPosition === visualActiveIndex}
            />
          ))}
        </div>
      </div>

      <footer className="relative z-20 px-6 md:px-12 pb-12 flex flex-col md:flex-row justify-between items-center gap-8">
        <div className="flex items-center gap-4">
          <span className="font-serif text-2xl w-8">
            0{order[visualActiveIndex] + 1}
          </span>
          <div className="w-32 md:w-48 h-0.5 bg-neutral-100 relative overflow-hidden">
            <div
              className="absolute inset-y-0 left-0 bg-black transition-all duration-1000 ease-out"
              style={{
                width: `${((order[visualActiveIndex] + 1) / products.length) * 100}%`,
              }}
            />
          </div>
          <span className="font-serif text-2xl">0{products.length}</span>
        </div>

        <div className="flex gap-4">
          <button
            onClick={() => rotate("prev")}
            className="w-14 h-14 border border-black/20 flex items-center justify-center hover:bg-black hover:text-white transition-all cursor-pointer active:scale-90"
          >
            <ChevronLeft size={24} />
          </button>
          <button
            onClick={() => rotate("next")}
            className="w-14 h-14 border border-black/20 flex items-center justify-center hover:bg-black hover:text-white transition-all cursor-pointer active:scale-90"
          >
            <ChevronRight size={24} />
          </button>
        </div>
      </footer>
    </section>
  );
}
