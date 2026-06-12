// "use client";

// import { useState, useEffect, useRef } from "react";
// import Image from "next/image";
// import { useRouter } from "next/navigation";
// import { Product, getAllProducts } from "@/types/Product";
// import {
//   ShoppingBag,
//   Check,
//   CreditCard,
//   MinusCircle,
//   AlertTriangle,
//   Loader2,
// } from "lucide-react";
// import { useCart } from "@/context/CartContext";
// import { useSession } from "next-auth/react";
// import { urlFor } from "@/sanity/lib/image";

// interface ProductCardProps {
//   productSlug?: string;
// }

// export default function ProductCard({ productSlug }: ProductCardProps) {
//   const router = useRouter();
//   const { data: session, status } = useSession();
//   const { addToCart, loading: cartLoading } = useCart();
//   const cardRef = useRef<HTMLDivElement>(null);

//   const [products, setProducts] = useState<Product[]>([]);
//   const [activeProduct, setActiveProduct] = useState<Product | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [fetchError, setFetchError] = useState<string | null>(null);
//   const [addToCartLoading, setAddToCartLoading] = useState(false);
//   const [purchaseLoading, setPurchaseLoading] = useState(false);

//   // Image gallery state
//   const [galleryImages, setGalleryImages] = useState<any[]>([]);
//   const [centerImage, setCenterImage] = useState<any>(null);

//   // Transition state for image swap
//   const [isSwapping, setIsSwapping] = useState(false);

//   const [selectedColor, setSelectedColor] = useState(0);
//   const [selectedSize, setSelectedSize] = useState(0);
//   const [descOpen, setDescOpen] = useState(true);
//   const [addedFeedback, setAddedFeedback] = useState(false);
//   const [lastAddedConfig, setLastAddedConfig] = useState<{
//     colorIndex: number;
//     sizeIndex: number;
//   } | null>(null);

//   // Helper function to get stock status
//   const getStockStatus = (stock: number = 0) => {
//     if (stock <= 0)
//       return {
//         status: "out",
//         label: "OUT OF STOCK",
//         disabled: true,
//         message: "This piece is currently unavailable",
//       };
//     if (stock <= 5)
//       return {
//         status: "low",
//         label: `LOW STOCK • ${stock} LEFT`,
//         disabled: false,
//         badge: "LIMITED",
//         message: `Only ${stock} pieces remaining`,
//       };
//     return {
//       status: "in",
//       label: "IN STOCK",
//       disabled: false,
//       badge: "AVAILABLE",
//       message: "Ready to ship",
//     };
//   };

//   // SAFE image URL helper with error handling
//   const getImageUrl = (source: any): string => {
//     if (!source) return "/assets/placeholder.png";

//     try {
//       if (typeof source === "string") return source;

//       if (source.asset) {
//         return urlFor(source).url();
//       }

//       if (source._ref) {
//         const imageObj = { asset: { _ref: source._ref } };
//         return urlFor(imageObj).url();
//       }

//       if (source.hero) {
//         return getImageUrl(source.hero);
//       }

//       if (Array.isArray(source) && source.length > 0) {
//         return getImageUrl(source[0]);
//       }

//       console.warn("Unable to resolve image URL from source:", source);
//       return "/assets/placeholder.png";
//     } catch (error) {
//       console.error("Error resolving image URL:", error);
//       return "/assets/placeholder.png";
//     }
//   };

//   // Initialize gallery & incorporate color variant specific images
//   useEffect(() => {
//     if (activeProduct) {
//       const allImages: any[] = [];

//       // 1. Add baseline hero image if it exists
//       if (activeProduct.images?.hero) {
//         allImages.push(activeProduct.images.hero);
//       }

//       // 2. Safely collect unique color variant showcase images if present
//       if (activeProduct.colors && Array.isArray(activeProduct.colors)) {
//         activeProduct.colors.forEach((c: any) => {
//           if (c.image) {
//             const isDuplicate = allImages.some(
//               (img) =>
//                 (img?.asset?._ref && img.asset._ref === c.image?.asset?._ref) ||
//                 img === c.image,
//             );
//             if (!isDuplicate) {
//               allImages.push(c.image);
//             }
//           }
//         });
//       }

//       // 3. Add standard thumbnails if they exist
//       if (
//         activeProduct.images?.thumbnails &&
//         Array.isArray(activeProduct.images.thumbnails)
//       ) {
//         activeProduct.images.thumbnails.forEach((thumb: any) => {
//           const isDuplicate = allImages.some(
//             (img) =>
//               (img?.asset?._ref && img.asset._ref === thumb?.asset?._ref) ||
//               img === thumb,
//           );
//           if (!isDuplicate) {
//             allImages.push(thumb);
//           }
//         });
//       }

//       if (allImages.length === 0) {
//         Object.values(activeProduct).forEach((value) => {
//           if (value && typeof value === "object" && "asset" in value) {
//             allImages.push(value);
//           }
//         });
//       }

//       if (allImages.length === 0) {
//         allImages.push("/assets/placeholder.png");
//       }

//       setGalleryImages(allImages);

//       // Initialize with the current selected color variation's image if available
//       const initialColorImg = activeProduct.colors?.[selectedColor]?.image;
//       setCenterImage(initialColorImg || allImages[0]);
//     }
//   }, [activeProduct]);

//   // Sync image display when color swatches are selected
//   useEffect(() => {
//     if (activeProduct && activeProduct.colors?.[selectedColor]) {
//       const variantImage = activeProduct.colors[selectedColor].image;
//       if (variantImage) {
//         setIsSwapping(true);
//         const timer = setTimeout(() => {
//           setCenterImage(variantImage);
//           setIsSwapping(false);
//         }, 200);
//         return () => clearTimeout(timer);
//       }
//     }
//   }, [selectedColor, activeProduct]);

//   // FETCH ALL PRODUCTS AND FIND THE ONE MATCHING THE SLUG
//   useEffect(() => {
//     const fetchData = async () => {
//       setLoading(true);
//       setFetchError(null);

//       try {
//         const data = await getAllProducts();
//         setProducts(data);

//         if (data.length > 0 && productSlug) {
//           const foundProduct = data.find(
//             (p) => p.slug?.current === productSlug || p._id === productSlug,
//           );

//           if (foundProduct) {
//             setActiveProduct(foundProduct);
//             setSelectedColor(0);
//             setSelectedSize(0);
//             setAddedFeedback(false);
//             setLastAddedConfig(null);
//           } else {
//             setActiveProduct(null);
//             setFetchError("This product is currently unavailable");
//           }
//         } else if (data.length > 0) {
//           setActiveProduct(data[0]);
//         } else {
//           setFetchError("No products available");
//         }
//       } catch (error) {
//         console.error("Failed to fetch products:", error);
//         setFetchError("Failed to load product");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, [productSlug]);

//   const handleThumbnailClick = (clickedImage: any) => {
//     if (!centerImage || clickedImage === centerImage) return;

//     setIsSwapping(true);

//     setTimeout(() => {
//       setCenterImage(clickedImage);

//       // Bi-directional mapping: update selected color variant if clicked thumbnail matches a variant image
//       if (activeProduct?.colors) {
//         const matchingColorIndex = activeProduct.colors.findIndex(
//           (c: any) =>
//             c.image?.asset?._ref === clickedImage?.asset?._ref ||
//             c.image === clickedImage,
//         );
//         if (matchingColorIndex !== -1) {
//           setSelectedColor(matchingColorIndex);
//         }
//       }

//       setIsSwapping(false);
//     }, 250);
//   };

//   useEffect(() => {
//     if (lastAddedConfig) {
//       const isSameConfig =
//         lastAddedConfig.colorIndex === selectedColor &&
//         lastAddedConfig.sizeIndex === selectedSize;

//       if (!isSameConfig && addedFeedback) {
//         setAddedFeedback(false);
//         setLastAddedConfig(null);
//       }
//     }
//   }, [selectedColor, selectedSize, lastAddedConfig, addedFeedback]);

//   const handleAddToCart = async () => {
//     if (stockStatus.disabled) return;

//     if (status !== "authenticated") {
//       router.push(
//         "/login?callbackUrl=" + encodeURIComponent(window.location.pathname),
//       );
//       return;
//     }

