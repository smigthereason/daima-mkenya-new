"use client";

import CheckOutPage from "@/components/CheckOutPage";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { useEffect, useState } from "react";

export default function CheckoutRoute() {
  const router = useRouter();
  const { cartItems } = useCart();
  const [hasDirectItem, setHasDirectItem] = useState(false);

  // Check for direct checkout item in sessionStorage
  useEffect(() => {
    const directItem = sessionStorage.getItem("directCheckout");
    setHasDirectItem(!!directItem);
  }, []);

  // If there are no cart items AND no direct checkout item, show empty state
  if (cartItems.length === 0 && !hasDirectItem) {
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
      <CheckOutPage onBack={() => router.back()} />
    </main>
  );
}
