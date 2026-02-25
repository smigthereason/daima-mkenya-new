// "use client";

// import React, { useState, useEffect } from "react";
// import { useSession, signOut } from "next-auth/react";
// import Image from "next/image";
// import {
//   LogOut,
//   Package,
//   Heart,
//   Settings,
//   ChevronRight,
//   MapPin,
//   CreditCard,
//   Trash2,
//   Smartphone,
//   Plus,
//   Check
// } from "lucide-react";
// import { redirect } from "next/navigation";
// import { useCart } from "@/context/CartContext";
// import { urlFor } from "@/sanity/lib/image";

// interface PaymentMethod {
//   id: string;
//   type: "pesapal" | "mpesa";
//   details: string;
//   isDefault: boolean;
//   createdAt: string;
// }

// const ProfilePage = () => {
//   const { data: session, status } = useSession();
//   const { cartItems, removeFromCart } = useCart();
//   const [activeTab, setActiveTab] = useState("orders");
//   const [imageError, setImageError] = useState(false);
//   const [showAddPayment, setShowAddPayment] = useState(false);
//   const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
//   const [loading, setLoading] = useState(false);
//   const [newMpesaNumber, setNewMpesaNumber] = useState("");
//   const [saveAsDefault, setSaveAsDefault] = useState(false);

//   if (status === "unauthenticated") redirect("/login");

//   // Fetch payment methods
//   useEffect(() => {
//     if (session?.user?.email) {
//       fetchPaymentMethods();
//     }
//   }, [session]);

//   const fetchPaymentMethods = async () => {
//     try {
//       const response = await fetch('/api/user/payment-methods');
//       const data = await response.json();
//       if (data.paymentMethods) {
//         setPaymentMethods(data.paymentMethods);
//       }
//     } catch (error) {
//       console.error("Error fetching payment methods:", error);
//     }
//   };

//   const handleAddPaymentMethod = async (type: "pesapal" | "mpesa", details: string) => {
//     setLoading(true);
//     try {
//       const response = await fetch('/api/user/payment-methods', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           type,
//           details,
//           isDefault: saveAsDefault || paymentMethods.length === 0,
//         }),
//       });

//       if (response.ok) {
//         await fetchPaymentMethods();
//         setShowAddPayment(false);
//         setNewMpesaNumber("");
//         setSaveAsDefault(false);
//       }
//     } catch (error) {
//       console.error("Error adding payment method:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleSetDefault = async (id: string) => {
//     try {
//       const response = await fetch('/api/user/payment-methods', {
//         method: 'PUT',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           methodId: id,
//           isDefault: true,
//         }),
//       });

//       if (response.ok) {
//         await fetchPaymentMethods();
//       }
//     } catch (error) {
//       console.error("Error setting default:", error);
//     }
//   };

//   const handleRemovePayment = async (id: string) => {
//     try {
//       const response = await fetch(`/api/user/payment-methods?id=${id}`, {
//         method: 'DELETE',
//       });

//       if (response.ok) {
//         await fetchPaymentMethods();
//       }
//     } catch (error) {
//       console.error("Error removing payment method:", error);
//     }
//   };

//   if (status === "loading") {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-white">
//         <div className="w-10 h-10 border-[1px] border-black border-t-transparent rounded-full animate-spin" />
//       </div>
//     );
//   }

//   const userInitial = session?.user?.name ? session.user.name.charAt(0).toUpperCase() : "M";

//   const tabs = [
//     { id: "orders", label: "Orders", icon: Package },
//     { id: "wishlist", label: "Wishlist", icon: Heart },
//     { id: "address", label: "Addresses", icon: MapPin },
//     { id: "payments", label: "Payments", icon: CreditCard },
//     { id: "settings", label: "Settings", icon: Settings },
//   ];

