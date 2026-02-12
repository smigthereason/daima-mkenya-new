"use client";

import React, { useState } from "react";
import Image from "next/image";
import { ChevronLeft, ArrowRight, Smartphone, Loader2 } from "lucide-react";
import { Product } from "@/types/Product";

interface CheckOutPageProps {
  product: Product;
  selectedSize: string;
  selectedColor: { name: string; hex: string };
  onBack: () => void;
}

export default function CheckOutPage({
  product,
  selectedSize,
  selectedColor,
  onBack,
}: CheckOutPageProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState<"card" | "paypal" | "mpesa">("card");
  const [phoneNumber, setPhoneNumber] = useState("");

  const titleParts = product.name.split(" ");
  const titleLine1 = titleParts.slice(0, 2).join(" ");
  const titleLine2 = titleParts.slice(2).join(" ");

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
    <div className="min-h-screen bg-white text-black antialiased mt-20 md:mt-32">
      {/* ── TOP NAVIGATION ── */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md flex justify-between items-center px-6 md:px-16 py-6 border-b border-gray-100">
        <button
          onClick={onBack}
          className="flex items-center gap-2 md:gap-3 group cursor-pointer"
        >
          <ChevronLeft size={18} className="transition-transform group-hover:-translate-x-1" />
          <span className="text-[10px] md:text-[11px] uppercase tracking-[0.3em] font-bold">
            Back
          </span>
        </button>
        <span className="text-[10px] md:text-[11px] uppercase tracking-[0.5em] font-light text-gray-400">
          Secure Checkout
        </span>
      </nav>

      <div className="flex flex-col lg:flex-row max-w-[1800px] mx-auto">
        
        {/* ───────── ORDER SUMMARY (Top on Mobile, Left on Desktop) ───────── */}
        <div className="w-full lg:w-[40%] p-6 md:p-12 lg:p-20 bg-[#F9F9F9] border-b lg:border-b-0 lg:border-r border-gray-100">
          <span className="text-[10px] uppercase tracking-[0.5em] text-gray-400 block mb-8 font-bold">
            01. Review Order
          </span>

          <div className="flex flex-row lg:flex-col gap-6 md:gap-10 mb-10">
            <div className="relative w-24 h-32 sm:w-48 sm:h-64 lg:w-full lg:h-80 bg-white shadow-sm border border-gray-100 overflow-hidden shrink-0">
              <Image
                src={product.images.hero}
                alt={product.name}
                fill
                className="object-contain p-4 lg:p-8"
              />
            </div>

            <div className="flex flex-col justify-center">
              <h2 className="text-lg md:text-2xl lg:text-3xl font-light tracking-tighter uppercase leading-tight">
                {titleLine1} <br />
                <span className="font-black text-zinc-900">{titleLine2}</span>
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3 mt-4">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full ring-1 ring-offset-2 ring-black" style={{ backgroundColor: selectedColor.hex }} />
                  <span className="text-[11px] font-bold uppercase tracking-widest">{selectedColor.name}</span>
                </div>
                <div className="text-[11px] font-bold uppercase tracking-widest text-gray-500">
                  Size: <span className="text-black">{selectedSize}</span>
                </div>
              </div>
              <p className="text-xl font-light tracking-widest mt-6 lg:mt-10">{product.price}</p>
            </div>
          </div>

          <div className="border-t border-gray-200 pt-8 space-y-4">
            <div className="flex justify-between text-[11px] tracking-widest uppercase text-gray-500">
              <span>Shipping</span>
              <span className="text-black font-bold">Complimentary</span>
            </div>
            <div className="flex justify-between text-[16px] tracking-[0.2em] font-black uppercase pt-4 border-t border-gray-100">
              <span>Total</span>
              <span>{product.price}</span>
            </div>
          </div>
        </div>

        {/* ───────── CHECKOUT FORM (Right Column) ───────── */}
        <div className="w-full lg:w-[60%] p-6 md:p-12 lg:p-20 bg-white">
          <form onSubmit={handleCompletePurchase} className="max-w-xl mx-auto lg:ml-0 space-y-16">
            
            {/* Shipping Section */}
            <section>
              <h3 className="text-[12px] md:text-[14px] uppercase tracking-[0.4em] font-black mb-8 pb-4 border-b border-black w-fit">
                02. Shipping
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">
                <div className="flex flex-col gap-2">
                  <label className="text-[9px] uppercase tracking-widest font-bold text-gray-400">First Name</label>
                  <input required type="text" className="border-b border-gray-200 py-2 focus:border-black outline-none transition-colors text-sm" />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-[9px] uppercase tracking-widest font-bold text-gray-400">Last Name</label>
                  <input required type="text" className="border-b border-gray-200 py-2 focus:border-black outline-none transition-colors text-sm" />
                </div>
                <div className="col-span-full flex flex-col gap-2">
                  <label className="text-[9px] uppercase tracking-widest font-bold text-gray-400">Street Address</label>
                  <input required type="text" className="border-b border-gray-200 py-2 focus:border-black outline-none transition-colors text-sm" />
                </div>
              </div>
            </section>

            {/* Payment Section */}
            <section>
              <h3 className="text-[12px] md:text-[14px] uppercase tracking-[0.4em] font-black mb-8 pb-4 border-b border-black w-fit">
                03. Payment
              </h3>
              <div className="space-y-4">
                {/* Methods */}
                {[
                  { id: "card", label: "Credit / Debit Card", sub: "Visa, Mastercard, Amex" },
                  { id: "paypal", label: "PayPal Express", sub: "Fast & Secure" },
                  { id: "mpesa", label: "M-Pesa Mobile Money", sub: "Lipa na M-Pesa", color: "#81b73e" }
                ].map((method) => (
                  <div key={method.id} className="group">
                    <div 
                      onClick={() => setSelectedMethod(method.id as any)}
                      className={`p-5 md:p-6 border-2 cursor-pointer transition-all duration-300 flex justify-between items-center ${
                        selectedMethod === method.id ? "border-black bg-white shadow-md" : "border-gray-100 hover:border-gray-200"
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <div className={`w-4 h-4 rounded-full border-4 ${selectedMethod === method.id ? "border-black" : "border-gray-200"}`} />
                        <div>
                          <p className={`text-[11px] uppercase tracking-widest font-black ${selectedMethod === method.id ? "text-black" : "text-gray-400"}`}>
                            {method.label}
                          </p>
                          <p className="text-[9px] text-gray-400 tracking-wider mt-0.5">{method.sub}</p>
                        </div>
                      </div>
                      {method.id === "mpesa" && (
                        <div className="bg-[#81b73e] px-2 py-1 text-[8px] font-bold text-white uppercase rounded">M-Pesa</div>
                      )}
                    </div>

                    {/* M-Pesa Specific Input */}
                    {method.id === "mpesa" && selectedMethod === "mpesa" && (
                      <div className="mt-4 p-6 bg-gray-50 border border-gray-100 animate-in slide-in-from-top-2 duration-300">
                        <label className="text-[9px] uppercase tracking-[0.2em] font-black text-gray-500 block mb-3">
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
                            className="w-full bg-white border border-gray-200 py-4 pl-12 pr-4 outline-none focus:border-[#81b73e] transition-colors text-sm font-bold tracking-widest"
                          />
                        </div>
                        <p className="text-[9px] text-gray-400 mt-3 italic">
                          You will receive a popup on this phone to enter your M-Pesa PIN.
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>

            {/* Action Button */}
            <div className="pt-6">
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