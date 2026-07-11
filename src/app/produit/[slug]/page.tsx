import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getProductBySlug, getProducts } from '@/lib/catalog';
import { getProductReviews } from '@/lib/reviews';
import { getCurrentUser } from '@/lib/session';
import { colorToHex } from '@/lib/colors';
import { AddToCartForm } from '@/components/AddToCartForm';
import { ProductCard } from '@/components/ProductCard';
import { StarRating } from '@/components/StarRating';
import { ReviewForm } from '@/components/ReviewForm';

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const product = await getProductBySlug(params.slug);
  return { title: product ? `${product.name} — Le Suffète Classic` : 'Produit introuvable' };
}

export default async function ProductPage({ params }: { params: { slug: string } }) {
  const product = await getProductBySlug(params.slug);

  if (!product || !product.isPublished) {
    notFound();
  }

  const color = product.variants[0]?.color ?? '';
  const onSale = product.compareAtPrice !== null && product.compareAtPrice > product.basePrice;
  const discountPct = onSale ? Math.round((1 - product.basePrice / product.compareAtPrice!) * 100) : 0;
  const [relatedResult, reviews, user] = await Promise.all([
    getProducts({ category: product.category.slug, limit: 5 }),
    getProductReviews(product.id),
    getCurrentUser(),
  ]);
  const related = relatedResult.items.filter((p) => p.id !== product.id).slice(0, 4);

  return (
    <div className="mx-auto max-w-7xl px-6 md:px-8 py-16">
      <p className="text-xs text-white/40 mb-8">
        <Link href="/" className="hover:text-gold">
          Accueil
        </Link>{' '}
        /{' '}
        <Link href={`/collection/${product.category.slug}`} className="hover:text-gold">
          {product.category.name}
        </Link>{' '}
        / <span className="text-white/70">{product.name}</span>
      </p>

      <div className="grid md:grid-cols-2 gap-12">
        <div
          className="aspect-square flex items-center justify-center overflow-hidden relative"
          style={product.imageUrl ? undefined : { background: `linear-gradient(155deg, ${colorToHex(color)} 0%, #0a0a0a 130%)` }}
        >
          {product.imageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
          ) : (
            <span className="font-serif text-9xl text-white/10 select-none">{product.name.charAt(0)}</span>
          )}
          {onSale && (
            <span className="absolute top-4 left-4 bg-gradient-to-br from-gold-light to-gold-dark text-ink text-xs font-bold px-3 py-1.5 tracking-wide">
              -{discountPct}%
            </span>
          )}
        </div>

        <div>
          <p className="text-xs tracking-widest2 text-gold mb-2">{product.category.name.toUpperCase()}</p>
          <h1 className="font-serif text-3xl md:text-4xl mb-3">{product.name}</h1>
          {reviews.average !== null && (
            <div className="flex items-center gap-2 mb-3">
              <StarRating value={reviews.average} />
              <span className="text-xs text-white/40">
                {reviews.average} · {reviews.count} avis
              </span>
            </div>
          )}
          <p className="text-2xl mb-6">
            <span className={onSale ? 'text-gold font-semibold' : 'text-white/90'}>{product.basePrice.toFixed(2)} €</span>
            {onSale && <span className="text-white/40 line-through ml-3 text-lg">{product.compareAtPrice!.toFixed(2)} €</span>}
          </p>
          {product.description && <p className="text-white/60 mb-8 leading-relaxed">{product.description}</p>}

          <AddToCartForm variants={product.variants} />

          <dl className="mt-10 pt-6 border-t border-white/10 text-xs text-white/40 space-y-1">
            <div className="flex gap-2">
              <dt className="tracking-widest2">COULEUR</dt>
              <dd>{color}</dd>
            </div>
          </dl>
        </div>
      </div>

      <section className="mt-24">
        <h2 className="section-title">AVIS CLIENTS</h2>
        <div className="section-title-underline" />

        <div className="grid md:grid-cols-3 gap-12">
          <div className="md:col-span-2 space-y-6">
            {reviews.items.length === 0 ? (
              <p className="text-white/50 text-sm">Aucun avis pour ce produit pour le moment.</p>
            ) : (
              reviews.items.map((review) => (
                <div key={review.id} className="border-b border-white/10 pb-6">
                  <div className="flex items-center gap-2 mb-1">
                    <StarRating value={review.rating} />
                    <span className="text-sm">{review.author}</span>
                  </div>
                  <p className="text-xs text-white/40 mb-2">
                    {new Date(review.createdAt).toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' })}
                  </p>
                  {review.comment && <p className="text-white/70 text-sm">{review.comment}</p>}
                </div>
              ))
            )}
          </div>
          <ReviewForm productId={product.id} isAuthenticated={!!user} />
        </div>
      </section>

      {related.length > 0 && (
        <section className="mt-24">
          <h2 className="section-title">VOUS AIMEREZ AUSSI</h2>
          <div className="section-title-underline" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
