'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import type { Product, ProductVariant } from '@/lib/types';
import { colorToHex } from '@/lib/colors';

type CategorySlot = {
  categorySlug: string;
  categoryName: string;
  products: Product[];
};

type Selection = { key: string; product: Product; variant: ProductVariant };

const BUNDLE_DISCOUNT_RATE = 0.1;
const BUNDLE_COUPON_CODE = 'TENUE10';
const MIN_ITEMS_FOR_DISCOUNT = 2;

let selectionCounter = 0;
function nextSelectionKey() {
  selectionCounter += 1;
  return `sel-${selectionCounter}`;
}

function SelectedItemCard({
  selection,
  onChange,
  onRemove,
}: {
  selection: Selection;
  onChange: (variant: ProductVariant) => void;
  onRemove: () => void;
}) {
  const { product, variant } = selection;
  const colors = Array.from(new Set(product.variants.map((v) => v.color)));
  const sizesForColor = product.variants.filter((v) => v.color === variant.color);

  return (
    <div className="border border-gold/40 p-4">
      <div className="flex items-center justify-between mb-3">
        <p className="text-sm">{product.name}</p>
        <button type="button" onClick={onRemove} className="text-xs text-foreground/50 hover:text-red-400">
          Retirer
        </button>
      </div>
      {colors.length > 1 && (
        <div className="flex gap-2 mb-3">
          {colors.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => {
                const sameSize = product.variants.find((v) => v.color === c && v.size === variant.size);
                const fallback = product.variants.find((v) => v.color === c);
                const nextVariant = sameSize ?? fallback;
                if (nextVariant) onChange(nextVariant);
              }}
              className={`w-6 h-6 rounded-full border-2 ${variant.color === c ? 'border-gold' : 'border-foreground/20'}`}
              style={{ backgroundColor: colorToHex(c) }}
              aria-label={c}
            />
          ))}
        </div>
      )}
      <div className="flex flex-wrap gap-2">
        {sizesForColor.map((v) => (
          <button
            key={v.id}
            type="button"
            disabled={v.stock === 0}
            onClick={() => onChange(v)}
            className={`shrink-0 min-w-[40px] px-2 py-1.5 text-xs border ${
              variant.id === v.id ? 'border-gold text-gold' : 'border-foreground/20'
            } ${v.stock === 0 ? 'opacity-30 cursor-not-allowed' : 'hover:border-gold'}`}
          >
            {v.size}
          </button>
        ))}
      </div>
      <p className="text-sm text-gold mt-3">{variant.price.toFixed(2)} €</p>
    </div>
  );
}

function ProductGrid({ products, onPick }: { products: Product[]; onPick: (selection: Selection) => void }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
      {products.map((product) => {
        const firstAvailable = product.variants.find((v) => v.stock > 0) ?? product.variants[0];
        return (
          <button
            key={product.id}
            type="button"
            onClick={() => firstAvailable && onPick({ key: nextSelectionKey(), product, variant: firstAvailable })}
            className="text-left border border-foreground/10 hover:border-gold/50 transition p-2"
          >
            <div className="aspect-square bg-surface2 mb-2 overflow-hidden">
              {product.imageUrl && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
              )}
            </div>
            <p className="text-xs">{product.name}</p>
            <p className="text-xs text-foreground/50">{product.basePrice.toFixed(2)} €</p>
          </button>
        );
      })}
    </div>
  );
}

function CategoryPicker({
  slot,
  selections,
  onAdd,
  onChange,
  onRemove,
}: {
  slot: CategorySlot;
  selections: Selection[];
  onAdd: (selection: Selection) => void;
  onChange: (key: string, variant: ProductVariant) => void;
  onRemove: (key: string) => void;
}) {
  const [pickerOpen, setPickerOpen] = useState(false);
  const showGrid = pickerOpen || selections.length === 0;

  return (
    <div className="space-y-3">
      {selections.map((s) => (
        <SelectedItemCard
          key={s.key}
          selection={s}
          onChange={(variant) => onChange(s.key, variant)}
          onRemove={() => onRemove(s.key)}
        />
      ))}

      {showGrid ? (
        <ProductGrid
          products={slot.products}
          onPick={(selection) => {
            onAdd(selection);
            setPickerOpen(false);
          }}
        />
      ) : (
        <button
          type="button"
          onClick={() => setPickerOpen(true)}
          className="text-xs tracking-widest2 uppercase border border-foreground/20 px-4 py-2.5 hover:border-gold transition"
        >
          + Ajouter un autre article
        </button>
      )}
    </div>
  );
}

