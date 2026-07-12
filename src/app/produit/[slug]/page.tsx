import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getProductBySlug, getProducts } from '@/lib/catalog';
import { getProductReviews } from '@/lib/reviews';
import { getCurrentUser } from '@/lib/session';
import { ProductCard } from '@/components/ProductCard';
import { ProductPurchasePanel } from '@/components/ProductPurchasePanel';
import { StarRating } from '@/components/StarRating';
import { ReviewForm } from '@/components/ReviewForm';
import { RecentlyViewed } from '@/components/RecentlyViewed';

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const product = await getProductBySlug(params.slug);
  if (!product) {
    return { title: 'Produit introuvable' };
  }

  const title = product.seoTitle || `${product.name} — Le Suffète Classic`;
  const description = product.seoDescription || product.description || undefined;

  return {
    title,
    description,
    alternates: { canonical: `/produit/${product.slug}` },
    openGraph: {
      title,
      description,
      images: product.imageUrl ? [{ url: product.imageUrl }] : undefined,
    },
  };
}

export default async function ProductPage({
  params,
  searchParams,
}: {
  params: { slug: string };
  searchParams: { color?: string };
}) {
  const product = await getProductBySlug(params.slug);

  if (!product || !product.isPublished) {
    notFound();
  }

  const [relatedResult, reviews, user] = await Promise.all([
    getProducts({ category: product.category.slug, limit: 5 }),
    getProductReviews(product.id),
    getCurrentUser(),
  ]);
  const related = relatedResult.items.filter((p) => p.id !== product.id).slice(0, 4);

  return (
    <div className="mx-auto max-w-7xl px-6 md:px-8 py-16">
      <p className="text-xs text-foreground/40 mb-8">
        <Link href="/" className="hover:text-gold">
          Accueil
        </Link>{' '}
        /{' '}
        <Link href={`/collection/${product.category.slug}`} className="hover:text-gold">
          {product.category.name}
        </Link>{' '}
        / <span className="text-foreground/70">{product.name}</span>
      </p>

      <ProductPurchasePanel
        product={product}
        reviews={{ average: reviews.average, count: reviews.count }}
        initialColor={searchParams.color}
      />

      {product.videoUrl && (
        <section className="mt-16 max-w-3xl">
          <h2 className="section-title">VIDÉO PRODUIT</h2>
          <div className="section-title-underline" />
          {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
          <video src={product.videoUrl} controls playsInline className="w-full aspect-video bg-black/40" />
        </section>
      )}

      <section className="mt-24">
        <h2 className="section-title">AVIS CLIENTS</h2>
        <div className="section-title-underline" />

        <div className="grid md:grid-cols-3 gap-12">
          <div className="md:col-span-2 space-y-6">
            {reviews.items.length === 0 ? (
              <p className="text-foreground/50 text-sm">Aucun avis pour ce produit pour le moment.</p>
            ) : (
              reviews.items.map((review) => (
                <div key={review.id} className="border-b border-foreground/10 pb-6">
                  <div className="flex items-center gap-2 mb-1">
                    <StarRating value={review.rating} />
                    <span className="text-sm">{review.author}</span>
                  </div>
                  <p className="text-xs text-foreground/40 mb-2">
                    {new Date(review.createdAt).toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' })}
                  </p>
                  {review.comment && <p className="text-foreground/70 text-sm">{review.comment}</p>}
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

      <RecentlyViewed currentSlug={product.slug} />
    </div>
  );
}
