"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Product, sampleProduct, getAllProducts } from "@/types/Product";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function ProductCard({ productId = 1 }: { productId?: number }) {
  const allProducts = getAllProducts();

  const [activeProduct, setActiveProduct] = useState<Product>(() => {
    const initialProduct =
      allProducts.find((p) => p.id === productId) || sampleProduct;
    return initialProduct;
  });

  const [currentProductIndex, setCurrentProductIndex] = useState(() => {
    return allProducts.findIndex((p) => p.id === productId);
  });

  const [activeThumb, setActiveThumb] = useState(0);
  const [isFading, setIsFading] = useState(false);

  // Update product when productId prop changes
  useEffect(() => {
    const newProduct =
      allProducts.find((p) => p.id === productId) || sampleProduct;
    const newIndex = allProducts.findIndex((p) => p.id === productId);

    triggerFade(() => {
      setActiveProduct(newProduct);
      setCurrentProductIndex(newIndex);
      setActiveThumb(0);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productId]);

  const triggerFade = (callback: () => void) => {
    setIsFading(true);
    setTimeout(() => {
      callback();
      setIsFading(false);
    }, 350);
  };

  const goToNextProduct = () => {
    const nextIndex = (currentProductIndex + 1) % allProducts.length;
    const nextProduct = allProducts[nextIndex];
    triggerFade(() => {
      setCurrentProductIndex(nextIndex);
      setActiveProduct(nextProduct);
      setActiveThumb(0);
    });
  };

  const goToPrevProduct = () => {
    const prevIndex =
      currentProductIndex === 0
        ? allProducts.length - 1
        : currentProductIndex - 1;
    const prevProduct = allProducts[prevIndex];
    triggerFade(() => {
      setCurrentProductIndex(prevIndex);
      setActiveProduct(prevProduct);
      setActiveThumb(0);
    });
  };

  const handleThumbChange = (index: number) => {
    if (index === activeThumb) return;
    triggerFade(() => setActiveThumb(index));
  };

  const [selectedColor, setSelectedColor] = useState(0);
  const [selectedSize, setSelectedSize] = useState(0);
  const [descOpen, setDescOpen] = useState(true);

  const titleParts = activeProduct.name.split(" ");
  const titleLine1 = titleParts.slice(0, 2).join(" ");
  const titleLine2 = titleParts.slice(2).join(" ");

  return (
    <div className="flex flex-col xl:flex-row w-full bg-white relative min-h-screen text-black antialiased overflow-x-hidden mt-20 md:mt-32">
      
      {/* ── LUXURY FLOATING NAV (Centered on Mobile/Tablet, Right-aligned on Desktop) ── */}
      <div className="absolute top-6 left-1/2 -translate-x-1/2 xl:left-auto xl:translate-x-0 xl:top-10 xl:right-12 z-30 flex items-center gap-8">
        <div className="flex items-center gap-8 bg-white/60 backdrop-blur-md px-6 py-3 rounded-full border border-gray-200/50 shadow-sm">
          <button onClick={goToPrevProduct} className="hover:opacity-30 transition-opacity p-1 group cursor-pointer">
            <ChevronLeft size={24} className="font-medium" />
          </button>
          <span className="text-[14px] tracking-[0.5em] text-gray-500 font-light whitespace-nowrap">
            {String(currentProductIndex + 1).padStart(2, "0")} /{" "}
            {String(allProducts.length).padStart(2, "0")}
          </span>
          <button onClick={goToNextProduct} className="hover:opacity-30 transition-opacity p-1 group cursor-pointer">
            <ChevronRight size={24} className="font-medium" />
          </button>
        </div>
      </div>

      {/* ───────── LEFT PANEL (Thumbnails & Info) ───────── */}
      <div className="order-2 xl:order-1 flex flex-col w-full xl:w-[32%] p-8 md:p-12 xl:p-16 border-r border-gray-50 bg-white">
        <div className="mb-10 md:mb-16">
          <span className="text-[14px] uppercase tracking-[0.5em] text-gray-400 block mb-4 font-light">
            The Collection
          </span>
          <span className="text-[12px] uppercase tracking-[0.3em] font-bold border-b-2 border-black pb-2">
            {activeProduct.category || "Exotic Leather"}
          </span>
        </div>

        <style jsx>{`
          .no-scrollbar::-webkit-scrollbar { display: none; }
          .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        `}</style>
        <div className="flex flex-row gap-6 mb-12 md:mb-20 overflow-x-auto no-scrollbar pb-4 -mx-2 px-2">
          {activeProduct.images.thumbnails.map((src, i) => (
            <button
              key={i}
              onClick={() => handleThumbChange(i)}
              className={`relative shrink-0 transition-all duration-700 ease-in-out group ${i === activeThumb ? "opacity-100 scale-100" : "opacity-30 hover:opacity-60 scale-[0.96]"
                }`}
            >
              <div className="w-40 h-55 md:w-50 md:h-65 bg-[#fcfcfc] relative overflow-hidden shadow-sm">
                <Image
                  src={src}
                  alt=""
                  fill
                  className={`object-cover transition-transform duration-1000 ${i === activeThumb ? 'scale-110' : 'scale-100 group-hover:scale-105'}`}
                  sizes="(max-width: 768px) 160px, 200px"
                />
              </div>
              {i === activeThumb && (
                <div className="absolute -bottom-3 left-0 w-full h-0.5 bg-black animate-in fade-in slide-in-from-left-4 duration-500" />
              )}
            </button>
          ))}
        </div>

        <div className="border-t border-gray-100 mt-auto">
          <div className="border-b border-gray-100">
            <button
              onClick={() => setDescOpen(!descOpen)}
              className="w-full flex justify-between items-center py-6 md:py-8"
            >
              <span className="text-[14px] uppercase tracking-[0.3em] font-bold">
                Product Narrative
              </span>
              <span className="text-xl font-extralight transition-transform duration-300">
                {descOpen ? "—" : "+"}
              </span>
            </button>
            <div
              className={`overflow-hidden transition-all duration-700 ease-[cubic-bezier(0.19,1,0.22,1)] ${descOpen ? "max-h-125 pb-12" : "max-h-0"}`}
            >
              <p className="text-[16px] leading-[1.8] text-gray-900 font-medium tracking-wide ">
                {activeProduct.description}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ───────── CENTER PANEL (Hero Section) ───────── */}
      <div className="order-1 xl:order-2 flex-1 bg-[#F9F9F9] relative flex items-center justify-center overflow-hidden h-[60vh] md:h-[70vh] xl:h-screen p-8 md:p-12 xl:p-20">
        <div
          className={`relative w-full h-full transition-all duration-700 ease-out flex items-center justify-center ${isFading ? "opacity-0 scale-[1.02] blur-md" : "opacity-100 scale-100 blur-0"
            }`}
        >
          <div className="relative w-full h-full max-w-2xl xl:max-w-none">
            <Image
              src={activeProduct.images.thumbnails[activeThumb] || activeProduct.images.hero}
              alt={activeProduct.name}
              fill
              className="object-contain"
              priority
            />
          </div>
        </div>
      </div>

      {/* ───────── RIGHT PANEL (Responsive Purchase Details) ───────── */}
      <div className="order-3 flex flex-col w-full xl:w-[28%] p-8 md:p-12 xl:p-16 bg-white justify-center border-l border-gray-50">
        <div className="max-w-sm mx-auto xl:ml-0 w-full">
          {/* Responsive ID Text */}
          <span className="text-[10px] sm:text-[11px] md:text-[12px] tracking-[0.6em] text-gray-900 uppercase block mb-6 md:mb-8 font-light">
            Identification No. {activeProduct.id.toString().padStart(6, "0")}
          </span>

          {/* Fluid Responsive Title */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl xl:text-[3.2rem] font-light tracking-tighter leading-[1.1] mb-6 uppercase">
            {titleLine1} <br />
            <span className="font-black text-zinc-900">{titleLine2}</span>
          </h1>

          {/* Responsive Price Text */}
          <p className="text-[1.5rem] sm:text-[1.8rem] md:text-[2rem] font-light tracking-[0.15em] mt-6 md:mt-10 mb-12 md:mb-20 text-zinc-800">
            {activeProduct.price}
          </p>

          <div className="space-y-12 md:space-y-16">
            <div>
              <p className="text-[12px] md:text-[14px] uppercase tracking-[0.4em] font-bold mb-6 text-gray-900">
                Palettes
              </p>
              <div className="flex gap-4 sm:gap-6">
                {activeProduct.colors.map((c, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedColor(i)}
                    className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full transition-all duration-500 ring-offset-4 sm:ring-offset-8 ring-1 ${i === selectedColor ? "ring-black scale-125 shadow-xl" : "ring-transparent hover:ring-gray-200"
                      }`}
                    style={{ backgroundColor: c.hex }}
                  />
                ))}
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-6">
                <p className="text-[12px] md:text-[14px] uppercase tracking-[0.4em] font-bold text-gray-900">
                  Dimensions
                </p>
                <button className="text-[10px] md:text-[11px] uppercase tracking-[0.3em] text-gray-700 hover:text-black transition-colors border-b border-transparent hover:border-black">
                  Sizing Guide
                </button>
              </div>
              <div className="grid grid-cols-4 gap-2 sm:gap-3">
                {activeProduct.sizes.map((s, i) => (
                  <button
                    key={s}
                    onClick={() => setSelectedSize(i)}
                    className={`py-4 sm:py-5 text-[14px] sm:text-[16px] tracking-[0.2em] font-medium transition-all duration-500 border ${i === selectedSize ? "bg-black text-white border-black shadow-2xl" : "border-gray-100 hover:border-zinc-800"
                      }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-16 md:mt-20 space-y-4">
            <button className="group relative w-full overflow-hidden border-2 border-black bg-black py-6 sm:py-7 text-[12px] sm:text-[14px] font-black uppercase tracking-[0.4em] text-white transition-colors duration-500 shadow-lg cursor-pointer">
              <span className="absolute inset-0 z-0 translate-y-full bg-white transition-transform duration-500 ease-out group-hover:translate-y-0" />
              <span className="relative z-10 group-hover:text-black">
                Purchase Item
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}