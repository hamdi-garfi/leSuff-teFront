'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import type { Product } from '@/lib/types';
import { colorToHex } from '@/lib/colors';
import { QuickViewModal } from '@/components/QuickViewModal';
import { WishlistButton } from '@/components/WishlistButton';

export function ProductCard({ product }: { product: Product }) {
  const colors = useMemo(() => Array.from(new Set(product.variants.map((v) => v.color))), [product.variants]);
  const defaultColor = colors[0] ?? '';
  const [quickViewOpen, setQuickViewOpen] = useState(false);
  const [previewColor, setPreviewColor] = useState(defaultColor);

  const previewImage = useMemo(() => {
    if (colors.length <= 1) return null;
    const variantWithImage = product.variants.find((v) => v.color === previewColor && v.imageUrl);
    return variantWithImage?.imageUrl ?? product.imageUrl;
  }, [colors.length, product.variants, product.imageUrl, previewColor]);

  const totalStock = product.variants.reduce((sum, v) => sum + v.stock, 0);
  const onSale = product.compareAtPrice !== null && product.compareAtPrice > product.basePrice;
  const discountPct = onSale ? Math.round((1 - product.basePrice / product.compareAtPrice!) * 100) : 0;
  const hoverImage = product.galleryImages[0];
  const mainImage = previewImage ?? product.imageUrl;

  const hrefFor = (color: string) =>
    color && color !== defaultColor ? `/produit/${product.slug}?color=${encodeURIComponent(color)}` : `/produit/${product.slug}`;

  return (
    <div className="group block">
      <div className="relative">
        <Link href={hrefFor(previewColor)} className="block">
          <div
            className="aspect-[3/4] w-full flex items-center justify-center relative overflow-hidden"
            style={mainImage ? undefined : { background: `linear-gradient(155deg, ${colorToHex(previewColor)} 0%, #0a0a0a 120%)` }}
          >
            {mainImage ? (
              <>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={mainImage}
                  alt={product.name}
                  className={`w-full h-full object-cover transition-all duration-300 group-hover:scale-105 ${!previewImage && hoverImage ? 'group-hover:opacity-0' : ''}`}
                />
                {!previewImage && hoverImage && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={hoverImage}
                    alt=""
                    aria-hidden="true"
                    className="absolute inset-0 w-full h-full object-cover opacity-0 scale-105 group-hover:opacity-100 transition-opacity duration-300"
                  />
                )}
              </>
            ) : (
              <span className="font-serif text-5xl text-foreground/15 group-hover:text-gold/25 transition-colors select-none">
                {product.name.charAt(0)}
              </span>
            )}
            {onSale && (
              <span className="absolute top-3 left-3 bg-gradient-to-br from-gold-light to-gold-dark text-ink text-[10px] font-bold px-2 py-1 tracking-wide">
                -{discountPct}%
              </span>
            )}
            {!onSale && totalStock <= 5 && totalStock > 0 && (
              <span className="absolute top-3 left-3 bg-white text-ink text-[10px] font-bold px-2 py-1 tracking-wide">
                PRESQUE ÉPUISÉ
              </span>
            )}
            {totalStock === 0 && (
              <span className="absolute top-3 left-3 bg-black/80 text-white text-[10px] font-bold px-2 py-1 tracking-wide">
                RUPTURE
              </span>
            )}
            <WishlistButton
              productId={product.id}
              className="absolute top-2 right-2 w-8 h-8 flex items-center justify-center text-white hover:text-gold transition drop-shadow-md"
            />
          </div>
        </Link>
        {totalStock > 0 && (
          <button
            type="button"
            onClick={() => setQuickViewOpen(true)}
            className="absolute bottom-0 left-0 right-0 text-center text-[11px] tracking-widest2 uppercase text-white py-3 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition"
          >
            Vue rapide
          </button>
        )}
      </div>
      {quickViewOpen && <QuickViewModal product={product} onClose={() => setQuickViewOpen(false)} />}
      <div className="pt-3">
        <Link href={hrefFor(previewColor)} className="text-sm text-foreground/90 hover:text-gold transition">
          {product.name}
        </Link>
        <p className="text-sm mt-0.5">
          <span className={onSale ? 'text-gold font-semibold' : 'text-foreground/60'}>{product.basePrice.toFixed(2)} €</span>
          {onSale && <span className="text-foreground/40 line-through ml-2 text-xs">{product.compareAtPrice!.toFixed(2)} €</span>}
        </p>
        {colors.length > 1 ? (
          <div className="flex items-center gap-1.5 mt-2" onMouseLeave={() => setPreviewColor(defaultColor)}>
            {colors.map((color) => (
              <Link
                key={color}
                href={hrefFor(color)}
                onMouseEnter={() => setPreviewColor(color)}
                aria-label={color}
                title={color}
                className={`w-3.5 h-3.5 rounded-full border transition ${
                  color === previewColor ? 'border-gold scale-110' : 'border-foreground/30 hover:border-foreground/60'
                }`}
                style={{ backgroundColor: colorToHex(color) }}
              />
            ))}
          </div>
        ) : (
          <span
            className="inline-block w-3 h-3 rounded-full border border-foreground/30 mt-2"
            style={{ backgroundColor: colorToHex(defaultColor) }}
            title={defaultColor}
          />
        )}
      </div>
    </div>
  );
}