//     const size = activeProduct!.sizes[selectedSize];
//     const colorObj = activeProduct!.colors[selectedColor];

//     setAddToCartLoading(true);
//     try {
//       await addToCart(activeProduct!, size, {
//         label: colorObj.label,
//         hex: colorObj.hex,
//       });

//       setAddedFeedback(true);
//       setLastAddedConfig({
//         colorIndex: selectedColor,
//         sizeIndex: selectedSize,
//       });
//     } catch (error) {
//       console.error("Failed to add to cart:", error);
//     } finally {
//       setAddToCartLoading(false);
//     }
//   };

//   const handlePurchaseNow = async () => {
//     if (stockStatus.disabled) return;

//     if (status !== "authenticated") {
//       router.push("/login?callbackUrl=/checkout");
//       return;
//     }

//     const size = activeProduct!.sizes[selectedSize];
//     const colorObj = activeProduct!.colors[selectedColor];

//     setPurchaseLoading(true);
//     try {
//       const directCheckoutItem = {
//         cartId: `direct-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
//         product: activeProduct,
//         quantity: 1,
//         selectedSize: size,
//         selectedColor: {
//           label: colorObj.label,
//           hex: colorObj.hex,
//         },
//       };

//       const encoded = encodeURIComponent(JSON.stringify(directCheckoutItem));
//       router.push(`/checkout?direct=true&item=${encoded}`);
//     } catch (error) {
//       console.error("Failed to process purchase:", error);
//       setPurchaseLoading(false);
//       alert("Failed to process purchase. Please try again.");
//     }
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-white">
//         <div className="text-center">
//           <div className="w-16 h-16 border-4 border-black border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
//           <p className="font-black tracking-widest uppercase text-sm">
//             Loading Piece...
//           </p>
//         </div>
//       </div>
//     );
//   }

//   if (!activeProduct || fetchError) {
//     return (
//       <div className="min-h-screen flex flex-col items-center justify-center bg-white px-4">
//         <div className="max-w-md text-center">
//           <AlertTriangle size={48} className="mx-auto mb-6 text-gray-400" />
//           <h1 className="text-2xl md:text-3xl font-black uppercase tracking-wider mb-4">
//             {fetchError || "Product Not Available"}
//           </h1>
//           <p className="text-sm text-gray-500 mb-8">
//             This product may be temporarily unavailable, removed, or you may
//             have followed a broken link.
//           </p>
//           <button
//             onClick={() => router.push("/products")}
//             className="group relative overflow-hidden border-2 border-black bg-black px-12 py-5 text-sm font-black uppercase tracking-[0.3em] text-white transition-all hover:bg-white hover:text-black"
//           >
//             <span className="relative z-10">Browse Collection</span>
//           </button>
//         </div>
//       </div>
//     );
//   }

//   const stockStatus = getStockStatus(activeProduct.stock || 0);
//   const titleLine1 = activeProduct.name;
//   const titleLine2 = activeProduct.colors?.[selectedColor]?.label || "";

//   return (
//     <div
//       ref={cardRef}
//       className="flex flex-col xl:flex-row w-full bg-white relative min-h-screen text-black antialiased overflow-x-hidden mt-0 border-t border-neutral-400"
//     >
//       {/* DESKTOP LAYOUT (xl screens and up) */}

//       {/* 1. LEFT PANEL - Title, Thumbnails and Product Narrative */}
//       <div className="hidden xl:block xl:w-[28%] p-6 sm:p-8 md:p-12 xl:p-16 border-r border-neutral-200 bg-white flex flex-col justify-between">
//         <div>
//           <div className="mb-6 xl:mb-10">
//             <span className="text-[12px] xl:text-[14px] uppercase tracking-[0.5em] text-gray-400 block mb-2 xl:mb-4 font-light">
//               The Collection
//             </span>
//             <span className="text-[11px] xl:text-[12px] uppercase tracking-[0.3em] font-bold border-b-2 border-black pb-2">
//               {activeProduct.category}
//             </span>
//           </div>

//           {/* Core Image Grid Element Selection Array */}
//           <div className="grid grid-cols-3 gap-3 xl:gap-4 mb-8">
//             {galleryImages.map((img, i) => {
//               const isCenterImage = img === centerImage;
//               return (
//                 <button
//                   key={i}
//                   onClick={() => handleThumbnailClick(img)}
//                   className={`group relative aspect-[3/4] transition-all duration-300 ease-out overflow-hidden bg-[#F9F9F9] border rounded-sm
//                     ${
//                       isCenterImage
//                         ? "opacity-100 border-black ring-1 ring-black scale-[0.96]"
//                         : "opacity-70 border-neutral-200 hover:opacity-100"
//                     }`}
//                 >
//                   <Image
//                     src={getImageUrl(img)}
//                     alt={`${activeProduct.name} thumbnail view ${i + 1}`}
//                     fill
//                     unoptimized
//                     className="object-cover transition-transform duration-500 group-hover:scale-105"
//                   />
//                 </button>
//               );
//             })}
//           </div>
//         </div>

//         <div className="border-t border-neutral-100 mt-4">
//           <button
//             onClick={() => setDescOpen(!descOpen)}
//             className="w-full flex justify-between items-center py-5 text-[13px] xl:text-[14px] uppercase tracking-[0.3em] font-bold hover:text-gray-600 transition-colors"
//           >
//             <span>Product Narrative</span>
//             <span className="text-lg">{descOpen ? "—" : "+"}</span>
//           </button>
//           {descOpen && activeProduct.description && (
//             <div className="pb-8 space-y-3 animate-fadeIn">
//               {Array.isArray(activeProduct.description) ? (
//                 activeProduct.description.map((line, i) => (
//                   <p
//                     key={i}
//                     className="text-[14px] xl:text-[15px] leading-[1.7] text-neutral-800 tracking-wide font-normal"
//                   >
//                     {line}
//                   </p>
//                 ))
//               ) : (
//                 <p className="text-[14px] xl:text-[15px] leading-[1.7] text-neutral-800 tracking-wide font-normal">
//                   {activeProduct.description}
//                 </p>
//               )}
//             </div>
//           )}
//         </div>
//       </div>

//       {/* 2. MIDDLE SECTION - Main Image View */}
//       <div className="hidden xl:block xl:w-[44%] bg-[#F5F5F5] relative flex items-center justify-center h-screen overflow-hidden group border-r border-neutral-200">
//         <div
//           className={`relative w-full h-full transition-all duration-300 ease-in-out
//             ${isSwapping ? "opacity-0 scale-95 blur-sm" : "opacity-100 scale-100 blur-0"}`}
//         >
//           {centerImage && (
//             <Image
//               src={getImageUrl(centerImage)}
//               alt={`${activeProduct.name} - ${titleLine2}`}
//               fill
//               unoptimized
//               className="object-contain p-4 sm:p-8 xl:p-16 transition-transform duration-700 ease-out group-hover:scale-102"
//               priority
//             />
//           )}
//         </div>

//         {/* Sold Out Overlay */}
//         {stockStatus.status === "out" && (
//           <div className="absolute inset-0 flex items-center justify-center pointer-events-none bg-black/5">
//             <div className="border-4 md:border-8 border-red-600 rotate-[-15deg] px-8 py-3 md:px-12 md:py-4 rounded-sm opacity-80 bg-white/95 shadow-xl">
//               <span className="text-red-600 text-3xl md:text-6xl font-black uppercase tracking-[0.3em]">
//                 SOLD OUT
//               </span>
//             </div>
//           </div>
//         )}
//       </div>

//       {/* 3. RIGHT PANEL - Details Panel */}
//       <div className="hidden xl:block xl:w-[28%] p-6 sm:p-8 md:p-12 xl:p-16 bg-white flex flex-col justify-center">
//         <h1 className="text-2xl sm:text-3xl xl:text-4xl font-light tracking-tighter leading-[1.1] mb-4 xl:mb-6 uppercase">
//           {titleLine1} <br />
//           <span className="font-black text-neutral-900">{titleLine2}</span>
//         </h1>

//         <p className="text-[1.75rem] xl:text-[2rem] font-light tracking-[0.15em] mb-4 xl:mb-6">
//           {activeProduct.price}
//         </p>

