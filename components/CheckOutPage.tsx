"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { ChevronLeft, ArrowRight, Smartphone, Loader2, Trash2, Minus, Plus, Check } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { urlFor } from "@/sanity/lib/image";

interface PaymentMethod {
  id: string;
  type: "pesapal" | "mpesa";
  details: string;
  isDefault: boolean;
}

interface CheckOutPageProps {
  onBack: () => void;
}

export default function CheckOutPage({ onBack }: CheckOutPageProps) {
  const { data: session, status } = useSession();
  const { cartItems, removeFromCart, updateQuantity } = useCart();
  const router = useRouter();

  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState<"pesapal" | "mpesa">("pesapal");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [savedMethods, setSavedMethods] = useState<PaymentMethod[]>([]);
  const [useSavedNumber, setUseSavedNumber] = useState(false);
  const [loadingMethods, setLoadingMethods] = useState(false);

  useEffect(() => {
    if (session?.user?.email) {
      fetchSavedMethods();
    }
  }, [session]);

  const fetchSavedMethods = async () => {
    setLoadingMethods(true);
    try {
      const response = await fetch('/api/user/payment-methods');
      const data = await response.json();
      if (data.paymentMethods) {
        setSavedMethods(data.paymentMethods);
        const defaultMpesa = data.paymentMethods.find(
          (m: PaymentMethod) => m.type === "mpesa" && m.isDefault
        );
        if (defaultMpesa) {
          setPhoneNumber(defaultMpesa.details);
          setUseSavedNumber(true);
        }
      }
    } catch (error) {
      console.error("Error fetching payment methods:", error);
    } finally {
      setLoadingMethods(false);
    }
  };

  if (status === "unauthenticated") {
    router.push("/login");
    return null;
  }

  const totalAmount = cartItems.reduce((acc, item) => {
    const price = parseFloat(item.product.price.replace(/[^0-9.]/g, ""));
    return acc + price * item.quantity;
  }, 0);

  const getImageUrl = (source: any) => {
    if (!source) return "/assets/placeholder.png";
    try {
      return urlFor(source).url();
    } catch (error) {
      return "/assets/placeholder.png";
    }
  };

  const handleCompletePurchase = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    try {
      const response = await fetch("/api/pesapal/register-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: totalAmount,
          phone: selectedMethod === "mpesa" ? phoneNumber : "",
          email: session?.user?.email,
          name: session?.user?.name,
          paymentMethod: selectedMethod,
        }),
      });
      const data = await response.json();
      if (data.redirect_url) {
        window.location.href = data.redirect_url;
      } else {
        alert(`Error: ${data.message || "Could not initiate payment."}`);
        setIsProcessing(false);
      }
    } catch (error) {
      console.error("Payment Error:", error);
      alert("A network error occurred.");
      setIsProcessing(false);
    }
  };

  const mpesaMethods = savedMethods.filter(m => m.type === "mpesa");

  return (
    <div className="min-h-screen bg-white text-black antialiased mt-20 md:mt-32 border-t border-neutral-200">
      {/* ── TOP NAVIGATION ── */}
      <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md flex justify-between items-center px-6 md:px-12 lg:px-16 py-5 border-b border-gray-100">
        <button onClick={onBack} className="flex items-center gap-3 group cursor-pointer">
          <ChevronLeft size={18} className="transition-transform group-hover:-translate-x-1" />
          <span className="text-[10px] md:text-[11px] uppercase tracking-[0.3em] font-bold">Back</span>
        </button>
        <span className="text-[9px] md:text-[11px] uppercase tracking-[0.3em] font-light text-gray-400">Secure Checkout</span>
      </nav>

      <div className="max-w-[1800px] mx-auto w-full">
        {/* Changed lg:flex-row to xl:flex-row for better iPad Pro Portrait support */}
        <div className="flex flex-col xl:flex-row">
          
          {/* ── ORDER SUMMARY (Left Column) ── */}
          <div className="w-full xl:w-[40%] p-6 md:p-10 lg:p-16 xl:p-20 bg-[#F9F9F9] border-b xl:border-b-0 xl:border-r border-gray-100">
            <div className="flex justify-between items-center mb-8">
              <span className="text-[10px] uppercase tracking-[0.5em] text-gray-400 font-bold">01. Review Order</span>
              <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                {cartItems.length} {cartItems.length === 1 ? 'Item' : 'Items'}
              </span>
            </div>

            <div className="space-y-8 mb-10 max-h-none xl:max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
              {cartItems.map((item) => {
                const titleParts = item.product.name.split(" ");
                const titleLine1 = titleParts.slice(0, 2).join(" ");
                const titleLine2 = titleParts.slice(2).join(" ");
                
                return (
                  <div key={item.cartId} className="group relative border-b border-gray-200 pb-8 last:border-0">
                    {/* Quantity Controls */}
                    <div className="absolute top-0 right-0 flex items-center border border-gray-200 bg-white z-10">
                      <button 
                        onClick={() => updateQuantity(item.cartId, item.quantity - 1)}
                        className="p-2 hover:bg-gray-50 disabled:opacity-30"
                        disabled={item.quantity <= 1}
                      >
                        <Minus size={12} />
                      </button>
                      <span className="w-8 text-center text-[11px] font-bold">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.cartId, item.quantity + 1)} className="p-2 hover:bg-gray-50">
                        <Plus size={12} />
                      </button>
                    </div>

                    <button 
                      onClick={() => removeFromCart(item.cartId)}
                      className="absolute top-12 right-0 text-gray-300 hover:text-[#be1e2d] p-2"
                    >
                      <Trash2 size={14} />
                    </button>

                    <div className="flex flex-row gap-5 md:gap-8 mt-12">
                      <div className="relative w-24 h-32 md:w-32 md:h-44 bg-white shadow-sm border border-gray-100 shrink-0">
                        <Image
                          src={getImageUrl(item.product.images?.hero)}
                          alt={item.product.name}
                          fill
                          unoptimized
                          className="object-contain p-2 md:p-4 transition-transform duration-700 group-hover:scale-105"
                        />
                      </div>

                      <div className="flex flex-col justify-between flex-1">
                        <div>
                          <h2 className="text-sm md:text-lg font-light tracking-tighter uppercase leading-tight">
                            {titleLine1} <br />
                            <span className="font-black text-zinc-900">{titleLine2}</span>
                          </h2>
                          <div className="flex flex-col gap-1.5 mt-3">
                            <div className="flex items-center gap-2">
                              <div className="w-2.5 h-2.5 rounded-full border border-black/10" style={{ backgroundColor: item.selectedColor.hex }} />
                              <span className="text-[9px] font-bold uppercase tracking-widest">{item.selectedColor.label}</span>
                            </div>
                            <div className="text-[9px] font-bold uppercase tracking-widest text-gray-500">
                              Size: <span className="text-black">{item.selectedSize}</span>
                            </div>
                          </div>
                        </div>
                        <div className="mt-4">
                          <div className="flex justify-between items-baseline">
                             <span className="text-[9px] font-bold uppercase text-gray-400">Unit Price</span>
                             <p className="text-sm md:text-base font-light tracking-widest">{item.product.price}</p>
                          </div>
                          {item.quantity > 1 && (
                            <div className="flex justify-between items-baseline mt-2 pt-2 border-t border-dashed border-gray-200">
                              <span className="text-[9px] font-bold uppercase text-gray-400">Subtotal</span>
                              <p className="text-sm font-bold">Ksh {(parseFloat(item.product.price.replace(/[^0-9.]/g, "")) * item.quantity).toLocaleString()}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="border-t border-gray-200 pt-8 space-y-4">
              <div className="flex justify-between text-[11px] tracking-widest uppercase text-gray-500">
                <span>Subtotal</span>
                <span className="text-black font-bold">Ksh {totalAmount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-[11px] tracking-widest uppercase text-gray-500">
                <span>Shipping</span>
                <span className="text-black font-bold italic">Complimentary</span>
              </div>
              <div className="flex justify-between text-lg tracking-[0.2em] font-black uppercase pt-6 border-t border-black">
                <span>Total</span>
                <span>Ksh {totalAmount.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* ── CHECKOUT FORM (Right Column) ── */}
          <div className="w-full xl:w-[60%] p-6 md:p-10 lg:p-16 xl:p-20 bg-white">
            <div className="xl:sticky xl:top-32">
              <form onSubmit={handleCompletePurchase} className="max-w-2xl mx-auto xl:ml-0 space-y-16">
                
                {/* Shipping Section */}
                <section>
                  <h3 className="text-[12px] md:text-[14px] uppercase tracking-[0.4em] font-black mb-10 pb-4 border-b border-black w-fit">
                    02. Shipping
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-8">
                    <div className="flex flex-col gap-2">
                      <label className="text-[9px] uppercase tracking-widest font-bold text-gray-400">Full Name</label>
                      <input required type="text" defaultValue={session?.user?.name || ""} className="border-b border-gray-200 py-3 focus:border-black outline-none transition-colors text-sm" />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-[9px] uppercase tracking-widest font-bold text-gray-400">Email Address</label>
                      <input required type="email" defaultValue={session?.user?.email || ""} className="border-b border-gray-200 py-3 focus:border-black outline-none transition-colors text-sm" />
                    </div>
                    <div className="col-span-full flex flex-col gap-2">
                      <label className="text-[9px] uppercase tracking-widest font-bold text-gray-400">Shipping Address</label>
                      <input required type="text" className="border-b border-gray-200 py-3 focus:border-black outline-none transition-colors text-sm" />
                    </div>
                  </div>
                </section>

                {/* Payment Section */}
                <section>
                  <h3 className="text-[12px] md:text-[14px] uppercase tracking-[0.4em] font-black mb-10 pb-4 border-b border-black w-fit">
                    03. Payment
                  </h3>
                  <div className="space-y-4">
                    {/* PesaPal Option */}
                    <div 
                      onClick={() => setSelectedMethod("pesapal")}
                      className={`p-5 md:p-7 border-2 cursor-pointer transition-all duration-300 flex justify-between items-center ${
                        selectedMethod === "pesapal" ? "border-black bg-white shadow-lg scale-[1.01]" : "border-gray-100 hover:border-gray-200"
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <div className={`w-4 h-4 rounded-full border-4 ${selectedMethod === "pesapal" ? "border-black" : "border-gray-200"}`} />
                        <div>
                          <p className={`text-[11px] uppercase tracking-widest font-black ${selectedMethod === "pesapal" ? "text-black" : "text-gray-400"}`}>PesaPal</p>
                          <p className="text-[9px] text-gray-400 tracking-wider mt-1">Cards, Mobile Money, Bank</p>
                        </div>
                      </div>
                      <div className="bg-black px-3 py-1 text-[8px] font-bold text-white uppercase rounded">PesaPal</div>
                    </div>

                    {/* M-Pesa Option */}
                    <div className="space-y-4">
                      <div 
                        onClick={() => setSelectedMethod("mpesa")}
                        className={`p-5 md:p-7 border-2 cursor-pointer transition-all duration-300 flex justify-between items-center ${
                          selectedMethod === "mpesa" ? "border-black bg-white shadow-lg scale-[1.01]" : "border-gray-100 hover:border-gray-200"
                        }`}
                      >
                        <div className="flex items-center gap-4">
                          <div className={`w-4 h-4 rounded-full border-4 ${selectedMethod === "mpesa" ? "border-black" : "border-gray-200"}`} />
                          <div>
                            <p className={`text-[11px] uppercase tracking-widest font-black ${selectedMethod === "mpesa" ? "text-black" : "text-gray-400"}`}>M-Pesa</p>
                            <p className="text-[9px] text-gray-400 tracking-wider mt-1">Lipa na M-Pesa</p>
                          </div>
                        </div>
                        <div className="bg-[#81b73e] px-3 py-1 text-[8px] font-bold text-white uppercase rounded">M-Pesa</div>
                      </div>

                      {selectedMethod === "mpesa" && (
                        <div className="mt-4 p-6 md:p-8 bg-gray-50 border border-gray-100 animate-in fade-in slide-in-from-top-4 duration-500">
                          {mpesaMethods.length > 0 && (
                            <div className="mb-6">
                              <label className="text-[9px] uppercase tracking-[0.2em] font-black text-gray-500 block mb-4">Saved M-Pesa Numbers</label>
                              <div className="space-y-2">
                                {mpesaMethods.map((method) => (
                                  <div
                                    key={method.id}
                                    onClick={() => { setPhoneNumber(method.details); setUseSavedNumber(true); }}
                                    className={`p-4 border cursor-pointer transition-all flex items-center justify-between ${
                                      phoneNumber === method.details && useSavedNumber ? 'border-[#81b73e] bg-[#81b73e]/5' : 'border-gray-200 bg-white'
                                    }`}
                                  >
                                    <div className="flex items-center gap-4">
                                      <Smartphone size={16} className={phoneNumber === method.details && useSavedNumber ? 'text-[#81b73e]' : 'text-gray-400'} />
                                      <span className="text-sm font-mono font-bold">{method.details}</span>
                                      {method.isDefault && (
                                        <span className="text-[8px] bg-black text-white px-2 py-1 uppercase tracking-wider flex items-center gap-1">Default</span>
                                      )}
                                    </div>
                                    {phoneNumber === method.details && useSavedNumber && <Check size={16} className="text-[#81b73e]" />}
                                  </div>
                                ))}
                              </div>
                              <div className="flex items-center gap-4 my-6">
                                <div className="flex-1 h-px bg-gray-200" />
                                <span className="text-[8px] text-gray-400 uppercase tracking-widest">OR</span>
                                <div className="flex-1 h-px bg-gray-200" />
                              </div>
                            </div>
                          )}

                          <label className="text-[9px] uppercase tracking-[0.2em] font-black text-gray-500 block mb-4">
                            {mpesaMethods.length > 0 ? 'Use Different Number' : 'Enter M-Pesa Phone Number'}
                          </label>
                          <div className="relative">
                            <Smartphone className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                            <input
                              type="tel"
                              placeholder="07XX XXX XXX"
                              value={phoneNumber}
                              onChange={(e) => { setPhoneNumber(e.target.value); setUseSavedNumber(false); }}
                              required={selectedMethod === "mpesa"}
                              className="w-full bg-white border border-gray-200 py-4 pl-14 pr-6 outline-none focus:border-[#81b73e] transition-colors text-sm font-bold tracking-[0.1em]"
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </section>

                <div className="pt-8">
                  <button
                    type="submit"
                    disabled={isProcessing || (selectedMethod === "mpesa" && !phoneNumber)}
                    className="group relative w-full overflow-hidden bg-black py-7 md:py-9 text-[13px] md:text-[15px] font-black uppercase tracking-[0.6em] text-white transition-all duration-500 disabled:opacity-50"
                  >
                    <span className="absolute inset-0 z-0 translate-y-full bg-white transition-transform duration-500 ease-out group-hover:translate-y-0" />
                    <span className="relative z-10 group-hover:text-black flex items-center justify-center gap-4">
                      {isProcessing ? (
                        <>
                          <Loader2 className="animate-spin" size={20} />
                          Processing...
                        </>
                      ) : (
                        <>
                          {selectedMethod === "mpesa" ? "Pay via M-Pesa" : "Pay via PesaPal"}
                          <ArrowRight size={20} className="transition-transform group-hover:translate-x-2" />
                        </>
                      )}
                    </span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar { width: 3px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #e5e5e5; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #d1d1d1; }
      `}</style>
    </div>
  );
}