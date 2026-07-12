'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import type { ProductFacets } from '@/lib/catalog';

const SORT_LABELS: Record<string, string> = {
  '': 'Pertinence',
  price_asc: 'Prix croissant',
  price_desc: 'Prix décroissant',
  name_asc: 'Nom A–Z',
};

function useArrayParam(key: string): string[] {
  const searchParams = useSearchParams();
  return searchParams.get(key)?.split(',').filter(Boolean) ?? [];
}

export function FilterBar({ basePath, facets }: { basePath: string; facets: ProductFacets }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [open, setOpen] = useState(false);

  const sizes = useArrayParam('size');
  const colors = useArrayParam('color');
  const fits = useArrayParam('fit');
  const materials = useArrayParam('material');
  const inStock = searchParams.get('inStock') === 'true';
  const onSale = searchParams.get('onSale') === 'true';
  const sort = searchParams.get('sort') ?? '';

  const priceFloor = Math.floor(facets.priceMin);
  const priceCeil = Math.ceil(facets.priceMax);
  const [minPrice, setMinPrice] = useState(searchParams.get('minPrice') ?? '');
  const [maxPrice, setMaxPrice] = useState(searchParams.get('maxPrice') ?? '');
  const priceDebounce = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    setMinPrice(searchParams.get('minPrice') ?? '');
    setMaxPrice(searchParams.get('maxPrice') ?? '');
  }, [searchParams]);

  function navigate(mutate: (params: URLSearchParams) => void) {
    const params = new URLSearchParams(searchParams.toString());
    mutate(params);
    params.delete('page');
    router.push(`${basePath}${params.toString() ? `?${params.toString()}` : ''}`, { scroll: false });
  }

  function toggleArrayValue(key: string, value: string) {
    navigate((params) => {
      const current = params.get(key)?.split(',').filter(Boolean) ?? [];
      const next = current.includes(value) ? current.filter((v) => v !== value) : [...current, value];
      if (next.length) params.set(key, next.join(',')); else params.delete(key);
    });
  }

  function toggleBoolean(key: string, value: boolean) {
    navigate((params) => {
      if (value) params.set(key, 'true'); else params.delete(key);
    });
  }

  function setSort(value: string) {
    navigate((params) => {
      if (value) params.set('sort', value); else params.delete('sort');
    });
  }

  function applyPriceRange(nextMin: string, nextMax: string) {
    if (priceDebounce.current) clearTimeout(priceDebounce.current);
    priceDebounce.current = setTimeout(() => {
      navigate((params) => {
        if (nextMin) params.set('minPrice', nextMin); else params.delete('minPrice');
        if (nextMax) params.set('maxPrice', nextMax); else params.delete('maxPrice');
      });
    }, 450);
  }

  const activeCount = sizes.length + colors.length + fits.length + materials.length + (inStock ? 1 : 0) + (onSale ? 1 : 0) + (minPrice ? 1 : 0) + (maxPrice ? 1 : 0);

  const activeChips: { key: string; label: string; onRemove: () => void }[] = [
    ...sizes.map((s) => ({ key: `size-${s}`, label: `Taille ${s}`, onRemove: () => toggleArrayValue('size', s) })),
    ...colors.map((c) => ({ key: `color-${c}`, label: c, onRemove: () => toggleArrayValue('color', c) })),
    ...fits.map((f) => ({ key: `fit-${f}`, label: f, onRemove: () => toggleArrayValue('fit', f) })),
    ...materials.map((m) => ({ key: `material-${m}`, label: m, onRemove: () => toggleArrayValue('material', m) })),
    ...(inStock ? [{ key: 'inStock', label: 'En stock', onRemove: () => toggleBoolean('inStock', false) }] : []),
    ...(onSale ? [{ key: 'onSale', label: 'Promotions', onRemove: () => toggleBoolean('onSale', false) }] : []),
    ...(minPrice || maxPrice
      ? [{ key: 'price', label: `${minPrice || priceFloor}€ – ${maxPrice || priceCeil}€`, onRemove: () => { setMinPrice(''); setMaxPrice(''); applyPriceRange('', ''); } }]
      : []),
  ];

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="flex items-center gap-2 border border-foreground/20 px-4 py-2.5 text-[13px] tracking-[0.06em] uppercase hover:border-gold transition"
        >
          <FilterIcon />
          Filtres
          {activeCount > 0 && <span className="bg-gold text-ink text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">{activeCount}</span>}
        </button>

        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="bg-surface2 border border-foreground/20 px-3 py-2.5 text-[13px] tracking-[0.04em] uppercase outline-none focus:border-gold"
        >
          {Object.entries(SORT_LABELS).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </div>

      {activeChips.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-4">
          {activeChips.map((chip) => (
            <button
              key={chip.key}
              type="button"
              onClick={chip.onRemove}
              className="flex items-center gap-1.5 bg-surface2 border border-foreground/15 px-3 py-1.5 text-xs hover:border-gold transition"
            >
              {chip.label}
              <span aria-hidden="true">×</span>
            </button>
          ))}
          <button
            type="button"
            onClick={() => router.push(basePath, { scroll: false })}
            className="text-xs text-foreground/50 hover:text-gold transition px-2 py-1.5"
          >
            Réinitialiser
          </button>
        </div>
      )}

      {open && (
        <div className="mt-5 p-6 bg-surface2 border border-foreground/10 grid grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xs tracking-[0.1em] uppercase text-foreground/50 mb-3">Disponibilité</h3>
            <label className="flex items-center gap-2 text-sm mb-2 cursor-pointer">
              <input type="checkbox" checked={inStock} onChange={(e) => toggleBoolean('inStock', e.target.checked)} className="accent-gold" />
              En stock uniquement
            </label>
            <label className="flex items-center gap-2 text-sm cursor-pointer">
              <input type="checkbox" checked={onSale} onChange={(e) => toggleBoolean('onSale', e.target.checked)} className="accent-gold" />
              En promotion
            </label>
          </div>

          {facets.sizes.length > 0 && (
            <div>
              <h3 className="text-xs tracking-[0.1em] uppercase text-foreground/50 mb-3">Taille</h3>
              <div className="flex flex-wrap gap-2">
                {facets.sizes.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => toggleArrayValue('size', s)}
                    className={`w-9 h-9 text-xs border transition ${sizes.includes(s) ? 'border-gold text-gold' : 'border-foreground/20 hover:border-gold'}`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {facets.colors.length > 0 && (
            <div>
              <h3 className="text-xs tracking-[0.1em] uppercase text-foreground/50 mb-3">Couleur</h3>
              <div className="flex flex-col gap-2">
                {facets.colors.map((c) => (
                  <label key={c} className="flex items-center gap-2 text-sm cursor-pointer">
                    <input type="checkbox" checked={colors.includes(c)} onChange={() => toggleArrayValue('color', c)} className="accent-gold" />
                    {c}
                  </label>
                ))}
              </div>
            </div>
          )}

          <div>
            <h3 className="text-xs tracking-[0.1em] uppercase text-foreground/50 mb-3">Prix</h3>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min={priceFloor}
                max={priceCeil}
                placeholder={String(priceFloor)}
                value={minPrice}
                onChange={(e) => { setMinPrice(e.target.value); applyPriceRange(e.target.value, maxPrice); }}
                className="w-full bg-surface border border-foreground/20 px-2 py-2 text-sm outline-none focus:border-gold"
              />
              <span className="text-foreground/40">–</span>
              <input
                type="number"
                min={priceFloor}
                max={priceCeil}
                placeholder={String(priceCeil)}
                value={maxPrice}
                onChange={(e) => { setMaxPrice(e.target.value); applyPriceRange(minPrice, e.target.value); }}
                className="w-full bg-surface border border-foreground/20 px-2 py-2 text-sm outline-none focus:border-gold"
              />
            </div>
          </div>

          {facets.fits.length > 0 && (
            <div>
              <h3 className="text-xs tracking-[0.1em] uppercase text-foreground/50 mb-3">Coupe</h3>
              <div className="flex flex-col gap-2">
                {facets.fits.map((f) => (
                  <label key={f} className="flex items-center gap-2 text-sm cursor-pointer">
                    <input type="checkbox" checked={fits.includes(f)} onChange={() => toggleArrayValue('fit', f)} className="accent-gold" />
                    {f}
                  </label>
                ))}
              </div>
            </div>
          )}

          {facets.materials.length > 0 && (
            <div>
              <h3 className="text-xs tracking-[0.1em] uppercase text-foreground/50 mb-3">Matière</h3>
              <div className="flex flex-col gap-2">
                {facets.materials.map((m) => (
                  <label key={m} className="flex items-center gap-2 text-sm cursor-pointer">
                    <input type="checkbox" checked={materials.includes(m)} onChange={() => toggleArrayValue('material', m)} className="accent-gold" />
                    {m}
                  </label>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function FilterIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M4 6h16M7 12h10M10 18h4" />
    </svg>
  );
}
