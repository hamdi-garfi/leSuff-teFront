import { notFound } from 'next/navigation';
import { getCategories, getProducts } from '@/lib/catalog';
import { ProductCard } from '@/components/ProductCard';
import { SearchBox } from '@/components/SearchBox';
import { Pagination } from '@/components/Pagination';

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
  searchParams: { q?: string; page?: string };
}) {
  const categories = await getCategories();
  const category = categories.find((c) => c.slug === params.slug);

  if (!category) {
    notFound();
  }

  const page = Math.max(1, Number(searchParams.page ?? 1) || 1);
  const search = searchParams.q ?? '';

  const { items, total } = await getProducts({
    category: params.slug,
    search: search || undefined,
    page,
    limit: LIMIT,
  });
  const totalPages = Math.max(1, Math.ceil(total / LIMIT));

  return (
    <div className="mx-auto max-w-7xl px-6 md:px-8 py-16">
      <h1 className="section-title">{category.name.toUpperCase()}</h1>
      <div className="section-title-underline" />
      {category.description && (
        <p className="text-center text-foreground/50 max-w-lg mx-auto -mt-6 mb-10">{category.description}</p>
      )}

      <SearchBox basePath={`/collection/${params.slug}`} defaultValue={search} />

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
            page={page}
            totalPages={totalPages}
            extraParams={search ? { q: search } : {}}
          />
        </>
      )}
    </div>
  );
}
