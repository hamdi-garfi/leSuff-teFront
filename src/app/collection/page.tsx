import { getProducts } from '@/lib/catalog';
import { ProductCard } from '@/components/ProductCard';
import { SearchBox } from '@/components/SearchBox';
import { Pagination } from '@/components/Pagination';

export const metadata = { title: 'Toutes les collections — Le Suffète Classic' };

const LIMIT = 12;

export default async function CollectionPage({ searchParams }: { searchParams: { q?: string; page?: string } }) {
  const page = Math.max(1, Number(searchParams.page ?? 1) || 1);
  const search = searchParams.q ?? '';

  const { items, total } = await getProducts({ search: search || undefined, page, limit: LIMIT });
  const totalPages = Math.max(1, Math.ceil(total / LIMIT));

  return (
    <div className="mx-auto max-w-7xl px-6 md:px-8 py-16">
      <h1 className="section-title">TOUTE LA COLLECTION</h1>
      <div className="section-title-underline" />

      <SearchBox basePath="/collection" defaultValue={search} />

      {items.length === 0 ? (
        <p className="text-center text-white/50 mt-12">Aucun produit ne correspond à cette recherche.</p>
      ) : (
        <>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-10">
            {items.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          <Pagination basePath="/collection" page={page} totalPages={totalPages} extraParams={search ? { q: search } : {}} />
        </>
      )}
    </div>
  );
}