//         {/* Stock Status Layout Panels */}
//         {stockStatus.status === "out" && (
//           <div className="mb-6 bg-neutral-50 border border-neutral-200 p-4 rounded-sm text-center">
//             <span className="text-red-600 text-[13px] font-bold uppercase tracking-[0.25em]">
//               {stockStatus.label}
//             </span>
//             <p className="text-[11px] text-gray-500 uppercase tracking-[0.15em] mt-1">
//               {stockStatus.message}
//             </p>
//           </div>
//         )}

//         {stockStatus.status === "low" && (
//           <div className="mb-6 bg-amber-50 border-l-4 border-amber-500 p-4 rounded-r-sm">
//             <div className="flex items-center gap-2.5">
//               <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
//               <p className="text-[12px] font-bold uppercase tracking-[0.2em] text-amber-800">
//                 {stockStatus.label}
//               </p>
//             </div>
//             <p className="text-[11px] text-amber-600 mt-1 ml-4">
//               {stockStatus.message}
//             </p>
//           </div>
//         )}

//         {stockStatus.status === "in" && (
//           <div className="mb-6 flex items-center gap-2 pl-1">
//             <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
//             <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-neutral-500">
//               {stockStatus.label} • {stockStatus.message}
//             </p>
//           </div>
//         )}

//         {/* Configurations Controls Box */}
//         <div
//           className={`space-y-8 xl:space-y-10 ${stockStatus.status === "out" ? "opacity-40 pointer-events-none" : ""}`}
//         >
//           {activeProduct.colors && (
//             <div>
//               <p className="text-[12px] xl:text-[13px] uppercase tracking-[0.35em] font-bold mb-4 text-neutral-500">
//                 Color Variant
//               </p>
//               <div className="flex flex-wrap gap-4.5">
//                 {activeProduct.colors.map((c, i) => (
//                   <button
//                     key={i}
//                     onClick={() => !stockStatus.disabled && setSelectedColor(i)}
//                     disabled={stockStatus.disabled}
//                     className={`w-7 h-7 rounded-full transition-all duration-300 relative border border-black/10
//                       ${
//                         i === selectedColor
//                           ? "scale-110 ring-2 ring-black ring-offset-2 shadow-md z-10"
//                           : "opacity-80 hover:opacity-100 hover:scale-[1.05]"
//                       }`}
//                     style={{ backgroundColor: c.hex }}
//                     title={c.label}
//                   />
//                 ))}
//               </div>
//             </div>
//           )}

//           {activeProduct.sizes && (
//             <div>
//               <p className="text-[12px] xl:text-[13px] uppercase tracking-[0.35em] font-bold mb-4 text-neutral-500">
//                 Dimensions
//               </p>
//               <div className="grid grid-cols-4 gap-2.5">
//                 {activeProduct.sizes.map((s, i) => (
//                   <button
//                     key={s}
//                     onClick={() => !stockStatus.disabled && setSelectedSize(i)}
//                     disabled={stockStatus.disabled}
//                     className={`py-3.5 text-[14px] xl:text-[15px] tracking-[0.15em] font-medium border transition-all duration-300 rounded-sm
//                       ${
//                         i === selectedSize
//                           ? "bg-black text-white border-black"
//                           : "border-neutral-200 text-neutral-800 hover:border-black hover:bg-neutral-50"
//                       }`}
//                   >
//                     {s}
//                   </button>
//                 ))}
//               </div>
//             </div>
//           )}
//         </div>

//         {/* Action Controls Panel */}
//         <div className="mt-10 xl:mt-12 space-y-3.5">
//           {stockStatus.status === "out" ? (
//             <div className="border border-neutral-200 bg-neutral-50 py-8 px-4 text-center rounded-sm">
//               <p className="text-[24px] font-black text-neutral-400 uppercase tracking-wider mb-2">
//                 OUT OF STOCK
//               </p>
//               <button
//                 onClick={() =>
//                   console.log("Notify registered for:", activeProduct.name)
//                 }
//                 className="text-[11px] font-bold uppercase tracking-[0.25em] border-b border-neutral-400 pb-0.5 text-neutral-600 hover:text-black hover:border-black transition-all"
//               >
//                 Notify Me When Available
//               </button>
//             </div>
//           ) : (
//             <>
//               <button
//                 onClick={handleAddToCart}
//                 disabled={
//                   stockStatus.disabled ||
//                   addToCartLoading ||
//                   cartLoading ||
//                   purchaseLoading
//                 }
//                 className="group relative w-full border-2 border-black py-5 text-[13px] font-black uppercase tracking-[0.35em] overflow-hidden transition-all rounded-sm bg-white"
//               >
//                 <span
//                   className={`absolute inset-0 bg-black transition-transform duration-500 ease-out ${
//                     addedFeedback
//                       ? "translate-y-0"
//                       : "translate-y-full group-hover:translate-y-0"
//                   }`}
//                 />
//                 <span
//                   className={`relative z-10 flex items-center justify-center gap-2.5 transition-colors duration-500 ${
//                     addedFeedback
//                       ? "text-white"
//                       : "text-black group-hover:text-white"
//                   }`}
//                 >
//                   {addToCartLoading || cartLoading ? (
//                     <>
//                       <Loader2 size={16} className="animate-spin" />
//                       <span>Adding...</span>
//                     </>
//                   ) : addedFeedback ? (
//                     <>
//                       <Check size={16} className="text-white" />
//                       <span className="text-white">Added to Bag ✓</span>
//                     </>
//                   ) : (
//                     <>
//                       <ShoppingBag size={16} />
//                       <span>Add to Bag</span>
//                     </>
//                   )}
//                 </span>
//               </button>

//               <button
//                 onClick={handlePurchaseNow}
//                 disabled={
//                   stockStatus.disabled ||
//                   purchaseLoading ||
//                   addToCartLoading ||
//                   cartLoading
//                 }
//                 className="group relative w-full py-5 text-[13px] font-black uppercase tracking-[0.35em] overflow-hidden transition-all rounded-sm bg-black text-white hover:bg-[#be1e2d]"
//               >
//                 <span className="absolute inset-0 translate-y-full bg-[#be1e2d] transition-transform duration-500 ease-out group-hover:translate-y-0" />
//                 <span className="relative z-10 flex items-center justify-center gap-2.5">
//                   <CreditCard size={16} />
//                   {purchaseLoading ? (
//                     <>
//                       <Loader2 size={16} className="animate-spin" />
//                       <span>Processing...</span>
//                     </>
//                   ) : (
//                     "Purchase Now"
//                   )}
//                 </span>
//               </button>
//             </>
//           )}
//         </div>

//         {addedFeedback && !stockStatus.disabled && (
//           <div className="mt-4 space-y-1 animate-pulse">
//             <p className="text-[10px] text-green-600 uppercase tracking-wider text-center font-bold">
//               ✓ Item successfully added to your bag!
//             </p>
//           </div>
//         )}
//       </div>

//       {/* MOBILE LAYOUT (below xl screens) */}
//       <div className="xl:hidden w-full">
//         {/* Title Section */}
//         <div className="p-6 sm:p-8 border-b border-neutral-200">
//           <div className="mb-4">
//             <span className="text-[12px] uppercase tracking-[0.5em] text-gray-400 block mb-2 font-light">
//               The Collection
//             </span>
//             <span className="text-[11px] uppercase tracking-[0.3em] font-bold border-b-2 border-black pb-2">
//               {activeProduct.category}
//             </span>
//           </div>
//           <h1 className="text-2xl sm:text-3xl font-light tracking-tighter leading-[1.1] mb-2 uppercase">
//             {titleLine1} <br />
//             <span className="font-black text-neutral-900">{titleLine2}</span>
//           </h1>
//           <p className="text-[1.75rem] font-light tracking-[0.15em]">
//             {activeProduct.price}
//           </p>
//         </div>

//         {/* Main Image */}
//         <div className="bg-[#F5F5F5] relative flex items-center justify-center h-[55vh] sm:h-[65vh] overflow-hidden group border-b border-neutral-200">
//           <div
//             className={`relative w-full h-full transition-all duration-300 ease-in-out
//               ${isSwapping ? "opacity-0 scale-95 blur-sm" : "opacity-100 scale-100 blur-0"}`}
//           >
//             {centerImage && (
//               <Image
//                 src={getImageUrl(centerImage)}
//                 alt={`${activeProduct.name} - ${titleLine2}`}
//                 fill
//                 unoptimized
//                 className="object-contain p-4 sm:p-8 transition-transform duration-700 ease-out group-hover:scale-102"
//                 priority
//               />
//             )}
//           </div>

