// "use client";

// import React, { useState } from "react";
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
//   Trash2
// } from "lucide-react";
// import { redirect } from "next/navigation";
// import { useCart } from "@/context/CartContext";
// import { urlFor } from "@/sanity/lib/image";

// const ProfilePage = () => {
//   const { data: session, status } = useSession();
//   const { cartItems, removeFromCart } = useCart();
//   const [activeTab, setActiveTab] = useState("orders");
//   const [imageError, setImageError] = useState(false);

//   if (status === "unauthenticated") redirect("/login");

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
//     <div className="min-h-screen bg-white pt-32 pb-20 mt-8 font-sans">
//       <div className="max-w-[1400px] mx-auto px-6 md:px-12">
//         <div className="flex flex-col items-center mb-16">
//           <div className="relative w-24 h-24 mb-6 group">
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
//                 <span className="text-white text-3xl font-serif font-light tracking-tighter transition-transform duration-700 group-hover:scale-125 select-none">{userInitial}</span>
//               )}
//             </div>
//           </div>
//           <h1 className="text-4xl md:text-6xl font-serif font-black uppercase tracking-widest text-black mb-2 text-center">
//             {session?.user?.name}
//           </h1>
//           <p className="text-[10px] uppercase tracking-[0.5em] text-[#c5a059] font-bold">MEMBER</p>
//         </div>

//         <div className="flex flex-col lg:flex-row gap-16 border-t border-zinc-100 pt-12">
//           <div className="lg:w-1/4 flex flex-col gap-1">
//             {tabs.map((tab) => (
//               <button
//                 key={tab.id}
//                 onClick={() => setActiveTab(tab.id)}
//                 className={`flex items-center justify-between py-4 px-2 border-b border-zinc-50 group transition-all ${
//                   activeTab === tab.id ? "border-black" : "hover:border-zinc-300"
//                 }`}
//               >
//                 <div className="flex items-center gap-4">
//                   <tab.icon 
//                     size={16} 
//                     strokeWidth={activeTab === tab.id ? 2 : 1.2}
//                     className={activeTab === tab.id ? "text-black" : "text-zinc-400"}
//                   />
//                   <span className={`text-[11px] uppercase tracking-[0.3em] font-bold transition-all ${
//                     activeTab === tab.id ? "text-black" : "text-zinc-400 group-hover:text-black"
//                   }`}>
//                     {tab.label}
//                   </span>
//                 </div>
//                 <ChevronRight size={14} className={`transition-all ${activeTab === tab.id ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-4"}`} />
//               </button>
//             ))}

//             <button 
//               onClick={() => signOut()}
//               className="flex items-center gap-4 py-8 px-2 text-zinc-400 hover:text-[#be1e2d] transition-colors mt-8"
//             >
//               <LogOut size={16} strokeWidth={1.2} />
//               <span className="text-[11px] uppercase tracking-[0.3em] font-bold">Sign Out</span>
//             </button>
//           </div>

//           <div className="flex-1 min-h-[400px]">
//             {activeTab === "orders" && (
//               <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
//                 <h2 className="text-2xl font-serif font-bold mb-8 uppercase tracking-tight">Recent Orders</h2>
//                 <div className="py-20 border border-dashed border-zinc-200 flex flex-col items-center justify-center bg-zinc-50/30">
//                   <Package className="text-zinc-300 mb-4" size={32} strokeWidth={1} />
//                   <p className="text-zinc-400 text-[10px] uppercase tracking-[0.3em] font-bold">No orders found</p>
//                 </div>
//               </div>
//             )}

//             {activeTab === "wishlist" && (
//               <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
//                 <h2 className="text-2xl font-serif font-bold mb-8 uppercase tracking-tight">Saved Items in Bag</h2>
//                 {cartItems.length === 0 ? (
//                   <div className="py-20 border border-dashed border-zinc-200 flex flex-col items-center justify-center bg-zinc-50/30">
//                     <Heart className="text-zinc-300 mb-4" size={32} strokeWidth={1} />
//                     <p className="text-zinc-400 text-[10px] uppercase tracking-[0.3em] font-bold">Your bag is empty</p>
//                   </div>
//                 ) : (
//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
//                     {cartItems.map((item) => (
//                       <div key={item.cartId} className="flex gap-6 p-4 border border-zinc-100 group">
//                         <div className="relative w-24 h-32 bg-zinc-50 shrink-0">
//                           <Image
//                             src={item.product.images?.hero ? urlFor(item.product.images.hero).url() : ""}
//                             alt={item.product.name}
//                             fill
//                             className="object-contain p-2"
//                           />
//                         </div>
//                         <div className="flex flex-col justify-between py-1 flex-1">
//                           <div>
//                             <h3 className="text-sm font-bold uppercase tracking-wider">{item.product.name}</h3>
//                             <p className="text-[10px] text-zinc-500 uppercase tracking-widest mt-1">
//                               {item.selectedSize} | {item.selectedColor.label}
//                             </p>
//                           </div>
//                           <div className="flex justify-between items-center">
//                             <p className="font-bold text-sm">{item.product.price}</p>
//                             <button 
//                               onClick={() => removeFromCart(item.cartId)}
//                               className="text-zinc-300 hover:text-[#be1e2d] transition-colors"
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
//                 <h2 className="text-2xl font-serif font-bold mb-8 uppercase tracking-tight">Saved Addresses</h2>
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                   <div className="p-8 border border-black relative">
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
//                 <h2 className="text-2xl font-serif font-bold mb-8 uppercase tracking-tight">Payment Methods</h2>
//                 <div className="py-20 border border-dashed border-zinc-200 flex flex-col items-center justify-center bg-zinc-50/30">
//                   <CreditCard className="text-zinc-300 mb-4" size={32} strokeWidth={1} />
//                   <p className="text-zinc-400 text-[10px] uppercase tracking-[0.3em] font-bold">No saved methods</p>
//                 </div>
//               </div>
//             )}

