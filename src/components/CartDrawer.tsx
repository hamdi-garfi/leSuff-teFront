'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { colorToHex } from '@/lib/colors';
import { useCart } from '@/lib/CartContext';
import { CartVariantPicker } from '@/components/CartVariantPicker';

export function CartDrawer() {
  const router = useRouter();
  const { cart, drawerOpen, closeDrawer, refresh, freeShippingThreshold: FREE_SHIPPING_THRESHOLD } = useCart();

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeDrawer();
    };
    if (drawerOpen) {
      document.addEventListener('keydown', onKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = '';
    };
  }, [drawerOpen, closeDrawer]);

  if (!drawerOpen) return null;

  async function updateQuantity(itemId: number, quantity: number) {
    const res = await fetch(`/api/cart/items/${itemId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ quantity }),
    });
    if (res.ok) {
      await refresh();
      router.refresh();
    }
  }

  async function removeItem(itemId: number) {
    const res = await fetch(`/api/cart/items/${itemId}`, { method: 'DELETE' });
    if (res.ok) {
      await refresh();
      router.refresh();
    }
  }

  async function updateVariant(itemId: number, variantId: number) {
    const res = await fetch(`/api/cart/items/${itemId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ variantId }),
    });
    if (res.ok) {
      await refresh();
      router.refresh();
    }
  }

  const total = cart?.total ?? 0;
  const freeShippingRemaining = Math.max(0, FREE_SHIPPING_THRESHOLD - total);
  const freeShippingPercent = Math.min(100, (total / FREE_SHIPPING_THRESHOLD) * 100);

  return (
    <div className="fixed inset-0 z-[110] flex justify-end" role="dialog" aria-modal="true">
      <div className="absolute inset-0 bg-black/60" onClick={closeDrawer} />
      <div className="relative bg-surface w-full max-w-md h-full flex flex-col shadow-2xl">
        <div className="flex items-center justify-between px-6 py-5 border-b border-foreground/10">
          <h2 className="text-sm tracking-widest2 uppercase">
            Panier {cart && cart.items.length > 0 ? `(${cart.items.length})` : ''}
          </h2>
          <button type="button" onClick={closeDrawer} aria-label="Fermer" className="text-foreground/50 hover:text-gold transition text-xl">
            ×
          </button>
        </div>

        {!cart || cart.items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-4 px-6 text-center">
            <p className="text-foreground/50">Votre panier est vide.</p>
            <Link href="/collection" onClick={closeDrawer} className="btn-gold">
              DÉCOUVRIR LA COLLECTION
            </Link>
          </div>
        ) : (
          <>
            <div className="px-6 py-4 border-b border-foreground/10">
              <p className="text-xs mb-2">
                {freeShippingRemaining > 0 ? (
                  <>
                    Plus que <span className="text-gold font-semibold">{freeShippingRemaining.toFixed(2)} €</span> pour la livraison offerte
                  </>
                ) : (
                  <span className="text-gold font-semibold">✓ Livraison offerte débloquée !</span>
                )}
              </p>
              <div className="h-1 bg-foreground/10 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-gold-dark to-gold-light transition-all duration-500"
                  style={{ width: `${freeShippingPercent}%` }}
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto divide-y divide-foreground/10 px-6">
              {cart.items.map((item) => (
                <div key={item.id} className="flex gap-3 py-5">
                  <div
                    className="w-14 h-16 shrink-0 flex items-center justify-center"
                    style={{ background: `linear-gradient(155deg, ${colorToHex(item.variant.color)} 0%, #0a0a0a 130%)` }}
                  >
                    <span className="font-serif text-lg text-foreground/20">{item.product.name.charAt(0)}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <Link href={`/produit/${item.product.slug}`} onClick={closeDrawer} className="text-sm hover:text-gold transition line-clamp-1">
                      {item.product.name}
                    </Link>
                    <div className="mt-0.5">
                      <CartVariantPicker
                        item={item}
                        onChange={(variantId) => updateVariant(item.id, variantId)}
                        className="bg-transparent border border-foreground/20 text-[11px] px-1 py-0.5 outline-none focus:border-gold"
                      />
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      <div className="flex items-center border border-foreground/30">
                        <button type="button" className="w-6 h-6 text-xs hover:text-gold" onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}>
                          −
                        </button>
                        <span className="w-6 text-center text-xs">{item.quantity}</span>
                        <button
                          type="button"
                          className="w-6 h-6 text-xs hover:text-gold"
                          onClick={() => updateQuantity(item.id, Math.min(item.variant.stock, item.quantity + 1))}
                        >
                          +
                        </button>
                      </div>
                      <button type="button" className="text-xs text-foreground/40 hover:text-red-400" onClick={() => removeItem(item.id)}>
                        Retirer
                      </button>
                    </div>
                  </div>
                  <p className="text-sm shrink-0">{item.lineTotal.toFixed(2)} €</p>
                </div>
              ))}
            </div>

            <div className="px-6 py-5 border-t border-foreground/10">
              <div className="flex justify-between text-sm mb-4">
                <span>Sous-total</span>
                <span className="font-semibold">{total.toFixed(2)} €</span>
              </div>
              <Link href="/panier" onClick={closeDrawer} className="btn-gold w-full block text-center">
                VOIR LE PANIER
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
