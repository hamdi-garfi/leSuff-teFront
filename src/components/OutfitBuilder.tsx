'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  TouchSensor,
  closestCenter,
  useDraggable,
  useDroppable,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
} from '@dnd-kit/core';
import { SortableContext, arrayMove, rectSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { Product, ProductVariant } from '@/lib/types';
import { colorToHex } from '@/lib/colors';

type CategorySlot = {
  categorySlug: string;
  categoryName: string;
  products: Product[];
};

type Selection = { key: string; categorySlug: string; product: Product; variant: ProductVariant };

const BUNDLE_DISCOUNT_RATE = 0.1;
const BUNDLE_COUPON_CODE = 'TENUE10';
const MIN_ITEMS_FOR_DISCOUNT = 2;

let selectionCounter = 0;
function nextSelectionKey() {
  selectionCounter += 1;
  return `sel-${selectionCounter}`;
}

function ProductThumb({ product, className }: { product: Product; className?: string }) {
  if (product.imageUrl) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={product.imageUrl} alt={product.name} className={className} draggable={false} />;
  }
  return (
    <div className={`${className} flex items-center justify-center bg-surface2`}>
      <span className="font-serif text-3xl text-foreground/20">{product.name.charAt(0)}</span>
    </div>
  );
}

function ShelfCard({ product, categorySlug, onAdd }: { product: Product; categorySlug: string; onAdd: (v: ProductVariant) => void }) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `shelf:${categorySlug}:${product.id}`,
    data: { type: 'shelf' as const, categorySlug, product },
  });
  const firstAvailable = product.variants.find((v) => v.stock > 0) ?? product.variants[0];

  return (
    <button
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      type="button"
      onClick={() => firstAvailable && onAdd(firstAvailable)}
      className={`shrink-0 w-36 text-left border border-foreground/10 hover:border-gold/50 transition p-2 bg-surface cursor-grab active:cursor-grabbing ${isDragging ? 'opacity-30' : ''}`}
    >
      <ProductThumb product={product} className="w-full aspect-square object-cover mb-2" />
      <p className="text-xs truncate">{product.name}</p>
      <p className="text-xs text-gold">{product.basePrice.toFixed(2)} €</p>
    </button>
  );
}