//             {activeTab === "settings" && (
//               <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
//                 <h2 className="text-2xl font-serif font-bold mb-8 uppercase tracking-tight">Personal Details</h2>
//                 <div className="max-w-xl space-y-8">
//                   <div className="space-y-1">
//                     <label className="text-[9px] uppercase tracking-[0.3em] font-bold text-zinc-400">Full Name</label>
//                     <input type="text" defaultValue={session?.user?.name || ""} className="w-full border-b border-zinc-200 py-3 text-sm focus:border-black outline-none transition-colors font-serif text-black" />
//                   </div>
//                   <div className="space-y-1">
//                     <label className="text-[9px] uppercase tracking-[0.3em] font-bold text-zinc-400">Email Address</label>
//                     <input type="email" defaultValue={session?.user?.email || ""} className="w-full border-b border-zinc-200 py-3 text-sm focus:border-black outline-none transition-colors font-serif text-black" />
//                   </div>
//                   <button className="bg-black text-white text-[10px] font-bold uppercase tracking-[0.3em] px-10 py-4 hover:bg-[#c5a059] transition-colors duration-500">
//                     Update Account
//                   </button>
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ProfilePage;

"use client";

import React, { useState } from "react";
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
  Trash2
} from "lucide-react";
import { redirect } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { urlFor } from "@/sanity/lib/image";

