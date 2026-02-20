// "use client";

// import { useState, useEffect, useRef } from "react";
// import Image from "next/image";
// import { useRouter } from "next/navigation";
// import { Product, getAllProducts } from "@/types/Product";
// import { ChevronLeft, ChevronRight, ShoppingBag, Check, CreditCard } from "lucide-react";
// import { useCart } from "@/context/CartContext";
// import { urlFor } from "@/sanity/lib/image";

// export default function ProductCard({ productId }: { productId?: string }) {
//   const router = useRouter();
//   const { addToCart } = useCart();
//   const cardRef = useRef<HTMLDivElement>(null);

//   const [products, setProducts] = useState<Product[]>([]);
//   const [activeProduct, setActiveProduct] = useState<Product | null>(null);
//   const [currentProductIndex, setCurrentProductIndex] = useState(0);
  
//   const [activeThumb, setActiveThumb] = useState(0);
//   const [isFading, setIsFading] = useState(false);
//   const [selectedColor, setSelectedColor] = useState(0);
//   const [selectedSize, setSelectedSize] = useState(0);
//   const [descOpen, setDescOpen] = useState(true);
//   const [addedFeedback, setAddedFeedback] = useState(false);

//   useEffect(() => {
//     const fetchData = async () => {
//       const data = await getAllProducts();
//       setProducts(data);
//       if (data.length > 0) {
//         // Find product by Sanity _id or default to first
//         const initialIndex = productId ? data.findIndex(p => p._id === productId) : 0;
//         const index = initialIndex === -1 ? 0 : initialIndex;
//         setCurrentProductIndex(index);
//         setActiveProduct(data[index]);
//       }
//     };
//     fetchData();
//   }, [productId]);

//   const handleProductTransition = (newIndex: number) => {
//     setIsFading(true);
//     setAddedFeedback(false);
//     setTimeout(() => {
//       const newProduct = products[newIndex];
//       setCurrentProductIndex(newIndex);
//       setActiveProduct(newProduct);
//       setActiveThumb(0);
//       setSelectedColor(0);
//       setSelectedSize(0);
//       setIsFading(false);
//     }, 300);
//   };

//   if (!activeProduct) {
//     return (
//       <div className="min-h-screen flex items-center justify-center font-black tracking-widest uppercase">
//         Loading Collection...
//       </div>
//     );
//   }

//   const handleAddToCart = () => {
//     const size = activeProduct.sizes[selectedSize];
//     const colorObj = activeProduct.colors[selectedColor];
    
//     addToCart(activeProduct, size, { 
//       label: colorObj.label, 
//       hex: colorObj.hex 
//     });
    
//     setAddedFeedback(true);
//     setTimeout(() => setAddedFeedback(false), 3000);
//   };

//   const handlePurchaseNow = () => {
//     const size = activeProduct.sizes[selectedSize];
//     const colorObj = activeProduct.colors[selectedColor];
//     addToCart(activeProduct, size, { label: colorObj.label, hex: colorObj.hex });
//     router.push("/checkout");
//   };

//   const getImageUrl = (source: any) => (source ? urlFor(source).url() : "");

//   const titleParts = activeProduct.name.split(" ");
//   const titleLine1 = titleParts.slice(0, 2).join(" ");
//   const titleLine2 = titleParts.slice(2).join(" ");

//   return (
//     <div ref={cardRef} className="flex flex-col xl:flex-row w-full bg-white relative min-h-screen text-black antialiased overflow-x-hidden mt-20 md:mt-32 border-t border-neutral-400">
//       <div className="absolute top-92 md:top-10 left-1/2 -translate-x-1/2 xl:left-auto xl:translate-x-0 xl:top-10 xl:right-12 z-30 flex items-center gap-8">
//         <div className="flex items-left gap-8 bg-white/60 backdrop-blur-md px-6 py-3 rounded-full border border-gray-200/50 shadow-sm">
//           <button 
//             onClick={() => handleProductTransition(currentProductIndex === 0 ? products.length - 1 : currentProductIndex - 1)} 
//             className="hover:opacity-30 p-1 cursor-pointer"
//           >
//             <ChevronLeft size={24} />
//           </button>
//           <span className="text-[14px] text-gray-500 font-light tracking-[0.5em]">
//             {String(currentProductIndex + 1).padStart(2, "0")} / {String(products.length).padStart(2, "0")}
//           </span>
//           <button 
//             onClick={() => handleProductTransition((currentProductIndex + 1) % products.length)} 
//             className="hover:opacity-30 p-1 cursor-pointer"
//           >
//             <ChevronRight size={24} />
//           </button>
//         </div>
//       </div>

