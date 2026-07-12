'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import type { Product } from '@/lib/types';
import { colorToHex } from '@/lib/colors';
import { ColorSwatches } from '@/components/ColorSwatches';
import { AddToCartForm } from '@/components/AddToCartForm';
import { WishlistButton } from '@/components/WishlistButton';

export function QuickViewModal({ product, onClose }: { product: Product; onClose: () => void }) {
  const colors = useMemo(() => Array.from(new Set(product.variants.map((v) => v.color))), [product.variants]);
  const [selectedColor, setSelectedColor] = useState(colors[0] ?? '');

  const image = useMemo(() => {
    const variantWithImage = product.variants.find((v) => v.color === selectedColor && v.imageUrl);
    return variantWithImage?.imageUrl ?? product.imageUrl;
  }, [product.variants, product.imageUrl, selectedColor]);

  const variantsForColor = product.variants.filter((v) => v.color === selectedColor);
  const onSale = product.compareAtPrice !== null && product.compareAtPrice > product.basePrice;

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKeyDown);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 px-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="bg-surface border border-foreground/10 max-w-3xl w-full max-h-[90vh] overflow-y-auto grid md:grid-cols-2 gap-8 p-6 md:p-8 relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Fermer"
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center text-foreground/50 hover:text-gold transition text-xl"
        >
          ×
        </button>

        <div
          className="aspect-square flex items-center justify-center overflow-hidden"
          style={image ? undefined : { background: `linear-gradient(155deg, ${colorToHex(selectedColor)} 0%, #0a0a0a 130%)` }}
        >
          {image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={image} alt={product.name} className="w-full h-full object-cover" />
          ) : (
            <span className="font-serif text-8xl text-foreground/10 select-none">{product.name.charAt(0)}</span>
          )}
        </div>

        <div>
          <div className="flex items-start justify-between gap-4">
            <p className="text-xs tracking-widest2 text-gold mb-2">{product.category.name.toUpperCase()}</p>
            <WishlistButton
              productId={product.id}
              className="w-8 h-8 flex items-center justify-center text-foreground/50 hover:text-gold transition shrink-0"
            />
          </div>
          <h2 className="font-serif text-2xl mb-3">{product.name}</h2>
          <p className="text-xl mb-4">
            <span className={onSale ? 'text-gold font-semibold' : 'text-foreground/90'}>{product.basePrice.toFixed(2)} €</span>
            {onSale && <span className="text-foreground/40 line-through ml-3 text-base">{product.compareAtPrice!.toFixed(2)} €</span>}
          </p>
          {product.description && <p className="text-foreground/60 text-sm mb-4 leading-relaxed line-clamp-3">{product.description}</p>}

          {colors.length > 1 && <ColorSwatches colors={colors} selected={selectedColor} onSelect={setSelectedColor} />}

          <div className="mt-6">
            <AddToCartForm variants={variantsForColor} basePrice={product.basePrice} />
          </div>

          <Link href={`/produit/${product.slug}`} className="inline-block mt-4 text-xs text-foreground/50 hover:text-gold transition">
            Voir la fiche complète →
          </Link>
        </div>
      </div>
    </div>
  );
}
