"use client";

import { useCart } from "@/context/CartContext";
import Image from "next/image";
import { Trash2, ChevronLeft, Plus, Minus, ArrowRight } from "lucide-react";
import Link from "next/link";

interface CartPageProps {
  onBack?: () => void;
  onCheckout?: () => void;
}

export default function CartPage({ onBack, onCheckout }: CartPageProps) {
  const { cartItems, removeFromCart, updateQuantity } = useCart();

  const total = cartItems.reduce((acc, item) => {
    const unitPrice = parseFloat(item.product.price.replace(/[^0-9.]/g, ""));
    return acc + unitPrice * item.quantity;
  }, 0);

  const getLineTotal = (priceStr: string, quantity: number) => {
    const unitPrice = parseFloat(priceStr.replace(/[^0-9.]/g, ""));
    const lineTotal = unitPrice * quantity;
    return `$${lineTotal.toLocaleString()}`;
  };

  return (
    <div className="min-h-screen bg-white text-black mt-24 md:mt-32 px-4 sm:px-8 lg:px-16 pb-20 border-t border-neutral-200">
      <div className="max-w-[1800px] mx-auto">
        {/* Header Navigation */}
        <div className="flex justify-between items-center py-8 md:py-10 border-b border-gray-100 mb-10 md:mb-16">
          <button
            onClick={onBack}
            className="flex items-center gap-3 group text-[10px] md:text-[11px] font-bold uppercase tracking-widest cursor-pointer"
          >
            <ChevronLeft size={18} className="transition-transform group-hover:-translate-x-1" />
            Continue Shopping
          </button>
          <span className="text-[10px] md:text-[11px] uppercase tracking-[0.4em] text-gray-400">
            Items ({cartItems.reduce((sum, i) => sum + i.quantity, 0)})
          </span>
        </div>

        <h1 className="text-4xl md:text-5xl lg:text-7xl font-light uppercase tracking-tighter mb-12 md:mb-20">
          Your <span className="font-black">Bag</span>
        </h1>

        {cartItems.length === 0 ? (
          <div className="py-32 text-center border-y border-gray-50">
            <p className="text-gray-400 uppercase tracking-widest text-sm mb-8">Your bag is empty.</p>
            <Link href="/products" className="inline-block bg-black text-white px-12 py-5 font-black uppercase tracking-widest text-[12px]">
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 xl:gap-24">
            
            {/* LEFT SIDE: ITEM LIST */}
            <div className="lg:col-span-7 xl:col-span-8 space-y-8 md:space-y-12">
              {cartItems.map((item) => (
                <div
                  key={item.cartId}
                  className="grid grid-cols-1 md:grid-cols-4 gap-6 md:gap-8 border-b border-gray-50 pb-10 md:pb-12"
                >
                  <div className="md:col-span-1">
                    <div className="relative aspect-[3/4] bg-[#F9F9F9] overflow-hidden">
                      <Image
                        src={item.product.images.hero}
                        alt={item.product.name}
                        fill
                        className="object-contain p-4"
                      />
                    </div>
                  </div>

                  <div className="md:col-span-3 flex flex-col justify-between py-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-xl md:text-2xl font-bold uppercase tracking-tighter leading-tight">
                          {item.product.name}
                        </h3>
                        <p className="text-[10px] md:text-[11px] uppercase tracking-widest text-gray-400 mt-2">
                          Size: {item.size} <span className="mx-2">|</span> Color: {item.color.name}
                        </p>
                      </div>
                      <p className="text-xl md:text-2xl font-light tabular-nums">
                        {getLineTotal(item.product.price, item.quantity)}
                      </p>
                    </div>

                    <div className="flex justify-between items-center mt-8 md:mt-0">
                      <div className="flex items-center border border-gray-200">
                        <button onClick={() => updateQuantity(item.cartId, -1)} className="p-3 hover:bg-gray-50">
                          <Minus size={14} />
                        </button>
                        <span className="px-6 text-sm font-black">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.cartId, 1)} className="p-3 hover:bg-gray-50">
                          <Plus size={14} />
                        </button>
                      </div>

                      <button
                        onClick={() => removeFromCart(item.cartId)}
                        className="text-gray-300 hover:text-red-500 transition-colors flex items-center gap-2 group"
                      >
                        <Trash2 size={16} />
                        <span className="text-[10px] font-bold uppercase tracking-widest border-b border-transparent group-hover:border-red-500 transition-all">
                          Remove
                        </span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* RIGHT SIDE: SUMMARY */}
            <div className="lg:col-span-5 xl:col-span-4">
              <div className="bg-[#F9F9F9] p-8 md:p-12 lg:p-10 xl:p-12 h-fit lg:sticky lg:top-40 border border-gray-100">
                <h3 className="text-[12px] font-black uppercase tracking-[0.4em] border-b border-black pb-4 mb-10">
                  Order Summary
                </h3>

                <div className="space-y-6 mb-12">
                  <div className="flex justify-between text-xs md:text-sm uppercase tracking-widest text-gray-500">
                    <span>Subtotal</span>
                    <span className="text-black font-medium">${total.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-xs md:text-sm uppercase tracking-widest text-gray-500">
                    <span>Shipping</span>
                    <span className="text-black font-medium">Complimentary</span>
                  </div>
                </div>

                <div className="flex justify-between text-3xl xl:text-4xl font-black uppercase mb-12">
                  <span>Total</span>
                  <span className="tabular-nums">${total.toLocaleString()}</span>
                </div>

                <button
                  onClick={onCheckout}
                  className="group relative flex items-center justify-center gap-4 w-full bg-black text-white py-8 text-[12px] font-black uppercase tracking-[0.4em] overflow-hidden cursor-pointer"
                >
                  <span className="absolute inset-0 bg-[#be1e2d] translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                  <span className="relative z-10">Checkout Now</span>
                  <ArrowRight size={18} className="relative z-10" />
                </button>
                
                <p className="text-[9px] text-gray-400 text-center uppercase tracking-widest mt-8 leading-relaxed">
                  Taxes and duties calculated at checkout <br />
                  Secure payment via SSL encryption
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}