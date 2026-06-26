// "use client";

// import React, { useState, useEffect, useMemo, useRef } from "react";
// import Image from "next/image";
// import Script from "next/script";
// import {
//   ChevronLeft,
//   ArrowRight,
//   Loader2,
//   Trash2,
//   Minus,
//   Plus,
//   Phone,
//   MapPin,
//   ChevronDown,
// } from "lucide-react";
// import { useCart } from "@/context/CartContext";
// import { useSession } from "next-auth/react";
// import { useRouter, useSearchParams } from "next/navigation";
// import { urlFor } from "@/sanity/lib/image";
// import { PICKUP_LOCATIONS } from "@/data/pickupPoints";

// const SHIPPING_RATES = {
//   Nairobi: 250,
//   Mombasa: 450,
//   Kisumu: 450,
//   Nakuru: 450,
//   Eldoret: 450,
//   Kiambu: 350,
// };

// interface CheckOutPageProps {
//   onBack: () => void;
// }

// declare global {
//   interface Window {
//     PesaPal?: {
//       pay: (url: string) => void;
//     };
//   }
// }

// export default function CheckOutPage({ onBack }: CheckOutPageProps) {
//   // 1. ALL HOOKS FIRST (useSession, useCart, useRouter, useSearchParams)
//   const { data: session, status } = useSession();
//   const { cartItems, removeFromCart, updateQuantity, loading } = useCart();
//   const router = useRouter();
//   const searchParams = useSearchParams();

//   // 2. ALL useState hooks
//   const [isProcessing, setIsProcessing] = useState(false);
//   const [directCheckoutItem, setDirectCheckoutItem] = useState<any>(null);
//   const [isInitialCheckDone, setIsInitialCheckDone] = useState(false);

//   // Form State
//   const [fullName, setFullName] = useState("");
//   const [email, setEmail] = useState("");
//   const [phoneNumber, setPhoneNumber] = useState("");
//   const [shippingAddress, setShippingAddress] = useState("");

//   // Pickup State
//   const [selectedCity, setSelectedCity] =
//     useState<keyof typeof PICKUP_LOCATIONS>("Nairobi");
//   const [selectedPickupPoint, setSelectedPickupPoint] = useState(
//     PICKUP_LOCATIONS.Nairobi[0],
//   );

//   const [localQuantities, setLocalQuantities] = useState<
//     Record<string, number>
//   >({});
//   const [pendingRemovals, setPendingRemovals] = useState<Set<string>>(
//     new Set(),
//   );

//   // 3. ALL useRef hooks
//   const isFirstRender = useRef(true);
//   const isDirectRoute = searchParams.get("direct") === "true";

//   // 4. ALL useMemo hooks (BEFORE any useEffect that depends on them)
//   const displayItems = useMemo(() => {
//     if (isDirectRoute) {
//       const item = directCheckoutItem || directItemFromUrl;
//       return item ? [item] : [];
//     }
//     return cartItems.filter((item) => !pendingRemovals.has(item.cartId));
//   }, [
//     isDirectRoute,
//     directCheckoutItem,
//     directItemFromUrl,
//     cartItems,
//     pendingRemovals,
//   ]);

//   const subtotal = useMemo(() => {
//     return displayItems.reduce((acc, item) => {
//       const priceStr = item.product.price || "0";
//       const price = parseFloat(priceStr.replace(/[^0-9.]/g, ""));
//       const quantity =
//         localQuantities[item.cartId || "direct"] ?? item.quantity ?? 1;
//       return acc + (isNaN(price) ? 0 : price * quantity);
//     }, 0);
//   }, [displayItems, localQuantities]);

//   const shippingFee = SHIPPING_RATES[selectedCity] || 450;
//   const totalAmount = subtotal + shippingFee;

//   // 5. ALL useEffect hooks (AFTER all useMemo)
//   // Load direct checkout item
//   // Parse item param synchronously via useMemo instead
//   const directItemFromUrl = useMemo(() => {
//     if (!isDirectRoute) return null;
//     const itemParam = searchParams.get("item");
//     if (!itemParam) return null;
//     try {
//       return JSON.parse(decodeURIComponent(itemParam));
//     } catch {
//       return null;
//     }
//   }, [isDirectRoute, searchParams]);

//   useEffect(() => {
//     if (directItemFromUrl && !directCheckoutItem) {
//       setDirectCheckoutItem(directItemFromUrl);
//     }
//     setIsInitialCheckDone(true);
//   }, [directItemFromUrl]);

//   // Set user info from session
//   useEffect(() => {
//     if (session?.user) {
//       setFullName(session.user.name || "");
//       setEmail(session.user.email || "");
//     }
//   }, [session]);

//   // Redirect if not authenticated
//   useEffect(() => {
//     if (status === "unauthenticated") {
//       router.push("/login");
//     }
//   }, [status, router]);