//   return (
//     <div className="min-h-screen bg-white pt-24 md:pt-32 pb-20 mt-4 md:mt-8 font-sans">
//       <div className="max-w-[1400px] mx-auto px-4 md:px-12">
//         {/* Profile Header */}
//         <div className="flex flex-col items-center mb-10 md:mb-16">
//           <div className="relative w-20 h-20 md:w-24 md:h-24 mb-4 md:mb-6 group">
//             <div className="absolute inset-0 rounded-full border border-zinc-200" />
//             <div className="absolute inset-2 rounded-full overflow-hidden bg-black flex items-center justify-center">
//               {session?.user?.image && !imageError ? (
//                 <Image
//                   src={session.user.image}
//                   alt="User Avatar"
//                   fill
//                   className="object-cover transition-transform duration-700 group-hover:scale-110"
//                   onError={() => setImageError(true)}
//                   unoptimized
//                 />
//               ) : (
//                 <span className="text-white text-2xl md:text-3xl font-serif font-light tracking-tighter transition-transform duration-700 group-hover:scale-125 select-none">{userInitial}</span>
//               )}
//             </div>
//           </div>
//           <h1 className="text-3xl md:text-6xl font-serif font-black uppercase tracking-widest text-black mb-2 text-center break-words max-w-full">
//             {session?.user?.name}
//           </h1>
//           <p className="text-[9px] md:text-[10px] uppercase tracking-[0.5em] text-[#c5a059] font-bold">MEMBER</p>
//         </div>

//         <div className="flex flex-col lg:flex-row gap-8 lg:gap-16 border-t border-zinc-100 pt-8 md:pt-12">
//           {/* Navigation Tabs - Scrollable on mobile, list on Desktop */}
//           <div className="lg:w-1/4">
//             <div className="flex lg:flex-col overflow-x-auto lg:overflow-x-visible no-scrollbar border-b lg:border-b-0 border-zinc-50 pb-2 lg:pb-0 gap-1">
//               {tabs.map((tab) => (
//                 <button
//                   key={tab.id}
//                   onClick={() => setActiveTab(tab.id)}
//                   className={`flex items-center justify-between py-3 lg:py-4 px-4 lg:px-2 whitespace-nowrap lg:whitespace-normal border-b-2 lg:border-b border-transparent transition-all shrink-0 ${
//                     activeTab === tab.id
//                       ? "border-black lg:border-black"
//                       : "hover:border-zinc-300 border-transparent text-zinc-400"
//                   }`}
//                 >
//                   <div className="flex items-center gap-3 lg:gap-4">
//                     <tab.icon
//                       size={16}
//                       strokeWidth={activeTab === tab.id ? 2 : 1.2}
//                       className={activeTab === tab.id ? "text-black" : "text-zinc-400"}
//                     />
//                     <span className={`text-[10px] lg:text-[11px] uppercase tracking-[0.2em] lg:tracking-[0.3em] font-bold transition-all ${
//                       activeTab === tab.id ? "text-black" : "text-zinc-400 group-hover:text-black"
//                     }`}>
//                       {tab.label}
//                     </span>
//                   </div>
//                   <ChevronRight size={14} className={`hidden lg:block transition-all ${activeTab === tab.id ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-4"}`} />
//                 </button>
//               ))}

//               <button
//                 onClick={() => signOut()}
//                 className="flex items-center gap-3 lg:gap-4 py-3 lg:py-8 px-4 lg:px-2 text-zinc-400 hover:text-[#be1e2d] transition-colors lg:mt-8 shrink-0"
//               >
//                 <LogOut size={16} strokeWidth={1.2} />
//                 <span className="text-[10px] lg:text-[11px] uppercase tracking-[0.2em] lg:tracking-[0.3em] font-bold">Sign Out</span>
//               </button>
//             </div>
//           </div>

//           {/* Content Area */}
//           <div className="flex-1 min-h-[300px] md:min-h-[400px]">
//             {activeTab === "orders" && (
//               <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
//                 <h2 className="text-xl md:text-2xl font-serif font-bold mb-6 md:mb-8 uppercase tracking-tight">Recent Orders</h2>
//                 <div className="py-16 md:py-20 border border-dashed border-zinc-200 flex flex-col items-center justify-center bg-zinc-50/30">
//                   <Package className="text-zinc-300 mb-4" size={32} strokeWidth={1} />
//                   <p className="text-zinc-400 text-[10px] uppercase tracking-[0.3em] font-bold">No orders found</p>
//                 </div>
//               </div>
//             )}

