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
  const isClearing = useRef(false); // Add this to prevent multiple clear operations

  const { data: session, status } = useSession();
  const prevSessionRef = useRef<typeof session>(null);

  // Fetch cart from Sanity only once when user logs in
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
      const requestKey = `${product._id}-${size}-${color.label}`;
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

          // Update with server data to get correct cartIds
          setCartItems(data.items);
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
            if (existingItem) {
              // Revert quantity change
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
      // Update with server data to ensure consistency
      setCartItems(data.items);
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

    // Store original quantity for potential revert
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
      // Update with server data to ensure consistency
      setCartItems(data.items);
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
