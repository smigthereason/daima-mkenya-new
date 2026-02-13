"use client";
import React, { createContext, useContext, useState,  } from 'react';
import { Product } from '@/types/Product';

interface CartItem {
  cartId: string;
  product: Product;
  size: string;
  color: { name: string; hex: string };
  quantity: number; // Added quantity
}

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (product: Product, size: string, color: { name: string; hex: string }) => void;
  removeFromCart: (cartId: string) => void;
  updateQuantity: (cartId: string, delta: number) => void; // For the counter
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  const addToCart = (product: Product, size: string, color: { name: string; hex: string }) => {
    setCartItems(prev => {
      const existingItemIndex = prev.findIndex(item => 
        item.product.id === product.id && 
        item.size === size && 
        item.color.name === color.name
      );

      if (existingItemIndex > -1) {
        const newItems = [...prev];
        newItems[existingItemIndex].quantity += 1;
        return newItems;
      }

      return [...prev, {
        cartId: Math.random().toString(36).substr(2, 9),
        product,
        size,
        color,
        quantity: 1
      }];
    });
  };

  const updateQuantity = (cartId: string, delta: number) => {
    setCartItems(prev => prev.map(item => 
      item.cartId === cartId 
        ? { ...item, quantity: Math.max(1, item.quantity + delta) } 
        : item
    ));
  };

  const removeFromCart = (cartId: string) => {
    setCartItems(prev => prev.filter(item => item.cartId !== cartId));
  };

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, updateQuantity }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within CartProvider");
  return context;
};