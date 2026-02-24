"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Product, getAllProducts } from "@/types/Product";
import { ShoppingBag, Check, CreditCard } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { urlFor } from "@/sanity/lib/image";

interface ProductCardProps {
  productSlug?: string;
}

export default function ProductCard({ productSlug }: ProductCardProps) {
  const router = useRouter();
  const { addToCart } = useCart();
  const cardRef = useRef<HTMLDivElement>(null);

  const [products, setProducts] = useState<Product[]>([]);
  const [activeProduct, setActiveProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  const [activeThumb, setActiveThumb] = useState(0);
  const [isFading, setIsFading] = useState(false);
  const [selectedColor, setSelectedColor] = useState(0);
  const [selectedSize, setSelectedSize] = useState(0);
  const [descOpen, setDescOpen] = useState(true);
  const [addedFeedback, setAddedFeedback] = useState(false);
  const [lastAddedConfig, setLastAddedConfig] = useState<{
    colorIndex: number;
    sizeIndex: number;
  } | null>(null);

  // FETCH ALL PRODUCTS AND FIND THE ONE MATCHING THE SLUG
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const data = await getAllProducts();
        setProducts(data);

        if (data.length > 0 && productSlug) {
          const foundProduct = data.find(p => 
            p.slug?.current === productSlug || 
            p._id === productSlug
          );
          
          setActiveProduct(foundProduct || data[0]);
          setActiveThumb(0);
          setSelectedColor(0);
          setSelectedSize(0);
          setAddedFeedback(false);
          setLastAddedConfig(null);
        } else if (data.length > 0) {
          setActiveProduct(data[0]);
        }
      } catch (error) {
        console.error("Failed to fetch products:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [productSlug]);

  // Reset added feedback when color or size changes
  useEffect(() => {
    if (lastAddedConfig) {
      const isSameConfig = 
        lastAddedConfig.colorIndex === selectedColor && 
        lastAddedConfig.sizeIndex === selectedSize;
      
      if (!isSameConfig) {
        setAddedFeedback(false);
        setLastAddedConfig(null);
      }
    }
  }, [selectedColor, selectedSize, lastAddedConfig]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center font-black tracking-widest uppercase">
        Loading Piece...
      </div>
    );
  }

  if (!activeProduct) {
    return (
      <div className="min-h-screen flex items-center justify-center font-black tracking-widest uppercase">
        Product Not Found
      </div>
    );
  }

  const handleAddToCart = () => {
    const size = activeProduct.sizes[selectedSize];
    const colorObj = activeProduct.colors[selectedColor];
    addToCart(activeProduct, size, { label: colorObj.label, hex: colorObj.hex });
    
    // Set feedback state
    setAddedFeedback(true);
    setLastAddedConfig({
      colorIndex: selectedColor,
      sizeIndex: selectedSize
    });
    
    // Don't auto-hide - let it persist until user changes selection
  };

  const handlePurchaseNow = () => {
    const size = activeProduct.sizes[selectedSize];
    const colorObj = activeProduct.colors[selectedColor];
    addToCart(activeProduct, size, { label: colorObj.label, hex: colorObj.hex });
    router.push("/checkout");
  };

  const getImageUrl = (source: any) => (source ? urlFor(source).url() : "");

  const titleParts = activeProduct.name.split(" ");
  const titleLine1 = titleParts.slice(0, 2).join(" ");
  const titleLine2 = titleParts.slice(2).join(" ");

  return (
    <div ref={cardRef} className="flex flex-col xl:flex-row w-full bg-white relative min-h-screen text-black antialiased overflow-x-hidden mt-20 md:mt-32 border-t border-neutral-400">

      {/* Left Panel: Thumbnails & Description */}
      <div className="order-2 xl:order-1 flex flex-col w-full xl:w-[32%] p-8 md:p-12 xl:p-16 border-r border-gray-50 bg-white">
        <div className="mb-10">
          <span className="text-[14px] uppercase tracking-[0.5em] text-gray-400 block mb-4 font-light">The Collection</span>
          <span className="text-[12px] uppercase tracking-[0.3em] font-bold border-b-2 border-black pb-2">{activeProduct.category}</span>
        </div>

        <div className="flex flex-row gap-6 mb-12 overflow-x-auto pb-4 scrollbar-hide">
          {activeProduct.images.thumbnails?.map((img, i) => (
            <button
              key={i}
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
                <Image src={getImageUrl(img)} alt="" fill unoptimized className="object-cover" />
              </div>
            </button>
          ))}
        </div>

        <div className="border-t border-gray-100 mt-auto">
          <button onClick={() => setDescOpen(!descOpen)} className="w-full flex justify-between items-center py-6 text-[14px] uppercase tracking-[0.3em] font-bold">
            <span>Product Narrative</span>
            <span>{descOpen ? "—" : "+"}</span>
          </button>
          {descOpen && activeProduct.description && (
            <div className="pb-12 space-y-2">
              {Array.isArray(activeProduct.description) ? (
                activeProduct.description.map((line, i) => (
                  <p key={i} className="text-[16px] leading-[1.8] text-gray-900 font-medium tracking-wide">{line}</p>
                ))
              ) : (
                <p className="text-[16px] leading-[1.8] text-gray-900 font-medium tracking-wide">{activeProduct.description}</p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Center Panel: Hero Image */}
      <div className="order-1 xl:order-2 flex-1 bg-[#F9F9F9] relative flex items-center justify-center h-[60vh] md:h-screen">
        <div className={`relative w-full h-full transition-all duration-700 ${isFading ? "opacity-0 blur-md" : "opacity-100 blur-0"}`}>
          <Image
            src={activeProduct.images.thumbnails?.[activeThumb] ? getImageUrl(activeProduct.images.thumbnails[activeThumb]) : getImageUrl(activeProduct.images.hero)}
            alt={activeProduct.name}
            fill
            unoptimized
            className="object-contain p-8 md:p-16"
            priority
          />
        </div>
      </div>

      {/* Right Panel: Details & Actions */}
      <div className="order-3 flex flex-col w-full xl:w-[28%] p-8 md:p-12 xl:p-16 bg-white justify-center border-l border-gray-50">
        <span className="text-[12px] tracking-[0.6em] text-gray-900 uppercase block mb-8 font-light">
          Ref. {activeProduct._id.substring(0, 8)} {/* FIXED: Removed fallback to non-existent id */}
        </span>
        <h1 className="text-3xl md:text-5xl font-light tracking-tighter leading-[1.1] mb-6 uppercase">
          {titleLine1} <br /><span className="font-black">{titleLine2}</span>
        </h1>
        <p className="text-[2rem] font-light tracking-[0.15em] mb-12">{activeProduct.price}</p>

        <div className="space-y-12">
          {activeProduct.colors && (
            <div>
              <p className="text-[14px] uppercase tracking-[0.4em] font-bold mb-6">Palettes</p>
              <div className="flex gap-6">
                {activeProduct.colors.map((c, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedColor(i)}
                    className={`w-8 h-8 rounded-full ring-offset-8 ring-1 transition-all duration-300 ${i === selectedColor ? "ring-black scale-125" : "ring-transparent"}`}
                    style={{ backgroundColor: c.hex }}
                  />
                ))}
              </div>
            </div>
          )}

          {activeProduct.sizes && (
            <div>
              <p className="text-[14px] uppercase tracking-[0.4em] font-bold mb-6">Dimensions</p>
              <div className="grid grid-cols-4 gap-3">
                {activeProduct.sizes.map((s, i) => (
                  <button
                    key={s}
                    onClick={() => setSelectedSize(i)}
                    className={`py-5 text-[16px] tracking-[0.2em] font-medium border transition-all duration-300 ${i === selectedSize ? "bg-black text-white border-black" : "border-gray-100 hover:border-black"}`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="mt-16 space-y-4">
          {/* Add to Cart Button - Fixed visibility */}
          <button 
            onClick={handleAddToCart} 
            className="group relative w-full border-2 border-black bg-white py-7 text-[12px] md:text-[14px] font-black uppercase tracking-[0.4em] overflow-hidden"
          >
            <span className={`absolute inset-0 bg-black transition-transform duration-500 ease-out ${
              addedFeedback ? 'translate-y-0' : 'translate-y-full group-hover:translate-y-0'
            }`} />
            <span className={`relative z-10 flex items-center justify-center gap-3 transition-colors duration-500 ${
              addedFeedback ? 'text-white' : 'text-black group-hover:text-white'
            }`}>
              {addedFeedback ? (
                <>
                  <Check size={18} className="text-white" />
                  <span className="text-white">Added to Cart</span>
                </>
              ) : (
                <>
                  <ShoppingBag size={18} />
                  <span>Add to Bag</span>
                </>
              )}
            </span>
          </button>

          <button 
            onClick={handlePurchaseNow} 
            className="group relative w-full bg-black py-7 text-[12px] md:text-[14px] font-black uppercase tracking-[0.4em] text-white overflow-hidden"
          >
            <span className="absolute inset-0 translate-y-full bg-[#be1e2d] transition-transform duration-500 ease-out group-hover:translate-y-0" />
            <span className="relative z-10 flex items-center justify-center gap-3">
              <CreditCard size={18} /> Purchase Now
            </span>
          </button>
        </div>
        
        {/* Optional: Add a subtle indicator that selection changes will reset cart status */}
        {addedFeedback && (
          <p className="text-[10px] text-gray-400 uppercase tracking-wider text-center mt-4">
            ✓ Item added • Change color or size to update selection
          </p>
        )}
      </div>
    </div>
  );
}