'use client';

import { useCart } from '@/lib/CartContext';

export function CartHeaderButton() {
  const { cart, openDrawer } = useCart();
  const count = cart?.items.reduce((sum, item) => sum + item.quantity, 0) ?? 0;

  return (
    <button type="button" onClick={openDrawer} className="relative hover:text-gold transition" aria-label="Panier">
      <CartIcon />
      {count > 0 && (
        <span className="absolute -top-2 -right-2 bg-gold text-ink text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
          {count}
        </span>
      )}
    </button>
  );
}

function CartIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M6 6h15l-1.5 9h-12z" />
      <path d="M6 6 5 3H2" />
      <circle cx="9.5" cy="20" r="1" fill="currentColor" />
      <circle cx="17.5" cy="20" r="1" fill="currentColor" />
    </svg>
  );
}
