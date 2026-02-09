"use client";

import { useState } from "react";
import Image from "next/image";
import { Product, sampleProduct, getAllProducts } from "@/types/Product";

export default function ProductCard({ initialProductId = 1 }: { initialProductId?: number }) {
  const allProducts = getAllProducts();
  const initialProduct = allProducts.find(p => p.id === initialProductId) || sampleProduct;

  const [activeProduct, setActiveProduct] = useState<Product>(initialProduct);
  const [currentProductIndex, setCurrentProductIndex] = useState(
    allProducts.findIndex(p => p.id === initialProductId)
  );

  const [activeThumb, setActiveThumb] = useState(0);
  const [isFading, setIsFading] = useState(false);

  // Transition handler for both thumb clicks and product changes
  const triggerFade = (callback: () => void) => {
    setIsFading(true);
    setTimeout(() => {
      callback();
      setIsFading(false);
    }, 350);
  };

  const goToNextProduct = () => {
    const nextIndex = (currentProductIndex + 1) % allProducts.length;
    triggerFade(() => {
      setCurrentProductIndex(nextIndex);
      setActiveProduct(allProducts[nextIndex]);
      setActiveThumb(0);
    });
  };

  const goToPrevProduct = () => {
    const prevIndex = currentProductIndex === 0 ? allProducts.length - 1 : currentProductIndex - 1;
    triggerFade(() => {
      setCurrentProductIndex(prevIndex);
      setActiveProduct(allProducts[prevIndex]);
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
    <div className="flex flex-col lg:flex-row w-full mt-32 border-t border-black/10 bg-white relative min-h-screen text-black antialiased overflow-x-hidden">
      
      {/* ── LUXURY FLOATING NAV ── */}
      <div className="absolute top-6 right-6 lg:top-10 lg:right-12 z-30 flex items-center gap-8">
        <div className="flex items-center gap-8 bg-white/40 backdrop-blur-md px-6 py-3 rounded-full border border-gray-100/50">
          <button onClick={goToPrevProduct} className="hover:opacity-30 transition-opacity p-1 group">
            <span className="text-[14px] uppercase tracking-[0.4em] font-medium">Prev</span>
          </button>
          <span className="text-[14px] tracking-[0.5em] text-gray-400 font-light">
            {String(currentProductIndex + 1).padStart(2, '0')} / {String(allProducts.length).padStart(2, '0')}
          </span>
          <button onClick={goToNextProduct} className="hover:opacity-30 transition-opacity p-1 group">
            <span className="text-[14px] uppercase tracking-[0.4em] font-medium">Next</span>
          </button>
        </div>
      </div>

      {/* ───────── LEFT PANEL (Doubled Thumbnails & Info) ───────── */}
      <div className="order-2 lg:order-1 flex flex-col w-full lg:w-[40%] xl:w-[32%] p-8 lg:p-16 border-r border-gray-50 bg-white">
        <div className="mb-16">
          <span className="text-[14px] uppercase tracking-[0.5em] text-gray-400 block mb-4 font-light">The Collection</span>
          <span className="text-[12px] uppercase tracking-[0.3em] font-bold border-b-2 border-black pb-2">
            {activeProduct.category || "Exotic Leather"}
          </span>
        </div>

        {/* THUMBNAILS: Doubled Size (200px x 260px) */}
        <div className="flex flex-row gap-6 mb-20 overflow-x-auto no-scrollbar pb-4 -mx-2 px-2">
          {activeProduct.images.thumbnails.map((src, i) => (
            <button
              key={i}
              onClick={() => handleThumbChange(i)}
              className={`relative shrink-0 transition-all duration-700 ease-in-out group ${
                i === activeThumb ? "opacity-100 scale-100" : "opacity-30 hover:opacity-60 scale-[0.96]"
              }`}
            >
              <div className="w-45 h-60 lg:w-50 lg:h-65 bg-[#fcfcfc] relative overflow-hidden shadow-sm group-hover:shadow-md transition-shadow">
                <Image 
                  src={src} 
                  alt="" 
                  fill 
                  className={`object-cover transition-transform duration-1000 ${i === activeThumb ? 'scale-110' : 'scale-100 group-hover:scale-105'}`} 
                  sizes="200px"
                />
              </div>
              {i === activeThumb && (
                <div className="absolute -bottom-3 left-0 w-full h-0.5 bg-black animate-in fade-in slide-in-from-left-4 duration-500" />
              )}
            </button>
          ))}
        </div>

        {/* ELEGANT ACCORDION */}
        <div className="border-t border-gray-100 mt-auto">
          <div className="border-b border-gray-100">
            <button onClick={() => setDescOpen(!descOpen)} className="w-full flex justify-between items-center py-8">
              <span className="text-[14px] uppercase tracking-[0.3em] font-bold">Product Narrative</span>
              <span className="text-xl font-extralight transition-transform duration-300" style={{ transform: descOpen ? 'rotate(0deg)' : 'rotate(45deg)' }}>
                {descOpen ? "—" : "+"}
              </span>
            </button>
            <div className={`overflow-hidden transition-all duration-700 ease-[cubic-bezier(0.19,1,0.22,1)] ${descOpen ? "max-h-125 pb-12" : "max-h-0"}`}>
              <p className="text-[16px] leading-[1.8] text-gray-900 font-medium tracking-wide ">
                {activeProduct.description}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ───────── CENTER PANEL (Hero Section) ───────── */}
      <div className="order-1 lg:order-2 flex-1 bg-[#F9F9F9] relative flex items-center justify-center overflow-hidden h-[70vh] lg:h-screen p-8 lg:p-20">
        <div 
          className={`relative w-full h-full transition-all duration-700 ease-out flex items-center justify-center ${
            isFading ? "opacity-0 scale-[1.02] blur-md" : "opacity-100 scale-100 blur-0"
          }`}
        >
          <div className="relative w-full h-full">
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

      {/* ───────── RIGHT PANEL (Purchase Details) ───────── */}
      <div className="order-3 flex flex-col w-full lg:w-[35%] xl:w-[28%] p-8 lg:p-16 bg-white justify-center border-l border-gray-50">
        <div className="max-w-sm mx-auto lg:ml-0 w-full">
          <span className="text-[12px] tracking-[0.6em] text-gray-900 uppercase block mb-8 font-light">
            Identification No. {activeProduct.id.toString().padStart(6, '0')}
          </span>
          
          <h1 className="text-4xl lg:text-[3.2rem] font-light tracking-tighter leading-none mb-6 uppercase">
            {titleLine1} <br />
            <span className="font-black text-zinc-900">{titleLine2}</span>
          </h1>

          <p className="text-[2rem] font-light tracking-[0.15em] mt-10 mb-20 text-zinc-800">
            {activeProduct.price}
          </p>

          {/* ATTRIBUTES */}
          <div className="space-y-16">
            <div>
              <p className="text-[14px] uppercase tracking-[0.4em] font-bold mb-6 text-gray-900">Palettes</p>
              <div className="flex gap-6">
                {activeProduct.colors.map((c, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedColor(i)}
                    className={`w-8 h-8 rounded-full transition-all duration-500 ring-offset-8 ring-1 ${
                      i === selectedColor ? "ring-black scale-125 shadow-xl" : "ring-transparent hover:ring-gray-200"
                    }`}
                    style={{ backgroundColor: c.hex }}
                  />
                ))}
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-6">
                <p className="text-[14px] uppercase tracking-[0.4em] font-bold text-gray-900">Dimensions</p>
                <button className="text-[11px] uppercase tracking-[0.3em] text-gray-700 hover:text-black transition-colors border-b border-transparent hover:border-black">Sizing Guide</button>
              </div>
              <div className="grid grid-cols-4 gap-3">
                {activeProduct.sizes.map((s, i) => (
                  <button
                    key={s}
                    onClick={() => setSelectedSize(i)}
                    className={`py-5 text-[16px] tracking-[0.2em] font-medium transition-all duration-500 border ${
                      i === selectedSize ? "bg-black text-white border-black shadow-2xl" : "border-gray-100 hover:border-zinc-800"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* CTA BUTTONS */}
          <div className="mt-20 space-y-4">
            <button className="w-full bg-black text-white text-[14px] font-bold uppercase tracking-[0.4em] py-7 hover:bg-zinc-800 transition-all transform active:scale-95 shadow-lg">
              Purchase Item
            </button>
            <button className="w-full bg-white text-black border border-zinc-100 text-[12px] font-bold uppercase tracking-[0.4em] py-7 hover:border-black transition-all transform active:scale-95">
              Check Boutique Availability
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}