export function OutfitBuilder({ slots }: { slots: CategorySlot[] }) {
  const router = useRouter();
  const [selectionsByCategory, setSelectionsByCategory] = useState<Record<string, Selection[]>>({});
  const [activeSlugs, setActiveSlugs] = useState<string[]>(slots.map((s) => s.categorySlug));
  const [adding, setAdding] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const activeSlots = slots.filter((s) => activeSlugs.includes(s.categorySlug));
  const inactiveSlots = slots.filter((s) => !activeSlugs.includes(s.categorySlug));

  function removeCategory(categorySlug: string) {
    setActiveSlugs((prev) => prev.filter((slug) => slug !== categorySlug));
    setSelectionsByCategory((prev) => ({ ...prev, [categorySlug]: [] }));
  }

  function addCategory(categorySlug: string) {
    setActiveSlugs((prev) => [...prev, categorySlug]);
  }

  const chosen = Object.values(selectionsByCategory).flat();
  const subtotal = chosen.reduce((sum, s) => sum + s.variant.price, 0);
  const eligibleForDiscount = chosen.length >= MIN_ITEMS_FOR_DISCOUNT;
  const discount = eligibleForDiscount ? subtotal * BUNDLE_DISCOUNT_RATE : 0;

  function addToCategory(categorySlug: string, selection: Selection) {
    setSelectionsByCategory((prev) => ({ ...prev, [categorySlug]: [...(prev[categorySlug] ?? []), selection] }));
  }

  function changeInCategory(categorySlug: string, key: string, variant: ProductVariant) {
    setSelectionsByCategory((prev) => ({
      ...prev,
      [categorySlug]: (prev[categorySlug] ?? []).map((s) => (s.key === key ? { ...s, variant } : s)),
    }));
  }

  function removeFromCategory(categorySlug: string, key: string) {
    setSelectionsByCategory((prev) => ({
      ...prev,
      [categorySlug]: (prev[categorySlug] ?? []).filter((s) => s.key !== key),
    }));
  }

  async function handleAddAll() {
    if (chosen.length === 0) return;
    setAdding(true);
    setError(null);

    for (const s of chosen) {
      const res = await fetch('/api/cart/items', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ variantId: s.variant.id, quantity: 1 }),
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.error ?? "Impossible d'ajouter un article au panier.");
        setAdding(false);
        return;
      }
    }

    const promoParam = eligibleForDiscount ? `?promo=${BUNDLE_COUPON_CODE}` : '';
    router.push(`/panier${promoParam}`);
    router.refresh();
  }

  return (
    <div className="grid lg:grid-cols-3 gap-12">
      <div className="lg:col-span-2 space-y-10">
        {activeSlots.map((slot) => (
          <div key={slot.categorySlug}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm tracking-widest2 text-foreground/60">{slot.categoryName.toUpperCase()}</h2>
              <button
                type="button"
                onClick={() => removeCategory(slot.categorySlug)}
                className="text-xs text-foreground/40 hover:text-red-400 transition"
              >
                Supprimer cette catégorie
              </button>
            </div>
            {slot.products.length === 0 ? (
              <p className="text-sm text-foreground/40">Aucun article disponible dans cette catégorie.</p>
            ) : (
              <CategoryPicker
                slot={slot}
                selections={selectionsByCategory[slot.categorySlug] ?? []}
                onAdd={(selection) => addToCategory(slot.categorySlug, selection)}
                onChange={(key, variant) => changeInCategory(slot.categorySlug, key, variant)}
                onRemove={(key) => removeFromCategory(slot.categorySlug, key)}
              />
            )}
          </div>
        ))}

        {inactiveSlots.length > 0 && (
          <div>
            <h2 className="text-sm tracking-widest2 text-foreground/60 mb-4">AJOUTER UNE CATÉGORIE</h2>
            <div className="flex flex-wrap gap-3">
              {inactiveSlots.map((slot) => (
                <button
                  key={slot.categorySlug}
                  type="button"
                  onClick={() => addCategory(slot.categorySlug)}
                  className="text-xs tracking-widest2 uppercase border border-foreground/20 px-4 py-2.5 hover:border-gold transition"
                >
                  + {slot.categoryName}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="border border-foreground/10 p-6 h-fit sticky top-24">
        <h2 className="text-xs tracking-widest2 text-foreground/60 mb-4">VOTRE TENUE</h2>
        {chosen.length === 0 ? (
          <p className="text-sm text-foreground/40">Choisissez au moins un article dans une catégorie.</p>
        ) : (
          <ul className="space-y-2 mb-4">
            {chosen.map((s) => (
              <li key={s.key} className="flex justify-between text-sm">
                <span>
                  {s.product.name} ({s.variant.size}, {s.variant.color})
                </span>
                <span className="text-foreground/60">{s.variant.price.toFixed(2)} €</span>
              </li>
            ))}
          </ul>
        )}

        {eligibleForDiscount && (
          <p className="text-xs text-gold mb-2">-10% en tenue complète appliqué au panier</p>
        )}

        <div className="border-t border-foreground/10 pt-4 space-y-1">
          <div className="flex justify-between text-sm">
            <span>Sous-total</span>
            <span>{subtotal.toFixed(2)} €</span>
          </div>
          {eligibleForDiscount && (
            <div className="flex justify-between text-sm text-gold">
              <span>Réduction tenue (-10%)</span>
              <span>-{discount.toFixed(2)} €</span>
            </div>
          )}
          <div className="flex justify-between text-base pt-1">
            <span>Total estimé</span>
            <span>{(subtotal - discount).toFixed(2)} €</span>
          </div>
        </div>

        {error && <p className="text-sm text-red-400 mt-3">{error}</p>}

        <button
          type="button"
          onClick={handleAddAll}
          disabled={chosen.length === 0 || adding}
          className="btn-gold w-full mt-4 disabled:opacity-50"
        >
          {adding ? 'Ajout…' : 'AJOUTER LA TENUE AU PANIER'}
        </button>
      </div>
    </div>
  );
}