//             {activeTab === "wishlist" && (
//               <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
//                 <h2 className="text-xl md:text-2xl font-serif font-bold mb-6 md:mb-8 uppercase tracking-tight">Saved Items in Bag</h2>
//                 {cartItems.length === 0 ? (
//                   <div className="py-16 md:py-20 border border-dashed border-zinc-200 flex flex-col items-center justify-center bg-zinc-50/30">
//                     <Heart className="text-zinc-300 mb-4" size={32} strokeWidth={1} />
//                     <p className="text-zinc-400 text-[10px] uppercase tracking-[0.3em] font-bold">Your bag is empty</p>
//                   </div>
//                 ) : (
//                   <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-4 md:gap-8">
//                     {cartItems.map((item) => (
//                       <div key={item.cartId} className="flex gap-4 md:gap-6 p-3 md:p-4 border border-zinc-100 group hover:border-black transition-all duration-500 relative bg-white">
//                         <div className="absolute top-2 right-2 z-10 bg-black text-white text-[8px] font-black px-2 py-1 uppercase tracking-tighter">
//                           Qty: {item.quantity}
//                         </div>

//                         <div className="relative w-20 h-28 md:w-24 md:h-32 bg-[#F9F9F9] shrink-0 overflow-hidden">
//                           <Image
//                             src={item.product.images?.hero ? urlFor(item.product.images.hero).url() : ""}
//                             alt={item.product.name}
//                             fill
//                             className="object-contain p-2 group-hover:scale-110 transition-transform duration-700"
//                             unoptimized
//                           />
//                         </div>
//                         <div className="flex flex-col justify-between py-1 flex-1 min-w-0">
//                           <div>
//                             <h3 className="text-[10px] md:text-xs font-black uppercase tracking-widest truncate">{item.product.name}</h3>
//                             <p className="text-[9px] md:text-[10px] text-zinc-500 uppercase tracking-widest mt-1 font-bold">
//                               {item.selectedSize} | {item.selectedColor.label}
//                             </p>
//                           </div>
//                           <div className="flex justify-between items-center mt-4">
//                             <p className="font-bold text-sm tracking-tighter">{item.product.price}</p>
//                             <button
//                               onClick={() => removeFromCart(item.cartId)}
//                               className="text-zinc-300 hover:text-[#be1e2d] transition-colors p-2"
//                               title="Remove from bag"
//                             >
//                               <Trash2 size={16} />
//                             </button>
//                           </div>
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                 )}
//               </div>
//             )}

//             {activeTab === "address" && (
//               <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
//                 <h2 className="text-xl md:text-2xl font-serif font-bold mb-6 md:mb-8 uppercase tracking-tight">Saved Addresses</h2>
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
//                   <div className="p-6 md:p-8 border border-black relative">
//                     <span className="absolute top-4 right-4 text-[8px] font-black tracking-widest bg-black text-white px-2 py-1 uppercase">Default</span>
//                     <h3 className="text-[10px] uppercase tracking-[0.3em] font-bold mb-4">Shipping Address</h3>
//                     <p className="text-sm font-serif leading-relaxed text-zinc-600">
//                       {session?.user?.name}<br />
//                       Westlands, Nairobi<br />
//                       Kenya
//                     </p>
//                   </div>
//                 </div>
//               </div>
//             )}

//             {activeTab === "payments" && (
//               <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
//                 <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
//                   <h2 className="text-xl md:text-2xl font-serif font-bold uppercase tracking-tight">Payment Methods</h2>
//                   <button
//                     onClick={() => setShowAddPayment(!showAddPayment)}
//                     className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest border border-black px-6 py-3 hover:bg-black hover:text-white transition-colors w-full sm:w-auto justify-center"
//                   >
//                     <Plus size={14} />
//                     Add Method
//                   </button>
//                 </div>

