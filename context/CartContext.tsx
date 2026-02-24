"use client";

import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { Product } from '@/types/Product';

interface CartItem {
  cartId: string;
  product: Product;
  selectedSize: string;
  selectedColor: { label: string; hex: string };
  quantity: number;
}

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (product: Product, size: string, color: { label: string; hex: string }) => void;
  removeFromCart: (cartId: string) => void;
  updateQuantity: (cartId: string, newQuantity: number) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const isInitialMount = useRef(true); // Ref to track the first load

  // Load from LocalStorage once on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('daima_cart');
    if (savedCart) {
      try {
        const parsed = JSON.parse(savedCart);
        if (Array.isArray(parsed)) setCartItems(parsed);
      } catch (e) {
        console.error("Failed to parse cart", e);
      }
    }
  }, []);

  // Sync to LocalStorage only AFTER initial load
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    localStorage.setItem('daima_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (product: Product, size: string, color: { label: string; hex: string }) => {
    setCartItems(prev => {
      const existingItemIndex = prev.findIndex(item =>
        item.product._id === product._id &&
        item.selectedSize === size &&
        item.selectedColor.label === color.label
      );

      if (existingItemIndex > -1) {
        const newItems = [...prev];
        newItems[existingItemIndex].quantity += 1;
        return newItems;
      }

      return [...prev, {
        cartId: `${product._id}-${size}-${color.label}-${Math.random().toString(36).substr(2, 5)}`,
        product,
        selectedSize: size,
        selectedColor: color,
        quantity: 1
      }];
    });
  };

  const updateQuantity = (cartId: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    setCartItems(prev => prev.map(item =>
      item.cartId === cartId ? { ...item, quantity: newQuantity } : item
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