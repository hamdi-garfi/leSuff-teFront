'use client';

import { createContext, useCallback, useContext, useState } from 'react';
import type { Cart } from '@/lib/types';

type CartContextValue = {
  cart: Cart | null;
  drawerOpen: boolean;
  openDrawer: () => void;
  closeDrawer: () => void;
  refresh: () => Promise<void>;
  freeShippingThreshold: number;
};

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({
  children,
  initialCart = null,
  freeShippingThreshold,
}: {
  children: React.ReactNode;
  initialCart?: Cart | null;
  freeShippingThreshold: number;
}) {
  const [cart, setCart] = useState<Cart | null>(initialCart);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const refresh = useCallback(async () => {
    const res = await fetch('/api/cart');
    setCart(res.ok ? await res.json() : null);
  }, []);

  return (
    <CartContext.Provider
      value={{ cart, drawerOpen, openDrawer: () => setDrawerOpen(true), closeDrawer: () => setDrawerOpen(false), refresh, freeShippingThreshold }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return ctx;
}
