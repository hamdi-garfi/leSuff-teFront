'use client';

import { useMemo, useState } from 'react';
import type { Product } from '@/lib/types';
import { colorToHex } from '@/lib/colors';
import { ProductGallery } from '@/components/ProductGallery';
import { ColorSwatches } from '@/components/ColorSwatches';
import { AddToCartForm } from '@/components/AddToCartForm';
import { StarRating } from '@/components/StarRating';

export function ProductPurchasePanel({
  product,
  reviews,
}: {
  product: Product;
  reviews: { average: number | null; count: number };
}) {
  const colors = useMemo(() => Array.from(new Set(product.variants.map((v) => v.color))), [product.variants]);
  const [selectedColor, setSelectedColor] = useState(colors[0] ?? '');

  const colorImage = useMemo(() => {
    const variantWithImage = product.variants.find((v) => v.color === selectedColor && v.imageUrl);
    return variantWithImage?.imageUrl ?? product.imageUrl;
  }, [product.variants, product.imageUrl, selectedColor]);

  const images = useMemo(() => {
    const gallery = [product.imageUrl, ...product.galleryImages].filter((src): src is string => Boolean(src));
    if (colorImage) {
      return [colorImage, ...gallery.filter((src) => src !== colorImage)];
    }
    return gallery;
  }, [colorImage, product.imageUrl, product.galleryImages]);

  const variantsForColor = product.variants.filter((v) => v.color === selectedColor);

  const onSale = product.compareAtPrice !== null && product.compareAtPrice > product.basePrice;
  const discountPct = onSale ? Math.round((1 - product.basePrice / product.compareAtPrice!) * 100) : 0;

  return (
    <div className="grid md:grid-cols-2 gap-12">
      <div>
        <ProductGallery
          key={selectedColor}
          name={product.name}
          images={images}
          fallbackGradient={`linear-gradient(155deg, ${colorToHex(selectedColor)} 0%, #0a0a0a 130%)`}
          badge={
            onSale && (
              <span className="absolute top-4 left-4 bg-gradient-to-br from-gold-light to-gold-dark text-ink text-xs font-bold px-3 py-1.5 tracking-wide">
                -{discountPct}%
              </span>
            )
          }
        />
        {colors.length > 1 && <ColorSwatches colors={colors} selected={selectedColor} onSelect={setSelectedColor} />}
      </div>

      <div>
        <p className="text-xs tracking-widest2 text-gold mb-2">{product.category.name.toUpperCase()}</p>
        <h1 className="font-serif text-3xl md:text-4xl mb-3">{product.name}</h1>
        {reviews.average !== null && (
          <div className="flex items-center gap-2 mb-3">
            <StarRating value={reviews.average} />
            <span className="text-xs text-foreground/40">
              {reviews.average} · {reviews.count} avis
            </span>
          </div>
        )}
        <p className="text-2xl mb-6">
          <span className={onSale ? 'text-gold font-semibold' : 'text-foreground/90'}>{product.basePrice.toFixed(2)} €</span>
          {onSale && <span className="text-foreground/40 line-through ml-3 text-lg">{product.compareAtPrice!.toFixed(2)} €</span>}
        </p>
        {product.description && <p className="text-foreground/60 mb-8 leading-relaxed">{product.description}</p>}

        <AddToCartForm variants={variantsForColor} />

        <dl className="mt-10 pt-6 border-t border-foreground/10 text-xs text-foreground/40 space-y-1">
          <div className="flex gap-2">
            <dt className="tracking-widest2">COULEUR</dt>
            <dd>{selectedColor}</dd>
          </div>
          {(product.lengthCm || product.widthCm || product.heightCm) && (
            <div className="flex gap-2">
              <dt className="tracking-widest2">DIMENSIONS</dt>
              <dd>
                {[product.lengthCm, product.widthCm, product.heightCm]
                  .map((v) => (v !== null ? `${v} cm` : null))
                  .filter(Boolean)
                  .join(' × ')}
              </dd>
            </div>
          )}
        </dl>

        {product.shippingNote && <p className="mt-4 text-xs text-foreground/50 leading-relaxed">{product.shippingNote}</p>}
      </div>
    </div>
  );
}