//   // Redirect if cart is empty (NOW displayItems is defined before this useEffect)
//   useEffect(() => {
//     if (
//       isInitialCheckDone &&
//       !loading &&
//       displayItems.length === 0 &&
//       !directCheckoutItem &&
//       !directItemFromUrl &&
//       !isDirectRoute
//     ) {
//       router.push("/cart");
//     }
//   }, [
//     isInitialCheckDone,
//     loading,
//     displayItems.length,
//     directCheckoutItem,
//     directItemFromUrl,
//     isDirectRoute,
//     router,
//   ]);

//   // Initialize local quantities
//   useEffect(() => {
//     if (isFirstRender.current) {
//       isFirstRender.current = false;
//       const initial: Record<string, number> = {};
//       cartItems.forEach((item) => {
//         initial[item.cartId] = item.quantity;
//       });
//       if (directCheckoutItem)
//         initial["direct"] = directCheckoutItem.quantity || 1;
//       setLocalQuantities(initial);
//       return;
//     }

//     // Update local quantities when cart changes
//     setLocalQuantities((prev) => {
//       const next = { ...prev };
//       cartItems.forEach((item) => {
//         if (!pendingRemovals.has(item.cartId))
//           next[item.cartId] = item.quantity;
//       });
//       return next;
//     });
//   }, [cartItems, directCheckoutItem, pendingRemovals]);

//   // 6. Event handlers
//   const handleCityChange = (city: keyof typeof PICKUP_LOCATIONS) => {
//     setSelectedCity(city);
//     setSelectedPickupPoint(PICKUP_LOCATIONS[city][0]);
//   };

//   const handleUpdateQuantity = (cartId: string, newQty: number) => {
//     if (newQty < 1) return;
//     setLocalQuantities((prev) => ({ ...prev, [cartId]: newQty }));
//     if (cartId !== "direct") {
//       updateQuantity(cartId, newQty);
//     } else {
//       setDirectCheckoutItem((prev: any) => ({ ...prev, quantity: newQty }));
//     }
//   };

//   const handleRemove = (cartId: string) => {
//     if (cartId === "direct") {
//       setDirectCheckoutItem(null);
//       router.push("/products");
//     } else {
//       setPendingRemovals((prev) => new Set(prev).add(cartId));
//       removeFromCart(cartId).finally(() => {
//         setPendingRemovals((prev) => {
//           const newSet = new Set(prev);
//           newSet.delete(cartId);
//           return newSet;
//         });
//       });
//     }
//   };

//   const handleCompletePurchase = async (e: React.FormEvent) => {
//     e.preventDefault();

//     // VALIDATION: Ensure all required PesaPal fields are present
//     if (!fullName.trim() || !email.trim() || !phoneNumber.trim()) {
//       alert("Please fill in your Name, Email, and Phone Number.");
//       return;
//     }

//     setIsProcessing(true);

//     const formattedItems = displayItems.map((item) => {
//       const productId =
//         item.product._id || item.product.id || item.productId || item._id;

//       const priceRaw = item.product.price;
//       const price =
//         typeof priceRaw === "number"
//           ? priceRaw
//           : parseFloat(String(priceRaw ?? "0").replace(/[^0-9.]/g, ""));

//       if (!productId) {
//         console.error("Missing product ID for item:", item);
//       }

//       return {
//         product: { _type: "reference", _ref: productId },
//         productName: item.product.name,
//         quantity:
//           localQuantities[item.cartId || "direct"] ?? item.quantity ?? 1,
//         price,
//         size: item.selectedSize,
//         color: item.selectedColor?.label || item.selectedColor,
//         image: item.product.images?.hero
//           ? urlFor(item.product.images.hero).url()
//           : "",
//       };
//     });

//     // Abort early if any item is missing a product ID
//     if (formattedItems.some((i) => !i.product._ref)) {
//       alert(
//         "One or more items is missing product data. Please return to the product page and try again.",
//       );
//       setIsProcessing(false);
//       return;
//     }

//     try {
//       const response = await fetch("/api/pesapal/register-order", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           amount: totalAmount,
//           customer: {
//             name: fullName.trim(),
//             phone: phoneNumber.trim(),
//             email: email.trim(),
//           },
//           email: email.trim(),
//           items: formattedItems,
//           deliveryDetails: {
//             method: "pickup",
//             city: selectedCity,
//             pickupStationName: selectedPickupPoint.name,
//             pickupStationId: selectedPickupPoint.id,
//             shippingAddress:
//               shippingAddress.trim() || "No specific building details",
//           },
//           shippingFee,
//         }),
//       });

//       const data = await response.json();

//       if (!response.ok) {
//         console.error("Server Error Detail:", data);
//         throw new Error(data.message || "Failed to register order");
//       }

//       if (data.redirect_url) {
//         sessionStorage.setItem("pendingOrderId", data.orderId);
//         window.location.href = data.redirect_url;
//       }
//     } catch (error: any) {
//       console.error("Payment Error:", error);
//       alert(error.message || "A network error occurred. Please try again.");
//     } finally {
//       setIsProcessing(false);
//     }
//   };

//   // 7. Early returns (conditional rendering)
//   // Show loading state
//   if (
//     status === "loading" ||
//     (loading &&
//       displayItems.length === 0 &&
//       !isDirectRoute &&
//       !searchParams.get("item"))
//   ) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <Loader2 className="w-8 h-8 animate-spin" />
//       </div>
//     );
//   }

