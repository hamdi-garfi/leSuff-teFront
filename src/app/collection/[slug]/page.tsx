import { notFound } from 'next/navigation';
import { getCategories, getFacets, getProducts } from '@/lib/catalog';
import { ProductCard } from '@/components/ProductCard';
import { SearchBox } from '@/components/SearchBox';
import { Pagination } from '@/components/Pagination';
import { FilterBar } from '@/components/FilterBar';
import type { CollectionSearchParams } from '@/lib/collectionQuery';
import { parseCollectionSearchParams, searchParamsToExtra } from '@/lib/collectionQuery';

const LIMIT = 12;

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const categories = await getCategories();
  const category = categories.find((c) => c.slug === params.slug);
  if (!category) {
    return { title: 'Collection introuvable' };
  }

  const title = category.seoTitle || `${category.name} — Le Suffète Classic`;
  const description = category.seoDescription || category.description || undefined;

  return {
    title,
    description,
    alternates: { canonical: `/collection/${category.slug}` },
    openGraph: {
      title,
      description,
      images: category.imageUrl ? [{ url: category.imageUrl }] : undefined,
    },
  };
}

export default async function CategoryPage({
  params,
  searchParams,
}: {
  params: { slug: string };
  searchParams: CollectionSearchParams;
}) {
  const categories = await getCategories();
  const category = categories.find((c) => c.slug === params.slug);

  if (!category) {
    notFound();
  }

  const query = parseCollectionSearchParams(searchParams, LIMIT);
  const [{ items, total }, facets] = await Promise.all([
    getProducts({ ...query, category: params.slug }),
    getFacets(params.slug),
  ]);
  const totalPages = Math.max(1, Math.ceil(total / LIMIT));

  return (
    <div className="mx-auto max-w-7xl px-6 md:px-8 py-16">
      <h1 className="section-title">{category.name.toUpperCase()}</h1>
      <div className="section-title-underline" />
      {category.description && (
        <p className="text-center text-foreground/50 max-w-lg mx-auto -mt-6 mb-10">{category.description}</p>
      )}

      <SearchBox basePath={`/collection/${params.slug}`} defaultValue={query.search} />
      <FilterBar basePath={`/collection/${params.slug}`} facets={facets} />

      {items.length === 0 ? (
        <p className="text-center text-foreground/50 mt-12">Aucun produit dans cette collection pour le moment.</p>
      ) : (
        <>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-10">
            {items.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          <Pagination
            basePath={`/collection/${params.slug}`}
            page={query.page ?? 1}
            totalPages={totalPages}
            extraParams={searchParamsToExtra(searchParams)}
          />
        </>
      )}
    </div>
  );
}
