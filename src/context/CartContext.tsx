'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { Product, CartItem } from '@/lib/types';

interface CartContextType {
  items: CartItem[];
  itemCount: number;
  subtotal: number;
  shippingAmount: number;
  totalAmount: number;
  freeShippingThreshold: number;
  freeShippingProgress: number;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  addItem: (product: Product, quantity?: number) => { success: boolean; message?: string };
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => { success: boolean; message?: string };
  clearCart: () => void;
  toastMessage: string | null;
  setToastMessage: (msg: string | null) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const LOCAL_STORAGE_CART_KEY = 'herbal_life_cart_v1';
const FREE_SHIPPING_THRESHOLD = 499;
const STANDARD_SHIPPING_FEE = 50;

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Load cart from LocalStorage on mount
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem(LOCAL_STORAGE_CART_KEY);
      if (savedCart) {
        setItems(JSON.parse(savedCart));
      }
    } catch (e) {
      console.error('Failed to load cart from localStorage:', e);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Save cart to LocalStorage whenever items change
  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem(LOCAL_STORAGE_CART_KEY, JSON.stringify(items));
      } catch (e) {
        console.error('Failed to save cart to localStorage:', e);
      }
    }
  }, [items, isLoaded]);

  // Clear toast after 3.5 seconds
  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => {
        setToastMessage(null);
      }, 3500);
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

  const addItem = (product: Product, quantity: number = 1): { success: boolean; message?: string } => {
    if (quantity <= 0) return { success: false, message: 'Invalid quantity' };
    
    // Check product stock
    const availableStock = product.stock ?? 0;
    if (availableStock <= 0) {
      setToastMessage(`"${product.name}" is currently out of stock.`);
      return { success: false, message: 'Product is out of stock' };
    }

    let success = true;
    let message = '';

    setItems((prevItems) => {
      const existingIndex = prevItems.findIndex((item) => item.product.id === product.id);
      if (existingIndex > -1) {
        const currentQty = prevItems[existingIndex].quantity;
        const newQty = currentQty + quantity;

        if (newQty > availableStock) {
          const clampedQty = availableStock;
          const updated = [...prevItems];
          updated[existingIndex] = {
            ...updated[existingIndex],
            quantity: clampedQty,
          };
          message = `Updated to maximum available stock (${availableStock} units).`;
          return updated;
        }

        const updated = [...prevItems];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: newQty,
        };
        message = `Added "${product.name}" to your basket.`;
        return updated;
      } else {
        const initialQty = Math.min(quantity, availableStock);
        message = `Added "${product.name}" to your basket.`;
        return [...prevItems, { product, quantity: initialQty }];
      }
    });

    setToastMessage(message || `Added "${product.name}" to your basket.`);
    return { success, message };
  };

  const removeItem = (productId: string) => {
    setItems((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const updateQuantity = (productId: string, quantity: number): { success: boolean; message?: string } => {
    if (quantity <= 0) {
      removeItem(productId);
      return { success: true };
    }

    const existingItem = items.find((i) => i.product.id === productId);
    const availableStock = existingItem?.product.stock ?? 99;

    if (quantity > availableStock) {
      setToastMessage(`Only ${availableStock} units available in stock.`);
      setItems((prev) =>
        prev.map((item) =>
          item.product.id === productId ? { ...item, quantity: availableStock } : item
        )
      );
      return { success: false, message: 'Maximum stock reached' };
    }

    setItems((prev) =>
      prev.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
    return { success: true };
  };

  const clearCart = () => {
    setItems([]);
  };

  // Calculations
  const itemCount = items.reduce((total, item) => total + item.quantity, 0);
  const subtotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const shippingAmount = subtotal >= FREE_SHIPPING_THRESHOLD || subtotal === 0 ? 0 : STANDARD_SHIPPING_FEE;
  const totalAmount = subtotal + shippingAmount;
  const freeShippingProgress = Math.min(100, Math.round((subtotal / FREE_SHIPPING_THRESHOLD) * 100));

  return (
    <CartContext.Provider
      value={{
        items,
        itemCount,
        subtotal,
        shippingAmount,
        totalAmount,
        freeShippingThreshold: FREE_SHIPPING_THRESHOLD,
        freeShippingProgress,
        isCartOpen,
        setIsCartOpen,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        toastMessage,
        setToastMessage,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
