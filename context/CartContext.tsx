"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
} from "react";
import { useSession } from "next-auth/react";
import { Product } from "@/types/Product";

export interface CartItem {
  cartId: string;
  product: Product;
  selectedSize: string;
  selectedColor: { label: string; hex: string };
  quantity: number;
}

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (
    product: Product,
    size: string,
    color: { label: string; hex: string },
    quantity?: number,
  ) => Promise<void>;
  removeFromCart: (cartId: string) => Promise<void>;
  updateQuantity: (cartId: string, newQuantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  loading: boolean;
  error: string | null;
  itemCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const pendingRequests = useRef<Map<string, Promise<any>>>(new Map());
  const isClearing = useRef(false);
  const lastUpdateTime = useRef<Map<string, number>>(new Map());
  // Fix: Initialize with undefined
  const updateTimeout = useRef<ReturnType<typeof setTimeout> | undefined>(
    undefined,
  );

  const { data: session, status } = useSession();
  const prevSessionRef = useRef<typeof session>(null);

  // Debounced fetch to prevent multiple rapid updates
  const debouncedFetchCart = useCallback(() => {
    if (updateTimeout.current) {
      clearTimeout(updateTimeout.current);
    }

    updateTimeout.current = setTimeout(() => {
      fetchCart();
    }, 100);
  }, []);

  const fetchCart = useCallback(async () => {
    if (status !== "authenticated" || !session?.user?.email) {
      setCartItems([]);
      setIsInitialized(true);
      return;
    }

    // Don't show loading for initial fetch if we already have items
    if (cartItems.length === 0) {
      setLoading(true);
    }

    try {
      const response = await fetch("/api/cart");

      if (!response.ok) {
        throw new Error("Failed to fetch cart");
      }

      const data = await response.json();
      setCartItems(data.items || []);
    } catch (err) {
      console.error("Error fetching cart:", err);
      setError(err instanceof Error ? err.message : "Failed to fetch cart");
    } finally {
      setLoading(false);
      setIsInitialized(true);
    }
  }, [session, status, cartItems.length]);

  // Fetch cart on mount and when session changes
  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  // Handle logout - clear cart state immediately
  useEffect(() => {
    if (prevSessionRef.current && !session) {
      setCartItems([]); // Clear immediately on logout
    }
    prevSessionRef.current = session;
  }, [session]);

  // Helper to find duplicate item
  const findExistingItem = (
    items: CartItem[],
    productId: string,
    size: string,
    colorLabel: string,
  ) => {
    return items.find(
      (item) =>
        item.product._id === productId &&
        item.selectedSize === size &&
        item.selectedColor.label === colorLabel,
    );
  };

  // Merge server items with current items to prevent race conditions
  const mergeCartItems = (
    serverItems: CartItem[],
    currentItems: CartItem[],
  ) => {
    // Create a map of current items for quick lookup
    const currentMap = new Map(currentItems.map((item) => [item.cartId, item]));

    // Start with server items
    const merged = [...serverItems];

    // Add any items that exist in current but not in server (optimistic updates)
    currentItems.forEach((currentItem) => {
      const existsInServer = serverItems.some(
        (serverItem) =>
          serverItem.product._id === currentItem.product._id &&
          serverItem.selectedSize === currentItem.selectedSize &&
          serverItem.selectedColor.label === currentItem.selectedColor.label,
      );

      if (!existsInServer && currentItem.cartId.startsWith("temp-")) {
        // This is a temporary item that hasn't been confirmed by server yet
        merged.push(currentItem);
      }
    });

    return merged;
  };

  const addToCart = async (
    product: Product,
    size: string,
    color: { label: string; hex: string },
    quantity = 1,
  ) => {
    if (status !== "authenticated") {
      setError("Please log in to add items to cart");
      return;
    }

    // Create a unique key for this request
    const requestKey = `${product._id}-${size}-${color.label}`;
    const now = Date.now();
    const lastUpdate = lastUpdateTime.current.get(requestKey) || 0;

    // Prevent rapid successive updates (debounce at 500ms)
    if (now - lastUpdate < 500) {
      return;
    }
    lastUpdateTime.current.set(requestKey, now);

    // Optimistic update
    setCartItems((prevItems) => {
      const existingItem = findExistingItem(
        prevItems,
        product._id,
        size,
        color.label,
      );

      if (existingItem) {
        // Update existing item quantity
        return prevItems.map((item) =>
          item.cartId === existingItem.cartId
            ? { ...item, quantity: item.quantity + quantity }
            : item,
        );
      } else {
        // Create new item with temporary cartId
        const tempCartId = `temp-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
        const newItem: CartItem = {
          cartId: tempCartId,
          product,
          selectedSize: size,
          selectedColor: color,
          quantity,
        };
        return [...prevItems, newItem];
      }
    });

    try {
      // Check if this exact item is already being added
      if (pendingRequests.current.has(requestKey)) {
        await pendingRequests.current.get(requestKey);
        return;
      }

      const request = fetch("/api/cart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          product: {
            _id: product._id,
            name: product.name,
            price: product.price,
            images: product.images,
          },
          quantity,
          selectedSize: size,
          selectedColor: color,
        }),
      })
        .then(async (response) => {
          if (!response.ok) {
            throw new Error("Failed to add to cart");
          }
          const data = await response.json();

          // Merge server data with current state instead of replacing
          setCartItems((currentItems) => {
            // Remove temporary items that match the server items
            const serverItemIds = new Set(
              data.items.map((item: CartItem) => item.cartId),
            );
            const filteredCurrent = currentItems.filter(
              (item) =>
                !item.cartId.startsWith("temp-") ||
                !serverItemIds.has(item.cartId),
            );

            // Combine server items with remaining current items
            return [...filteredCurrent, ...data.items];
          });

          return data;
        })
        .catch((err) => {
          // Revert optimistic update on error
          setCartItems((prevItems) => {
            const existingItem = findExistingItem(
              prevItems,
              product._id,
              size,
              color.label,
            );
            if (existingItem && !existingItem.cartId.startsWith("temp-")) {
              // Revert quantity change for existing item
              return prevItems.map((item) =>
                item.cartId === existingItem.cartId
                  ? { ...item, quantity: item.quantity - quantity }
                  : item,
              );
            } else {
              // Remove the temporary item
              return prevItems.filter(
                (item) => !item.cartId.startsWith("temp-"),
              );
            }
          });
          throw err;
        });

      pendingRequests.current.set(requestKey, request);
      await request;
      pendingRequests.current.delete(requestKey);
    } catch (err) {
      console.error("Error adding to cart:", err);
      setError(err instanceof Error ? err.message : "Failed to add to cart");
    }
  };

  const removeFromCart = async (cartId: string) => {
    // Store item for potential revert
    let removedItem: CartItem | undefined;

    // Optimistic update
    setCartItems((prevItems) => {
      removedItem = prevItems.find((item) => item.cartId === cartId);
      return prevItems.filter((item) => item.cartId !== cartId);
    });

    try {
      const response = await fetch(`/api/cart?cartId=${cartId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to remove from cart");
      }

      const data = await response.json();

      // Merge server data with current state
      setCartItems((currentItems) => {
        // Keep items that aren't in the server response (optimistic updates)
        const serverItemIds = new Set(
          data.items.map((item: CartItem) => item.cartId),
        );
        const optimisticItems = currentItems.filter(
          (item) => !serverItemIds.has(item.cartId) && item.cartId !== cartId,
        );

        return [...optimisticItems, ...data.items];
      });
    } catch (err) {
      // Revert optimistic update on error
      if (removedItem) {
        setCartItems((prevItems) => [...prevItems, removedItem!]);
      }
      console.error("Error removing from cart:", err);
      setError(
        err instanceof Error ? err.message : "Failed to remove from cart",
      );
    }
  };

  const updateQuantity = async (cartId: string, newQuantity: number) => {
    if (newQuantity < 1) return;

    // Prevent rapid successive updates for the same item
    const now = Date.now();
    const lastUpdate = lastUpdateTime.current.get(cartId) || 0;

    // Debounce at 300ms
    if (now - lastUpdate < 300) {
      return;
    }
    lastUpdateTime.current.set(cartId, now);

    // Store original item for potential revert
    let originalItem: CartItem | undefined;

    // Optimistic update
    setCartItems((prevItems) => {
      originalItem = prevItems.find((item) => item.cartId === cartId);
      return prevItems.map((item) =>
        item.cartId === cartId ? { ...item, quantity: newQuantity } : item,
      );
    });

    try {
      const response = await fetch("/api/cart", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          cartId,
          quantity: newQuantity,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update quantity");
      }

      const data = await response.json();

      // Merge server data with current state
      setCartItems((currentItems) => {
        // Keep items that aren't in the server response (optimistic updates)
        const serverItemIds = new Set(
          data.items.map((item: CartItem) => item.cartId),
        );
        const optimisticItems = currentItems.filter(
          (item) => !serverItemIds.has(item.cartId) && item.cartId !== cartId,
        );

        return [...optimisticItems, ...data.items];
      });
    } catch (err) {
      // Revert optimistic update on error
      if (originalItem) {
        setCartItems((prevItems) =>
          prevItems.map((item) =>
            item.cartId === cartId ? { ...originalItem! } : item,
          ),
        );
      }
      console.error("Error updating quantity:", err);
      setError(
        err instanceof Error ? err.message : "Failed to update quantity",
      );
    }
  };

  const clearCart = async () => {
    // Prevent multiple clear operations
    if (isClearing.current) return;

    // If cart is already empty, just return
    if (cartItems.length === 0) return;

    isClearing.current = true;

    // Store current items for potential revert
    const currentItems = [...cartItems];

    // Optimistic update
    setCartItems([]);

    try {
      const removePromises = currentItems.map((item) =>
        fetch(`/api/cart?cartId=${item.cartId}`, {
          method: "DELETE",
        }).then((res) => {
          if (!res.ok) throw new Error("Failed to remove item");
          return res.json();
        }),
      );

      await Promise.all(removePromises);
    } catch (err) {
      // Revert optimistic update on error
      setCartItems(currentItems);
      console.error("Error clearing cart:", err);
      setError(err instanceof Error ? err.message : "Failed to clear cart");
    } finally {
      isClearing.current = false;
    }
  };

  const itemCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        loading: loading && !isInitialized, // Only show loading on initial fetch
        error,
        itemCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within CartProvider");
  }
  return context;
};