//           {/* Sold Out Overlay */}
//           {stockStatus.status === "out" && (
//             <div className="absolute inset-0 flex items-center justify-center pointer-events-none bg-black/5">
//               <div className="border-4 border-red-600 rotate-[-15deg] px-6 py-2 rounded-sm opacity-80 bg-white/95 shadow-xl">
//                 <span className="text-red-600 text-2xl sm:text-4xl font-black uppercase tracking-[0.2em]">
//                   SOLD OUT
//                 </span>
//               </div>
//             </div>
//           )}
//         </div>

//         {/* Thumbnails */}
//         <div className="p-6 sm:p-8 border-b border-neutral-200">
//           <div className="grid grid-cols-4 gap-3">
//             {galleryImages.map((img, i) => {
//               const isCenterImage = img === centerImage;
//               return (
//                 <button
//                   key={i}
//                   onClick={() => handleThumbnailClick(img)}
//                   className={`group relative aspect-[3/4] transition-all duration-300 ease-out overflow-hidden bg-[#F9F9F9] border rounded-sm
//                     ${
//                       isCenterImage
//                         ? "opacity-100 border-black ring-1 ring-black scale-[0.96]"
//                         : "opacity-70 border-neutral-200 hover:opacity-100"
//                     }`}
//                 >
//                   <Image
//                     src={getImageUrl(img)}
//                     alt={`${activeProduct.name} thumbnail view ${i + 1}`}
//                     fill
//                     unoptimized
//                     className="object-cover transition-transform duration-500 group-hover:scale-105"
//                   />
//                 </button>
//               );
//             })}
//           </div>
//         </div>

//         {/* Product Narrative */}
//         <div className="p-6 sm:p-8 border-b border-neutral-200">
//           <button
//             onClick={() => setDescOpen(!descOpen)}
//             className="w-full flex justify-between items-center py-2 text-[13px] uppercase tracking-[0.3em] font-bold hover:text-gray-600 transition-colors"
//           >
//             <span>Product Narrative</span>
//             <span className="text-lg">{descOpen ? "—" : "+"}</span>
//           </button>
//           {descOpen && activeProduct.description && (
//             <div className="pt-4 space-y-3 animate-fadeIn">
//               {Array.isArray(activeProduct.description) ? (
//                 activeProduct.description.map((line, i) => (
//                   <p
//                     key={i}
//                     className="text-[14px] leading-[1.7] text-neutral-800 tracking-wide font-normal"
//                   >
//                     {line}
//                   </p>
//                 ))
//               ) : (
//                 <p className="text-[14px] leading-[1.7] text-neutral-800 tracking-wide font-normal">
//                   {activeProduct.description}
//                 </p>
//               )}
//             </div>
//           )}
//         </div>

//         {/* Details Panel */}
//         <div className="p-6 sm:p-8 bg-white">
//           {/* Stock Status Layout Panels */}
//           {stockStatus.status === "out" && (
//             <div className="mb-6 bg-neutral-50 border border-neutral-200 p-4 rounded-sm text-center">
//               <span className="text-red-600 text-[13px] font-bold uppercase tracking-[0.25em]">
//                 {stockStatus.label}
//               </span>
//               <p className="text-[11px] text-gray-500 uppercase tracking-[0.15em] mt-1">
//                 {stockStatus.message}
//               </p>
//             </div>
//           )}

//           {stockStatus.status === "low" && (
//             <div className="mb-6 bg-amber-50 border-l-4 border-amber-500 p-4 rounded-r-sm">
//               <div className="flex items-center gap-2.5">
//                 <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
//                 <p className="text-[12px] font-bold uppercase tracking-[0.2em] text-amber-800">
//                   {stockStatus.label}
//                 </p>
//               </div>
//               <p className="text-[11px] text-amber-600 mt-1 ml-4">
//                 {stockStatus.message}
//               </p>
//             </div>
//           )}

//           {stockStatus.status === "in" && (
//             <div className="mb-6 flex items-center gap-2 pl-1">
//               <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
//               <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-neutral-500">
//                 {stockStatus.label} • {stockStatus.message}
//               </p>
//             </div>
//           )}

//           {/* Configurations Controls Box */}
//           <div
//             className={`space-y-8 ${stockStatus.status === "out" ? "opacity-40 pointer-events-none" : ""}`}
//           >
//             {activeProduct.colors && (
//               <div>
//                 <p className="text-[12px] uppercase tracking-[0.35em] font-bold mb-4 text-neutral-500">
//                   Color Variant
//                 </p>
//                 <div className="flex flex-wrap gap-4.5">
//                   {activeProduct.colors.map((c, i) => (
//                     <button
//                       key={i}
//                       onClick={() =>
//                         !stockStatus.disabled && setSelectedColor(i)
//                       }
//                       disabled={stockStatus.disabled}
//                       className={`w-7 h-7 rounded-full transition-all duration-300 relative border border-black/10
//                         ${
//                           i === selectedColor
//                             ? "scale-110 ring-2 ring-black ring-offset-2 shadow-md z-10"
//                             : "opacity-80 hover:opacity-100 hover:scale-[1.05]"
//                         }`}
//                       style={{ backgroundColor: c.hex }}
//                       title={c.label}
//                     />
//                   ))}
//                 </div>
//               </div>
//             )}

//             {activeProduct.sizes && (
//               <div>
//                 <p className="text-[12px] uppercase tracking-[0.35em] font-bold mb-4 text-neutral-500">
//                   Dimensions
//                 </p>
//                 <div className="grid grid-cols-4 gap-2.5">
//                   {activeProduct.sizes.map((s, i) => (
//                     <button
//                       key={s}
//                       onClick={() =>
//                         !stockStatus.disabled && setSelectedSize(i)
//                       }
//                       disabled={stockStatus.disabled}
//                       className={`py-3.5 text-[14px] tracking-[0.15em] font-medium border transition-all duration-300 rounded-sm
//                         ${
//                           i === selectedSize
//                             ? "bg-black text-white border-black"
//                             : "border-neutral-200 text-neutral-800 hover:border-black hover:bg-neutral-50"
//                         }`}
//                     >
//                       {s}
//                     </button>
//                   ))}
//                 </div>
//               </div>
//             )}
//           </div>

//           {/* Action Controls Panel */}
//           <div className="mt-8 space-y-3.5">
//             {stockStatus.status === "out" ? (
//               <div className="border border-neutral-200 bg-neutral-50 py-6 px-4 text-center rounded-sm">
//                 <p className="text-[18px] font-black text-neutral-400 uppercase tracking-wider mb-2">
//                   OUT OF STOCK
//                 </p>
//                 <button
//                   onClick={() =>
//                     console.log("Notify registered for:", activeProduct.name)
//                   }
//                   className="text-[10px] font-bold uppercase tracking-[0.25em] border-b border-neutral-400 pb-0.5 text-neutral-600 hover:text-black hover:border-black transition-all"
//                 >
//                   Notify Me When Available
//                 </button>
//               </div>
//             ) : (
//               <>
//                 <button
//                   onClick={handleAddToCart}
//                   disabled={
//                     stockStatus.disabled ||
//                     addToCartLoading ||
//                     cartLoading ||
//                     purchaseLoading
//                   }
//                   className="group relative w-full border-2 border-black py-5 text-[13px] font-black uppercase tracking-[0.35em] overflow-hidden transition-all rounded-sm bg-white"
//                 >
//                   <span
//                     className={`absolute inset-0 bg-black transition-transform duration-500 ease-out ${
//                       addedFeedback
//                         ? "translate-y-0"
//                         : "translate-y-full group-hover:translate-y-0"
//                     }`}
//                   />
//                   <span
//                     className={`relative z-10 flex items-center justify-center gap-2.5 transition-colors duration-500 ${
//                       addedFeedback
//                         ? "text-white"
//                         : "text-black group-hover:text-white"
//                     }`}
//                   >
//                     {addToCartLoading || cartLoading ? (
//                       <>
//                         <Loader2 size={16} className="animate-spin" />
//                         <span>Adding...</span>
//                       </>
//                     ) : addedFeedback ? (
//                       <>
//                         <Check size={16} className="text-white" />
//                         <span className="text-white">Added to Bag ✓</span>
//                       </>
//                     ) : (
//                       <>
//                         <ShoppingBag size={16} />
//                         <span>Add to Bag</span>
//                       </>
//                     )}
//                   </span>
//                 </button>

