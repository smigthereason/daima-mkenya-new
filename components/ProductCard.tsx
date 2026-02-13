"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Product, sampleProduct, getAllProducts } from "@/types/Product";
import { ChevronLeft, ChevronRight, ShoppingBag, Check } from "lucide-react";
import { useCart } from "@/context/CartContext";

export default function ProductCard({ productId = 1 }: { productId?: number }) {
  const router = useRouter();
  const { addToCart } = useCart();
  const allProducts = getAllProducts();
  const cardRef = useRef<HTMLDivElement>(null);

  // State Management
  const [activeProduct, setActiveProduct] = useState<Product>(() => 
    allProducts.find((p) => p.id === productId) || sampleProduct
  );
  const [currentProductIndex, setCurrentProductIndex] = useState(() => 
    allProducts.findIndex((p) => p.id === productId)
  );
  
  const [activeThumb, setActiveThumb] = useState(0);
  const [isFading, setIsFading] = useState(false);
  const [selectedColor, setSelectedColor] = useState(0);
  const [selectedSize, setSelectedSize] = useState(0);
  const [descOpen, setDescOpen] = useState(true);
  const [addedFeedback, setAddedFeedback] = useState(false);

  // Reset "Added to Bag" if user clicks anywhere else on the screen
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // If the click is outside the card or specifically on the background
      if (cardRef.current && !cardRef.current.contains(event.target as Node)) {
        setAddedFeedback(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Sync state if prop changes
  useEffect(() => {
    const index = allProducts.findIndex((p) => p.id === productId);
    if (index !== -1) {
      handleProductTransition(index);
    }
  }, [productId]);

  const handleProductTransition = (newIndex: number) => {
    setIsFading(true);
    setAddedFeedback(false); // Reset feedback on navigation
    setTimeout(() => {
      const newProduct = allProducts[newIndex];
      setCurrentProductIndex(newIndex);
      setActiveProduct(newProduct);
      setActiveThumb(0);
      setSelectedColor(0);
      setSelectedSize(0);
      setIsFading(false);
    }, 300);
  };

  const handleAddToCart = () => {
    const size = activeProduct.sizes[selectedSize];
    const colorObj = activeProduct.colors[selectedColor];
    addToCart(activeProduct, size, { name: colorObj.label, hex: colorObj.hex });
    setAddedFeedback(true);
  };

  const handleSizeChange = (index: number) => {
    setSelectedSize(index);
    setAddedFeedback(false); // Remove "Added" state when a new size is picked
  };

  const handleColorChange = (index: number) => {
    setSelectedColor(index);
    setAddedFeedback(false); // Remove "Added" state when a new color is picked
  };

  const handlePurchaseNow = () => {
    const size = activeProduct.sizes[selectedSize];
    const colorObj = activeProduct.colors[selectedColor];
    addToCart(activeProduct, size, { name: colorObj.label, hex: colorObj.hex });
    router.push("/checkout");
  };

  const titleParts = activeProduct.name.split(" ");
  const titleLine1 = titleParts.slice(0, 2).join(" ");
  const titleLine2 = titleParts.slice(2).join(" ");

  return (
    <div 
      ref={cardRef}
      className="flex flex-col xl:flex-row w-full bg-white relative min-h-screen text-black antialiased overflow-x-hidden mt-20 md:mt-32 border-t border-neutral-400"
    >
      
      {/* Navigation Arrows */}
      <div className="absolute top-6 left-1/2 -translate-x-1/2 xl:left-auto xl:translate-x-0 xl:top-10 xl:right-12 z-30 flex items-center gap-8">
        <div className="flex items-center gap-8 bg-white/60 backdrop-blur-md px-6 py-3 rounded-full border border-gray-200/50 shadow-sm">
          <button 
            onClick={() => {
              const prevIndex = currentProductIndex === 0 ? allProducts.length - 1 : currentProductIndex - 1;
              handleProductTransition(prevIndex);
            }} 
            className="hover:opacity-30 p-1 cursor-pointer"
          >
            <ChevronLeft size={24} />
          </button>
          <span className="text-[14px] tracking-[0.5em] text-gray-500 font-light">
            {String(currentProductIndex + 1).padStart(2, "0")} / {String(allProducts.length).padStart(2, "0")}
          </span>
          <button 
            onClick={() => {
              const nextIndex = (currentProductIndex + 1) % allProducts.length;
              handleProductTransition(nextIndex);
            }} 
            className="hover:opacity-30 p-1 cursor-pointer"
          >
            <ChevronRight size={24} />
          </button>
        </div>
      </div>

      {/* Left Panel */}
      <div className="order-2 xl:order-1 flex flex-col w-full xl:w-[32%] p-8 md:p-12 xl:p-16 border-r border-gray-50 bg-white">
        <div className="mb-10">
          <span className="text-[14px] uppercase tracking-[0.5em] text-gray-400 block mb-4 font-light">The Collection</span>
          <span className="text-[12px] uppercase tracking-[0.3em] font-bold border-b-2 border-black pb-2">{activeProduct.category}</span>
        </div>
        
        <div className="flex flex-row gap-6 mb-12 overflow-x-auto pb-4 scrollbar-hide">
          {activeProduct.images.thumbnails.map((src, i) => (
            <button 
              key={`${activeProduct.id}-thumb-${i}`} 
              onClick={() => {
                setIsFading(true);
                setTimeout(() => {
                  setActiveThumb(i);
                  setIsFading(false);
                }, 300);
              }} 
              className={`relative shrink-0 transition-all duration-700 ${i === activeThumb ? "opacity-100 scale-100" : "opacity-30 scale-95"}`}
            >
              <div className="w-40 h-55 bg-[#fcfcfc] relative overflow-hidden">
                <Image src={src} alt="" fill className="object-cover" />
              </div>
            </button>
          ))}
        </div>

        <div className="border-t border-gray-100 mt-auto">
          <button onClick={() => setDescOpen(!descOpen)} className="w-full flex justify-between items-center py-6">
            <span className="text-[14px] uppercase tracking-[0.3em] font-bold">Product Narrative</span>
            <span>{descOpen ? "—" : "+"}</span>
          </button>
          {descOpen && <p className="text-[16px] leading-[1.8] text-gray-900 font-medium tracking-wide pb-12">{activeProduct.description}</p>}
        </div>
      </div>

      {/* Center Panel */}
      <div className="order-1 xl:order-2 flex-1 bg-[#F9F9F9] relative flex items-center justify-center h-[60vh] md:h-screen">
        <div className={`relative w-full h-full transition-all duration-700 ${isFading ? "opacity-0 blur-md" : "opacity-100 blur-0"}`}>
          <Image 
            src={activeProduct.images.thumbnails[activeThumb] || activeProduct.images.hero} 
            alt={activeProduct.name} 
            fill 
            className="object-contain p-8 md:p-16" 
            priority 
            quality={100}
          />
        </div>
      </div>

      {/* Right Panel */}
      <div className="order-3 flex flex-col w-full xl:w-[28%] p-8 md:p-12 xl:p-16 bg-white justify-center border-l border-gray-50">
        <span className="text-[12px] tracking-[0.6em] text-gray-900 uppercase block mb-8 font-light">
          Identification No. {activeProduct.id.toString().padStart(6, "0")}
        </span>
        <h1 className="text-3xl md:text-5xl font-light tracking-tighter leading-[1.1] mb-6 uppercase">
          {titleLine1} <br /><span className="font-black">{titleLine2}</span>
        </h1>
        <p className="text-[2rem] font-light tracking-[0.15em] mb-12">{activeProduct.price}</p>
        
        <div className="space-y-12">
          <div>
            <p className="text-[14px] uppercase tracking-[0.4em] font-bold mb-6">Palettes</p>
            <div className="flex gap-6">
              {activeProduct.colors.map((c, i) => (
                <button 
                  key={`${activeProduct.id}-color-${i}`}
                  onClick={() => handleColorChange(i)} 
                  className={`w-8 h-8 rounded-full ring-offset-8 ring-1 transition-all duration-300 ${i === selectedColor ? "ring-black scale-125" : "ring-transparent"}`} 
                  style={{ backgroundColor: c.hex }} 
                />
              ))}
            </div>
          </div>
          <div>
            <p className="text-[14px] uppercase tracking-[0.4em] font-bold mb-6">Dimensions</p>
            <div className="grid grid-cols-4 gap-3">
              {activeProduct.sizes.map((s, i) => (
                <button 
                  key={`${activeProduct.id}-size-${s}`}
                  onClick={() => handleSizeChange(i)} 
                  className={`py-5 text-[16px] tracking-[0.2em] font-medium border transition-all duration-300 ${i === selectedSize ? "bg-black text-white border-black" : "border-gray-100 hover:border-black"}`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-16 space-y-4">
          <button 
            onClick={handleAddToCart} 
            className="group relative w-full border-2 border-black bg-white py-7 text-[14px] font-black uppercase tracking-[0.4em] overflow-hidden"
          >
            <span className={`absolute inset-0 translate-y-full bg-black transition-transform duration-500 ease-out ${addedFeedback ? 'translate-y-0' : 'group-hover:translate-y-0'}`} />
            <span className={`relative z-10 flex items-center justify-center gap-3 transition-colors duration-500 ${addedFeedback ? 'text-black' : 'text-black group-hover:text-white'}`}>
              {addedFeedback ? (
                <>
                  <Check size={18} className="animate-in zoom-in duration-300 text-black" /> 
                  Added to Bag
                </>
              ) : (
                <>
                  <ShoppingBag size={18} /> 
                  Add to Bag
                </>
              )}
            </span>
          </button>

          <button 
            onClick={handlePurchaseNow} 
            className="group relative w-full border-2 border-black bg-black py-7 text-[14px] font-black uppercase tracking-[0.4em] text-white overflow-hidden"
          >
            <span className="absolute inset-0 translate-y-full bg-white transition-transform duration-500 ease-out group-hover:translate-y-0" />
            <span className="relative z-10 transition-colors duration-500 group-hover:text-black">Purchase Item</span>
          </button>
        </div>
      </div>
    </div>
  );
}