//       <div className="order-2 xl:order-1 flex flex-col w-full xl:w-[32%] p-8 md:p-12 xl:p-16 border-r border-gray-50 bg-white">
//         <div className="mb-10">
//           <span className="text-[14px] uppercase tracking-[0.5em] text-gray-400 block mb-4 font-light">The Collection</span>
//           <span className="text-[12px] uppercase tracking-[0.3em] font-bold border-b-2 border-black pb-2">{activeProduct.category}</span>
//         </div>
//         <div className="flex flex-row gap-6 mb-12 overflow-x-auto pb-4 scrollbar-hide">
//           {activeProduct.images.thumbnails?.map((img, i) => (
//             <button 
//                 key={i} 
//                 onClick={() => { setIsFading(true); setTimeout(() => { setActiveThumb(i); setIsFading(false); }, 300); }} 
//                 className={`relative shrink-0 transition-all duration-700 ${i === activeThumb ? "opacity-100 scale-100" : "opacity-30 scale-95"}`}
//             >
//               <div className="w-40 h-55 bg-[#fcfcfc] relative overflow-hidden">
//                 <Image src={getImageUrl(img)} alt="" fill unoptimized className="object-cover" />
//               </div>
//             </button>
//           ))}
//         </div>
//         <div className="border-t border-gray-100 mt-auto">
//           <button onClick={() => setDescOpen(!descOpen)} className="w-full flex justify-between items-center py-6 text-[14px] uppercase tracking-[0.3em] font-bold">
//             <span>Product Narrative</span>
//             <span>{descOpen ? "—" : "+"}</span>
//           </button>
//           {descOpen && (
//             <div className="pb-12 space-y-2">
//               {activeProduct.description.map((line, i) => (
//                 <p key={i} className="text-[16px] leading-[1.8] text-gray-900 font-medium tracking-wide">{line}</p>
//               ))}
//             </div>
//           )}
//         </div>
//       </div>

//       <div className="order-1 xl:order-2 flex-1 bg-[#F9F9F9] relative flex items-center justify-center h-[60vh] md:h-screen">
//         <div className={`relative w-full h-full transition-all duration-700 ${isFading ? "opacity-0 blur-md" : "opacity-100 blur-0"}`}>
//           <Image 
//             src={activeProduct.images.thumbnails?.[activeThumb] ? getImageUrl(activeProduct.images.thumbnails[activeThumb]) : getImageUrl(activeProduct.images.hero)} 
//             alt={activeProduct.name} 
//             fill 
//             unoptimized 
//             className="object-contain p-8 md:p-16" 
//             priority 
//           />
//         </div>
//       </div>

//       <div className="order-3 flex flex-col w-full xl:w-[28%] p-8 md:p-12 xl:p-16 bg-white justify-center border-l border-gray-50">
//         <span className="text-[12px] tracking-[0.6em] text-gray-900 uppercase block mb-8 font-light">Ref. {activeProduct._id.substring(0, 8)}</span>
//         <h1 className="text-3xl md:text-5xl font-light tracking-tighter leading-[1.1] mb-6 uppercase">
//           {titleLine1} <br /><span className="font-black">{titleLine2}</span>
//         </h1>
//         <p className="text-[2rem] font-light tracking-[0.15em] mb-12">{activeProduct.price}</p>
        