//   if (!isInitialCheckDone) return null;

//   // 8. JSX Return
//   return (
//     <div className="min-h-screen bg-white text-black antialiased border-t border-neutral-200">
//       <Script
//         src="https://cybqa.pesapal.com/v3/js/pesapal.js"
//         strategy="afterInteractive"
//       />

//       <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md flex justify-between items-center px-6 md:px-12 lg:px-16 py-5 border-b border-gray-100">
//         <button
//           onClick={onBack}
//           className="flex items-center gap-3 group cursor-pointer"
//         >
//           <ChevronLeft
//             size={18}
//             className="transition-transform group-hover:-translate-x-1"
//           />
//           <span className="text-[10px] md:text-[11px] uppercase tracking-[0.3em] font-bold">
//             Back
//           </span>
//         </button>
//         <span className="text-[9px] md:text-[11px] uppercase tracking-[0.3em] font-light text-gray-400">
//           Secure Checkout
//         </span>
//       </nav>

//       <div className="max-w-[1800px] mx-auto w-full">
//         <div className="flex flex-col xl:flex-row">
//           <div className="w-full xl:w-[40%] p-6 md:p-10 lg:p-16 xl:p-20 bg-[#F9F9F9] border-b xl:border-b-0 xl:border-r border-gray-100">
//             <div className="flex justify-between items-center mb-8">
//               <span className="text-[10px] uppercase tracking-[0.5em] text-gray-400 font-bold">
//                 01. Review Order
//               </span>
//               <span className="text-[10px] uppercase tracking-widest font-bold">
//                 {displayItems.length} Items
//               </span>
//             </div>

//             <div className="space-y-8 mb-10 max-h-[55vh] overflow-y-auto pr-4 custom-scrollbar">
//               {displayItems.map((item, index) => {
//                 const currentId = item.cartId || "direct";
//                 const qty = localQuantities[currentId] || 1;
//                 const isPending = pendingRemovals.has(currentId);

//                 return (
//                   <div
//                     key={currentId}
//                     className={`flex gap-6 border-b border-gray-200 pb-8 last:border-0 group ${
//                       isPending ? "opacity-50" : ""
//                     }`}
//                   >
//                     <div className="relative w-24 h-32 bg-white border border-gray-100 shrink-0 overflow-hidden">
//                       {item.product.images?.hero && (
//                         <Image
//                           src={urlFor(item.product.images.hero).url()}
//                           alt={item.product.name}
//                           fill
//                           className="object-contain p-2 transition-transform duration-700 group-hover:scale-110"
//                           unoptimized
//                         />
//                       )}
//                     </div>

//                     <div className="flex-1 flex flex-col">
//                       <div className="flex justify-between items-start">
//                         <h2 className="text-[13px] font-black uppercase tracking-tighter leading-tight max-w-[180px]">
//                           {item.product.name}
//                         </h2>
//                         <button
//                           onClick={() => handleRemove(currentId)}
//                           disabled={isPending}
//                           className="text-gray-300 hover:text-black transition-colors p-1 disabled:opacity-50"
//                         >
//                           {isPending ? (
//                             <div className="w-4 h-4 border-2 border-gray-300 border-t-transparent rounded-full animate-spin" />
//                           ) : (
//                             <Trash2 size={14} />
//                           )}
//                         </button>
//                       </div>

//                       <div className="mt-2 space-y-1">
//                         <p className="text-[9px] text-gray-400 uppercase font-bold tracking-widest">
//                           Size: {item.selectedSize}
//                         </p>
//                         <p className="text-[9px] text-gray-400 uppercase font-bold tracking-widest">
//                           Color:{" "}
//                           {item.selectedColor?.label || item.selectedColor}
//                         </p>
//                       </div>

//                       <div className="mt-auto flex justify-between items-end">
//                         <div className="flex items-center border border-gray-200">
//                           <button
//                             type="button"
//                             onClick={() =>
//                               handleUpdateQuantity(currentId, qty - 1)
//                             }
//                             disabled={isPending || qty <= 1}
//                             className="p-2 hover:bg-gray-50 transition-colors disabled:opacity-30"
//                           >
//                             <Minus size={10} />
//                           </button>
//                           <span className="text-[10px] font-bold w-8 text-center">
//                             {qty}
//                           </span>
//                           <button
//                             type="button"
//                             onClick={() =>
//                               handleUpdateQuantity(currentId, qty + 1)
//                             }
//                             disabled={isPending}
//                             className="p-2 hover:bg-gray-50 transition-colors disabled:opacity-30"
//                           >
//                             <Plus size={10} />
//                           </button>
//                         </div>
//                         <p className="text-sm font-black tracking-tight">
//                           {item.product.price}
//                         </p>
//                       </div>
//                     </div>
//                   </div>
//                 );
//               })}
//             </div>

