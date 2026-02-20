"use client";

import CheckOutPage from "@/components/CheckOutPage";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";

export default function CheckoutRoute() {
  const router = useRouter();
  const { cartItems } = useCart();
  
  // We still check for an empty cart to show the empty state UI
  const hasItems = cartItems.length > 0;

  if (!hasItems) {
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

  return (
    <main>
      {/* FIX: Removed product, selectedSize, and selectedColor props.
        The CheckOutPage component now retrieves all cart data 
        internally using the useCart hook.
      */}
      <CheckOutPage 
        onBack={() => router.back()} 
      />
    </main>
  );
}