//         <div className="space-y-12">
//           <div>
//             <p className="text-[14px] uppercase tracking-[0.4em] font-bold mb-6">Palettes</p>
//             <div className="flex gap-6">
//               {activeProduct.colors.map((c, i) => (
//                 <button 
//                     key={i} 
//                     onClick={() => setSelectedColor(i)} 
//                     className={`w-8 h-8 rounded-full ring-offset-8 ring-1 transition-all duration-300 ${i === selectedColor ? "ring-black scale-125" : "ring-transparent"}`} 
//                     style={{ backgroundColor: c.hex }} 
//                 />
//               ))}
//             </div>
//           </div>
//           <div>
//             <p className="text-[14px] uppercase tracking-[0.4em] font-bold mb-6">Dimensions</p>
//             <div className="grid grid-cols-4 gap-3">
//               {activeProduct.sizes.map((s, i) => (
//                 <button 
//                     key={s} 
//                     onClick={() => setSelectedSize(i)} 
//                     className={`py-5 text-[16px] tracking-[0.2em] font-medium border transition-all duration-300 ${i === selectedSize ? "bg-black text-white border-black" : "border-gray-100 hover:border-black"}`}
//                 >
//                     {s}
//                 </button>
//               ))}
//             </div>
//           </div>
//         </div>

//         <div className="mt-16 space-y-4">
//           <button onClick={handleAddToCart} className="group relative w-full border-2 border-black bg-white py-7 text-[12px] md:text-[14px] font-black uppercase tracking-[0.4em] overflow-hidden">
//             <span className={`absolute inset-0 translate-y-full bg-black transition-transform duration-500 ease-out ${addedFeedback ? 'translate-y-0' : 'group-hover:translate-y-0'}`} />
//             <span className={`relative z-10 flex items-center justify-center gap-3 transition-colors duration-500 ${addedFeedback ? 'text-white' : 'text-black group-hover:text-white'}`}>
//               {addedFeedback ? <><Check size={18} /> Added</> : <><ShoppingBag size={18} /> Add to Bag</>}
//             </span>
//           </button>
          
//           <button onClick={handlePurchaseNow} className="group relative w-full bg-black py-7 text-[12px] md:text-[14px] font-black uppercase tracking-[0.4em] text-white overflow-hidden">
//             <span className="absolute inset-0 translate-y-full bg-[#be1e2d] transition-transform duration-500 ease-out group-hover:translate-y-0" />
//             <span className="relative z-10 flex items-center justify-center gap-3">
//               <CreditCard size={18} /> Purchase Now
//             </span>
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Product, getAllProducts } from "@/types/Product";
import { ChevronLeft, ChevronRight, ShoppingBag, Check, CreditCard } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { urlFor } from "@/sanity/lib/image";

interface ProductCardProps {
  productId?: string; // This comes from your [id]/page.tsx
}

