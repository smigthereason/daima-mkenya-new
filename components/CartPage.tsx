"use client";

import { useCart } from "@/context/CartContext";
import Image from "next/image";
import { Trash2, ChevronLeft, Plus, Minus, ArrowRight } from "lucide-react";
import { urlFor } from "@/sanity/lib/image";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState, useCallback, useRef } from "react";
import Link from "next/link";

export default function CartPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { cartItems, removeFromCart, updateQuantity } = useCart();

  // Local state that overrides server state for instant UI
  const [localQuantities, setLocalQuantities] = useState<
    Record<string, number>
  >({});
  const [pendingRemovals, setPendingRemovals] = useState<Set<string>>(
    new Set(),
  );

  // Use ref to track if this is the first render
  const isFirstRender = useRef(true);
  // Use ref to store previous cartItems for comparison
  const prevCartItemsRef = useRef(cartItems);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login?callbackUrl=/cart");
    }
  }, [status, router]);

  // Sync local quantities with cart items when they change - FIXED INFINITE LOOP
  useEffect(() => {
    // Skip if this is the first render
    if (isFirstRender.current) {
      isFirstRender.current = false;
      // Initialize local quantities with cart items on first render
      const initialQuantities: Record<string, number> = {};
      cartItems.forEach((item) => {
        initialQuantities[item.cartId] = item.quantity;
      });
      setLocalQuantities(initialQuantities);
      return;
    }

    // Check if cartItems actually changed by comparing with previous ref
    const prevCartItems = prevCartItemsRef.current;

    // If cartItems length changed or items changed, update local quantities
    if (prevCartItems.length !== cartItems.length) {
      setLocalQuantities((prev) => {
        const newQuantities = { ...prev };

        // Add new items
        cartItems.forEach((item) => {
          if (!newQuantities[item.cartId]) {
            newQuantities[item.cartId] = item.quantity;
          }
        });

        // Remove items that are no longer in cart
        const currentCartIds = new Set(cartItems.map((item) => item.cartId));
        Object.keys(newQuantities).forEach((cartId) => {
          if (!currentCartIds.has(cartId) && !pendingRemovals.has(cartId)) {
            delete newQuantities[cartId];
          }
        });

        return newQuantities;
      });
    } else {
      // Check if any quantities changed in the server response
      const needsUpdate = cartItems.some((item) => {
        const localQty = localQuantities[item.cartId];
        return (
          localQty &&
          localQty !== item.quantity &&
          !pendingRemovals.has(item.cartId)
        );
      });

      if (needsUpdate) {
        setLocalQuantities((prev) => {
          const newQuantities = { ...prev };
          cartItems.forEach((item) => {
            if (!pendingRemovals.has(item.cartId)) {
              newQuantities[item.cartId] = item.quantity;
            }
          });
          return newQuantities;
        });
      }
    }

    // Update ref for next comparison
    prevCartItemsRef.current = cartItems;
  }, [cartItems, pendingRemovals, localQuantities]);

  // Calculate total using local quantities if available, otherwise server quantities
  const total = useMemo(() => {
    return cartItems.reduce((acc, item) => {
      // Skip items that are pending deletion
      if (pendingRemovals.has(item.cartId)) {
        return acc;
      }

      if (!item.product?.price) return acc;
      const unitPrice = parseFloat(item.product.price.replace(/[^0-9.]/g, ""));
      // Use local quantity if we have it, otherwise use server quantity
      const quantity = localQuantities[item.cartId] ?? item.quantity ?? 0;
      return acc + (isNaN(unitPrice) ? 0 : unitPrice * quantity);
    }, 0);
  }, [cartItems, localQuantities, pendingRemovals]);

  const handleCheckoutAction = () => {
    router.push("/checkout");
  };

  const handleIncrement = useCallback(
    (cartId: string, currentServerQuantity: number) => {
      // Skip if item is pending deletion
      if (pendingRemovals.has(cartId)) return;

      // Get current local quantity or fallback to server quantity
      const currentLocalQty = localQuantities[cartId] ?? currentServerQuantity;
      const newQuantity = currentLocalQty + 1;

      // Update local state immediately (instant UI)
      setLocalQuantities((prev) => ({ ...prev, [cartId]: newQuantity }));

      // Trigger server update in background (don't wait for it)
      updateQuantity(cartId, newQuantity).catch(() => {
        // If server update fails, revert local state
        setLocalQuantities((prev) => {
          const newState = { ...prev };
          delete newState[cartId];
          return newState;
        });
      });
    },
    [localQuantities, updateQuantity, pendingRemovals],
  );

  const handleDecrement = useCallback(
    (cartId: string, currentServerQuantity: number) => {
      // Skip if item is pending deletion
      if (pendingRemovals.has(cartId)) return;

      // Get current local quantity or fallback to server quantity
      const currentLocalQty = localQuantities[cartId] ?? currentServerQuantity;

      if (currentLocalQty <= 1) return;

      const newQuantity = currentLocalQty - 1;

      // Update local state immediately (instant UI)
      setLocalQuantities((prev) => ({ ...prev, [cartId]: newQuantity }));

      // Trigger server update in background
      updateQuantity(cartId, newQuantity).catch(() => {
        // If server update fails, revert local state
        setLocalQuantities((prev) => {
          const newState = { ...prev };
          delete newState[cartId];
          return newState;
        });
      });
    },
    [localQuantities, updateQuantity, pendingRemovals],
  );

  const handleRemove = useCallback(
    (cartId: string) => {
      // Mark as pending removal
      setPendingRemovals((prev) => new Set(prev).add(cartId));

      // Optimistically remove from local state
      setLocalQuantities((prev) => {
        const newState = { ...prev };
        delete newState[cartId];
        return newState;
      });

      // Trigger server removal in background
      removeFromCart(cartId)
        .catch(() => {
          // If server removal fails, remove from pending
          setPendingRemovals((prev) => {
            const newSet = new Set(prev);
            newSet.delete(cartId);
            return newSet;
          });
        })
        .finally(() => {
          // Remove from pending after completion
          setPendingRemovals((prev) => {
            const newSet = new Set(prev);
            newSet.delete(cartId);
            return newSet;
          });
        });
    },
    [removeFromCart],
  );

  // Filter out items that are pending deletion
  const visibleItems = useMemo(() => {
    return cartItems.filter((item) => !pendingRemovals.has(item.cartId));
  }, [cartItems, pendingRemovals]);

  if (status === "loading") return null;
  if (status === "unauthenticated") return null;

  return (
    <div className="min-h-screen bg-white text-black mt-0 px-4 sm:px-8 lg:px-16 pb-20 border-t border-neutral-200">
      <div className="max-w-[1800px] mx-auto">
        <div className="flex justify-between items-center py-10 md:py-16">
          <Link
            href="/products"
            className="group flex items-center gap-3 text-[10px] md:text-[12px] font-black uppercase tracking-[0.4em] hover:opacity-50 transition-all cursor-pointer"
          >
            <ChevronLeft size={16} /> Continue Shopping
          </Link>
          <h1 className="text-xl md:text-2xl font-black uppercase tracking-[0.2em]">
            Your Bag ({visibleItems.length})
          </h1>
        </div>

        {visibleItems.length === 0 ? (
          <div className="py-40 text-center border-y border-neutral-100">
            <p className="text-gray-400 uppercase tracking-[0.5em] text-sm mb-8">
              Your bag is currently empty
            </p>
            <Link
              href="/products"
              className="inline-block border-2 border-black px-12 py-4 text-[10px] font-black uppercase tracking-[0.4em] hover:bg-black hover:text-white transition-all"
            >
              Explore Collection
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-16 md:gap-24">
            <div className="xl:col-span-8 space-y-12">
              {visibleItems.map((item) => {
                // Use local quantity if available, otherwise use server quantity
                const displayQuantity =
                  localQuantities[item.cartId] ?? item.quantity;

                return (
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
                          <h3 className="text-lg md:text-xl font-black  tracking-widest mb-2">
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
                          onClick={() => handleRemove(item.cartId)}
                          className="text-gray-300 hover:text-[#be1e2d] transition-colors p-2 cursor-pointer"
                          disabled={pendingRemovals.has(item.cartId)}
                        >
                          {pendingRemovals.has(item.cartId) ? (
                            <div className="w-5 h-5 border-2 border-gray-300 border-t-transparent rounded-full animate-spin" />
                          ) : (
                            <Trash2 size={20} />
                          )}
                        </button>
                      </div>

                      <div className="flex justify-between items-end mt-12 md:mt-0">
                        <div className="flex items-center border border-neutral-200">
                          <button
                            onClick={() =>
                              handleDecrement(item.cartId, item.quantity)
                            }
                            className="p-4 hover:bg-neutral-50 cursor-pointer disabled:opacity-30"
                            disabled={
                              displayQuantity <= 1 ||
                              pendingRemovals.has(item.cartId)
                            }
                          >
                            <Minus size={14} />
                          </button>
                          <span className="w-12 text-center font-bold text-sm tabular-nums">
                            {displayQuantity}
                          </span>
                          <button
                            onClick={() =>
                              handleIncrement(item.cartId, item.quantity)
                            }
                            className="p-4 hover:bg-neutral-50 cursor-pointer disabled:opacity-30"
                            disabled={pendingRemovals.has(item.cartId)}
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
                );
              })}
            </div>

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
                  disabled={visibleItems.length === 0}
                  className="group relative flex items-center justify-center gap-4 w-full bg-black text-white py-8 text-[12px] font-black uppercase tracking-[0.4em] overflow-hidden cursor-pointer disabled:opacity-50"
                >
                  <span className="absolute inset-0 bg-[#be1e2d] translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                  <span className="relative z-10">Checkout Now</span>
                  <ArrowRight size={18} className="relative z-10" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