const ProfilePage = () => {
  const { data: session, status } = useSession();
  const { cartItems, removeFromCart } = useCart();
  const [activeTab, setActiveTab] = useState("orders");
  const [imageError, setImageError] = useState(false);

  if (status === "unauthenticated") redirect("/login");

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="w-10 h-10 border-[1px] border-black border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const userInitial = session?.user?.name ? session.user.name.charAt(0).toUpperCase() : "M";

  const tabs = [
    { id: "orders", label: "Orders", icon: Package },
    { id: "wishlist", label: "Wishlist", icon: Heart },
    { id: "address", label: "Addresses", icon: MapPin },
    { id: "payments", label: "Payments", icon: CreditCard },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-white pt-32 pb-20 mt-8 font-sans">
      <div className="max-w-[1400px] mx-auto px-6 md:px-12">
        <div className="flex flex-col items-center mb-16">
          <div className="relative w-24 h-24 mb-6 group">
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
                <span className="text-white text-3xl font-serif font-light tracking-tighter transition-transform duration-700 group-hover:scale-125 select-none">{userInitial}</span>
              )}
            </div>
          </div>
          <h1 className="text-4xl md:text-6xl font-serif font-black uppercase tracking-widest text-black mb-2 text-center">
            {session?.user?.name}
          </h1>
          <p className="text-[10px] uppercase tracking-[0.5em] text-[#c5a059] font-bold">MEMBER</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-16 border-t border-zinc-100 pt-12">
          <div className="lg:w-1/4 flex flex-col gap-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center justify-between py-4 px-2 border-b border-zinc-50 group transition-all ${
                  activeTab === tab.id ? "border-black" : "hover:border-zinc-300"
                }`}
              >
                <div className="flex items-center gap-4">
                  <tab.icon 
                    size={16} 
                    strokeWidth={activeTab === tab.id ? 2 : 1.2}
                    className={activeTab === tab.id ? "text-black" : "text-zinc-400"}
                  />
                  <span className={`text-[11px] uppercase tracking-[0.3em] font-bold transition-all ${
                    activeTab === tab.id ? "text-black" : "text-zinc-400 group-hover:text-black"
                  }`}>
                    {tab.label}
                  </span>
                </div>
                <ChevronRight size={14} className={`transition-all ${activeTab === tab.id ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-4"}`} />
              </button>
            ))}

            <button 
              onClick={() => signOut()}
              className="flex items-center gap-4 py-8 px-2 text-zinc-400 hover:text-[#be1e2d] transition-colors mt-8"
            >
              <LogOut size={16} strokeWidth={1.2} />
              <span className="text-[11px] uppercase tracking-[0.3em] font-bold">Sign Out</span>
            </button>
          </div>

          <div className="flex-1 min-h-[400px]">
            {activeTab === "orders" && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
                <h2 className="text-2xl font-serif font-bold mb-8 uppercase tracking-tight">Recent Orders</h2>
                <div className="py-20 border border-dashed border-zinc-200 flex flex-col items-center justify-center bg-zinc-50/30">
                  <Package className="text-zinc-300 mb-4" size={32} strokeWidth={1} />
                  <p className="text-zinc-400 text-[10px] uppercase tracking-[0.3em] font-bold">No orders found</p>
                </div>
              </div>
            )}

            {activeTab === "wishlist" && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
                <h2 className="text-2xl font-serif font-bold mb-8 uppercase tracking-tight">Saved Items in Bag</h2>
                {cartItems.length === 0 ? (
                  <div className="py-20 border border-dashed border-zinc-200 flex flex-col items-center justify-center bg-zinc-50/30">
                    <Heart className="text-zinc-300 mb-4" size={32} strokeWidth={1} />
                    <p className="text-zinc-400 text-[10px] uppercase tracking-[0.3em] font-bold">Your bag is empty</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {cartItems.map((item) => (
                      <div key={item.cartId} className="flex gap-6 p-4 border border-zinc-100 group hover:border-black transition-all duration-500 relative bg-white">
                        {/* Quantity Indicator */}
                        <div className="absolute top-2 right-2 z-10 bg-black text-white text-[8px] font-black px-2 py-1 uppercase tracking-tighter">
                          Qty: {item.quantity}
                        </div>
                        
                        <div className="relative w-24 h-32 bg-[#F9F9F9] shrink-0 overflow-hidden">
                          <Image
                            src={item.product.images?.hero ? urlFor(item.product.images.hero).url() : ""}
                            alt={item.product.name}
                            fill
                            className="object-contain p-2 group-hover:scale-110 transition-transform duration-700"
                            unoptimized
                          />
                        </div>
                        <div className="flex flex-col justify-between py-1 flex-1">
                          <div>
                            <h3 className="text-xs font-black uppercase tracking-widest">{item.product.name}</h3>
                            <p className="text-[10px] text-zinc-500 uppercase tracking-widest mt-1 font-bold">
                              {item.selectedSize} | {item.selectedColor.label}
                            </p>
                          </div>
                          <div className="flex justify-between items-center mt-4">
                            <p className="font-bold text-sm tracking-tighter">{item.product.price}</p>
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
                <h2 className="text-2xl font-serif font-bold mb-8 uppercase tracking-tight">Saved Addresses</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="p-8 border border-black relative">
                    <span className="absolute top-4 right-4 text-[8px] font-black tracking-widest bg-black text-white px-2 py-1 uppercase">Default</span>
                    <h3 className="text-[10px] uppercase tracking-[0.3em] font-bold mb-4">Shipping Address</h3>
                    <p className="text-sm font-serif leading-relaxed text-zinc-600">
                      {session?.user?.name}<br />
                      Westlands, Nairobi<br />
                      Kenya
                    </p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "payments" && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
                <h2 className="text-2xl font-serif font-bold mb-8 uppercase tracking-tight">Payment Methods</h2>
                <div className="py-20 border border-dashed border-zinc-200 flex flex-col items-center justify-center bg-zinc-50/30">
                  <CreditCard className="text-zinc-300 mb-4" size={32} strokeWidth={1} />
                  <p className="text-zinc-400 text-[10px] uppercase tracking-[0.3em] font-bold">No saved methods</p>
                </div>
              </div>
            )}

            {activeTab === "settings" && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
                <h2 className="text-2xl font-serif font-bold mb-8 uppercase tracking-tight">Personal Details</h2>
                <div className="max-w-xl space-y-8">
                  <div className="space-y-1">
                    <label className="text-[9px] uppercase tracking-[0.3em] font-bold text-zinc-400">Full Name</label>
                    <input type="text" defaultValue={session?.user?.name || ""} className="w-full border-b border-zinc-200 py-3 text-sm focus:border-black outline-none transition-colors font-serif text-black" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] uppercase tracking-[0.3em] font-bold text-zinc-400">Email Address</label>
                    <input type="email" defaultValue={session?.user?.email || ""} className="w-full border-b border-zinc-200 py-3 text-sm focus:border-black outline-none transition-colors font-serif text-black" />
                  </div>
                  <button className="bg-black text-white text-[10px] font-bold uppercase tracking-[0.3em] px-10 py-4 hover:bg-[#c5a059] transition-colors duration-500">
                    Update Account
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;