export default function ProductCard({ productId }: ProductCardProps) {
  const router = useRouter();
  const { addToCart } = useCart();
  const cardRef = useRef<HTMLDivElement>(null);

  const [products, setProducts] = useState<Product[]>([]);
  const [activeProduct, setActiveProduct] = useState<Product | null>(null);
  const [currentProductIndex, setCurrentProductIndex] = useState(0);
  
  const [activeThumb, setActiveThumb] = useState(0);
  const [isFading, setIsFading] = useState(false);
  const [selectedColor, setSelectedColor] = useState(0);
  const [selectedSize, setSelectedSize] = useState(0);
  const [descOpen, setDescOpen] = useState(true);
  const [addedFeedback, setAddedFeedback] = useState(false);

  // FETCH AND SYNC DATA
  useEffect(() => {
    const fetchData = async () => {
      const data = await getAllProducts();
      setProducts(data);
      
      if (data.length > 0) {
        // FIX: Find product by checking both Sanity _id and potential numeric id
        // We convert both to strings to avoid "123" !== 123 errors
        const foundIndex = productId 
          ? data.findIndex(p => p._id?.toString() === productId?.toString() || p.id?.toString() === productId?.toString()) 
          : 0;

        // If not found (foundIndex is -1), we default to 0, otherwise use the found index
        const targetIndex = foundIndex === -1 ? 0 : foundIndex;
        
        setCurrentProductIndex(targetIndex);
        setActiveProduct(data[targetIndex]);
        
        // Reset local UI states for the new product
        setActiveThumb(0);
        setSelectedColor(0);
        setSelectedSize(0);
      }
    };
    fetchData();
  }, [productId]); // RE-RUNS whenever the URL ID changes

  const handleProductTransition = (newIndex: number) => {
    setIsFading(true);
    setAddedFeedback(false);
    setTimeout(() => {
      const newProduct = products[newIndex];
      setCurrentProductIndex(newIndex);
      setActiveProduct(newProduct);
      
      // Update URL so the browser matches the new item being viewed
      const newId = newProduct._id || newProduct.id;
      router.push(`/products/${newId}`, { scroll: false });

      setActiveThumb(0);
      setSelectedColor(0);
      setSelectedSize(0);
      setIsFading(false);
    }, 300);
  };

  if (!activeProduct) {
    return (
      <div className="min-h-screen flex items-center justify-center font-black tracking-widest uppercase">
        Loading Piece...
      </div>
    );
  }

  const handleAddToCart = () => {
    const size = activeProduct.sizes[selectedSize];
    const colorObj = activeProduct.colors[selectedColor];
    addToCart(activeProduct, size, { label: colorObj.label, hex: colorObj.hex });
    setAddedFeedback(true);
    setTimeout(() => setAddedFeedback(false), 3000);
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
      
      {/* Navigation Arrows */}
      <div className="absolute top-92 md:top-10 left-1/2 -translate-x-1/2 xl:left-auto xl:translate-x-0 xl:top-10 xl:right-12 z-30 flex items-center gap-8">
        <div className="flex items-left gap-8 bg-white/60 backdrop-blur-md px-6 py-3 rounded-full border border-gray-200/50 shadow-sm">
          <button 
            onClick={() => handleProductTransition(currentProductIndex === 0 ? products.length - 1 : currentProductIndex - 1)} 
            className="hover:opacity-30 p-1 cursor-pointer"
          >
            <ChevronLeft size={24} />
          </button>
          <span className="text-[14px] text-gray-500 font-light tracking-[0.5em]">
            {String(currentProductIndex + 1).padStart(2, "0")} / {String(products.length).padStart(2, "0")}
          </span>
          <button 
            onClick={() => handleProductTransition((currentProductIndex + 1) % products.length)} 
            className="hover:opacity-30 p-1 cursor-pointer"
          >
            <ChevronRight size={24} />
          </button>
        </div>
      </div>

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
                onClick={() => { setIsFading(true); setTimeout(() => { setActiveThumb(i); setIsFading(false); }, 300); }} 
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
            Ref. {activeProduct._id ? activeProduct._id.substring(0, 8) : activeProduct.id}
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
          <button onClick={handleAddToCart} className="group relative w-full border-2 border-black bg-white py-7 text-[12px] md:text-[14px] font-black uppercase tracking-[0.4em] overflow-hidden">
            <span className={`absolute inset-0 translate-y-full bg-black transition-transform duration-500 ease-out ${addedFeedback ? 'translate-y-0' : 'group-hover:translate-y-0'}`} />
            <span className={`relative z-10 flex items-center justify-center gap-3 transition-colors duration-500 ${addedFeedback ? 'text-white' : 'text-black group-hover:text-white'}`}>
              {addedFeedback ? <><Check size={18} /> Added</> : <><ShoppingBag size={18} /> Add to Bag</>}
            </span>
          </button>
          
          <button onClick={handlePurchaseNow} className="group relative w-full bg-black py-7 text-[12px] md:text-[14px] font-black uppercase tracking-[0.4em] text-white overflow-hidden">
            <span className="absolute inset-0 translate-y-full bg-[#be1e2d] transition-transform duration-500 ease-out group-hover:translate-y-0" />
            <span className="relative z-10 flex items-center justify-center gap-3">
              <CreditCard size={18} /> Purchase Now
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}