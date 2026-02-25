// app/checkout/success/page.tsx

"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Check, Package, ArrowRight, Loader2, XCircle } from "lucide-react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";

export default function CheckoutSuccessPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { clearCart } = useCart();
  const [orderId, setOrderId] = useState<string | null>(null);
  const [countdown, setCountdown] = useState(10);
  const [verifying, setVerifying] = useState(true);
  const [paymentStatus, setPaymentStatus] = useState<
    "success" | "pending" | "failed"
  >("pending");

  useEffect(() => {
    // Get orderId from URL
    const orderIdParam = searchParams.get("orderId");
    const orderTrackingId = searchParams.get("OrderTrackingId");

    const verifyPayment = async () => {
      if (orderTrackingId) {
        try {
          // Verify payment status with your backend
          const response = await fetch(
            `/api/pesapal/verify?orderTrackingId=${orderTrackingId}`,
          );
          const data = await response.json();

          if (
            data.status_code === 1 ||
            data.status === "COMPLETED" ||
            data.status === "SUCCESS"
          ) {
            setPaymentStatus("success");
            clearCart(); // Clear the cart on successful payment
          } else if (data.status_code === 0 || data.status === "PENDING") {
            setPaymentStatus("pending");
          } else {
            setPaymentStatus("failed");
          }
        } catch (error) {
          console.error("Error verifying payment:", error);
          setPaymentStatus("pending");
        }
      }

      setVerifying(false);
    };

    if (orderIdParam) {
      setOrderId(orderIdParam);
      verifyPayment();

      // Clear pending order from session storage
      sessionStorage.removeItem("pendingOrder");
    } else {
      // Try to get from session storage as fallback
      const pendingOrder = sessionStorage.getItem("pendingOrder");
      if (pendingOrder) {
        const { orderId } = JSON.parse(pendingOrder);
        setOrderId(orderId);
        verifyPayment();
        sessionStorage.removeItem("pendingOrder");
      } else {
        setVerifying(false);
      }
    }
  }, [searchParams, clearCart]); // Remove router and paymentStatus from dependencies

  // Separate useEffect for redirect countdown
  useEffect(() => {
    if (paymentStatus === "success") {
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            router.push("/profile?tab=orders");
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [paymentStatus, router]);

  if (verifying) {
    return (
      <div className="min-h-screen bg-white pt-32 md:pt-40 pb-20 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="animate-spin mx-auto mb-4" size={40} />
          <p className="text-gray-500">Verifying your payment...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pt-32 md:pt-40 pb-20">
      <div className="max-w-2xl mx-auto px-4 text-center">
        {paymentStatus === "success" && (
          <>
            <div className="mb-8 flex justify-center">
              <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-[#81b73e]/10 flex items-center justify-center">
                <Check size={40} className="text-[#81b73e]" strokeWidth={2.5} />
              </div>
            </div>

            <h1 className="text-3xl md:text-5xl font-serif font-black uppercase tracking-widest mb-4">
              Payment Successful!
            </h1>

            <p className="text-gray-500 text-sm md:text-base mb-8 max-w-md mx-auto">
              Thank you for your purchase. Your order has been received and is
              ready for processing.
            </p>

            {orderId && (
              <div className="bg-gray-50 p-6 md:p-8 mb-8 border border-gray-100">
                <p className="text-[9px] uppercase tracking-[0.3em] font-bold text-gray-400 mb-2">
                  Order Reference
                </p>
                <p className="font-mono text-lg font-bold">{orderId}</p>
              </div>
            )}

            <div className="space-y-4">
              <Link
                href="/profile?tab=orders"
                className="flex items-center justify-center gap-3 w-full bg-black text-white py-5 text-sm font-black uppercase tracking-widest hover:bg-[#c5a059] transition-colors"
              >
                <Package size={18} />
                View Your Orders
              </Link>

              <p className="text-[10px] text-gray-400">
                Redirecting to your profile in {countdown} seconds...
              </p>
            </div>
          </>
        )}

        {paymentStatus === "pending" && (
          <>
            <div className="mb-8 flex justify-center">
              <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-[#c5a059]/10 flex items-center justify-center">
                <Loader2 size={40} className="text-[#c5a059] animate-spin" />
              </div>
            </div>

            <h1 className="text-3xl md:text-5xl font-serif font-black uppercase tracking-widest mb-4">
              Payment Processing
            </h1>

            <p className="text-gray-500 text-sm md:text-base mb-8 max-w-md mx-auto">
              Your payment is being processed. You'll receive a confirmation
              once it's complete.
            </p>

            <Link
              href="/profile?tab=orders"
              className="flex items-center justify-center gap-3 w-full bg-black text-white py-5 text-sm font-black uppercase tracking-widest hover:bg-[#c5a059] transition-colors"
            >
              <Package size={18} />
              Check Order Status
            </Link>
          </>
        )}

        {paymentStatus === "failed" && (
          <>
            <div className="mb-8 flex justify-center">
              <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-[#be1e2d]/10 flex items-center justify-center">
                <XCircle size={40} className="text-[#be1e2d]" />
              </div>
            </div>

            <h1 className="text-3xl md:text-5xl font-serif font-black uppercase tracking-widest mb-4">
              Payment Failed
            </h1>

            <p className="text-gray-500 text-sm md:text-base mb-8 max-w-md mx-auto">
              Something went wrong with your payment. Please try again.
            </p>

            <Link
              href="/checkout"
              className="flex items-center justify-center gap-3 w-full bg-black text-white py-5 text-sm font-black uppercase tracking-widest hover:bg-[#c5a059] transition-colors"
            >
              Try Again
            </Link>
          </>
        )}
      </div>
    </div>
  );
}
