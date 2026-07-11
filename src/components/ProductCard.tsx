import Link from 'next/link';
import type { Product } from '@/lib/types';
import { colorToHex } from '@/lib/colors';

export function ProductCard({ product }: { product: Product }) {
  const color = product.variants[0]?.color ?? '';
  const totalStock = product.variants.reduce((sum, v) => sum + v.stock, 0);

  return (
    <Link href={`/produit/${product.slug}`} className="group block">
      <div
        className="aspect-[3/4] w-full flex items-center justify-center relative overflow-hidden"
        style={
          product.imageUrl
            ? undefined
            : { background: `linear-gradient(155deg, ${colorToHex(color)} 0%, #0a0a0a 120%)` }
        }
      >
        {product.imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
        ) : (
          <span className="font-serif text-5xl text-white/15 group-hover:text-gold/25 transition-colors select-none">
            {product.name.charAt(0)}
          </span>
        )}
        {totalStock <= 5 && totalStock > 0 && (
          <span className="absolute top-3 left-3 bg-white text-ink text-[10px] font-bold px-2 py-1 tracking-wide">
            PRESQUE ÉPUISÉ
          </span>
        )}
        {totalStock === 0 && (
          <span className="absolute top-3 left-3 bg-black/80 text-white text-[10px] font-bold px-2 py-1 tracking-wide">
            RUPTURE
          </span>
        )}
      </div>
      <div className="pt-3">
        <h3 className="text-sm text-white/90 group-hover:text-gold transition">{product.name}</h3>
        <p className="text-sm text-white/60 mt-0.5">{product.basePrice.toFixed(2)} €</p>
        <span
          className="inline-block w-3 h-3 rounded-full border border-white/30 mt-2"
          style={{ backgroundColor: colorToHex(color) }}
          title={color}
        />
      </div>
    </Link>
  );
}
