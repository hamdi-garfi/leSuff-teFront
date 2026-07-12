'use client';

import { useEffect, useState } from 'react';
import type { Product } from '@/lib/types';
import { ProductCard } from '@/components/ProductCard';

const STORAGE_KEY = 'suffete_recently_viewed';
const MAX_ITEMS = 8;

function readViewedSlugs(): string[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as string[]) : [];
  } catch {
    return [];
  }
}

export function RecentlyViewed({ currentSlug }: { currentSlug: string }) {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const previous = readViewedSlugs().filter((s) => s !== currentSlug);
    const updated = [currentSlug, ...previous].slice(0, MAX_ITEMS);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));

    const othersToShow = previous.slice(0, 4);
    if (othersToShow.length === 0) return;

    fetch(`/api/products/by-slugs?slugs=${othersToShow.join(',')}`)
      .then((res) => (res.ok ? res.json() : []))
      .then((data: Product[]) => setProducts(data))
      .catch(() => setProducts([]));
  }, [currentSlug]);

  if (products.length === 0) return null;

  return (
    <section className="mt-24">
      <h2 className="section-title">RÉCEMMENT CONSULTÉS</h2>
      <div className="section-title-underline" />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {products.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </section>
  );
}