//             <div className="border-t border-gray-200 pt-8 space-y-4">
//               <div className="flex justify-between text-[11px] tracking-widest uppercase text-gray-500 font-bold">
//                 <span>Subtotal</span>
//                 <span>Ksh {subtotal.toLocaleString()}</span>
//               </div>
//               <div className="flex justify-between text-[11px] tracking-widest uppercase text-gray-500 font-bold">
//                 <span>Shipping ({selectedCity})</span>
//                 <span>Ksh {shippingFee.toLocaleString()}</span>
//               </div>
//               <div className="flex justify-between text-xl tracking-[0.2em] font-black uppercase pt-6 border-t border-black mt-4">
//                 <span>Total</span>
//                 <span>Ksh {totalAmount.toLocaleString()}</span>
//               </div>
//             </div>
//           </div>

//           <div className="w-full xl:w-[60%] p-6 md:p-10 lg:p-16 xl:p-20 bg-white">
//             <form
//               onSubmit={handleCompletePurchase}
//               className="max-w-2xl mx-auto xl:ml-0 space-y-16"
//             >
//               <section>
//                 <h3 className="text-[12px] md:text-[14px] uppercase tracking-[0.4em] font-black mb-10 pb-4 border-b border-black w-fit">
//                   02. Delivery Selection
//                 </h3>

//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
//                   <div className="flex flex-col gap-3">
//                     <label className="text-[9px] uppercase tracking-[0.2em] font-black text-gray-400">
//                       Full Name
//                     </label>
//                     <input
//                       required
//                       type="text"
//                       value={fullName}
//                       onChange={(e) => setFullName(e.target.value)}
//                       className="border-b-2 border-gray-100 py-3 focus:border-black outline-none text-[13px]  transition-colors"
//                       placeholder="YOUR NAME"
//                     />
//                   </div>
//                   <div className="flex flex-col gap-3">
//                     <label className="text-[9px] uppercase tracking-[0.2em] font-black text-gray-400">
//                       Email Address
//                     </label>
//                     <input
//                       required
//                       type="email"
//                       value={email}
//                       onChange={(e) => setEmail(e.target.value)}
//                       className="border-b-2 border-gray-100 py-3 focus:border-black outline-none text-[13px]   transition-colors"
//                       placeholder="EMAIL@DOMAIN.COM"
//                     />
//                   </div>
//                   <div className="flex flex-col gap-3 md:col-span-2">
//                     <label className="text-[9px] uppercase tracking-[0.2em] font-black text-gray-400 flex items-center gap-2">
//                       <Phone size={12} /> Contact Number
//                     </label>
//                     <input
//                       required
//                       type="tel"
//                       value={phoneNumber}
//                       onChange={(e) => setPhoneNumber(e.target.value)}
//                       className="border-b-2 border-gray-100 py-3 focus:border-black outline-none text-[13px] transition-colors"
//                       placeholder="0712 XXX XXX"
//                     />
//                   </div>

//                   <div className="flex flex-col gap-3 md:col-span-2">
//                     <label className="text-[9px] uppercase tracking-[0.2em] font-black text-gray-400">
//                       Select City
//                     </label>
//                     <div className="flex flex-wrap gap-2">
//                       {Object.keys(PICKUP_LOCATIONS).map((city) => (
//                         <button
//                           key={city}
//                           type="button"
//                           onClick={() => handleCityChange(city as any)}
//                           className={`px-5 py-2.5 border text-[10px] uppercase font-black tracking-widest transition-all ${
//                             selectedCity === city
//                               ? "bg-black text-white border-black"
//                               : "text-gray-400 border-gray-200 hover:border-black"
//                           }`}
//                         >
//                           {city}
//                         </button>
//                       ))}
//                     </div>
//                   </div>

//                   <div className="flex flex-col gap-3 md:col-span-2 relative">
//                     <label className="text-[9px] uppercase tracking-[0.2em] font-black text-gray-400 flex items-center gap-2">
//                       <MapPin size={12} /> Specific Pickup Station
//                     </label>
//                     <div className="relative">
//                       <select
//                         className="appearance-none w-full border-b-2 border-gray-100 py-4 outline-none text-[13px]  bg-transparent pr-10 focus:border-black transition-colors"
//                         value={selectedPickupPoint.id}
//                         onChange={(e) => {
//                           const point = PICKUP_LOCATIONS[selectedCity].find(
//                             (p) => p.id === e.target.value,
//                           );
//                           if (point) setSelectedPickupPoint(point);
//                         }}
//                       >
//                         {PICKUP_LOCATIONS[selectedCity].map((point) => (
//                           <option key={point.id} value={point.id}>
//                             {point.name} — {point.address}
//                           </option>
//                         ))}
//                       </select>
//                       <ChevronDown
//                         size={16}
//                         className="absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400"
//                       />
//                     </div>
//                   </div>

//                   <div className="flex flex-col gap-3 md:col-span-2">
//                     <label className="text-[9px] uppercase tracking-[0.2em] font-black text-gray-400">
//                       Building / Suite / Floor (Optional)
//                     </label>
//                     <input
//                       type="text"
//                       value={shippingAddress}
//                       onChange={(e) => setShippingAddress(e.target.value)}
//                       className="border-b-2 border-gray-100 py-3 focus:border-black outline-none text-[13px] font-black uppercase transition-colors"
//                       placeholder="E.G. SUITE 302, 3RD FLOOR"
//                     />
//                   </div>
//                 </div>
//               </section>

