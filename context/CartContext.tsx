// // context/CartContext.tsx

// "use client";

// import React, {
//   createContext,
//   useContext,
//   useState,
//   useEffect,
//   useRef,
// } from "react";
// import { Product } from "@/types/Product";

// interface CartItem {
//   cartId: string;
//   product: Product;
//   selectedSize: string;
//   selectedColor: { label: string; hex: string };
//   quantity: number;
// }

// interface CartContextType {
//   cartItems: CartItem[];
//   addToCart: (
//     product: Product,
//     size: string,
//     color: { label: string; hex: string },
//   ) => void;
//   removeFromCart: (cartId: string) => void;
//   updateQuantity: (cartId: string, newQuantity: number) => void;
//   clearCart: () => void; // Add this
// }

// const CartContext = createContext<CartContextType | undefined>(undefined);

// export const CartProvider = ({ children }: { children: React.ReactNode }) => {
//   const [cartItems, setCartItems] = useState<CartItem[]>([]);
//   const isInitialMount = useRef(true);

//   // Load from LocalStorage once on mount
//   useEffect(() => {
//     const savedCart = localStorage.getItem("daima_cart");
//     if (savedCart) {
//       try {
//         const parsed = JSON.parse(savedCart);
//         if (Array.isArray(parsed)) setCartItems(parsed);
//       } catch (e) {
//         console.error("Failed to parse cart", e);
//       }
//     }
//   }, []);

//   // Sync to LocalStorage only AFTER initial load
//   useEffect(() => {
//     if (isInitialMount.current) {
//       isInitialMount.current = false;
//       return;
//     }
//     localStorage.setItem("daima_cart", JSON.stringify(cartItems));
//   }, [cartItems]);

//   const addToCart = (
//     product: Product,
//     size: string,
//     color: { label: string; hex: string },
//   ) => {
//     setCartItems((prev) => {
//       const existingItemIndex = prev.findIndex(
//         (item) =>
//           item.product._id === product._id &&
//           item.selectedSize === size &&
//           item.selectedColor.label === color.label,
//       );

//       if (existingItemIndex > -1) {
//         const newItems = [...prev];
//         newItems[existingItemIndex].quantity += 1;
//         return newItems;
//       }

//       return [
//         ...prev,
//         {
//           cartId: `${product._id}-${size}-${color.label}-${Math.random().toString(36).substr(2, 5)}`,
//           product,
//           selectedSize: size,
//           selectedColor: color,
//           quantity: 1,
//         },
//       ];
//     });
//   };

//   const updateQuantity = (cartId: string, newQuantity: number) => {
//     if (newQuantity < 1) return;
//     setCartItems((prev) =>
//       prev.map((item) =>
//         item.cartId === cartId ? { ...item, quantity: newQuantity } : item,
//       ),
//     );
//   };

//   const removeFromCart = (cartId: string) => {
//     setCartItems((prev) => prev.filter((item) => item.cartId !== cartId));
//   };

//   const clearCart = () => {
//     setCartItems([]);
//     localStorage.removeItem("daima_cart");
//   };

//   return (
//     <CartContext.Provider
//       value={{
//         cartItems,
//         addToCart,
//         removeFromCart,
//         updateQuantity,
//         clearCart, // Add this
//       }}
//     >
//       {children}
//     </CartContext.Provider>
//   );
// };

// export const useCart = () => {
//   const context = useContext(CartContext);
//   if (!context) throw new Error("useCart must be used within CartProvider");
//   return context;
// };

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
  isInitialized: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  const { data: session, status } = useSession();
  const prevSessionRef = useRef<typeof session>(null);

  // Fetch cart from Sanity
  const fetchCart = useCallback(async () => {
    if (status !== "authenticated" || !session?.user?.email) {
      setCartItems([]);
      setIsInitialized(true);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/cart");

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to fetch cart");
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
  }, [session, status]);

  // Fetch cart on mount and when session changes
  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  // Handle logout - clear cart state
  useEffect(() => {
    if (prevSessionRef.current && !session) {
      setCartItems([]);
      setIsInitialized(true);
    }
    prevSessionRef.current = session;
  }, [session]);

  const addToCart = async (
    product: Product,
    size: string,
    color: { label: string; hex: string },
    quantity = 1,
  ) => {
    if (status !== "authenticated") {
      setError("Please log in to add items to cart");
      throw new Error("Please log in to add items to cart");
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/cart", {
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
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to add to cart");
      }

      const data = await response.json();
      setCartItems(data.items);
    } catch (err) {
      console.error("Error adding to cart:", err);
      setError(err instanceof Error ? err.message : "Failed to add to cart");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const removeFromCart = async (cartId: string) => {
    if (status !== "authenticated") return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/cart?cartId=${cartId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to remove from cart");
      }

      const data = await response.json();
      setCartItems(data.items);
    } catch (err) {
      console.error("Error removing from cart:", err);
      setError(
        err instanceof Error ? err.message : "Failed to remove from cart",
      );
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (cartId: string, newQuantity: number) => {
    if (status !== "authenticated") return;
    if (newQuantity < 1) return;

    setLoading(true);
    setError(null);

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
        const data = await response.json();
        throw new Error(data.error || "Failed to update quantity");
      }

      const data = await response.json();
      setCartItems(data.items);
    } catch (err) {
      console.error("Error updating quantity:", err);
      setError(
        err instanceof Error ? err.message : "Failed to update quantity",
      );
    } finally {
      setLoading(false);
    }
  };

  const clearCart = async () => {
    if (status !== "authenticated") return;

    setLoading(true);
    setError(null);

    try {
      // Get all cart items and remove them one by one
      const removePromises = cartItems.map((item) =>
        fetch(`/api/cart?cartId=${item.cartId}`, {
          method: "DELETE",
        }).then((res) => {
          if (!res.ok) throw new Error("Failed to remove item");
          return res.json();
        }),
      );

      await Promise.all(removePromises);
      setCartItems([]);
    } catch (err) {
      console.error("Error clearing cart:", err);
      setError(err instanceof Error ? err.message : "Failed to clear cart");
    } finally {
      setLoading(false);
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
        loading,
        error,
        itemCount,
        isInitialized,
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