//                 {showAddPayment && (
//                   <div className="mb-8 p-6 md:p-8 border-2 border-black bg-white animate-in fade-in slide-in-from-top-4 duration-500">
//                     <h3 className="text-[11px] font-black uppercase tracking-[0.3em] mb-6">Select Payment Method</h3>

//                     <div className="mb-6">
//                       <button
//                         onClick={() => handleAddPaymentMethod("pesapal", "PesaPal Account")}
//                         disabled={loading}
//                         className="w-full p-6 md:p-8 border-2 border-gray-200 hover:border-black transition-all group relative"
//                       >
//                         <div className="flex flex-col items-center gap-4">
//                           <CreditCard size={32} className="text-gray-400 group-hover:text-black" />
//                           <span className="text-xs font-black uppercase tracking-widest">PesaPal</span>
//                           <span className="text-[8px] text-gray-400">Cards, Mobile Money, Bank</span>
//                         </div>
//                       </button>
//                     </div>

//                     <div className="border-2 border-gray-200 p-4 md:p-6">
//                       <div className="flex items-center gap-4 mb-4">
//                         <Smartphone size={24} className="text-[#81b73e]" />
//                         <span className="text-xs font-black uppercase tracking-widest">M-Pesa</span>
//                       </div>

//                       <input
//                         type="tel"
//                         placeholder="Enter M-Pesa phone number"
//                         value={newMpesaNumber}
//                         onChange={(e) => setNewMpesaNumber(e.target.value)}
//                         className="w-full border-b border-gray-200 py-3 mb-4 text-sm focus:border-[#81b73e] outline-none transition-colors"
//                       />

//                       <div className="flex items-center gap-4 mb-4">
//                         <input
//                           type="checkbox"
//                           id="saveAsDefault"
//                           checked={saveAsDefault}
//                           onChange={(e) => setSaveAsDefault(e.target.checked)}
//                           className="w-4 h-4 accent-[#81b73e]"
//                         />
//                         <label htmlFor="saveAsDefault" className="text-[9px] md:text-[10px] uppercase tracking-wider text-gray-600">
//                           Set as default payment method
//                         </label>
//                       </div>

//                       <button
//                         onClick={() => {
//                           if (newMpesaNumber.trim()) {
//                             handleAddPaymentMethod("mpesa", newMpesaNumber.trim());
//                           }
//                         }}
//                         disabled={loading || !newMpesaNumber.trim()}
//                         className="w-full bg-[#81b73e] text-white py-4 text-[10px] font-black uppercase tracking-widest hover:bg-[#6a9932] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
//                       >
//                         {loading ? "Saving..." : "Save M-Pesa Number"}
//                       </button>
//                     </div>
//                   </div>
//                 )}

//                 {paymentMethods.length === 0 && !showAddPayment ? (
//                   <div className="py-16 md:py-20 border border-dashed border-zinc-200 flex flex-col items-center justify-center bg-zinc-50/30">
//                     <CreditCard className="text-zinc-300 mb-4" size={32} strokeWidth={1} />
//                     <p className="text-zinc-400 text-[10px] uppercase tracking-[0.3em] font-bold">No payment methods saved</p>
//                   </div>
//                 ) : (
//                   <div className="grid grid-cols-1 gap-4">
//                     {paymentMethods.map((method) => (
//                       <div
//                         key={method.id}
//                         className={`p-4 md:p-6 border ${method.isDefault ? 'border-black' : 'border-gray-200'} relative group hover:border-black transition-all`}
//                       >
//                         {method.isDefault && (
//                           <span className="absolute top-2 right-2 md:top-4 md:right-4 text-[8px] font-black tracking-widest bg-black text-white px-2 py-1 uppercase flex items-center gap-1">
//                             <Check size={10} /> Default
//                           </span>
//                         )}

