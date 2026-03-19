"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';

export interface CartItem {
  id: string;
  nom: string;
  prix: number;
  quantite: number;
  nuitees: number; // Durée du séjour
  categorie: string;
  disponibilite: number; // Stock max
}


interface CartContextType {
  cart: CartItem[];
  addToCart: (room: any, nuitees?: number) => void;
  removeFromCart: (roomId: string) => void;
  updateQuantity: (roomId: string, quantite: number) => void;
  updateNights: (roomId: string, nuitees: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('afcd_cart');
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (e) {
        console.error("Failed to parse cart", e);
      }
    }
  }, []);

  // Save cart to localStorage on change
  useEffect(() => {
    localStorage.setItem('afcd_cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (room: any, nuitees: number = 1) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === room.id);
      if (existing) {
        // Enforce availability limit
        if (existing.quantite >= room.disponibilite) return prev;

        return prev.map(item => 
          item.id === room.id ? { ...item, quantite: item.quantite + 1, nuitees: Math.max(item.nuitees, nuitees) } : item
        );
      }
      return [...prev, { 
        id: room.id, 
        nom: room.nom, 
        prix: room.prix, 
        quantite: 1, 
        nuitees: nuitees,
        categorie: room.categorie,
        disponibilite: room.disponibilite
      }];
    });
  };


  const removeFromCart = (roomId: string) => {
    setCart(prev => prev.filter(item => item.id !== roomId));
  };

  const updateQuantity = (roomId: string, quantite: number) => {
    if (quantite <= 0) {
      removeFromCart(roomId);
      return;
    }
    setCart(prev => prev.map(item => {
      if (item.id === roomId) {
        const newQty = Math.min(Math.max(0, quantite), item.disponibilite);
        return { ...item, quantite: newQty };
      }
      return item;
    }));

  };

  const updateNights = (roomId: string, nuitees: number) => {
    if (nuitees <= 0) return;
    setCart(prev => prev.map(item => 
      item.id === roomId ? { ...item, nuitees } : item
    ));
  };

  const clearCart = () => setCart([]);

  const totalItems = cart.reduce((acc, item) => acc + item.quantite, 0);
  const totalPrice = cart.reduce((acc, item) => acc + (item.prix * item.quantite * item.nuitees), 0);

  return (
    <CartContext.Provider value={{ 
      cart, 
      addToCart, 
      removeFromCart, 
      updateQuantity, 
      updateNights,
      clearCart, 
      totalItems, 
      totalPrice 
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
