'use client';

import { createContext, useCallback, useContext, useEffect, useState } from 'react';

type WishlistContextValue = {
  ids: Set<number>;
  ready: boolean;
  isAuthenticated: boolean;
  isWishlisted: (productId: number) => boolean;
  toggle: (productId: number) => Promise<void>;
};

const WishlistContext = createContext<WishlistContextValue | null>(null);

export function WishlistProvider({ children, isAuthenticated }: { children: React.ReactNode; isAuthenticated: boolean }) {
  const [ids, setIds] = useState<Set<number>>(new Set());
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      setReady(true);
      return;
    }
    fetch('/api/wishlist')
      .then((res) => (res.ok ? res.json() : []))
      .then((items: { productId: number }[]) => setIds(new Set(items.map((i) => i.productId))))
      .catch(() => setIds(new Set()))
      .finally(() => setReady(true));
  }, [isAuthenticated]);

  const toggle = useCallback(
    async (productId: number) => {
      const wasWishlisted = ids.has(productId);
      setIds((prev) => {
        const next = new Set(prev);
        if (wasWishlisted) next.delete(productId);
        else next.add(productId);
        return next;
      });

      if (wasWishlisted) {
        await fetch(`/api/wishlist/${productId}`, { method: 'DELETE' });
      } else {
        await fetch('/api/wishlist', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ productId }),
        });
      }
    },
    [ids],
  );

  const isWishlisted = useCallback((productId: number) => ids.has(productId), [ids]);

  return (
    <WishlistContext.Provider value={{ ids, ready, isAuthenticated, isWishlisted, toggle }}>{children}</WishlistContext.Provider>
  );
}

export function useWishlist(): WishlistContextValue {
  const ctx = useContext(WishlistContext);
  if (!ctx) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return ctx;
}