//                         <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 md:gap-6">
//                           <div className="flex items-center gap-4 flex-1">
//                             {method.type === "pesapal" ? (
//                               <CreditCard size={24} className="text-gray-700 shrink-0" />
//                             ) : (
//                               <Smartphone size={24} className="text-[#81b73e] shrink-0" />
//                             )}

//                             <div className="min-w-0">
//                               <p className="text-xs font-black uppercase tracking-widest">
//                                 {method.type === "pesapal" ? "PesaPal" : "M-Pesa"}
//                               </p>
//                               <p className="text-[10px] text-gray-500 mt-1 font-mono truncate">
//                                 {method.details}
//                               </p>
//                             </div>
//                           </div>

//                           <div className="flex items-center gap-2 w-full sm:w-auto justify-end mt-2 sm:mt-0">
//                             {!method.isDefault && (
//                               <button
//                                 onClick={() => handleSetDefault(method.id)}
//                                 className="text-[8px] uppercase tracking-widest font-bold text-gray-400 hover:text-black px-3 py-1 border border-gray-200 hover:border-black transition-all"
//                               >
//                                 Set Default
//                               </button>
//                             )}
//                             <button
//                               onClick={() => handleRemovePayment(method.id)}
//                               className="text-gray-300 hover:text-[#be1e2d] transition-colors p-2"
//                             >
//                               <Trash2 size={16} />
//                             </button>
//                           </div>
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                 )}
//               </div>
//             )}

//             {activeTab === "settings" && (
//               <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
//                 <h2 className="text-xl md:text-2xl font-serif font-bold mb-6 md:mb-8 uppercase tracking-tight">Personal Details</h2>
//                 <div className="max-w-xl space-y-6 md:space-y-8">
//                   <div className="space-y-1">
//                     <label className="text-[9px] uppercase tracking-[0.3em] font-bold text-zinc-400">Full Name</label>
//                     <input type="text" defaultValue={session?.user?.name || ""} className="w-full border-b border-zinc-200 py-3 text-sm focus:border-black outline-none transition-colors font-serif text-black" />
//                   </div>
//                   <div className="space-y-1">
//                     <label className="text-[9px] uppercase tracking-[0.3em] font-bold text-zinc-400">Email Address</label>
//                     <input type="email" defaultValue={session?.user?.email || ""} className="w-full border-b border-zinc-200 py-3 text-sm focus:border-black outline-none transition-colors font-serif text-black" />
//                   </div>
//                   <button className="w-full sm:w-auto bg-black text-white text-[10px] font-bold uppercase tracking-[0.3em] px-10 py-4 hover:bg-[#c5a059] transition-colors duration-500">
//                     Update Account
//                   </button>
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>

//       <style jsx global>{`
//         .no-scrollbar::-webkit-scrollbar {
//           display: none;
//         }
//         .no-scrollbar {
//           -ms-overflow-style: none;
//           scrollbar-width: none;
//         }
//       `}</style>
//     </div>
//   );
// };

// export default ProfilePage;
//
//
"use client";