//               <button
//                 type="submit"
//                 disabled={isProcessing || displayItems.length === 0}
//                 className="group relative w-full overflow-hidden bg-black text-white py-9 text-[15px] font-black uppercase tracking-[0.6em] transition-all border-2 border-black hover:bg-white hover:text-black disabled:opacity-50 disabled:cursor-not-allowed"
//               >
//                 <span className="relative z-10 flex items-center justify-center gap-4">
//                   {isProcessing ? (
//                     <>
//                       <Loader2 className="animate-spin" size={20} />
//                       Processing
//                     </>
//                   ) : (
//                     "Complete Purchase"
//                   )}
//                   {!isProcessing && (
//                     <ArrowRight
//                       size={20}
//                       className="transition-transform group-hover:translate-x-2"
//                     />
//                   )}
//                 </span>
//               </button>
//             </form>
//           </div>
//         </div>
//       </div>

//       <style jsx>{`
//         .custom-scrollbar::-webkit-scrollbar {
//           width: 3px;
//         }
//         .custom-scrollbar::-webkit-scrollbar-thumb {
//           background: #e5e5e5;
//           border-radius: 10px;
//         }
//       `}</style>
//     </div>
//   );
// }
"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import Image from "next/image";
import Script from "next/script";
import {
  ChevronLeft,
  ArrowRight,
  Loader2,
  Trash2,
  Minus,
  Plus,
  Phone,
  MapPin,
  ChevronDown,
} from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { urlFor } from "@/sanity/lib/image";
import { PICKUP_LOCATIONS } from "@/data/pickupPoints";

const SHIPPING_RATES = {
  Nairobi: 250,
  Mombasa: 450,
  Kisumu: 450,
  Nakuru: 450,
  Eldoret: 450,
  Kiambu: 350,
};

interface CheckOutPageProps {
  onBack: () => void;
}

declare global {
  interface Window {
    PesaPal?: {
      pay: (url: string) => void;
    };
  }
}