//                 <button
//                   onClick={handlePurchaseNow}
//                   disabled={
//                     stockStatus.disabled ||
//                     purchaseLoading ||
//                     addToCartLoading ||
//                     cartLoading
//                   }
//                   className="group relative w-full py-5 text-[13px] font-black uppercase tracking-[0.35em] overflow-hidden transition-all rounded-sm bg-black text-white hover:bg-[#be1e2d]"
//                 >
//                   <span className="absolute inset-0 translate-y-full bg-[#be1e2d] transition-transform duration-500 ease-out group-hover:translate-y-0" />
//                   <span className="relative z-10 flex items-center justify-center gap-2.5">
//                     <CreditCard size={16} />
//                     {purchaseLoading ? (
//                       <>
//                         <Loader2 size={16} className="animate-spin" />
//                         <span>Processing...</span>
//                       </>
//                     ) : (
//                       "Purchase Now"
//                     )}
//                   </span>
//                 </button>
//               </>
//             )}
//           </div>

//           {addedFeedback && !stockStatus.disabled && (
//             <div className="mt-4 space-y-1 animate-pulse">
//               <p className="text-[10px] text-green-600 uppercase tracking-wider text-center font-bold">
//                 ✓ Item successfully added to your bag!
//               </p>
//             </div>
//           )}
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
import {
  ShoppingBag,
  Check,
  CreditCard,
  MinusCircle,
  AlertTriangle,
  Loader2,
} from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useSession } from "next-auth/react";
import { urlFor } from "@/sanity/lib/image";

interface ProductCardProps {
  productSlug?: string;
}

