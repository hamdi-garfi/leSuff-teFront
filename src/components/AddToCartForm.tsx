'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import type { ProductVariant } from '@/lib/types';

export function AddToCartForm({ variants }: { variants: ProductVariant[] }) {
  const router = useRouter();
  const availableVariants = variants.filter((v) => v.stock > 0);
  const [selectedId, setSelectedId] = useState<number | null>(availableVariants[0]?.id ?? null);
  const [quantity, setQuantity] = useState(1);
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState<string | null>(null);

  const selectedVariant = variants.find((v) => v.id === selectedId) ?? null;

  async function handleAddToCart() {
    if (!selectedVariant) {
      return;
    }
    setStatus('loading');
    setMessage(null);

    const res = await fetch('/api/cart/items', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ variantId: selectedVariant.id, quantity }),
    });

    if (res.status === 401) {
      router.push('/compte/connexion?next=panier');
      return;
    }

    const data = await res.json();

    if (!res.ok) {
      setStatus('error');
      setMessage(data.error ?? 'Une erreur est survenue.');
      return;
    }

    setStatus('success');
    setMessage('Ajouté au panier.');
    router.refresh();
  }

  if (variants.every((v) => v.stock === 0)) {
    return <p className="text-white/50 text-sm">Rupture de stock sur toutes les tailles.</p>;
  }

  return (
    <div>
      <div className="mb-6">
        <span className="text-xs tracking-widest2 text-white/60 block mb-2">TAILLE</span>
        <div className="flex flex-wrap gap-2">
          {variants.map((variant) => (
            <button
              key={variant.id}
              type="button"
              disabled={variant.stock === 0}
              onClick={() => setSelectedId(variant.id)}
              className={`min-w-[44px] h-11 px-3 border text-sm transition ${
                selectedId === variant.id
                  ? 'border-gold text-gold'
                  : variant.stock === 0
                    ? 'border-white/10 text-white/25 line-through cursor-not-allowed'
                    : 'border-white/30 text-white/80 hover:border-white/60'
              }`}
            >
              {variant.size}
            </button>
          ))}
        </div>
      </div>

      <div className="mb-6 flex items-center gap-3">
        <span className="text-xs tracking-widest2 text-white/60">QUANTITÉ</span>
        <div className="flex items-center border border-white/30">
          <button
            type="button"
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            className="w-9 h-9 hover:text-gold"
          >
            −
          </button>
          <span className="w-10 text-center">{quantity}</span>
          <button
            type="button"
            onClick={() => setQuantity((q) => (selectedVariant ? Math.min(selectedVariant.stock, q + 1) : q + 1))}
            className="w-9 h-9 hover:text-gold"
          >
            +
          </button>
        </div>
        {selectedVariant && selectedVariant.stock <= 5 && (
          <span className="text-xs text-gold">Plus que {selectedVariant.stock} en stock</span>
        )}
      </div>

      <button
        type="button"
        onClick={handleAddToCart}
        disabled={!selectedVariant || status === 'loading'}
        className="btn-gold w-full md:w-auto disabled:opacity-50"
      >
        {status === 'loading' ? 'Ajout…' : 'AJOUTER AU PANIER'}
      </button>

      {message && (
        <p className={`mt-3 text-sm ${status === 'error' ? 'text-red-400' : 'text-green-400'}`}>{message}</p>
      )}
    </div>
  );
}