export default function CheckOutPage({ onBack }: CheckOutPageProps) {
  const { data: session, status } = useSession();
  const { cartItems, removeFromCart, updateQuantity, loading } = useCart();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [isProcessing, setIsProcessing] = useState(false);
  const [pendingRemovals, setPendingRemovals] = useState<Set<string>>(
    new Set(),
  );
  const [localQuantities, setLocalQuantities] = useState<
    Record<string, number>
  >({});
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [shippingAddress, setShippingAddress] = useState("");
  const [selectedCity, setSelectedCity] =
    useState<keyof typeof PICKUP_LOCATIONS>("Nairobi");
  const [selectedPickupPoint, setSelectedPickupPoint] = useState(
    PICKUP_LOCATIONS.Nairobi[0],
  );

  // NEW: Support for direct checkout via sessionStorage (reliable) + legacy URL support
  const [directCheckoutItem, setDirectCheckoutItem] = useState<any>(null);

  const isFirstRender = useRef(true);

  // Parse everything we need synchronously
  const isDirectRoute = searchParams.get("direct") === "true";

  // Legacy support: parse from ?item= URL param (if someone still has old links)
  const directItemFromUrl = useMemo(() => {
    if (!isDirectRoute) return null;
    const itemParam = searchParams.get("item");
    if (!itemParam) return null;
    try {
      return JSON.parse(decodeURIComponent(itemParam));
    } catch {
      return null;
    }
  }, [isDirectRoute, searchParams]);

  // displayItems: prefers directCheckoutItem (from sessionStorage) then falls back to URL param
  const displayItems = useMemo(() => {
    if (isDirectRoute) {
      const item = directCheckoutItem || directItemFromUrl;
      return item ? [item] : [];
    }
    return cartItems.filter((item) => !pendingRemovals.has(item.cartId));
  }, [
    isDirectRoute,
    directCheckoutItem,
    directItemFromUrl,
    cartItems,
    pendingRemovals,
  ]);

  const subtotal = useMemo(() => {
    return displayItems.reduce((acc, item) => {
      const priceRaw = item.product.price || "0";
      const price =
        typeof priceRaw === "number"
          ? priceRaw
          : parseFloat(String(priceRaw).replace(/[^0-9.]/g, ""));
      const quantity =
        localQuantities[item.cartId || "direct"] ?? item.quantity ?? 1;
      return acc + (isNaN(price) ? 0 : price * quantity);
    }, 0);
  }, [displayItems, localQuantities]);

  const shippingFee = SHIPPING_RATES[selectedCity] || 450;
  const totalAmount = subtotal + shippingFee;

  // === Load direct checkout item from sessionStorage (PREFERRED METHOD) ===
  useEffect(() => {
    if (!isDirectRoute) return;
    if (directCheckoutItem) return; // already loaded

    if (typeof window !== "undefined") {
      const stored = sessionStorage.getItem("directCheckoutItem");
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          setDirectCheckoutItem(parsed);
          // Do NOT remove here — allows page refresh to still work.
          // We will clear it after successful order placement.
        } catch (e) {
          console.error(
            "Failed to parse directCheckoutItem from sessionStorage",
          );
          sessionStorage.removeItem("directCheckoutItem");
        }
      }
    }
  }, [isDirectRoute, directCheckoutItem]);

  // Populate form from session
  useEffect(() => {
    if (session?.user) {
      setFullName(session.user.name || "");
      setEmail(session.user.email || "");
    }
  }, [session]);

  // Redirect if not authenticated
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  // Redirect to cart only if NOT a direct route and cart becomes empty
  useEffect(() => {
    if (isDirectRoute) return;
    if (status === "loading" || loading) return;
    if (cartItems.length === 0) {
      router.push("/cart");
    }
  }, [isDirectRoute, status, loading, cartItems.length, router]);

  // Initialize local quantities (supports both directCheckoutItem and legacy directItemFromUrl)
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      const initial: Record<string, number> = {};
      cartItems.forEach((item) => {
        initial[item.cartId] = item.quantity;
      });
      const directItem = directCheckoutItem || directItemFromUrl;
      if (directItem) {
        initial["direct"] = directItem.quantity || 1;
      }
      setLocalQuantities(initial);
      return;
    }

    // Update when cart changes (normal flow)
    setLocalQuantities((prev) => {
      const next = { ...prev };
      cartItems.forEach((item) => {
        if (!pendingRemovals.has(item.cartId))
          next[item.cartId] = item.quantity;
      });
      return next;
    });
  }, [cartItems, directCheckoutItem, directItemFromUrl, pendingRemovals]);

  const handleCityChange = (city: keyof typeof PICKUP_LOCATIONS) => {
    setSelectedCity(city);
    setSelectedPickupPoint(PICKUP_LOCATIONS[city][0]);
  };

  const handleUpdateQuantity = (cartId: string, newQty: number) => {
    if (newQty < 1) return;
    setLocalQuantities((prev) => ({ ...prev, [cartId]: newQty }));

    if (cartId !== "direct") {
      updateQuantity(cartId, newQty);
    } else if (directCheckoutItem) {
      // Keep the direct item object in sync (optional but clean)
      setDirectCheckoutItem((prev: any) => ({ ...prev, quantity: newQty }));
    }
  };

  const handleRemove = (cartId: string) => {
    if (cartId === "direct") {
      // Clear any stored direct item
      if (typeof window !== "undefined") {
        sessionStorage.removeItem("directCheckoutItem");
      }
      router.push("/products");
    } else {
      setPendingRemovals((prev) => new Set(prev).add(cartId));
      removeFromCart(cartId).finally(() => {
        setPendingRemovals((prev) => {
          const newSet = new Set(prev);
          newSet.delete(cartId);
          return newSet;
        });
      });
    }
  };

  const handleCompletePurchase = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!fullName.trim() || !email.trim() || !phoneNumber.trim()) {
      alert("Please fill in your Name, Email, and Phone Number.");
      return;
    }

    setIsProcessing(true);

    const formattedItems = displayItems.map((item) => {
      const productId =
        item.product._id || item.product.id || item.productId || item._id;
      const priceRaw = item.product.price;
      const price =
        typeof priceRaw === "number"
          ? priceRaw
          : parseFloat(String(priceRaw ?? "0").replace(/[^0-9.]/g, ""));

      if (!productId) {
        console.error("Missing product ID for item:", item);
      }

      return {
        product: { _type: "reference", _ref: productId },
        productName: item.product.name,
        quantity:
          localQuantities[item.cartId || "direct"] ?? item.quantity ?? 1,
        price,
        size: item.selectedSize,
        color: item.selectedColor?.label || item.selectedColor,
        image: item.product.images?.hero
          ? urlFor(item.product.images.hero).url()
          : "",
      };
    });

    if (formattedItems.some((i) => !i.product._ref)) {
      alert(
        "One or more items is missing product data. Please return to the product page and try again.",
      );
      setIsProcessing(false);
      return;
    }

    try {
      const response = await fetch("/api/pesapal/register-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: totalAmount,
          customer: {
            name: fullName.trim(),
            phone: phoneNumber.trim(),
            email: email.trim(),
          },
          email: email.trim(),
          items: formattedItems,
          deliveryDetails: {
            method: "pickup",
            city: selectedCity,
            pickupStationName: selectedPickupPoint.name,
            pickupStationId: selectedPickupPoint.id,
            shippingAddress:
              shippingAddress.trim() || "No specific building details",
          },
          shippingFee,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        console.error("Server Error Detail:", data);
        throw new Error(
          data.error || data.message || "Failed to register order",
        );
      }

      if (data.redirect_url) {
        // Clear direct checkout item after successful order registration
        if (typeof window !== "undefined") {
          sessionStorage.removeItem("directCheckoutItem");
        }
        sessionStorage.setItem("pendingOrderId", data.orderId);
        window.location.href = data.redirect_url;
      }
    } catch (error: any) {
      console.error("Payment Error:", error);
      alert(error.message || "A network error occurred. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  // ==================== LOADING & ERROR STATES ====================

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  if (!isDirectRoute && loading && cartItems.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  // Direct route but no item found from either source
  if (isDirectRoute && !directCheckoutItem && !directItemFromUrl) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <p className="text-sm uppercase tracking-widest text-gray-500">
          Item not found
        </p>
        <button
          onClick={() => router.push("/products")}
          className="border-b border-black text-sm font-bold uppercase tracking-widest"
        >
          Browse Products
        </button>
      </div>
    );
  }

  // ==================== MAIN RENDER ====================

  return (
    <div className="min-h-screen bg-white text-black antialiased border-t border-neutral-200">
      <Script
        src="https://pay.pesapal.com/v3/js/pesapal.js"
        strategy="afterInteractive"
      />

      <nav className="top-0 z-50 bg-white/90 backdrop-blur-md flex justify-between items-center px-6 md:px-12 lg:px-16 py-5 border-b border-gray-100">
        <button
          onClick={onBack}
          className="flex items-center gap-3 group cursor-pointer"
        >
          <ChevronLeft
            size={18}
            className="transition-transform group-hover:-translate-x-1"
          />
          <span className="text-[10px] md:text-[11px] uppercase tracking-[0.3em] font-bold">
            Back
          </span>
        </button>
        <span className="text-[9px] md:text-[11px] uppercase tracking-[0.3em] font-light text-gray-400">
          Secure Checkout
        </span>
      </nav>

      <div className="max-w-[1800px] mx-auto w-full">
        <div className="flex flex-col xl:flex-row">
          {/* Order Summary */}
          <div className="w-full xl:w-[40%] p-6 md:p-10 lg:p-16 xl:p-20 bg-[#F9F9F9] border-b xl:border-b-0 xl:border-r border-gray-100">
            <div className="flex justify-between items-center mb-8">
              <span className="text-[10px] uppercase tracking-[0.5em] text-gray-400 font-bold">
                01. Review Order
              </span>
              <span className="text-[10px] uppercase tracking-widest font-bold">
                {displayItems.length} Items
              </span>
            </div>

            <div className="space-y-8 mb-10 max-h-[55vh] overflow-y-auto pr-4 custom-scrollbar">
              {displayItems.map((item) => {
                const currentId = item.cartId || "direct";
                const qty = localQuantities[currentId] || 1;
                const isPending = pendingRemovals.has(currentId);

                return (
                  <div
                    key={currentId}
                    className={`flex gap-6 border-b border-gray-200 pb-8 last:border-0 group ${isPending ? "opacity-50" : ""}`}
                  >
                    <div className="relative w-24 h-32 bg-white border border-gray-100 shrink-0 overflow-hidden">
                      {item.product.images?.hero && (
                        <Image
                          src={urlFor(item.product.images.hero).url()}
                          alt={item.product.name}
                          fill
                          className="object-contain p-2 transition-transform duration-700 group-hover:scale-110"
                          unoptimized
                        />
                      )}
                    </div>

                    <div className="flex-1 flex flex-col">
                      <div className="flex justify-between items-start">
                        <h2 className="text-[13px] font-black tracking-tighter leading-tight max-w-[180px]">
                          {item.product.name}
                        </h2>
                        <button
                          onClick={() => handleRemove(currentId)}
                          disabled={isPending}
                          className="text-gray-300 hover:text-black transition-colors p-1 disabled:opacity-50"
                        >
                          {isPending ? (
                            <div className="w-4 h-4 border-2 border-gray-300 border-t-transparent rounded-full animate-spin" />
                          ) : (
                            <Trash2 size={14} />
                          )}
                        </button>
                      </div>

                      <div className="mt-2 space-y-1">
                        <p className="text-[9px] text-gray-400 uppercase font-bold tracking-widest">
                          Size: {item.selectedSize}
                        </p>
                        <p className="text-[9px] text-gray-400 uppercase font-bold tracking-widest">
                          Color:{" "}
                          {item.selectedColor?.label || item.selectedColor}
                        </p>
                      </div>

                      <div className="mt-auto flex justify-between items-end">
                        <div className="flex items-center border border-gray-200">
                          <button
                            type="button"
                            onClick={() =>
                              handleUpdateQuantity(currentId, qty - 1)
                            }
                            disabled={isPending || qty <= 1}
                            className="p-2 hover:bg-gray-50 transition-colors disabled:opacity-30"
                          >
                            <Minus size={10} />
                          </button>
                          <span className="text-[10px] font-bold w-8 text-center">
                            {qty}
                          </span>
                          <button
                            type="button"
                            onClick={() =>
                              handleUpdateQuantity(currentId, qty + 1)
                            }
                            disabled={isPending}
                            className="p-2 hover:bg-gray-50 transition-colors disabled:opacity-30"
                          >
                            <Plus size={10} />
                          </button>
                        </div>
                        <p className="text-sm font-black tracking-tight">
                          {item.product.price}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="border-t border-gray-200 pt-8 space-y-4">
              <div className="flex justify-between text-[11px] tracking-widest uppercase text-gray-500 font-bold">
                <span>Subtotal</span>
                <span>Ksh {subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-[11px] tracking-widest uppercase text-gray-500 font-bold">
                <span>Shipping ({selectedCity})</span>
                <span>Ksh {shippingFee.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-xl tracking-[0.2em] font-black uppercase pt-6 border-t border-black mt-4">
                <span>Total</span>
                <span>Ksh {totalAmount.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Delivery & Payment */}
          <div className="w-full xl:w-[60%] p-6 md:p-10 lg:p-16 xl:p-20 bg-white">
            <form
              onSubmit={handleCompletePurchase}
              className="max-w-2xl mx-auto xl:ml-0 space-y-16"
            >
              <section>
                <h3 className="text-[12px] md:text-[14px] uppercase tracking-[0.4em] font-black mb-10 pb-4 border-b border-black w-fit">
                  02. Delivery Selection
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
                  <div className="flex flex-col gap-3">
                    <label className="text-[9px] uppercase tracking-[0.2em] font-black text-gray-400">
                      Full Name
                    </label>
                    <input
                      required
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="border-b-2 border-gray-100 py-3 focus:border-black outline-none text-[13px] transition-colors"
                      placeholder="YOUR NAME"
                    />
                  </div>

                  <div className="flex flex-col gap-3">
                    <label className="text-[9px] uppercase tracking-[0.2em] font-black text-gray-400">
                      Email Address
                    </label>
                    <input
                      required
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="border-b-2 border-gray-100 py-3 focus:border-black outline-none text-[13px] transition-colors"
                      placeholder="EMAIL@DOMAIN.COM"
                    />
                  </div>

                  <div className="flex flex-col gap-3 md:col-span-2">
                    <label className="text-[9px] uppercase tracking-[0.2em] font-black text-gray-400 flex items-center gap-2">
                      <Phone size={12} /> Contact Number
                    </label>
                    <input
                      required
                      type="tel"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      className="border-b-2 border-gray-100 py-3 focus:border-black outline-none text-[13px] transition-colors"
                      placeholder="0712 XXX XXX"
                    />
                  </div>

                  <div className="flex flex-col gap-3 md:col-span-2">
                    <label className="text-[9px] uppercase tracking-[0.2em] font-black text-gray-400">
                      Select City
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {Object.keys(PICKUP_LOCATIONS).map((city) => (
                        <button
                          key={city}
                          type="button"
                          onClick={() =>
                            handleCityChange(
                              city as keyof typeof PICKUP_LOCATIONS,
                            )
                          }
                          className={`px-5 py-2.5 border text-[10px] uppercase font-black tracking-widest transition-all ${
                            selectedCity === city
                              ? "bg-black text-white border-black"
                              : "text-gray-400 border-gray-200 hover:border-black"
                          }`}
                        >
                          {city}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-col gap-3 md:col-span-2 relative">
                    <label className="text-[9px] uppercase tracking-[0.2em] font-black text-gray-400 flex items-center gap-2">
                      <MapPin size={12} /> Specific Pickup Station
                    </label>
                    <div className="relative">
                      <select
                        className="appearance-none w-full border-b-2 border-gray-100 py-4 outline-none text-[13px] bg-transparent pr-10 focus:border-black transition-colors"
                        value={selectedPickupPoint.id}
                        onChange={(e) => {
                          const point = PICKUP_LOCATIONS[selectedCity].find(
                            (p) => p.id === e.target.value,
                          );
                          if (point) setSelectedPickupPoint(point);
                        }}
                      >
                        {PICKUP_LOCATIONS[selectedCity].map((point) => (
                          <option key={point.id} value={point.id}>
                            {point.name} — {point.address}
                          </option>
                        ))}
                      </select>
                      <ChevronDown
                        size={16}
                        className="absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-3 md:col-span-2">
                    <label className="text-[9px] uppercase tracking-[0.2em] font-black text-gray-400">
                      Building / Suite / Floor (Optional)
                    </label>
                    <input
                      type="text"
                      value={shippingAddress}
                      onChange={(e) => setShippingAddress(e.target.value)}
                      className="border-b-2 border-gray-100 py-3 focus:border-black outline-none text-[13px] font-black uppercase transition-colors"
                      placeholder="E.G. SUITE 302, 3RD FLOOR"
                    />
                  </div>
                </div>
              </section>

              <button
                type="submit"
                disabled={isProcessing || displayItems.length === 0}
                className="group relative w-full overflow-hidden bg-black text-white py-9 text-[15px] font-black uppercase tracking-[0.6em] transition-all border-2 border-black hover:bg-white hover:text-black disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span className="relative z-10 flex items-center justify-center gap-4">
                  {isProcessing ? (
                    <>
                      <Loader2 className="animate-spin" size={20} />
                      Processing
                    </>
                  ) : (
                    "Complete Purchase"
                  )}
                  {!isProcessing && (
                    <ArrowRight
                      size={20}
                      className="transition-transform group-hover:translate-x-2"
                    />
                  )}
                </span>
              </button>
            </form>
          </div>
        </div>
      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #e5e5e5;
          border-radius: 10px;
        }
      `}</style>
    </div>
  );
}
