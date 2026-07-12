'use client';

import { useMemo, useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import type { Address, Cart, ShippingZone } from '@/lib/types';
import { colorToHex } from '@/lib/colors';
import { FREE_SHIPPING_THRESHOLD } from '@/lib/constants';
import { useCart } from '@/lib/CartContext';
import { CartVariantPicker } from '@/components/CartVariantPicker';

export function CartClient({
  initialCart,
  shippingZones,
  addresses,
}: {
  initialCart: Cart | null;
  shippingZones: ShippingZone[];
  addresses: Address[];
}) {
  const router = useRouter();
  const { refresh: refreshCartContext } = useCart();
  const [cart, setCart] = useState(initialCart);
  const [isPending, startTransition] = useTransition();
  const [checkoutError, setCheckoutError] = useState<string | null>(null);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [couponCode, setCouponCode] = useState('');
  const [giftCardCode, setGiftCardCode] = useState('');
  const [showGiftCard, setShowGiftCard] = useState(false);
  const [country, setCountry] = useState('France');
  const [showCountryPicker, setShowCountryPicker] = useState(false);
  const [addressId, setAddressId] = useState<number | null>(addresses[0]?.id ?? null);
  const [giftWrap, setGiftWrap] = useState(false);
  const [giftMessage, setGiftMessage] = useState('');
  const [hidePriceOnSlip, setHidePriceOnSlip] = useState(false);

  const selectedZone = useMemo(() => shippingZones.find((z) => z.country === country) ?? null, [shippingZones, country]);
  const shippingCost = !selectedZone ? null : cart && cart.total >= FREE_SHIPPING_THRESHOLD ? 0 : selectedZone.price;

  async function updateQuantity(itemId: number, quantity: number) {
    const res = await fetch(`/api/cart/items/${itemId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ quantity }),
    });
    if (res.ok) {
      setCart(await res.json());
      refreshCartContext();
      startTransition(() => router.refresh());
    }
  }

  async function updateVariant(itemId: number, variantId: number) {
    const res = await fetch(`/api/cart/items/${itemId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ variantId }),
    });
    if (res.ok) {
      setCart(await res.json());
      refreshCartContext();
      startTransition(() => router.refresh());
    }
  }

  async function removeItem(itemId: number) {
    const res = await fetch(`/api/cart/items/${itemId}`, { method: 'DELETE' });
    if (res.ok) {
      setCart(await res.json());
      refreshCartContext();
      startTransition(() => router.refresh());
    }
  }

  async function handleCheckout() {
    if (!country) {
      setCheckoutError('Choisis un pays de livraison.');
      return;
    }

    setCheckoutLoading(true);
    setCheckoutError(null);

    const res = await fetch('/api/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        country,
        ...(couponCode ? { couponCode } : {}),
        ...(giftCardCode ? { giftCardCode } : {}),
        ...(addressId ? { addressId } : {}),
        ...(giftWrap ? { giftWrap: true, giftMessage, hidePriceOnSlip } : {}),
      }),
    });
    const data = await res.json();

    if (res.status === 401) {
      router.push('/compte/connexion?next=panier');
      return;
    }

    if (!res.ok) {
      setCheckoutError(data.error ?? 'Le paiement est momentanément indisponible.');
      setCheckoutLoading(false);
      return;
    }

    const extraParams =
      (data.discount > 0 ? `&discount=${data.discount}` : '') +
      (data.giftCardAmountUsed > 0 ? `&giftCard=${data.giftCardAmountUsed}` : '');

    if (data.clientSecret) {
      router.push(
        `/commande/paiement?client_secret=${encodeURIComponent(data.clientSecret)}&number=${encodeURIComponent(data.number)}${extraParams}`,
      );
      return;
    }

    router.push(`/commande/confirmation?number=${encodeURIComponent(data.number)}${extraParams}`);
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="text-center py-24">
        <p className="text-foreground/50 mb-6">Votre panier est vide.</p>
        <Link href="/collection" className="btn-gold">
          DÉCOUVRIR LA COLLECTION
        </Link>
      </div>
    );
  }

  const freeShippingRemaining = Math.max(0, FREE_SHIPPING_THRESHOLD - cart.total);
  const freeShippingPercent = Math.min(100, (cart.total / FREE_SHIPPING_THRESHOLD) * 100);

  return (
    <div>
      <div className="mb-10 border border-foreground/10 p-5">
        <p className="text-sm mb-3">
          {freeShippingRemaining > 0 ? (
            <>
              Plus que <span className="text-gold font-semibold">{freeShippingRemaining.toFixed(2)} €</span> d&apos;achat
              pour la livraison offerte
            </>
          ) : (
            <span className="text-gold font-semibold">✓ Livraison offerte débloquée !</span>
          )}
        </p>
        <div className="h-1.5 bg-foreground/10 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-gold-dark to-gold-light transition-all duration-500"
            style={{ width: `${freeShippingPercent}%` }}
          />
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-12">
        <div className="md:col-span-2 divide-y divide-foreground/10">
          {cart.items.map((item) => (
            <div key={item.id} className="flex gap-4 py-6" style={{ opacity: isPending ? 0.6 : 1 }}>
              <div
              className="w-20 h-24 shrink-0 flex items-center justify-center"
              style={{ background: `linear-gradient(155deg, ${colorToHex(item.variant.color)} 0%, #0a0a0a 130%)` }}
            >
              <span className="font-serif text-2xl text-foreground/20">{item.product.name.charAt(0)}</span>
            </div>
            <div className="flex-1">
              <Link href={`/produit/${item.product.slug}`} className="text-sm hover:text-gold transition">
                {item.product.name}
              </Link>
              <div className="mt-1">
                <CartVariantPicker item={item} onChange={(variantId) => updateVariant(item.id, variantId)} />
              </div>
              <p className="text-sm mt-2">{item.unitPrice.toFixed(2)} €</p>

              <div className="flex items-center gap-3 mt-3">
                <div className="flex items-center border border-foreground/30">
                  <button
                    type="button"
                    className="w-7 h-7 hover:text-gold"
                    onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                  >
                    −
                  </button>
                  <span className="w-8 text-center text-sm">{item.quantity}</span>
                  <button
                    type="button"
                    className="w-7 h-7 hover:text-gold"
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
            <p className="text-sm">{item.lineTotal.toFixed(2)} €</p>
          </div>
        ))}
      </div>

      <div className="border border-foreground/10 p-6 h-fit">
        <h2 className="text-xs tracking-widest2 text-foreground/60 mb-4">RÉSUMÉ</h2>
        <div className="flex justify-between text-sm mb-2">
          <span>Sous-total</span>
          <span>{cart.total.toFixed(2)} €</span>
        </div>

        <div className="flex items-center justify-between mb-4">
          <div>
            <label className="text-xs tracking-widest2 text-foreground/60 block mb-1">PAYS DE LIVRAISON</label>
            {!showCountryPicker && <p className="text-sm">{country || 'Choisir un pays…'}</p>}
          </div>
          {!showCountryPicker && (
            <button
              type="button"
              onClick={() => setShowCountryPicker(true)}
              className="text-xs text-foreground/50 hover:text-gold transition shrink-0"
            >
              Changer
            </button>
          )}
        </div>
        {showCountryPicker && (
          <div className="flex items-center gap-2 mb-4">
            <select
              value={country}
              onChange={(e) => {
                setCountry(e.target.value);
                setShowCountryPicker(false);
              }}
              autoFocus
              className="flex-1 bg-surface2 border border-foreground/20 px-3 py-2 text-sm outline-none focus:border-gold"
            >
              <option value="">Choisir un pays…</option>
              {shippingZones.map((zone) => (
                <option key={zone.id} value={zone.country}>
                  {zone.country}
                </option>
              ))}
            </select>
            <button type="button" onClick={() => setShowCountryPicker(false)} className="text-xs text-foreground/50 hover:text-gold transition shrink-0">
              Annuler
            </button>
          </div>
        )}

        {addresses.length > 0 ? (
          <div className="mb-4">
            <label className="text-xs tracking-widest2 text-foreground/60 block mb-2">ADRESSE DE LIVRAISON</label>
            <select
              value={addressId ?? ''}
              onChange={(e) => setAddressId(e.target.value ? Number(e.target.value) : null)}
              className="w-full bg-surface2 border border-foreground/20 px-3 py-2 text-sm outline-none focus:border-gold"
            >
              {addresses.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.street}, {a.postalCode} {a.city}
                </option>
              ))}
            </select>
          </div>
        ) : (
          <p className="text-xs text-foreground/50 mb-4">
            Aucune adresse enregistrée.{' '}
            <Link href="/compte/adresses" className="text-gold hover:underline">
              En ajouter une
            </Link>
          </p>
        )}

        <div className="flex justify-between text-sm mb-4 text-foreground/50">
          <span>Livraison{selectedZone && cart.total < FREE_SHIPPING_THRESHOLD ? ` (${selectedZone.estimatedDaysMin}–${selectedZone.estimatedDaysMax}j)` : ''}</span>
          <span>
            {shippingCost === null
              ? cart.total >= FREE_SHIPPING_THRESHOLD
                ? 'Offerte'
                : 'Choisir un pays'
              : shippingCost === 0
                ? 'Offerte'
                : `${shippingCost.toFixed(2)} €`}
          </span>
        </div>
        <div className="flex justify-between text-base border-t border-foreground/10 pt-4 mb-6">
          <span>Total</span>
          <span>{(cart.total + (shippingCost ?? 0)).toFixed(2)} €</span>
        </div>

        <label className="text-xs tracking-widest2 text-foreground/60 block mb-2">CODE PROMO</label>
        <input
          type="text"
          value={couponCode}
          onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
          placeholder="BIENVENUE10"
          className="w-full bg-surface2 border border-foreground/20 px-3 py-2 text-sm outline-none focus:border-gold mb-4"
        />

        {showGiftCard ? (
          <>
            <label className="text-xs tracking-widest2 text-foreground/60 block mb-2">CARTE CADEAU</label>
            <input
              type="text"
              value={giftCardCode}
              onChange={(e) => setGiftCardCode(e.target.value.toUpperCase())}
              placeholder="XXXX-XXXX-XXXX"
              autoFocus
              className="w-full bg-surface2 border border-foreground/20 px-3 py-2 text-sm outline-none focus:border-gold mb-4"
            />
          </>
        ) : (
          <button
            type="button"
            onClick={() => setShowGiftCard(true)}
            className="text-xs text-foreground/50 hover:text-gold transition mb-4 block"
          >
            + J&apos;ai une carte cadeau
          </button>
        )}

        <label className="flex items-center gap-2 text-sm mb-4 cursor-pointer">
          <input type="checkbox" checked={giftWrap} onChange={(e) => setGiftWrap(e.target.checked)} className="accent-gold" />
          🎁 Emballage cadeau
        </label>

        {giftWrap && (
          <div className="mb-4 border-l-2 border-gold/30 pl-3">
            <textarea
              value={giftMessage}
              onChange={(e) => setGiftMessage(e.target.value)}
              placeholder="Message personnalisé (optionnel)"
              rows={3}
              className="w-full bg-surface2 border border-foreground/20 px-3 py-2 text-sm outline-none focus:border-gold mb-2"
            />
            <label className="flex items-center gap-2 text-xs text-foreground/60 cursor-pointer">
              <input type="checkbox" checked={hidePriceOnSlip} onChange={(e) => setHidePriceOnSlip(e.target.checked)} className="accent-gold" />
              Masquer le prix sur le bordereau (idéal si c&apos;est un cadeau)
            </label>
          </div>
        )}

        <button type="button" onClick={handleCheckout} disabled={checkoutLoading} className="btn-gold w-full disabled:opacity-50">
          {checkoutLoading ? 'Traitement…' : 'PASSER COMMANDE'}
        </button>
        {checkoutError && <p className="mt-3 text-sm text-red-400">{checkoutError}</p>}
      </div>
      </div>
    </div>
  );
}
