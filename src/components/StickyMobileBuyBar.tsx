'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import type { ProductVariant } from '@/lib/types';
import { useCart } from '@/lib/CartContext';

export function StickyMobileBuyBar({
  basePrice,
  compareAtPrice,
  variants,
}: {
  basePrice: number;
  compareAtPrice: number | null;
  variants: ProductVariant[];
}) {
  const router = useRouter();
  const { refresh: refreshCart, openDrawer } = useCart();
  const available = variants.filter((v) => v.stock > 0);
  const [selectedId, setSelectedId] = useState<number | null>(available[0]?.id ?? null);
  const [status, setStatus] = useState<'idle' | 'loading' | 'added'>('idle');
  const onSale = compareAtPrice !== null && compareAtPrice > basePrice;

  useEffect(() => {
    setSelectedId(available[0]?.id ?? null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [variants]);

  async function add() {
    if (!selectedId) return;
    setStatus('loading');
    const res = await fetch('/api/cart/items', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ variantId: selectedId, quantity: 1 }),
    });
    if (res.status === 401) {
      router.push('/compte/connexion?next=produit');
      return;
    }
    if (!res.ok) {
      setStatus('idle');
      return;
    }
    setStatus('added');
    await refreshCart();
    openDrawer();
    router.refresh();
    setTimeout(() => setStatus('idle'), 1500);
  }

  if (variants.length === 0) return null;

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-surface border-t border-foreground/10 px-4 py-3 flex items-center gap-3 shadow-[0_-4px_16px_rgba(0,0,0,0.15)]">
      <span className="shrink-0 text-lg leading-none">
        <span className={onSale ? 'text-gold font-semibold' : 'font-semibold'}>{basePrice.toFixed(2)} €</span>
      </span>

      {available.length === 0 ? (
        <span className="flex-1 text-center text-xs text-foreground/50">Rupture de stock</span>
      ) : (
        <div className="flex gap-1.5 overflow-x-auto flex-1">
          {variants.map((v) => (
            <button
              key={v.id}
              type="button"
              disabled={v.stock === 0}
              onClick={() => setSelectedId(v.id)}
              className={`shrink-0 min-w-[36px] h-9 px-2 text-xs border transition ${
                v.stock === 0
                  ? 'border-foreground/10 text-foreground/25 line-through'
                  : selectedId === v.id
                    ? 'border-gold text-gold'
                    : 'border-foreground/30'
              }`}
            >
              {v.size}
            </button>
          ))}
        </div>
      )}

      <button
        type="button"
        onClick={add}
        disabled={!selectedId || status === 'loading'}
        className="btn-gold shrink-0 px-4 py-2.5 text-xs disabled:opacity-50"
      >
        {status === 'added' ? 'Ajouté ✓' : status === 'loading' ? '…' : 'AJOUTER'}
      </button>
    </div>
  );
}
