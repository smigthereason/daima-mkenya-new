"use client";

import React, { useState, useEffect } from "react";
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
} from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { urlFor } from "@/sanity/lib/image";

interface CheckOutPageProps {
  onBack: () => void;
}

// Ensure TypeScript recognizes the PesaPal global object
declare global {
  interface Window {
    PesaPal?: {
      pay: (url: string) => void;
    };
  }
}

export default function CheckOutPage({ onBack }: CheckOutPageProps) {
  // ALL HOOKS MUST BE AT THE TOP - BEFORE ANY CONDITIONAL RETURNS
  const { data: session, status } = useSession();
  const { cartItems, removeFromCart, updateQuantity, clearCart, loading } =
    useCart();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [isProcessing, setIsProcessing] = useState(false);
  const [directCheckoutItem, setDirectCheckoutItem] = useState<any>(null);
  const [shouldRedirect, setShouldRedirect] = useState(false);
  const [isDirectCheckoutChecked, setIsDirectCheckoutChecked] = useState(false);

  // Shipping form state
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [shippingAddress, setShippingAddress] = useState("");

  // Check for direct purchase
  useEffect(() => {
    const isDirect = searchParams.get("direct") === "true";
    console.log("isDirect:", isDirect);

    if (isDirect) {
      const storedItem = sessionStorage.getItem("directCheckout");
      console.log("storedItem:", storedItem);

      if (storedItem) {
        try {
          const parsedItem = JSON.parse(storedItem);
          console.log("parsedItem:", parsedItem);
          setDirectCheckoutItem(parsedItem);
          // Clear it from sessionStorage after reading
          sessionStorage.removeItem("directCheckout");
        } catch (e) {
          console.error("Error parsing direct checkout item:", e);
        }
      }
    }

    // Mark that we've checked for direct checkout
    setIsDirectCheckoutChecked(true);
  }, [searchParams]);

  // Handle redirect logic in useEffect instead of during render
  useEffect(() => {
    // Wait for loading to complete and for direct checkout to be checked
    if (loading || !isDirectCheckoutChecked) return;

    const hasItems = directCheckoutItem ? true : cartItems.length > 0;

    // Only redirect if we're sure there are no items AND no direct checkout item
    if (!hasItems && !directCheckoutItem) {
      setShouldRedirect(true);
    }
  }, [directCheckoutItem, cartItems, loading, isDirectCheckoutChecked]);

  // Perform the actual redirect
  useEffect(() => {
    if (shouldRedirect) {
      router.push("/cart");
    }
  }, [shouldRedirect, router]);

  // Pre-fill form with session data
  useEffect(() => {
    if (session?.user?.email) {
      setFullName(session?.user?.name || "");
      setEmail(session?.user?.email || "");
    }
  }, [session]);

  // Handle unauthenticated redirect
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  // Determine which items to display
  const displayItems = directCheckoutItem ? [directCheckoutItem] : cartItems;

  console.log("displayItems:", displayItems);
  console.log("directCheckoutItem:", directCheckoutItem);

  // NOW WE CAN HAVE CONDITIONAL RETURNS - AFTER ALL HOOKS
  // If cart is loading, show loading state
  if (loading && !directCheckoutItem) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  // If we're redirecting, show nothing
  if (shouldRedirect) {
    return null;
  }

  // If no items to display and not loading, show empty state (but don't redirect during render)
  if (displayItems.length === 0 && !loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center uppercase tracking-[0.5em] text-gray-400">
        Your bag is empty
        <button
          onClick={() => router.push("/products")}
          className="mt-10 text-black font-bold border-b border-black"
        >
          Continue Shopping
        </button>
      </div>
    );
  }

  const totalAmount = displayItems.reduce((acc, item) => {
    const price = parseFloat(item.product.price.replace(/[^0-9.]/g, ""));
    return acc + price * (item.quantity || 1);
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

    // Format items correctly for the API - ensure product._id is included
    const formattedItems = displayItems.map((item) => ({
      product: {
        _id: item.product._id, // CRITICAL: This must be included
        name: item.product.name,
        price: item.product.price,
      },
      quantity: item.quantity || 1,
      selectedSize: item.selectedSize,
      selectedColor: {
        label: item.selectedColor.label,
        hex: item.selectedColor.hex,
      },
    }));

    console.log(
      "Sending items with product IDs:",
      formattedItems.map((i) => ({
        productId: i.product._id,
        name: i.product.name,
      })),
    );

    const requestData = {
      amount: totalAmount,
      email: email,
      name: fullName,
      phoneNumber: phoneNumber,
      items: formattedItems,
      shippingAddress: shippingAddress,
    };

    try {
      const response = await fetch("/api/pesapal/register-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestData),
      });

      const data = await response.json();

      if (!response.ok) {
        console.error("API Error:", data);
        alert(`Error: ${data.error || "Could not initiate payment."}`);
        setIsProcessing(false);
        return;
      }

      if (data.redirect_url) {
        // Store order ID in session storage to clear cart after successful payment
        sessionStorage.setItem("pendingOrderId", data.orderId);

        if (window.PesaPal) {
          window.PesaPal.pay(data.redirect_url);
          setIsProcessing(false);
        } else {
          window.location.href = data.redirect_url;
        }
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

  // Custom remove function for direct checkout items
  const handleRemoveDirectItem = () => {
    setDirectCheckoutItem(null);
    router.push("/products");
  };

  return (
    <div className="min-h-screen bg-white text-black antialiased mt-20 md:mt-32 border-t border-neutral-200">
      {/* ── PESAPAL V3 SDK ── */}
      <Script
        src="https://cybqa.pesapal.com/v3/js/pesapal.js"
        strategy="afterInteractive"
      />

      {/* ── TOP NAVIGATION ── */}
      <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md flex justify-between items-center px-6 md:px-12 lg:px-16 py-5 border-b border-gray-100">
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
          {/* ── ORDER SUMMARY (Left Column) ── */}
          <div className="w-full xl:w-[40%] p-6 md:p-10 lg:p-16 xl:p-20 bg-[#F9F9F9] border-b xl:border-b-0 xl:border-r border-gray-100">
            <div className="flex justify-between items-center mb-8">
              <span className="text-[10px] uppercase tracking-[0.5em] text-gray-400 font-bold">
                01. Review Order
              </span>
              <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                {displayItems.length}{" "}
                {displayItems.length === 1 ? "Item" : "Items"}
                {directCheckoutItem && " (Direct Purchase)"}
              </span>
            </div>

            <div className="space-y-8 mb-10 max-h-none xl:max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
              {displayItems.map((item, index) => {
                const titleParts = item.product.name.split(" ");
                const titleLine1 = titleParts.slice(0, 2).join(" ");
                const titleLine2 = titleParts.slice(2).join(" ");

                return (
                  <div
                    key={directCheckoutItem ? `direct-${index}` : item.cartId}
                    className="group relative border-b border-gray-200 pb-8 last:border-0"
                  >
                    {/* Quantity Controls - FIXED: Removed the !directCheckoutItem condition that was hiding them */}
                    {item.cartId && (
                      <div className="absolute top-0 right-0 flex items-center border border-gray-200 bg-white z-10">
                        <button
                          onClick={() =>
                            updateQuantity(item.cartId, item.quantity - 1)
                          }
                          className="p-2 hover:bg-gray-50 disabled:opacity-30"
                          disabled={item.quantity <= 1}
                        >
                          <Minus size={12} />
                        </button>
                        <span className="w-8 text-center text-[11px] font-bold">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            updateQuantity(item.cartId, item.quantity + 1)
                          }
                          className="p-2 hover:bg-gray-50"
                        >
                          <Plus size={12} />
                        </button>
                      </div>
                    )}

                    {/* Remove button - Different behavior for direct vs cart items */}
                    {directCheckoutItem ? (
                      <button
                        onClick={handleRemoveDirectItem}
                        className="absolute top-0 right-0 text-gray-300 hover:text-[#be1e2d] p-2"
                      >
                        <Trash2 size={14} />
                      </button>
                    ) : (
                      <button
                        onClick={() => removeFromCart(item.cartId)}
                        className="absolute top-12 right-0 text-gray-300 hover:text-[#be1e2d] p-2"
                      >
                        <Trash2 size={14} />
                      </button>
                    )}

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
                            <span className="font-black text-zinc-900">
                              {titleLine2}
                            </span>
                          </h2>
                          <div className="flex flex-col gap-1.5 mt-3">
                            <div className="flex items-center gap-2">
                              <div
                                className="w-2.5 h-2.5 rounded-full border border-black/10"
                                style={{
                                  backgroundColor: item.selectedColor.hex,
                                }}
                              />
                              <span className="text-[9px] font-bold uppercase tracking-widest">
                                {item.selectedColor.label}
                              </span>
                            </div>
                            <div className="text-[9px] font-bold uppercase tracking-widest text-gray-500">
                              Size:{" "}
                              <span className="text-black">
                                {item.selectedSize}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="mt-4">
                          <div className="flex justify-between items-baseline">
                            <span className="text-[9px] font-bold uppercase text-gray-400">
                              Unit Price
                            </span>
                            <p className="text-sm md:text-base font-light tracking-widest">
                              {item.product.price}
                            </p>
                          </div>
                          {(item.quantity || 1) > 1 && (
                            <div className="flex justify-between items-baseline mt-2 pt-2 border-t border-dashed border-gray-200">
                              <span className="text-[9px] font-bold uppercase text-gray-400">
                                Subtotal
                              </span>
                              <p className="text-sm font-bold">
                                Ksh{" "}
                                {(
                                  parseFloat(
                                    item.product.price.replace(/[^0-9.]/g, ""),
                                  ) * (item.quantity || 1)
                                ).toLocaleString()}
                              </p>
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
                <span className="text-black font-bold">
                  Ksh {totalAmount.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between text-[11px] tracking-widest uppercase text-gray-500">
                <span>Shipping</span>
                <span className="text-black font-bold italic">
                  Complimentary
                </span>
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
              <form
                onSubmit={handleCompletePurchase}
                className="max-w-2xl mx-auto xl:ml-0 space-y-16"
              >
                {/* Shipping Section */}
                <section>
                  <h3 className="text-[12px] md:text-[14px] uppercase tracking-[0.4em] font-black mb-10 pb-4 border-b border-black w-fit">
                    02. Shipping & Contact
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-8">
                    <div className="flex flex-col gap-2">
                      <label className="text-[9px] uppercase tracking-widest font-bold text-gray-400">
                        Full Name
                      </label>
                      <input
                        required
                        type="text"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="border-b border-gray-200 py-3 focus:border-black outline-none transition-colors text-sm"
                        placeholder="John Doe"
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-[9px] uppercase tracking-widest font-bold text-gray-400">
                        Email Address
                      </label>
                      <input
                        required
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="border-b border-gray-200 py-3 focus:border-black outline-none transition-colors text-sm"
                        placeholder="john@example.com"
                      />
                    </div>

                    {/* Phone Number Field - REQUIRED */}
                    <div className="flex flex-col gap-2 md:col-span-2">
                      <label className="text-[9px] uppercase tracking-widest font-bold text-gray-400 flex items-center gap-2">
                        <Phone size={12} /> Phone Number{" "}
                        <span className="text-red-500">*</span>
                      </label>
                      <input
                        required
                        type="tel"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        className="border-b border-gray-200 py-3 focus:border-black outline-none transition-colors text-sm"
                        placeholder="0712 345 678"
                      />
                      <p className="text-[8px] text-gray-400 mt-1">
                        For M-Pesa payment confirmation and order updates
                      </p>
                    </div>

                    <div className="flex flex-col gap-2 md:col-span-2">
                      <label className="text-[9px] uppercase tracking-widest font-bold text-gray-400">
                        Shipping Address
                      </label>
                      <input
                        required
                        type="text"
                        value={shippingAddress}
                        onChange={(e) => setShippingAddress(e.target.value)}
                        className="border-b border-gray-200 py-3 focus:border-black outline-none transition-colors text-sm"
                        placeholder="123 Main Street, Nairobi"
                      />
                    </div>
                  </div>
                </section>

                {/* REMOVED: Section 3 Payment Method - Now just the button */}

                <div className="pt-8">
                  <button
                    type="submit"
                    disabled={
                      isProcessing ||
                      displayItems.length === 0 ||
                      !phoneNumber.trim()
                    }
                    className="group relative w-full overflow-hidden bg-black text-white py-7 md:py-9 text-[13px] md:text-[15px] font-black uppercase tracking-[0.6em] transition-all duration-500 disabled:opacity-50 disabled:cursor-not-allowed border-2 border-black hover:bg-white hover:text-black"
                  >
                    {/* Removed the white overlay span that was causing hover issues */}
                    <span className="relative z-10 flex items-center justify-center gap-4">
                      {isProcessing ? (
                        <>
                          <Loader2 className="animate-spin" size={20} />
                          Processing...
                        </>
                      ) : (
                        <>
                          Complete Purchase
                          <ArrowRight
                            size={20}
                            className="transition-transform group-hover:translate-x-2"
                          />
                        </>
                      )}
                    </span>
                  </button>

                  {/* Security notice */}
                  <p className="text-[8px] text-center text-gray-400 mt-4 uppercase tracking-wider">
                    🔒 256-bit SSL Secure Payment • Your information is
                    encrypted
                  </p>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #e5e5e5;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #d1d1d1;
        }
      `}</style>
    </div>
  );
}
