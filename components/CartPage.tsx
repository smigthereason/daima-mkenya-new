"use client";

import { useCart } from "@/context/CartContext";
import Image from "next/image";
import { Trash2, ChevronLeft, Plus, Minus, ArrowRight } from "lucide-react";
import { urlFor } from "@/sanity/lib/image";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function CartPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { cartItems, removeFromCart, updateQuantity } = useCart();

  // Redirect if not authenticated
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login?callbackUrl=/cart");
    }
  }, [status, router]);

  const total = cartItems.reduce((acc, item) => {
    const unitPrice = parseFloat(item.product.price.replace(/[^0-9.]/g, ""));
    return acc + unitPrice * item.quantity;
  }, 0);

  const handleCheckoutAction = () => {
    if (!session) {
      router.push("/login?callbackUrl=/checkout");
    } else {
      router.push("/checkout");
    }
  };

  // Show nothing while checking auth (instant redirect will happen)
  if (status === "loading") {
    return null;
  }

  if (status === "unauthenticated") {
    return null; // Will redirect
  }

  return (
    <div className="min-h-screen bg-white text-black mt-24 md:mt-32 px-4 sm:px-8 lg:px-16 pb-20 border-t border-neutral-200">
      <div className="max-w-[1800px] mx-auto">
        <div className="flex justify-between items-center py-10 md:py-16">
          <button
            onClick={() => router.push("/products")}
            className="group flex items-center gap-3 text-[10px] md:text-[12px] font-black uppercase tracking-[0.4em] hover:opacity-50 transition-all cursor-pointer"
          >
            <ChevronLeft size={16} /> Continue Shopping
          </button>
          <h1 className="text-xl md:text-2xl font-black uppercase tracking-[0.2em]">
            Your Bag ({cartItems.length})
          </h1>
        </div>

        {cartItems.length === 0 ? (
          <div className="py-40 text-center border-y border-neutral-100">
            <p className="text-gray-400 uppercase tracking-[0.5em] text-sm mb-8">
              Your bag is currently empty
            </p>
            <button
              onClick={() => router.push("/products")}
              className="border-2 border-black px-12 py-4 text-[10px] font-black uppercase tracking-[0.4em] hover:bg-black hover:text-white transition-all"
            >
              Explore Collection
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-16 md:gap-24">
            {/* Items List */}
            <div className="xl:col-span-8 space-y-12">
              {cartItems.map((item) => (
                <div
                  key={item.cartId}
                  className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-12 border-b border-neutral-100 group"
                >
                  <div className="md:col-span-1">
                    <div className="relative aspect-[3/4] bg-[#F9F9F9] overflow-hidden">
                      <Image
                        src={
                          item.product.images?.hero
                            ? urlFor(item.product.images.hero).url()
                            : "/assets/placeholder.png"
                        }
                        alt={item.product.name}
                        fill
                        unoptimized
                        className="object-contain p-4 group-hover:scale-105 transition-transform duration-700"
                      />
                    </div>
                  </div>

                  <div className="md:col-span-3 flex flex-col justify-between py-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-lg md:text-xl font-black uppercase tracking-widest mb-2">
                          {item.product.name}
                        </h3>
                        <div className="flex flex-wrap gap-4 text-[10px] md:text-[11px] uppercase tracking-[0.3em] text-gray-500 font-bold">
                          <span className="flex items-center gap-2">
                            Color:{" "}
                            <span
                              className="w-3 h-3 rounded-full"
                              style={{
                                backgroundColor: item.selectedColor.hex,
                              }}
                            />{" "}
                            {item.selectedColor.label}
                          </span>
                          <span>Size: {item.selectedSize}</span>
                        </div>
                      </div>
                      <button
                        onClick={() => removeFromCart(item.cartId)}
                        className="text-gray-300 hover:text-[#be1e2d] transition-colors p-2 cursor-pointer"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>

                    <div className="flex justify-between items-end mt-12 md:mt-0">
                      <div className="flex items-center border border-neutral-200">
                        <button
                          onClick={() =>
                            updateQuantity(item.cartId, item.quantity - 1)
                          }
                          disabled={item.quantity <= 1}
                          className="p-4 hover:bg-neutral-50 transition-colors cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
                        >
                          <Minus size={14} />
                        </button>
                        <span className="w-12 text-center font-bold text-sm tabular-nums">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            updateQuantity(item.cartId, item.quantity + 1)
                          }
                          className="p-4 hover:bg-neutral-50 transition-colors cursor-pointer"
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                      <p className="text-lg md:text-xl font-medium tracking-tighter uppercase">
                        {item.product.price}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Summary Sidebar */}
            <div className="xl:col-span-4">
              <div className="bg-[#fcfcfc] p-8 md:p-12 sticky top-40 border border-neutral-100">
                <h2 className="text-sm font-black uppercase tracking-[0.4em] mb-12 border-b border-black pb-6">
                  Order Summary
                </h2>

                <div className="space-y-6 mb-12">
                  <div className="flex justify-between text-xs md:text-sm uppercase tracking-widest text-gray-500">
                    <span>Subtotal</span>
                    <span className="text-black font-medium tabular-nums">
                      Ksh {total.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between text-xs md:text-sm uppercase tracking-widest text-gray-500">
                    <span>Shipping</span>
                    <span className="text-black font-medium">
                      Complimentary
                    </span>
                  </div>
                </div>

                <div className="flex justify-between text-3xl xl:text-4xl font-black uppercase mb-12">
                  <span>Total</span>
                  <span className="tabular-nums">
                    Ksh {total.toLocaleString()}
                  </span>
                </div>

                <button
                  onClick={handleCheckoutAction}
                  disabled={cartItems.length === 0}
                  className="group relative flex items-center justify-center gap-4 w-full bg-black text-white py-8 text-[12px] font-black uppercase tracking-[0.4em] overflow-hidden cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="absolute inset-0 bg-[#be1e2d] translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                  <span className="relative z-10">Checkout Now</span>
                  <ArrowRight size={18} className="relative z-10" />
                </button>

                <p className="text-[9px] text-gray-400 text-center uppercase tracking-widest mt-8 leading-relaxed">
                  Taxes and duties calculated at checkout <br /> Secure payment
                  via SSL encryption
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