export default function ProductCard({ productSlug }: ProductCardProps) {
  const router = useRouter();
  const { data: session, status } = useSession();
  const { addToCart, loading: cartLoading } = useCart();
  const cardRef = useRef<HTMLDivElement>(null);

  const [products, setProducts] = useState<Product[]>([]);
  const [activeProduct, setActiveProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [addToCartLoading, setAddToCartLoading] = useState(false);
  const [purchaseLoading, setPurchaseLoading] = useState(false);

  // Image gallery state
  const [galleryImages, setGalleryImages] = useState<any[]>([]);
  const [centerImage, setCenterImage] = useState<any>(null);

  // Transition state for image swap
  const [isSwapping, setIsSwapping] = useState(false);

  const [selectedColor, setSelectedColor] = useState(0);
  const [selectedSize, setSelectedSize] = useState(0);
  const [descOpen, setDescOpen] = useState(true);
  const [addedFeedback, setAddedFeedback] = useState(false);
  const [lastAddedConfig, setLastAddedConfig] = useState<{
    colorIndex: number;
    sizeIndex: number;
  } | null>(null);

  // Helper function to get stock status
  const getStockStatus = (stock: number = 0) => {
    if (stock <= 0)
      return {
        status: "out",
        label: "OUT OF STOCK",
        disabled: true,
        message: "This piece is currently unavailable",
      };
    if (stock <= 5)
      return {
        status: "low",
        label: `LOW STOCK • ${stock} LEFT`,
        disabled: false,
        badge: "LIMITED",
        message: `Only ${stock} pieces remaining`,
      };
    return {
      status: "in",
      label: "IN STOCK",
      disabled: false,
      badge: "AVAILABLE",
      message: "Ready to ship",
    };
  };

  // SAFE image URL helper with error handling
  const getImageUrl = (source: any): string => {
    if (!source) return "/assets/placeholder.png";

    try {
      if (typeof source === "string") return source;

      if (source.asset) {
        return urlFor(source).url();
      }

      if (source._ref) {
        const imageObj = { asset: { _ref: source._ref } };
        return urlFor(imageObj).url();
      }

      if (source.hero) {
        return getImageUrl(source.hero);
      }

      if (Array.isArray(source) && source.length > 0) {
        return getImageUrl(source[0]);
      }

      console.warn("Unable to resolve image URL from source:", source);
      return "/assets/placeholder.png";
    } catch (error) {
      console.error("Error resolving image URL:", error);
      return "/assets/placeholder.png";
    }
  };

  // Initialize gallery & incorporate color variant specific images
  useEffect(() => {
    if (activeProduct) {
      const allImages: any[] = [];

      // 1. Add baseline hero image if it exists
      if (activeProduct.images?.hero) {
        allImages.push(activeProduct.images.hero);
      }

      // 2. Safely collect unique color variant showcase images if present
      if (activeProduct.colors && Array.isArray(activeProduct.colors)) {
        activeProduct.colors.forEach((c: any) => {
          if (c.image) {
            const isDuplicate = allImages.some(
              (img) =>
                (img?.asset?._ref && img.asset._ref === c.image?.asset?._ref) ||
                img === c.image,
            );
            if (!isDuplicate) {
              allImages.push(c.image);
            }
          }
        });
      }

      // 3. Add standard thumbnails if they exist
      if (
        activeProduct.images?.thumbnails &&
        Array.isArray(activeProduct.images.thumbnails)
      ) {
        activeProduct.images.thumbnails.forEach((thumb: any) => {
          const isDuplicate = allImages.some(
            (img) =>
              (img?.asset?._ref && img.asset._ref === thumb?.asset?._ref) ||
              img === thumb,
          );
          if (!isDuplicate) {
            allImages.push(thumb);
          }
        });
      }

      if (allImages.length === 0) {
        Object.values(activeProduct).forEach((value) => {
          if (value && typeof value === "object" && "asset" in value) {
            allImages.push(value);
          }
        });
      }

      if (allImages.length === 0) {
        allImages.push("/assets/placeholder.png");
      }

      setGalleryImages(allImages);

      // Initialize with the current selected color variation's image if available
      const initialColorImg = activeProduct.colors?.[selectedColor]?.image;
      setCenterImage(initialColorImg || allImages[0]);
    }
  }, [activeProduct]);

  // Sync image display when color swatches are selected
  useEffect(() => {
    if (activeProduct && activeProduct.colors?.[selectedColor]) {
      const variantImage = activeProduct.colors[selectedColor].image;
      if (variantImage) {
        setIsSwapping(true);
        const timer = setTimeout(() => {
          setCenterImage(variantImage);
          setIsSwapping(false);
        }, 200);
        return () => clearTimeout(timer);
      }
    }
  }, [selectedColor, activeProduct]);

  // FETCH ALL PRODUCTS AND FIND THE ONE MATCHING THE SLUG
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setFetchError(null);

      try {
        const data = await getAllProducts();
        setProducts(data);

        if (data.length > 0 && productSlug) {
          const foundProduct = data.find(
            (p) => p.slug?.current === productSlug || p._id === productSlug,
          );

          if (foundProduct) {
            setActiveProduct(foundProduct);
            setSelectedColor(0);
            setSelectedSize(0);
            setAddedFeedback(false);
            setLastAddedConfig(null);
          } else {
            setActiveProduct(null);
            setFetchError("This product is currently unavailable");
          }
        } else if (data.length > 0) {
          setActiveProduct(data[0]);
        } else {
          setFetchError("No products available");
        }
      } catch (error) {
        console.error("Failed to fetch products:", error);
        setFetchError("Failed to load product");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [productSlug]);

  const handleThumbnailClick = (clickedImage: any) => {
    if (!centerImage || clickedImage === centerImage) return;

    setIsSwapping(true);

    setTimeout(() => {
      setCenterImage(clickedImage);

      // Bi-directional mapping: update selected color variant if clicked thumbnail matches a variant image
      if (activeProduct?.colors) {
        const matchingColorIndex = activeProduct.colors.findIndex(
          (c: any) =>
            c.image?.asset?._ref === clickedImage?.asset?._ref ||
            c.image === clickedImage,
        );
        if (matchingColorIndex !== -1) {
          setSelectedColor(matchingColorIndex);
        }
      }

      setIsSwapping(false);
    }, 250);
  };

  useEffect(() => {
    if (lastAddedConfig) {
      const isSameConfig =
        lastAddedConfig.colorIndex === selectedColor &&
        lastAddedConfig.sizeIndex === selectedSize;

      if (!isSameConfig && addedFeedback) {
        setAddedFeedback(false);
        setLastAddedConfig(null);
      }
    }
  }, [selectedColor, selectedSize, lastAddedConfig, addedFeedback]);

  const handleAddToCart = async () => {
    if (stockStatus.disabled) return;

    if (status !== "authenticated") {
      router.push(
        "/login?callbackUrl=" + encodeURIComponent(window.location.pathname),
      );
      return;
    }

    const size = activeProduct!.sizes[selectedSize];
    const colorObj = activeProduct!.colors[selectedColor];

    setAddToCartLoading(true);
    try {
      await addToCart(activeProduct!, size, {
        label: colorObj.label,
        hex: colorObj.hex,
      });

      setAddedFeedback(true);
      setLastAddedConfig({
        colorIndex: selectedColor,
        sizeIndex: selectedSize,
      });
    } catch (error) {
      console.error("Failed to add to cart:", error);
    } finally {
      setAddToCartLoading(false);
    }
  };

  // ==================== PURCHASE NOW (DIRECT CHECKOUT) - FIXED ====================
  const handlePurchaseNow = async () => {
    if (stockStatus.disabled) return;

    if (status !== "authenticated") {
      router.push("/login?callbackUrl=/checkout");
      return;
    }

    const size = activeProduct!.sizes[selectedSize];
    const colorObj = activeProduct!.colors[selectedColor];

    setPurchaseLoading(true);
    try {
      // Create the direct checkout payload
      const directCheckoutItem = {
        cartId: `direct-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
        product: activeProduct,
        quantity: 1,
        selectedSize: size,
        selectedColor: {
          label: colorObj.label,
          hex: colorObj.hex,
        },
      };

      // Store in sessionStorage instead of URL query param.
      // This is the RELIABLE way — avoids URL length limits and parsing failures.
      if (typeof window !== "undefined") {
        sessionStorage.setItem(
          "directCheckoutItem",
          JSON.stringify(directCheckoutItem),
        );
      }

      // Navigate with a clean, short URL. Checkout page will read from sessionStorage.
      router.push("/checkout?direct=true");
    } catch (error) {
      console.error("Failed to process purchase:", error);
      setPurchaseLoading(false);
      alert("Failed to process purchase. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-black border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
          <p className="font-black tracking-widest uppercase text-sm">
            Loading Piece...
          </p>
        </div>
      </div>
    );
  }

  if (!activeProduct || fetchError) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white px-4">
        <div className="max-w-md text-center">
          <AlertTriangle size={48} className="mx-auto mb-6 text-gray-400" />
          <h1 className="text-2xl md:text-3xl font-black uppercase tracking-wider mb-4">
            {fetchError || "Product Not Available"}
          </h1>
          <p className="text-sm text-gray-500 mb-8">
            This product may be temporarily unavailable, removed, or you may
            have followed a broken link.
          </p>
          <button
            onClick={() => router.push("/products")}
            className="group relative overflow-hidden border-2 border-black bg-black px-12 py-5 text-sm font-black uppercase tracking-[0.3em] text-white transition-all hover:bg-white hover:text-black"
          >
            <span className="relative z-10">Browse Collection</span>
          </button>
        </div>
      </div>
    );
  }

  const stockStatus = getStockStatus(activeProduct.stock || 0);
  const titleLine1 = activeProduct.name;
  const titleLine2 = activeProduct.colors?.[selectedColor]?.label || "";

  return (
    <div
      ref={cardRef}
      className="flex flex-col xl:flex-row w-full bg-white relative min-h-screen text-black antialiased overflow-x-hidden mt-0 border-t border-neutral-400"
    >
      {/* DESKTOP LAYOUT (xl screens and up) */}

      {/* 1. LEFT PANEL - Title, Thumbnails and Product Narrative */}
      <div className="hidden xl:block xl:w-[28%] p-6 sm:p-8 md:p-12 xl:p-16 border-r border-neutral-200 bg-white flex flex-col justify-between">
        <div>
          <div className="mb-6 xl:mb-10">
            <span className="text-[12px] xl:text-[14px] uppercase tracking-[0.5em] text-gray-400 block mb-2 xl:mb-4 font-light">
              The Collection
            </span>
            <span className="text-[11px] xl:text-[12px] uppercase tracking-[0.3em] font-bold border-b-2 border-black pb-2">
              {activeProduct.category}
            </span>
          </div>

          {/* Core Image Grid Element Selection Array */}
          <div className="grid grid-cols-3 gap-3 xl:gap-4 mb-8">
            {galleryImages.map((img, i) => {
              const isCenterImage = img === centerImage;
              return (
                <button
                  key={i}
                  onClick={() => handleThumbnailClick(img)}
                  className={`group relative aspect-[3/4] transition-all duration-300 ease-out overflow-hidden bg-[#F9F9F9] border rounded-sm
                    ${
                      isCenterImage
                        ? "opacity-100 border-black ring-1 ring-black scale-[0.96]"
                        : "opacity-70 border-neutral-200 hover:opacity-100"
                    }`}
                >
                  <Image
                    src={getImageUrl(img)}
                    alt={`${activeProduct.name} thumbnail view ${i + 1}`}
                    fill
                    unoptimized
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </button>
              );
            })}
          </div>
        </div>

        <div className="border-t border-neutral-100 mt-4">
          <button
            onClick={() => setDescOpen(!descOpen)}
            className="w-full flex justify-between items-center py-5 text-[13px] xl:text-[14px] uppercase tracking-[0.3em] font-bold hover:text-gray-600 transition-colors"
          >
            <span>Product Narrative</span>
            <span className="text-lg">{descOpen ? "—" : "+"}</span>
          </button>
          {descOpen && activeProduct.description && (
            <div className="pb-8 space-y-3 animate-fadeIn">
              {Array.isArray(activeProduct.description) ? (
                activeProduct.description.map((line, i) => (
                  <p
                    key={i}
                    className="text-[14px] xl:text-[15px] leading-[1.7] text-neutral-800 tracking-wide font-normal"
                  >
                    {line}
                  </p>
                ))
              ) : (
                <p className="text-[14px] xl:text-[15px] leading-[1.7] text-neutral-800 tracking-wide font-normal">
                  {activeProduct.description}
                </p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* 2. MIDDLE SECTION - Main Image View */}
      <div className="hidden xl:block xl:w-[44%] bg-[#F5F5F5] relative flex items-center justify-center h-screen overflow-hidden group border-r border-neutral-200">
        <div
          className={`relative w-full h-full transition-all duration-300 ease-in-out
            ${isSwapping ? "opacity-0 scale-95 blur-sm" : "opacity-100 scale-100 blur-0"}`}
        >
          {centerImage && (
            <Image
              src={getImageUrl(centerImage)}
              alt={`${activeProduct.name} - ${titleLine2}`}
              fill
              unoptimized
              className="object-contain p-4 sm:p-8 xl:p-16 transition-transform duration-700 ease-out group-hover:scale-102"
              priority
            />
          )}
        </div>

        {/* Sold Out Overlay */}
        {stockStatus.status === "out" && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none bg-black/5">
            <div className="border-4 md:border-8 border-red-600 rotate-[-15deg] px-8 py-3 md:px-12 md:py-4 rounded-sm opacity-80 bg-white/95 shadow-xl">
              <span className="text-red-600 text-3xl md:text-6xl font-black uppercase tracking-[0.3em]">
                SOLD OUT
              </span>
            </div>
          </div>
        )}
      </div>

      {/* 3. RIGHT PANEL - Details Panel */}
      <div className="hidden xl:block xl:w-[28%] p-6 sm:p-8 md:p-12 xl:p-16 bg-white flex flex-col justify-center">
        <h1 className="text-2xl sm:text-3xl xl:text-4xl font-light tracking-tighter leading-[1.1] mb-4 xl:mb-6 uppercase">
          {titleLine1} <br />
          <span className="font-black text-neutral-900">{titleLine2}</span>
        </h1>

        <p className="text-[1.75rem] xl:text-[2rem] font-light tracking-[0.15em] mb-4 xl:mb-6">
          {activeProduct.price}
        </p>

        {/* Stock Status Layout Panels */}
        {stockStatus.status === "out" && (
          <div className="mb-6 bg-neutral-50 border border-neutral-200 p-4 rounded-sm text-center">
            <span className="text-red-600 text-[13px] font-bold uppercase tracking-[0.25em]">
              {stockStatus.label}
            </span>
            <p className="text-[11px] text-gray-500 uppercase tracking-[0.15em] mt-1">
              {stockStatus.message}
            </p>
          </div>
        )}

        {stockStatus.status === "low" && (
          <div className="mb-6 bg-amber-50 border-l-4 border-amber-500 p-4 rounded-r-sm">
            <div className="flex items-center gap-2.5">
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
              <p className="text-[12px] font-bold uppercase tracking-[0.2em] text-amber-800">
                {stockStatus.label}
              </p>
            </div>
            <p className="text-[11px] text-amber-600 mt-1 ml-4">
              {stockStatus.message}
            </p>
          </div>
        )}

        {stockStatus.status === "in" && (
          <div className="mb-6 flex items-center gap-2 pl-1">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-neutral-500">
              {stockStatus.label} • {stockStatus.message}
            </p>
          </div>
        )}

        {/* Configurations Controls Box */}
        <div
          className={`space-y-8 xl:space-y-10 ${stockStatus.status === "out" ? "opacity-40 pointer-events-none" : ""}`}
        >
          {activeProduct.colors && (
            <div>
              <p className="text-[12px] xl:text-[13px] uppercase tracking-[0.35em] font-bold mb-4 text-neutral-500">
                Color Variant
              </p>
              <div className="flex flex-wrap gap-4.5">
                {activeProduct.colors.map((c, i) => (
                  <button
                    key={i}
                    onClick={() => !stockStatus.disabled && setSelectedColor(i)}
                    disabled={stockStatus.disabled}
                    className={`w-7 h-7 rounded-full transition-all duration-300 relative border border-black/10
                      ${
                        i === selectedColor
                          ? "scale-110 ring-2 ring-black ring-offset-2 shadow-md z-10"
                          : "opacity-80 hover:opacity-100 hover:scale-[1.05]"
                      }`}
                    style={{ backgroundColor: c.hex }}
                    title={c.label}
                  />
                ))}
              </div>
            </div>
          )}

          {activeProduct.sizes && (
            <div>
              <p className="text-[12px] xl:text-[13px] uppercase tracking-[0.35em] font-bold mb-4 text-neutral-500">
                Dimensions
              </p>
              <div className="grid grid-cols-4 gap-2.5">
                {activeProduct.sizes.map((s, i) => (
                  <button
                    key={s}
                    onClick={() => !stockStatus.disabled && setSelectedSize(i)}
                    disabled={stockStatus.disabled}
                    className={`py-3.5 text-[14px] xl:text-[15px] tracking-[0.15em] font-medium border transition-all duration-300 rounded-sm
                      ${
                        i === selectedSize
                          ? "bg-black text-white border-black"
                          : "border-neutral-200 text-neutral-800 hover:border-black hover:bg-neutral-50"
                      }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Action Controls Panel */}
        <div className="mt-10 xl:mt-12 space-y-3.5">
          {stockStatus.status === "out" ? (
            <div className="border border-neutral-200 bg-neutral-50 py-8 px-4 text-center rounded-sm">
              <p className="text-[24px] font-black text-neutral-400 uppercase tracking-wider mb-2">
                OUT OF STOCK
              </p>
              <button
                onClick={() =>
                  console.log("Notify registered for:", activeProduct.name)
                }
                className="text-[11px] font-bold uppercase tracking-[0.25em] border-b border-neutral-400 pb-0.5 text-neutral-600 hover:text-black hover:border-black transition-all"
              >
                Notify Me When Available
              </button>
            </div>
          ) : (
            <>
              <button
                onClick={handleAddToCart}
                disabled={
                  stockStatus.disabled ||
                  addToCartLoading ||
                  cartLoading ||
                  purchaseLoading
                }
                className="group relative w-full border-2 border-black py-5 text-[13px] font-black uppercase tracking-[0.35em] overflow-hidden transition-all rounded-sm bg-white"
              >
                <span
                  className={`absolute inset-0 bg-black transition-transform duration-500 ease-out ${
                    addedFeedback
                      ? "translate-y-0"
                      : "translate-y-full group-hover:translate-y-0"
                  }`}
                />
                <span
                  className={`relative z-10 flex items-center justify-center gap-2.5 transition-colors duration-500 ${
                    addedFeedback
                      ? "text-white"
                      : "text-black group-hover:text-white"
                  }`}
                >
                  {addToCartLoading || cartLoading ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      <span>Adding...</span>
                    </>
                  ) : addedFeedback ? (
                    <>
                      <Check size={16} className="text-white" />
                      <span className="text-white">Added to Bag ✓</span>
                    </>
                  ) : (
                    <>
                      <ShoppingBag size={16} />
                      <span>Add to Bag</span>
                    </>
                  )}
                </span>
              </button>

              <button
                onClick={handlePurchaseNow}
                disabled={
                  stockStatus.disabled ||
                  purchaseLoading ||
                  addToCartLoading ||
                  cartLoading
                }
                className="group relative w-full py-5 text-[13px] font-black uppercase tracking-[0.35em] overflow-hidden transition-all rounded-sm bg-black text-white hover:bg-[#be1e2d]"
              >
                <span className="absolute inset-0 translate-y-full bg-[#be1e2d] transition-transform duration-500 ease-out group-hover:translate-y-0" />
                <span className="relative z-10 flex items-center justify-center gap-2.5">
                  <CreditCard size={16} />
                  {purchaseLoading ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      <span>Processing...</span>
                    </>
                  ) : (
                    "Purchase Now"
                  )}
                </span>
              </button>
            </>
          )}
        </div>

        {addedFeedback && !stockStatus.disabled && (
          <div className="mt-4 space-y-1 animate-pulse">
            <p className="text-[10px] text-green-600 uppercase tracking-wider text-center font-bold">
              ✓ Item successfully added to your bag!
            </p>
          </div>
        )}
      </div>

      {/* MOBILE LAYOUT (below xl screens) */}
      <div className="xl:hidden w-full">
        {/* Title Section */}
        <div className="p-6 sm:p-8 border-b border-neutral-200">
          <div className="mb-4">
            <span className="text-[12px] uppercase tracking-[0.5em] text-gray-400 block mb-2 font-light">
              The Collection
            </span>
            <span className="text-[11px] uppercase tracking-[0.3em] font-bold border-b-2 border-black pb-2">
              {activeProduct.category}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-light tracking-tighter leading-[1.1] mb-2 uppercase">
            {titleLine1} <br />
            <span className="font-black text-neutral-900">{titleLine2}</span>
          </h1>
          <p className="text-[1.75rem] font-light tracking-[0.15em]">
            {activeProduct.price}
          </p>
        </div>

        {/* Main Image */}
        <div className="bg-[#F5F5F5] relative flex items-center justify-center h-[55vh] sm:h-[65vh] overflow-hidden group border-b border-neutral-200">
          <div
            className={`relative w-full h-full transition-all duration-300 ease-in-out
              ${isSwapping ? "opacity-0 scale-95 blur-sm" : "opacity-100 scale-100 blur-0"}`}
          >
            {centerImage && (
              <Image
                src={getImageUrl(centerImage)}
                alt={`${activeProduct.name} - ${titleLine2}`}
                fill
                unoptimized
                className="object-contain p-4 sm:p-8 transition-transform duration-700 ease-out group-hover:scale-102"
                priority
              />
            )}
          </div>

          {/* Sold Out Overlay */}
          {stockStatus.status === "out" && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none bg-black/5">
              <div className="border-4 border-red-600 rotate-[-15deg] px-6 py-2 rounded-sm opacity-80 bg-white/95 shadow-xl">
                <span className="text-red-600 text-2xl sm:text-4xl font-black uppercase tracking-[0.2em]">
                  SOLD OUT
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Thumbnails */}
        <div className="p-6 sm:p-8 border-b border-neutral-200">
          <div className="grid grid-cols-4 gap-3">
            {galleryImages.map((img, i) => {
              const isCenterImage = img === centerImage;
              return (
                <button
                  key={i}
                  onClick={() => handleThumbnailClick(img)}
                  className={`group relative aspect-[3/4] transition-all duration-300 ease-out overflow-hidden bg-[#F9F9F9] border rounded-sm
                    ${
                      isCenterImage
                        ? "opacity-100 border-black ring-1 ring-black scale-[0.96]"
                        : "opacity-70 border-neutral-200 hover:opacity-100"
                    }`}
                >
                  <Image
                    src={getImageUrl(img)}
                    alt={`${activeProduct.name} thumbnail view ${i + 1}`}
                    fill
                    unoptimized
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </button>
              );
            })}
          </div>
        </div>

        {/* Product Narrative */}
        <div className="p-6 sm:p-8 border-b border-neutral-200">
          <button
            onClick={() => setDescOpen(!descOpen)}
            className="w-full flex justify-between items-center py-2 text-[13px] uppercase tracking-[0.3em] font-bold hover:text-gray-600 transition-colors"
          >
            <span>Product Narrative</span>
            <span className="text-lg">{descOpen ? "—" : "+"}</span>
          </button>
          {descOpen && activeProduct.description && (
            <div className="pt-4 space-y-3 animate-fadeIn">
              {Array.isArray(activeProduct.description) ? (
                activeProduct.description.map((line, i) => (
                  <p
                    key={i}
                    className="text-[14px] leading-[1.7] text-neutral-800 tracking-wide font-normal"
                  >
                    {line}
                  </p>
                ))
              ) : (
                <p className="text-[14px] leading-[1.7] text-neutral-800 tracking-wide font-normal">
                  {activeProduct.description}
                </p>
              )}
            </div>
          )}
        </div>

        {/* Details Panel */}
        <div className="p-6 sm:p-8 bg-white">
          {/* Stock Status Layout Panels */}
          {stockStatus.status === "out" && (
            <div className="mb-6 bg-neutral-50 border border-neutral-200 p-4 rounded-sm text-center">
              <span className="text-red-600 text-[13px] font-bold uppercase tracking-[0.25em]">
                {stockStatus.label}
              </span>
              <p className="text-[11px] text-gray-500 uppercase tracking-[0.15em] mt-1">
                {stockStatus.message}
              </p>
            </div>
          )}

          {stockStatus.status === "low" && (
            <div className="mb-6 bg-amber-50 border-l-4 border-amber-500 p-4 rounded-r-sm">
              <div className="flex items-center gap-2.5">
                <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                <p className="text-[12px] font-bold uppercase tracking-[0.2em] text-amber-800">
                  {stockStatus.label}
                </p>
              </div>
              <p className="text-[11px] text-amber-600 mt-1 ml-4">
                {stockStatus.message}
              </p>
            </div>
          )}

          {stockStatus.status === "in" && (
            <div className="mb-6 flex items-center gap-2 pl-1">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-neutral-500">
                {stockStatus.label} • {stockStatus.message}
              </p>
            </div>
          )}

          {/* Configurations Controls Box */}
          <div
            className={`space-y-8 ${stockStatus.status === "out" ? "opacity-40 pointer-events-none" : ""}`}
          >
            {activeProduct.colors && (
              <div>
                <p className="text-[12px] uppercase tracking-[0.35em] font-bold mb-4 text-neutral-500">
                  Color Variant
                </p>
                <div className="flex flex-wrap gap-4.5">
                  {activeProduct.colors.map((c, i) => (
                    <button
                      key={i}
                      onClick={() =>
                        !stockStatus.disabled && setSelectedColor(i)
                      }
                      disabled={stockStatus.disabled}
                      className={`w-7 h-7 rounded-full transition-all duration-300 relative border border-black/10
                        ${
                          i === selectedColor
                            ? "scale-110 ring-2 ring-black ring-offset-2 shadow-md z-10"
                            : "opacity-80 hover:opacity-100 hover:scale-[1.05]"
                        }`}
                      style={{ backgroundColor: c.hex }}
                      title={c.label}
                    />
                  ))}
                </div>
              </div>
            )}

            {activeProduct.sizes && (
              <div>
                <p className="text-[12px] uppercase tracking-[0.35em] font-bold mb-4 text-neutral-500">
                  Dimensions
                </p>
                <div className="grid grid-cols-4 gap-2.5">
                  {activeProduct.sizes.map((s, i) => (
                    <button
                      key={s}
                      onClick={() =>
                        !stockStatus.disabled && setSelectedSize(i)
                      }
                      disabled={stockStatus.disabled}
                      className={`py-3.5 text-[14px] tracking-[0.15em] font-medium border transition-all duration-300 rounded-sm
                        ${
                          i === selectedSize
                            ? "bg-black text-white border-black"
                            : "border-neutral-200 text-neutral-800 hover:border-black hover:bg-neutral-50"
                        }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Action Controls Panel */}
          <div className="mt-8 space-y-3.5">
            {stockStatus.status === "out" ? (
              <div className="border border-neutral-200 bg-neutral-50 py-6 px-4 text-center rounded-sm">
                <p className="text-[18px] font-black text-neutral-400 uppercase tracking-wider mb-2">
                  OUT OF STOCK
                </p>
                <button
                  onClick={() =>
                    console.log("Notify registered for:", activeProduct.name)
                  }
                  className="text-[10px] font-bold uppercase tracking-[0.25em] border-b border-neutral-400 pb-0.5 text-neutral-600 hover:text-black hover:border-black transition-all"
                >
                  Notify Me When Available
                </button>
              </div>
            ) : (
              <>
                <button
                  onClick={handleAddToCart}
                  disabled={
                    stockStatus.disabled ||
                    addToCartLoading ||
                    cartLoading ||
                    purchaseLoading
                  }
                  className="group relative w-full border-2 border-black py-5 text-[13px] font-black uppercase tracking-[0.35em] overflow-hidden transition-all rounded-sm bg-white"
                >
                  <span
                    className={`absolute inset-0 bg-black transition-transform duration-500 ease-out ${
                      addedFeedback
                        ? "translate-y-0"
                        : "translate-y-full group-hover:translate-y-0"
                    }`}
                  />
                  <span
                    className={`relative z-10 flex items-center justify-center gap-2.5 transition-colors duration-500 ${
                      addedFeedback
                        ? "text-white"
                        : "text-black group-hover:text-white"
                    }`}
                  >
                    {addToCartLoading || cartLoading ? (
                      <>
                        <Loader2 size={16} className="animate-spin" />
                        <span>Adding...</span>
                      </>
                    ) : addedFeedback ? (
                      <>
                        <Check size={16} className="text-white" />
                        <span className="text-white">Added to Bag ✓</span>
                      </>
                    ) : (
                      <>
                        <ShoppingBag size={16} />
                        <span>Add to Bag</span>
                      </>
                    )}
                  </span>
                </button>

                <button
                  onClick={handlePurchaseNow}
                  disabled={
                    stockStatus.disabled ||
                    purchaseLoading ||
                    addToCartLoading ||
                    cartLoading
                  }
                  className="group relative w-full py-5 text-[13px] font-black uppercase tracking-[0.35em] overflow-hidden transition-all rounded-sm bg-black text-white hover:bg-[#be1e2d]"
                >
                  <span className="absolute inset-0 translate-y-full bg-[#be1e2d] transition-transform duration-500 ease-out group-hover:translate-y-0" />
                  <span className="relative z-10 flex items-center justify-center gap-2.5">
                    <CreditCard size={16} />
                    {purchaseLoading ? (
                      <>
                        <Loader2 size={16} className="animate-spin" />
                        <span>Processing...</span>
                      </>
                    ) : (
                      "Purchase Now"
                    )}
                  </span>
                </button>
              </>
            )}
          </div>

          {addedFeedback && !stockStatus.disabled && (
            <div className="mt-4 space-y-1 animate-pulse">
              <p className="text-[10px] text-green-600 uppercase tracking-wider text-center font-bold">
                ✓ Item successfully added to your bag!
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
