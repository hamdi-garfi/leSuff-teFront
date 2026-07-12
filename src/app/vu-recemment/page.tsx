'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import type { Product } from '@/lib/types';
import { ProductCard } from '@/components/ProductCard';
import { clearHistory, readViewedSlugs, subscribeToRecentlyViewed } from '@/lib/recentlyViewed';

export default function RecentlyViewedPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = () => {
      const slugs = readViewedSlugs();
      if (slugs.length === 0) {
        setProducts([]);
        setLoading(false);
        return;
      }
      fetch(`/api/products/by-slugs?slugs=${slugs.join(',')}`)
        .then((res) => (res.ok ? res.json() : []))
        .then((data: Product[]) => setProducts(data))
        .catch(() => setProducts([]))
        .finally(() => setLoading(false));
    };
    load();
    return subscribeToRecentlyViewed(load);
  }, []);

  return (
    <div className="mx-auto max-w-6xl px-6 md:px-8 py-16">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="section-title">VU RÉCEMMENT</h1>
          <div className="section-title-underline" />
        </div>
        {products.length > 0 && (
          <button
            type="button"
            onClick={clearHistory}
            className="text-xs text-foreground/50 hover:text-gold transition tracking-widest2 uppercase shrink-0 mt-2"
          >
            Vider l&apos;historique
          </button>
        )}
      </div>

      {!loading && products.length === 0 && (
        <div className="text-center py-16">
          <p className="text-foreground/50 mb-6">Vous n&apos;avez pas encore consulté de produit.</p>
          <Link href="/collection" className="btn-gold">
            DÉCOUVRIR LA COLLECTION
          </Link>
        </div>
      )}

      {products.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}