import React, { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import Image from "next/image";
import {
  LogOut,
  Package,
  Heart,
  Settings,
  ChevronRight,
  MapPin,
  CreditCard,
  Trash2,
  Clock,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { redirect } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { urlFor } from "@/sanity/lib/image";
import Link from "next/link";

interface Order {
  _id: string;
  orderNumber: string;
  status: "pending" | "completed" | "failed";
  amount: number;
  createdAt: string;
  items: Array<{
    productName: string;
    quantity: number;
    price: string;
    size: string;
    color: string;
  }>;
  pesapalOrderTrackingId?: string;
}

const ProfilePage = () => {
  const { data: session, status } = useSession();
  const { cartItems, removeFromCart } = useCart();
  const [activeTab, setActiveTab] = useState("orders");
  const [imageError, setImageError] = useState(false);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(false);

  if (status === "unauthenticated") redirect("/login");

  // Fetch orders
  useEffect(() => {
    if (session?.user?.email) {
      fetchOrders();
    }
  }, [session]);

  // Check URL params for tab
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const tab = params.get("tab");
    if (tab) {
      setActiveTab(tab);
    }
  }, []);

  const fetchOrders = async () => {
    setLoadingOrders(true);
    try {
      const response = await fetch("/api/user/orders");
      const data = await response.json();
      if (data.orders) {
        setOrders(data.orders);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoadingOrders(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle size={16} className="text-[#81b73e]" />;
      case "failed":
        return <XCircle size={16} className="text-[#be1e2d]" />;
      default:
        return <Clock size={16} className="text-[#c5a059]" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "completed":
        return "Completed";
      case "failed":
        return "Failed";
      default:
        return "Pending";
    }
  };

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="w-10 h-10 border-[1px] border-black border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const userInitial = session?.user?.name
    ? session.user.name.charAt(0).toUpperCase()
    : "M";

  const tabs = [
    { id: "orders", label: "Orders", icon: Package },
    { id: "wishlist", label: "Wishlist", icon: Heart },
    { id: "address", label: "Addresses", icon: MapPin },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-white pt-24 md:pt-32 pb-20 mt-4 md:mt-8 font-sans">
      <div className="max-w-[1400px] mx-auto px-4 md:px-12">
        {/* Profile Header */}
        <div className="flex flex-col items-center mb-10 md:mb-16">
          <div className="relative w-20 h-20 md:w-24 md:h-24 mb-4 md:mb-6 group">
            <div className="absolute inset-0 rounded-full border border-zinc-200" />
            <div className="absolute inset-2 rounded-full overflow-hidden bg-black flex items-center justify-center">
              {session?.user?.image && !imageError ? (
                <Image
                  src={session.user.image}
                  alt="User Avatar"
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                  onError={() => setImageError(true)}
                  unoptimized
                />
              ) : (
                <span className="text-white text-2xl md:text-3xl font-serif font-light tracking-tighter transition-transform duration-700 group-hover:scale-125 select-none">
                  {userInitial}
                </span>
              )}
            </div>
          </div>
          <h1 className="text-3xl md:text-6xl font-serif font-black uppercase tracking-widest text-black mb-2 text-center break-words max-w-full">
            {session?.user?.name}
          </h1>
          <p className="text-[9px] md:text-[10px] uppercase tracking-[0.5em] text-[#c5a059] font-bold">
            MEMBER
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 lg:gap-16 border-t border-zinc-100 pt-8 md:pt-12">
          {/* Navigation Tabs */}
          <div className="lg:w-1/4">
            <div className="flex lg:flex-col overflow-x-auto lg:overflow-x-visible no-scrollbar border-b lg:border-b-0 border-zinc-50 pb-2 lg:pb-0 gap-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center justify-between py-3 lg:py-4 px-4 lg:px-2 whitespace-nowrap lg:whitespace-normal border-b-2 lg:border-b border-transparent transition-all shrink-0 ${
                    activeTab === tab.id
                      ? "border-black lg:border-black"
                      : "hover:border-zinc-300 border-transparent text-zinc-400"
                  }`}
                >
                  <div className="flex items-center gap-3 lg:gap-4">
                    <tab.icon
                      size={16}
                      strokeWidth={activeTab === tab.id ? 2 : 1.2}
                      className={
                        activeTab === tab.id ? "text-black" : "text-zinc-400"
                      }
                    />
                    <span
                      className={`text-[10px] lg:text-[11px] uppercase tracking-[0.2em] lg:tracking-[0.3em] font-bold transition-all ${
                        activeTab === tab.id
                          ? "text-black"
                          : "text-zinc-400 group-hover:text-black"
                      }`}
                    >
                      {tab.label}
                    </span>
                  </div>
                  <ChevronRight
                    size={14}
                    className={`hidden lg:block transition-all ${activeTab === tab.id ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-4"}`}
                  />
                </button>
              ))}

              <button
                onClick={() => signOut()}
                className="flex items-center gap-3 lg:gap-4 py-3 lg:py-8 px-4 lg:px-2 text-zinc-400 hover:text-[#be1e2d] transition-colors lg:mt-8 shrink-0"
              >
                <LogOut size={16} strokeWidth={1.2} />
                <span className="text-[10px] lg:text-[11px] uppercase tracking-[0.2em] lg:tracking-[0.3em] font-bold">
                  Sign Out
                </span>
              </button>
            </div>
          </div>

          {/* Content Area */}
          <div className="flex-1 min-h-[300px] md:min-h-[400px]">
            {activeTab === "orders" && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
                <h2 className="text-xl md:text-2xl font-serif font-bold mb-6 md:mb-8 uppercase tracking-tight">
                  Your Orders
                </h2>

                {loadingOrders ? (
                  <div className="py-20 flex justify-center">
                    <div className="w-8 h-8 border-[1px] border-black border-t-transparent rounded-full animate-spin" />
                  </div>
                ) : orders.length === 0 ? (
                  <div className="py-16 md:py-20 border border-dashed border-zinc-200 flex flex-col items-center justify-center bg-zinc-50/30">
                    <Package
                      className="text-zinc-300 mb-4"
                      size={32}
                      strokeWidth={1}
                    />
                    <p className="text-zinc-400 text-[10px] uppercase tracking-[0.3em] font-bold mb-4">
                      No orders found
                    </p>
                    <Link
                      href="/shop"
                      className="bg-black text-white text-[9px] font-bold uppercase tracking-widest px-6 py-3 hover:bg-[#c5a059] transition-colors"
                    >
                      Start Shopping
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {orders.map((order) => (
                      <div
                        key={order._id}
                        className="border border-zinc-200 p-4 md:p-6 hover:border-black transition-all"
                      >
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
                          <div>
                            <p className="text-[9px] uppercase tracking-widest text-gray-400 font-bold mb-1">
                              Order Number
                            </p>
                            <p className="font-mono text-sm font-bold">
                              {order.orderNumber}
                            </p>
                          </div>
                          <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2">
                              {getStatusIcon(order.status)}
                              <span
                                className={`text-[10px] font-black uppercase tracking-wider ${
                                  order.status === "completed"
                                    ? "text-[#81b73e]"
                                    : order.status === "failed"
                                      ? "text-[#be1e2d]"
                                      : "text-[#c5a059]"
                                }`}
                              >
                                {getStatusText(order.status)}
                              </span>
                            </div>
                            <p className="text-sm font-bold">
                              Ksh {order.amount.toLocaleString()}
                            </p>
                          </div>
                        </div>

                        <div className="border-t border-zinc-100 pt-4">
                          <p className="text-[8px] uppercase tracking-widest text-gray-400 mb-3">
                            Items ({order.items.length})
                          </p>
                          <div className="space-y-2">
                            {order.items.map((item, idx) => (
                              <div
                                key={idx}
                                className="flex justify-between text-sm"
                              >
                                <span className="text-gray-600">
                                  {item.productName} x{item.quantity} (
                                  {item.size}, {item.color})
                                </span>
                                <span className="font-medium">
                                  {item.price}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="border-t border-zinc-100 mt-4 pt-4 flex justify-between items-center">
                          <p className="text-[8px] text-gray-400">
                            {new Date(order.createdAt).toLocaleDateString(
                              "en-KE",
                              {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              },
                            )}
                          </p>
                          {order.pesapalOrderTrackingId && (
                            <p className="text-[8px] text-gray-400 font-mono">
                              Ref: {order.pesapalOrderTrackingId}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === "wishlist" && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
                <h2 className="text-xl md:text-2xl font-serif font-bold mb-6 md:mb-8 uppercase tracking-tight">
                  Saved Items in Bag
                </h2>
                {cartItems.length === 0 ? (
                  <div className="py-16 md:py-20 border border-dashed border-zinc-200 flex flex-col items-center justify-center bg-zinc-50/30">
                    <Heart
                      className="text-zinc-300 mb-4"
                      size={32}
                      strokeWidth={1}
                    />
                    <p className="text-zinc-400 text-[10px] uppercase tracking-[0.3em] font-bold mb-4">
                      Your bag is empty
                    </p>
                    <Link
                      href="/shop"
                      className="bg-black text-white text-[9px] font-bold uppercase tracking-widest px-6 py-3 hover:bg-[#c5a059] transition-colors"
                    >
                      Shop Now
                    </Link>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-4 md:gap-8">
                    {cartItems.map((item) => (
                      <div
                        key={item.cartId}
                        className="flex gap-4 md:gap-6 p-3 md:p-4 border border-zinc-100 group hover:border-black transition-all duration-500 relative bg-white"
                      >
                        <div className="absolute top-2 right-2 z-10 bg-black text-white text-[8px] font-black px-2 py-1 uppercase tracking-tighter">
                          Qty: {item.quantity}
                        </div>

                        <div className="relative w-20 h-28 md:w-24 md:h-32 bg-[#F9F9F9] shrink-0 overflow-hidden">
                          <Image
                            src={
                              item.product.images?.hero
                                ? urlFor(item.product.images.hero).url()
                                : "/assets/placeholder.png"
                            }
                            alt={item.product.name}
                            fill
                            className="object-contain p-2 group-hover:scale-110 transition-transform duration-700"
                            unoptimized
                          />
                        </div>
                        <div className="flex flex-col justify-between py-1 flex-1 min-w-0">
                          <div>
                            <h3 className="text-[10px] md:text-xs font-black uppercase tracking-widest truncate">
                              {item.product.name}
                            </h3>
                            <p className="text-[9px] md:text-[10px] text-zinc-500 uppercase tracking-widest mt-1 font-bold">
                              {item.selectedSize} | {item.selectedColor.label}
                            </p>
                          </div>
                          <div className="flex justify-between items-center mt-4">
                            <p className="font-bold text-sm tracking-tighter">
                              {item.product.price}
                            </p>
                            <button
                              onClick={() => removeFromCart(item.cartId)}
                              className="text-zinc-300 hover:text-[#be1e2d] transition-colors p-2"
                              title="Remove from bag"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === "address" && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
                <h2 className="text-xl md:text-2xl font-serif font-bold mb-6 md:mb-8 uppercase tracking-tight">
                  Saved Addresses
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                  <div className="p-6 md:p-8 border border-black relative">
                    <span className="absolute top-4 right-4 text-[8px] font-black tracking-widest bg-black text-white px-2 py-1 uppercase">
                      Default
                    </span>
                    <h3 className="text-[10px] uppercase tracking-[0.3em] font-bold mb-4">
                      Shipping Address
                    </h3>
                    <p className="text-sm font-serif leading-relaxed text-zinc-600">
                      {session?.user?.name}
                      <br />
                      Westlands, Nairobi
                      <br />
                      Kenya
                    </p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "settings" && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
                <h2 className="text-xl md:text-2xl font-serif font-bold mb-6 md:mb-8 uppercase tracking-tight">
                  Personal Details
                </h2>
                <div className="max-w-xl space-y-6 md:space-y-8">
                  <div className="space-y-1">
                    <label className="text-[9px] uppercase tracking-[0.3em] font-bold text-zinc-400">
                      Full Name
                    </label>
                    <input
                      type="text"
                      defaultValue={session?.user?.name || ""}
                      className="w-full border-b border-zinc-200 py-3 text-sm focus:border-black outline-none transition-colors font-serif text-black"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] uppercase tracking-[0.3em] font-bold text-zinc-400">
                      Email Address
                    </label>
                    <input
                      type="email"
                      defaultValue={session?.user?.email || ""}
                      className="w-full border-b border-zinc-200 py-3 text-sm focus:border-black outline-none transition-colors font-serif text-black"
                    />
                  </div>
                  <button className="w-full sm:w-auto bg-black text-white text-[10px] font-bold uppercase tracking-[0.3em] px-10 py-4 hover:bg-[#c5a059] transition-colors duration-500">
                    Update Account
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <style jsx global>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
};

export default ProfilePage;