function FrameTile({ selection, onChange, onRemove }: { selection: Selection; onChange: (v: ProductVariant) => void; onRemove: () => void }) {
  const [expanded, setExpanded] = useState(false);
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: `frame:${selection.key}`,
    data: { type: 'frame' as const, key: selection.key },
  });
  const { product, variant } = selection;
  const colors = Array.from(new Set(product.variants.map((v) => v.color)));
  const sizesForColor = product.variants.filter((v) => v.color === variant.color);

  const style = { transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.4 : 1 };

  return (
    <div ref={setNodeRef} style={style} className="relative border border-gold/40 bg-surface group">
      <button
        type="button"
        onClick={onRemove}
        className="absolute top-1.5 right-1.5 z-10 w-6 h-6 flex items-center justify-center bg-surface/90 border border-foreground/20 text-foreground/60 hover:text-red-400 hover:border-red-400 transition opacity-0 group-hover:opacity-100"
        aria-label="Retirer"
      >
        ×
      </button>
      <div {...listeners} {...attributes} className="cursor-grab active:cursor-grabbing touch-none" onClick={() => setExpanded((e) => !e)}>
        <ProductThumb product={product} className="w-full aspect-square object-cover" />
        <div className="p-2.5">
          <p className="text-xs truncate">{product.name}</p>
          <p className="text-xs text-foreground/50">
            {variant.size} · {variant.color}
          </p>
          <p className="text-sm text-gold mt-1">{variant.price.toFixed(2)} €</p>
        </div>
      </div>

      {expanded && (
        <div className="p-2.5 pt-0 space-y-2 border-t border-foreground/10 mt-1">
          {colors.length > 1 && (
            <div className="flex gap-1.5 pt-2">
              {colors.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    const sameSize = product.variants.find((v) => v.color === c && v.size === variant.size);
                    const fallback = product.variants.find((v) => v.color === c);
                    const next = sameSize ?? fallback;
                    if (next) onChange(next);
                  }}
                  className={`w-5 h-5 rounded-full border-2 ${variant.color === c ? 'border-gold' : 'border-foreground/20'}`}
                  style={{ backgroundColor: colorToHex(c) }}
                  aria-label={c}
                />
              ))}
            </div>
          )}
          <div className="flex flex-wrap gap-1.5">
            {sizesForColor.map((v) => (
              <button
                key={v.id}
                type="button"
                disabled={v.stock === 0}
                onClick={(e) => {
                  e.stopPropagation();
                  onChange(v);
                }}
                className={`shrink-0 min-w-[32px] px-1.5 py-1 text-[11px] border ${
                  variant.id === v.id ? 'border-gold text-gold' : 'border-foreground/20'
                } ${v.stock === 0 ? 'opacity-30 cursor-not-allowed' : 'hover:border-gold'}`}
              >
                {v.size}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function OutfitFrame({
  selections,
  onChange,
  onRemove,
}: {
  selections: Selection[];
  onChange: (key: string, v: ProductVariant) => void;
  onRemove: (key: string) => void;
}) {
  const { setNodeRef, isOver } = useDroppable({ id: 'frame-canvas' });

  return (
    <div className="relative border border-gold/50 p-4 md:p-6 bg-gradient-to-b from-surface2/60 to-surface">
      <span className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-gold/70" />
      <span className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-gold/70" />
      <span className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-gold/70" />
      <span className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-gold/70" />

      <p className="text-center text-[11px] tracking-widest2 text-gold/80 mb-4">VOTRE TENUE</p>

      <div
        ref={setNodeRef}
        className={`min-h-[220px] transition ${isOver ? 'ring-1 ring-gold/60' : ''}`}
      >
        {selections.length === 0 ? (
          <div className="h-[220px] flex items-center justify-center border border-dashed border-foreground/15 text-center px-6">
            <p className="text-sm text-foreground/40">
              Glissez un article ici, ou cliquez sur un article ci-dessous pour composer votre tenue.
            </p>
          </div>
        ) : (
          <SortableContext items={selections.map((s) => `frame:${s.key}`)} strategy={rectSortingStrategy}>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {selections.map((s) => (
                <FrameTile key={s.key} selection={s} onChange={(v) => onChange(s.key, v)} onRemove={() => onRemove(s.key)} />
              ))}
            </div>
          </SortableContext>
        )}
      </div>
    </div>
  );
}

const DRAFT_STORAGE_KEY = 'suffete_outfit_draft';

type Draft = { selections: Selection[]; activeSlugs: string[] };

export function OutfitBuilder({ slots }: { slots: CategorySlot[] }) {
  const router = useRouter();
  const [selections, setSelections] = useState<Selection[]>([]);
  const [activeSlugs, setActiveSlugs] = useState<string[]>(slots.map((s) => s.categorySlug));
  const [currentShelf, setCurrentShelf] = useState(slots[0]?.categorySlug ?? '');
  const [draggedProduct, setDraggedProduct] = useState<Product | null>(null);
  const [adding, setAdding] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sessionExpired, setSessionExpired] = useState(false);
  const [draftLoaded, setDraftLoaded] = useState(false);

  // Restore a saved draft after mount (not in the initial state) to avoid an SSR/client
  // hydration mismatch, since the server render never has access to localStorage.
  useEffect(() => {
    try {
      const raw = localStorage.getItem(DRAFT_STORAGE_KEY);
      if (raw) {
        const draft = JSON.parse(raw) as Draft;
        if (draft.selections?.length > 0) {
          selectionCounter = Math.max(selectionCounter, draft.selections.length);
          setSelections(draft.selections);
        }
        if (draft.activeSlugs?.length > 0) {
          setActiveSlugs(draft.activeSlugs);
        }
      }
    } catch {
      // Corrupted or unavailable storage — just start with an empty outfit.
    }
    setDraftLoaded(true);
  }, []);

  useEffect(() => {
    if (!draftLoaded) return;
    if (selections.length === 0) {
      localStorage.removeItem(DRAFT_STORAGE_KEY);
      return;
    }
    localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify({ selections, activeSlugs } satisfies Draft));
  }, [selections, activeSlugs, draftLoaded]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 150, tolerance: 8 } }),
  );

  const activeSlots = slots.filter((s) => activeSlugs.includes(s.categorySlug));
  const inactiveSlots = slots.filter((s) => !activeSlugs.includes(s.categorySlug));
  const shelf = activeSlots.find((s) => s.categorySlug === currentShelf) ?? activeSlots[0];

  const subtotal = useMemo(() => selections.reduce((sum, s) => sum + s.variant.price, 0), [selections]);
  const eligibleForDiscount = selections.length >= MIN_ITEMS_FOR_DISCOUNT;
  const discount = eligibleForDiscount ? subtotal * BUNDLE_DISCOUNT_RATE : 0;

  function addSelection(categorySlug: string, product: Product, variant: ProductVariant) {
    setSelections((prev) => [...prev, { key: nextSelectionKey(), categorySlug, product, variant }]);
  }

  function changeVariant(key: string, variant: ProductVariant) {
    setSelections((prev) => prev.map((s) => (s.key === key ? { ...s, variant } : s)));
  }

  function removeSelection(key: string) {
    setSelections((prev) => prev.filter((s) => s.key !== key));
  }

  function removeCategory(categorySlug: string) {
    setActiveSlugs((prev) => prev.filter((slug) => slug !== categorySlug));
    setSelections((prev) => prev.filter((s) => s.categorySlug !== categorySlug));
    if (currentShelf === categorySlug) {
      const next = activeSlots.find((s) => s.categorySlug !== categorySlug);
      setCurrentShelf(next?.categorySlug ?? '');
    }
  }

  function addCategory(categorySlug: string) {
    setActiveSlugs((prev) => [...prev, categorySlug]);
    setCurrentShelf(categorySlug);
  }

  function handleDragStart(event: DragStartEvent) {
    const data = event.active.data.current as { type: 'shelf'; product: Product } | { type: 'frame'; key: string } | undefined;
    if (data?.type === 'shelf') {
      setDraggedProduct(data.product);
    }
  }

  function handleDragEnd(event: DragEndEvent) {
    setDraggedProduct(null);
    const { active, over } = event;
    if (!over) return;

    const data = active.data.current as { type: 'shelf'; categorySlug: string; product: Product } | { type: 'frame'; key: string } | undefined;
    if (!data) return;

    if (data.type === 'shelf') {
      const firstAvailable = data.product.variants.find((v) => v.stock > 0) ?? data.product.variants[0];
      if (firstAvailable) addSelection(data.categorySlug, data.product, firstAvailable);
      return;
    }

    if (data.type === 'frame' && String(over.id).startsWith('frame:')) {
      const overKey = String(over.id).slice('frame:'.length);
      if (data.key !== overKey) {
        setSelections((prev) => {
          const oldIndex = prev.findIndex((s) => s.key === data.key);
          const newIndex = prev.findIndex((s) => s.key === overKey);
          return arrayMove(prev, oldIndex, newIndex);
        });
      }
    }
  }

  async function handleAddAll() {
    if (selections.length === 0) return;
    setAdding(true);
    setError(null);
    setSessionExpired(false);

    for (const s of selections) {
      const res = await fetch('/api/cart/items', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ variantId: s.variant.id, quantity: 1 }),
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.error ?? "Impossible d'ajouter un article au panier.");
        setSessionExpired(data.code === 'session_expired');
        setAdding(false);
        return;
      }
    }

    localStorage.removeItem(DRAFT_STORAGE_KEY);
    const promoParam = eligibleForDiscount ? `?promo=${BUNDLE_COUPON_CODE}` : '';
    router.push(`/panier${promoParam}`);
    router.refresh();
  }

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <div className="grid lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-6">
          <OutfitFrame selections={selections} onChange={changeVariant} onRemove={removeSelection} />

          <div>
            <div className="flex flex-wrap items-center gap-2 border-b border-foreground/10 pb-3 mb-4">
              {activeSlots.map((slot) => (
                <div key={slot.categorySlug} className="flex items-center">
                  <button
                    type="button"
                    onClick={() => setCurrentShelf(slot.categorySlug)}
                    className={`text-xs tracking-widest2 uppercase px-3 py-2 transition ${
                      shelf?.categorySlug === slot.categorySlug ? 'text-gold border-b-2 border-gold' : 'text-foreground/50 hover:text-foreground'
                    }`}
                  >
                    {slot.categoryName}
                  </button>
                  <button
                    type="button"
                    onClick={() => removeCategory(slot.categorySlug)}
                    className="text-foreground/30 hover:text-red-400 transition text-xs px-1"
                    aria-label={`Supprimer ${slot.categoryName}`}
                  >
                    ×
                  </button>
                </div>
              ))}
              {inactiveSlots.map((slot) => (
                <button
                  key={slot.categorySlug}
                  type="button"
                  onClick={() => addCategory(slot.categorySlug)}
                  className="text-xs tracking-widest2 uppercase px-3 py-2 border border-dashed border-foreground/20 text-foreground/40 hover:text-gold hover:border-gold/50 transition"
                >
                  + {slot.categoryName}
                </button>
              ))}
            </div>

            {shelf && shelf.products.length > 0 ? (
              <div className="flex gap-3 overflow-x-auto pb-2">
                {shelf.products.map((product) => (
                  <ShelfCard
                    key={product.id}
                    product={product}
                    categorySlug={shelf.categorySlug}
                    onAdd={(variant) => addSelection(shelf.categorySlug, product, variant)}
                  />
                ))}
              </div>
            ) : (
              <p className="text-sm text-foreground/40">Aucun article disponible dans cette catégorie.</p>
            )}
          </div>
        </div>

        <div className="border border-foreground/10 p-6 h-fit lg:sticky lg:top-24">
          <h2 className="text-xs tracking-widest2 text-foreground/60 mb-4">RÉSUMÉ</h2>
          {selections.length === 0 ? (
            <p className="text-sm text-foreground/40">Choisissez au moins un article.</p>
          ) : (
            <ul className="space-y-2 mb-4">
              {selections.map((s) => (
                <li key={s.key} className="flex justify-between text-sm">
                  <span className="truncate pr-2">
                    {s.product.name} ({s.variant.size}, {s.variant.color})
                  </span>
                  <span className="text-foreground/60 shrink-0">{s.variant.price.toFixed(2)} €</span>
                </li>
              ))}
            </ul>
          )}

          {eligibleForDiscount && <p className="text-xs text-gold mb-2">-10% en tenue complète appliqué au panier</p>}

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

          {error && (
            <p className="text-sm text-red-400 mt-3">
              {error}
              {sessionExpired && (
                <>
                  {' '}
                  <Link href="/compte/connexion?next=tenue" className="text-gold hover:underline">
                    Se reconnecter
                  </Link>
                </>
              )}
            </p>
          )}

          <button
            type="button"
            onClick={handleAddAll}
            disabled={selections.length === 0 || adding}
            className="btn-gold w-full mt-4 disabled:opacity-50"
          >
            {adding ? 'Ajout…' : 'AJOUTER LA TENUE AU PANIER'}
          </button>
        </div>
      </div>

      <DragOverlay>
        {draggedProduct ? (
          <div className="w-36 border border-gold bg-surface p-2 shadow-2xl rotate-3">
            <ProductThumb product={draggedProduct} className="w-full aspect-square object-cover mb-2" />
            <p className="text-xs truncate">{draggedProduct.name}</p>
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
