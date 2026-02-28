"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { CheckCircle, Loader2 } from "lucide-react";
import Link from "next/link";

export default function CheckoutSuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { clearCart } = useCart();
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading",
  );
  const [orderId, setOrderId] = useState<string | null>(null);

  // Add a ref to prevent double execution
  const hasProcessed = useRef(false);

  const orderTrackingId = searchParams.get("OrderTrackingId");
  const orderMerchantReference = searchParams.get("OrderMerchantReference");
  const orderIdParam = searchParams.get("orderId");

  useEffect(() => {
    // Prevent double execution in Strict Mode
    if (hasProcessed.current) return;
    hasProcessed.current = true;

    const processSuccess = async () => {
      try {
        // Clear the cart - this will trigger a re-render but our ref prevents re-execution
        await clearCart();

        // Also clear from session storage
        sessionStorage.removeItem("pendingOrderId");

        // Verify payment status
        if (orderTrackingId) {
          const response = await fetch(
            `/api/pesapal/verify?orderTrackingId=${orderTrackingId}`,
          );
          const data = await response.json();

          if (data.status_code === 1) {
            setStatus("success");
            setOrderId(orderIdParam || orderMerchantReference);
          } else {
            setStatus("error");
          }
        } else {
          setStatus("success");
          setOrderId(orderIdParam || orderMerchantReference);
        }
      } catch (error) {
        console.error("Error processing success:", error);
        setStatus("error");
      }
    };

    processSuccess();
  }, [clearCart, orderTrackingId, orderIdParam, orderMerchantReference]); // Keep dependencies

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-black" />
          <p className="text-sm uppercase tracking-widest">
            Processing your order...
          </p>
        </div>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-3xl">⚠️</span>
          </div>
          <h1 className="text-2xl font-black uppercase tracking-wider mb-4">
            Payment Issue
          </h1>
          <p className="text-gray-600 mb-8">
            There was an issue processing your payment. Please check your email
            for confirmation or contact support.
          </p>
          <Link
            href="/"
            className="inline-block border-2 border-black px-8 py-4 text-sm font-black uppercase tracking-widest hover:bg-black hover:text-white transition-all"
          >
            Return Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-white mt-20">
      <div className="text-center max-w-md mx-auto px-4">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-10 h-10 text-green-600" />
        </div>
        <h1 className="text-2xl font-black uppercase tracking-wider mb-2">
          Thank You!
        </h1>
        <p className="text-sm uppercase tracking-widest text-gray-500 mb-4">
          Order #{orderId}
        </p>
        <p className="text-gray-600 mb-8">
          Your order has been confirmed and will be processed shortly. You'll
          receive a confirmation email with your order details.
        </p>
        <div className="space-y-3">
          <Link
            href="/profile"
            className="block w-full bg-black text-white px-8 py-4 text-sm font-black uppercase tracking-widest hover:bg-opacity-80 transition-all"
          >
            View Order Status
          </Link>
          <Link
            href="/products"
            className="block w-full border-2 border-black px-8 py-4 text-sm font-black uppercase tracking-widest hover:bg-black hover:text-white transition-all"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}
