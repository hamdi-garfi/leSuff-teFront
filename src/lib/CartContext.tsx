'use client';

import { createContext, useCallback, useContext, useState } from 'react';
import type { Cart } from '@/lib/types';

type CartContextValue = {
  cart: Cart | null;
  drawerOpen: boolean;
  openDrawer: () => void;
  closeDrawer: () => void;
  refresh: () => Promise<void>;
};

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({
  children,
  isAuthenticated,
  initialCart = null,
}: {
  children: React.ReactNode;
  isAuthenticated: boolean;
  initialCart?: Cart | null;
}) {
  const [cart, setCart] = useState<Cart | null>(initialCart);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const refresh = useCallback(async () => {
    if (!isAuthenticated) {
      setCart(null);
      return;
    }
    const res = await fetch('/api/cart');
    setCart(res.ok ? await res.json() : null);
  }, [isAuthenticated]);

  return (
    <CartContext.Provider
      value={{ cart, drawerOpen, openDrawer: () => setDrawerOpen(true), closeDrawer: () => setDrawerOpen(false), refresh }}
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
