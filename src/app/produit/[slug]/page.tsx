import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getProductBySlug, getProducts } from '@/lib/catalog';
import { getProductReviews } from '@/lib/reviews';
import { getCurrentUser } from '@/lib/session';
import { getHomepageSettings } from '@/lib/homepage';
import { ProductCard } from '@/components/ProductCard';
import { ProductPurchasePanel } from '@/components/ProductPurchasePanel';
import { ReviewForm } from '@/components/ReviewForm';
import { ReviewsList } from '@/components/ReviewsList';
import { RecentlyViewed } from '@/components/RecentlyViewed';
import type { Product } from '@/lib/types';

const SITE_URL = process.env.SITE_URL || 'http://localhost:3000';

function buildProductJsonLd(product: Product, reviews: { average: number | null; count: number }) {
  const url = `${SITE_URL}/produit/${product.slug}`;

  return {
    '@context': 'https://schema.org',
    '@type': 'ProductGroup',
    name: product.name,
    description: product.description ?? undefined,
    url,
    productGroupID: String(product.id),
    variesBy: ['https://schema.org/size', 'https://schema.org/color'],
    ...(reviews.count > 0 && reviews.average !== null
      ? { aggregateRating: { '@type': 'AggregateRating', ratingValue: reviews.average, reviewCount: reviews.count } }
      : {}),
    hasVariant: product.variants.map((v) => ({
      '@type': 'Product',
      name: `${product.name} — ${v.color} — ${v.size}`,
      sku: v.sku,
      color: v.color,
      size: v.size,
      image: v.imageUrl ?? product.imageUrl ?? undefined,
      offers: {
        '@type': 'Offer',
        url,
        priceCurrency: 'EUR',
        price: v.price,
        availability: v.stock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
      },
    })),
  };
}

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

  const [relatedResult, reviews, user, homepageSettings] = await Promise.all([
    getProducts({ category: product.category.slug, limit: 5 }),
    getProductReviews(product.id),
    getCurrentUser(),
    getHomepageSettings(),
  ]);
  const related = relatedResult.items.filter((p) => p.id !== product.id).slice(0, 4);

  return (
    <div className="mx-auto max-w-7xl px-6 md:px-8 py-16 pb-24 md:pb-16">
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(buildProductJsonLd(product, { average: reviews.average, count: reviews.count })) }}
      />
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
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h2 className="section-title">AVIS CLIENTS</h2>
            <div className="section-title-underline" />
          </div>
          {homepageSettings.googleReviewUrl && (
            <a
              href={homepageSettings.googleReviewUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs tracking-widest2 uppercase border border-foreground/20 px-4 py-2.5 hover:border-gold transition"
            >
              Laissez-nous un avis sur Google
            </a>
          )}
        </div>

        <div className="grid md:grid-cols-3 gap-12">
          <div className="md:col-span-2">
            {reviews.items.length === 0 ? (
              <p className="text-foreground/50 text-sm">Aucun avis pour ce produit pour le moment.</p>
            ) : (
              <ReviewsList reviews={reviews.items} />
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
