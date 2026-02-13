"use client";

import React, { useState } from "react";
import Image from "next/image";
import { ChevronLeft, ArrowRight, Smartphone, Loader2 } from "lucide-react";
import { useCart } from "@/context/CartContext";

interface CheckOutPageProps {
  onBack: () => void;
}

export default function CheckOutPage({ onBack }: CheckOutPageProps) {
  const { cartItems } = useCart();
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState<"card" | "paypal" | "mpesa">("card");
  const [phoneNumber, setPhoneNumber] = useState("");

  // Calculate total from cart items
  const totalAmount = cartItems.reduce((acc, item) => {
    const price = parseFloat(item.product.price.replace(/[^0-9.]/g, ""));
    return acc + (price * item.quantity);
  }, 0);

  const handleCompletePurchase = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    
    // Simulate payment logic
    setTimeout(() => {
      if (selectedMethod === "mpesa") {
        alert(`STK Push sent to ${phoneNumber}. Please check your phone.`);
      } else {
        alert("Payment successful!");
      }
      setIsProcessing(false);
    }, 2500);
  };

  return (
    <div className="min-h-screen flex flex-col bg-white text-black antialiased overflow-hidden mt-24 md:mt-32 border-t border-neutral-200">
      {/* ── TOP NAVIGATION ── */}
      <nav className="flex-none bg-white/80 backdrop-blur-md flex justify-between items-center px-4 md:px-16 py-4 md:py-6 border-b border-gray-100">
        <button
          onClick={onBack}
          className="flex items-center gap-2 md:gap-3 group cursor-pointer"
        >
          <ChevronLeft size={18} className="transition-transform group-hover:-translate-x-1" />
          <span className="text-[10px] md:text-[11px] uppercase tracking-[0.3em] font-bold">
            Back
          </span>
        </button>
        <span className="text-[10px] md:text-[11px] uppercase tracking-[0.3em] md:tracking-[0.5em] font-light text-gray-400">
          Secure Checkout
        </span>
      </nav>

      <div className="flex flex-1 flex-col lg:flex-row max-w-450 mx-auto w-full overflow-hidden">
        
        {/* ───────── ORDER SUMMARY (Left Column) ───────── */}
        <div className="w-full lg:w-[40%] p-6 md:p-12 lg:p-20 bg-[#F9F9F9] border-b lg:border-b-0 lg:border-r border-gray-100 overflow-y-auto">
          <span className="text-[10px] uppercase tracking-[0.5em] text-gray-400 block mb-6 md:mb-8 font-bold">
            01. Review Order
          </span>

          <div className="space-y-6 md:space-y-8 mb-8 md:mb-10">
            {cartItems.map((item) => {
              const titleParts = item.product.name.split(" ");
              const titleLine1 = titleParts.slice(0, 2).join(" ");
              const titleLine2 = titleParts.slice(2).join(" ");
              
              return (
                <div key={item.cartId} className="flex flex-row gap-4 md:gap-10">
                  <div className="relative w-20 h-28 sm:w-32 sm:h-44 bg-white shadow-sm border border-gray-100 overflow-hidden shrink-0">
                    <Image
                      src={item.product.images.hero}
                      alt={item.product.name}
                      fill
                      className="object-contain p-2 lg:p-4"
                    />
                  </div>

                  <div className="flex flex-col justify-center">
                    <h2 className="text-xs md:text-lg font-light tracking-tighter uppercase leading-tight">
                      {titleLine1} <br />
                      <span className="font-black text-zinc-900">{titleLine2}</span>
                    </h2>

                    <div className="flex flex-col gap-1 mt-2 md:mt-4">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color.hex }} />
                        <span className="text-[8px] md:text-[9px] font-bold uppercase tracking-widest">{item.color.name}</span>
                      </div>
                      <div className="text-[8px] md:text-[9px] font-bold uppercase tracking-widest text-gray-500">
                        Size: <span className="text-black">{item.size}</span>
                        {item.quantity > 1 && <span className="ml-2">| Qty: {item.quantity}</span>}
                      </div>
                    </div>
                    <p className="text-sm md:text-md font-light tracking-widest mt-2">{item.product.price}</p>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="border-t border-gray-200 pt-6 md:pt-8 space-y-3 md:space-y-4">
            <div className="flex justify-between text-[10px] md:text-[11px] tracking-widest uppercase text-gray-500">
              <span>Shipping</span>
              <span className="text-black font-bold">Complimentary</span>
            </div>
            <div className="flex justify-between text-sm md:text-[16px] tracking-[0.2em] font-black uppercase pt-4 border-t border-gray-100">
              <span>Total</span>
              <span>${totalAmount.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* ───────── CHECKOUT FORM (Right Column) ───────── */}
        <div className="w-full lg:w-[60%] p-6 md:p-12 lg:p-20 bg-white overflow-y-auto lg:overflow-hidden">
          <form onSubmit={handleCompletePurchase} className="max-w-xl mx-auto lg:ml-0 space-y-12 md:space-y-16">
            
            {/* Shipping Section */}
            <section>
              <h3 className="text-[11px] md:text-[14px] uppercase tracking-[0.4em] font-black mb-6 md:mb-8 pb-4 border-b border-black w-fit">
                02. Shipping
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">
                <div className="flex flex-col gap-2">
                  <label className="text-[8px] md:text-[9px] uppercase tracking-widest font-bold text-gray-400">First Name</label>
                  <input required type="text" className="border-b border-gray-200 py-2 focus:border-black outline-none transition-colors text-sm" />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-[8px] md:text-[9px] uppercase tracking-widest font-bold text-gray-400">Last Name</label>
                  <input required type="text" className="border-b border-gray-200 py-2 focus:border-black outline-none transition-colors text-sm" />
                </div>
                <div className="col-span-full flex flex-col gap-2">
                  <label className="text-[8px] md:text-[9px] uppercase tracking-widest font-bold text-gray-400">Email Address</label>
                  <input required type="email" className="border-b border-gray-200 py-2 focus:border-black outline-none transition-colors text-sm" />
                </div>
              </div>
            </section>

            {/* Payment Section */}
            <section>
              <h3 className="text-[11px] md:text-[14px] uppercase tracking-[0.4em] font-black mb-6 md:mb-8 pb-4 border-b border-black w-fit">
                03. Payment
              </h3>
              <div className="space-y-3 md:space-y-4">
                {[
                  { id: "card", label: "Credit / Debit Card", sub: "Visa, Mastercard, Amex" },
                  { id: "paypal", label: "PayPal Express", sub: "Fast & Secure" },
                  { id: "mpesa", label: "M-Pesa Mobile Money", sub: "Lipa na M-Pesa", color: "#81b73e" }
                ].map((method) => (
                  <div key={method.id} className="group">
                    <div 
                      // eslint-disable-next-line @typescript-eslint/no-explicit-any
                      onClick={() => setSelectedMethod(method.id as any)}
                      className={`p-4 md:p-6 border-2 cursor-pointer transition-all duration-300 flex justify-between items-center ${
                        selectedMethod === method.id ? "border-black bg-white shadow-md" : "border-gray-100 hover:border-gray-200"
                      }`}
                    >
                      <div className="flex items-center gap-3 md:gap-4">
                        <div className={`w-3 h-3 md:w-4 md:h-4 rounded-full border-4 ${selectedMethod === method.id ? "border-black" : "border-gray-200"}`} />
                        <div>
                          <p className={`text-[10px] md:text-[11px] uppercase tracking-widest font-black ${selectedMethod === method.id ? "text-black" : "text-gray-400"}`}>
                            {method.label}
                          </p>
                          <p className="text-[8px] md:text-[9px] text-gray-400 tracking-wider mt-0.5">{method.sub}</p>
                        </div>
                      </div>
                      {method.id === "mpesa" && (
                        <div className="bg-[#81b73e] px-2 py-0.5 md:py-1 text-[7px] md:text-[8px] font-bold text-white uppercase rounded">M-Pesa</div>
                      )}
                    </div>

                    {/* M-Pesa Specific Input */}
                    {method.id === "mpesa" && selectedMethod === "mpesa" && (
                      <div className="mt-3 md:mt-4 p-4 md:p-6 bg-gray-50 border border-gray-100 animate-in slide-in-from-top-2 duration-300">
                        <label className="text-[8px] md:text-[9px] uppercase tracking-[0.2em] font-black text-gray-500 block mb-3">
                          Enter M-Pesa Phone Number
                        </label>
                        <div className="relative">
                          <Smartphone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                          <input
                            type="tel"
                            placeholder="07XX XXX XXX"
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                            required={selectedMethod === "mpesa"}
                            className="w-full bg-white border border-gray-200 py-3 md:py-4 pl-12 pr-4 outline-none focus:border-[#81b73e] transition-colors text-sm font-bold tracking-widest"
                          />
                        </div>
                        <p className="text-[8px] md:text-[9px] text-gray-400 mt-3 italic">
                          You will receive a popup on this phone to enter your M-Pesa PIN.
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>

            {/* Action Button */}
            <div className="pt-4 md:pt-6">
              <button
                type="submit"
                disabled={isProcessing}
                className="group relative w-full overflow-hidden border-2 border-black bg-black py-6 md:py-8 text-[12px] md:text-[14px] font-black uppercase tracking-[0.5em] text-white transition-all duration-500"
              >
                <span className="absolute inset-0 z-0 translate-y-full bg-white transition-transform duration-500 ease-out group-hover:translate-y-0" />
                <span className="relative z-10 group-hover:text-black flex items-center justify-center gap-4">
                  {isProcessing ? (
                    <>
                      <Loader2 className="animate-spin" size={18} />
                      Processing...
                    </>
                  ) : (
                    <>
                      {selectedMethod === "mpesa" ? "Pay via M-Pesa" : "Complete Purchase"}
                      <ArrowRight size={18} />
                    </>
                  )}
                </span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}