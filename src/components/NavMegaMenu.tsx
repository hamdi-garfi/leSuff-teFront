'use client';

import { useRef, useState } from 'react';
import Link from 'next/link';
import type { Category, Product } from '@/lib/types';
import { NAV_LABELS } from '@/lib/navLabels';

export function NavMegaMenu({
  categories,
  categoryProducts,
}: {
  categories: Category[];
  categoryProducts: Record<number, Product[]>;
}) {
  const [openId, setOpenId] = useState<number | null>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  function open(id: number) {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setOpenId(id);
  }

  function scheduleClose() {
    closeTimer.current = setTimeout(() => setOpenId(null), 150);
  }

  return (
    <nav className="hidden md:flex items-center gap-7 text-[13px] tracking-[0.06em] uppercase flex-1">
      <Link href="/" className="hover:text-gold transition whitespace-nowrap">
        Accueil
      </Link>
      <Link href="/collection" className="hover:text-gold transition whitespace-nowrap">
        Collection
      </Link>
      {categories.map((c) => {
        const products = categoryProducts[c.id] ?? [];
        return (
          <div key={c.id} className="relative" onMouseEnter={() => open(c.id)} onMouseLeave={scheduleClose}>
            <Link href={`/collection/${c.slug}`} className="hover:text-gold transition whitespace-nowrap">
              {NAV_LABELS[c.slug] ?? c.name}
            </Link>

            {openId === c.id && products.length > 0 && (
              <div
                className="absolute left-1/2 -translate-x-1/2 top-full pt-4 z-50"
                onMouseEnter={() => open(c.id)}
                onMouseLeave={scheduleClose}
              >
                <div className="bg-surface border border-foreground/10 shadow-2xl p-6 flex gap-5 normal-case tracking-normal">
                  {products.map((p) => (
                    <Link key={p.id} href={`/produit/${p.slug}`} className="w-32 group/item shrink-0">
                      <div className="aspect-square bg-surface2 overflow-hidden mb-2">
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
                    className="w-32 shrink-0 flex flex-col items-center justify-center text-center text-xs text-foreground/60 hover:text-gold transition border-l border-foreground/10 pl-5"
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
