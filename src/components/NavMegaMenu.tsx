'use client';

import { useRef, useState } from 'react';
import Link from 'next/link';
import type { Category, Product } from '@/lib/types';
import { NAV_LABELS } from '@/lib/navLabels';

type MenuKey = 'collection' | 'tenue' | number;

export function NavMegaMenu({
  categories,
  categoryProducts,
}: {
  categories: Category[];
  categoryProducts: Record<number, Product[]>;
}) {
  const [openKey, setOpenKey] = useState<MenuKey | null>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  function open(key: MenuKey) {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setOpenKey(key);
  }

  function scheduleClose() {
    closeTimer.current = setTimeout(() => setOpenKey(null), 150);
  }

  return (
    <nav className="hidden md:flex items-center gap-7 text-[13px] tracking-[0.06em] uppercase flex-1">
      <Link href="/" className="hover:text-gold transition whitespace-nowrap">
        Accueil
      </Link>

      <div className="relative" onMouseEnter={() => open('collection')} onMouseLeave={scheduleClose}>
        <Link href="/collection" className="hover:text-gold transition whitespace-nowrap">
          Collection
        </Link>

        {openKey === 'collection' && (
          <div className="absolute left-1/2 -translate-x-1/2 top-full pt-4 z-50" onMouseEnter={() => open('collection')} onMouseLeave={scheduleClose}>
            <div className="bg-surface border border-foreground/10 shadow-2xl p-8 grid grid-cols-4 gap-6 normal-case tracking-normal w-[600px]">
              {categories.map((c) => (
                <Link key={c.id} href={`/collection/${c.slug}`} className="group/item">
                  <div className="aspect-square bg-surface2 overflow-hidden mb-3">
                    {c.imageUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={c.imageUrl}
                        alt={c.name}
                        className="w-full h-full object-cover group-hover/item:scale-105 transition duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-foreground/20 font-serif text-3xl">
                        {c.name.charAt(0)}
                      </div>
                    )}
                  </div>
                  <p className="text-sm text-center group-hover/item:text-gold transition">{NAV_LABELS[c.slug] ?? c.name}</p>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="relative" onMouseEnter={() => open('tenue')} onMouseLeave={scheduleClose}>
        <Link href="/tenue" className="hover:text-gold transition whitespace-nowrap">
          Créer une tenue
        </Link>

        {openKey === 'tenue' && (
          <div className="absolute left-1/2 -translate-x-1/2 top-full pt-4 z-50" onMouseEnter={() => open('tenue')} onMouseLeave={scheduleClose}>
            <div className="relative bg-ink border border-foreground/10 shadow-2xl p-10 normal-case tracking-normal w-[380px] text-center overflow-hidden">
              <span className="pointer-events-none absolute top-4 left-4 w-8 h-8 border-t border-l border-gold/40" />
              <span className="pointer-events-none absolute top-4 right-4 w-8 h-8 border-t border-r border-gold/40" />
              <span className="pointer-events-none absolute bottom-4 left-4 w-8 h-8 border-b border-l border-gold/40" />
              <span className="pointer-events-none absolute bottom-4 right-4 w-8 h-8 border-b border-r border-gold/40" />
              <p className="font-serif text-xl text-white mb-3">Composez votre tenue</p>
              <p className="text-xs text-white/60 leading-relaxed mb-6">
                Choisissez un article par catégorie et profitez de -10% sur l&apos;ensemble dès 2 articles.
              </p>
              <Link href="/tenue" className="btn-gold inline-block">
                COMPOSER MA TENUE →
              </Link>
            </div>
          </div>
        )}
      </div>

      {categories.map((c) => {
        const products = categoryProducts[c.id] ?? [];
        return (
          <div key={c.id} className="relative" onMouseEnter={() => open(c.id)} onMouseLeave={scheduleClose}>
            <Link href={`/collection/${c.slug}`} className="hover:text-gold transition whitespace-nowrap">
              {NAV_LABELS[c.slug] ?? c.name}
            </Link>

            {openKey === c.id && products.length > 0 && (
              <div
                className="absolute left-1/2 -translate-x-1/2 top-full pt-4 z-50"
                onMouseEnter={() => open(c.id)}
                onMouseLeave={scheduleClose}
              >
                <div className="bg-surface border border-foreground/10 shadow-2xl p-8 flex gap-6 normal-case tracking-normal">
                  {products.map((p) => (
                    <Link key={p.id} href={`/produit/${p.slug}`} className="w-40 group/item shrink-0">
                      <div className="aspect-square bg-surface2 overflow-hidden mb-3">
                        {p.imageUrl ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={p.imageUrl}
                            alt={p.name}
                            className="w-full h-full object-cover group-hover/item:scale-105 transition duration-300"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-foreground/20 font-serif text-3xl">
                            {p.name.charAt(0)}
                          </div>
                        )}
                      </div>
                      <p className="text-xs text-foreground/80 leading-tight line-clamp-2">{p.name}</p>
                      <p className="text-xs text-gold mt-1">{p.basePrice.toFixed(2)} €</p>
                    </Link>
                  ))}
                  <Link
                    href={`/collection/${c.slug}`}
                    className="w-32 shrink-0 flex flex-col items-center justify-center text-center text-xs text-foreground/60 hover:text-gold transition border-l border-foreground/10 pl-6"
                  >
                    Voir tout
                    <br />
                    {NAV_LABELS[c.slug] ?? c.name} →
                  </Link>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </nav>
  );
}
