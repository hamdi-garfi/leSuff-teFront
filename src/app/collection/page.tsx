import { getFacets, getProducts } from '@/lib/catalog';
import { ProductCard } from '@/components/ProductCard';
import { SearchBox } from '@/components/SearchBox';
import { Pagination } from '@/components/Pagination';
import { FilterBar } from '@/components/FilterBar';
import type { CollectionSearchParams } from '@/lib/collectionQuery';
import { parseCollectionSearchParams, searchParamsToExtra } from '@/lib/collectionQuery';

export const metadata = { title: 'Toutes les collections — Le Suffète Classic' };

const LIMIT = 12;

export default async function CollectionPage({ searchParams }: { searchParams: CollectionSearchParams }) {
  const query = parseCollectionSearchParams(searchParams, LIMIT);
  const [{ items, total }, facets] = await Promise.all([getProducts(query), getFacets()]);
  const totalPages = Math.max(1, Math.ceil(total / LIMIT));

  return (
    <div className="mx-auto max-w-7xl px-6 md:px-8 py-16">
      <h1 className="section-title">TOUTE LA COLLECTION</h1>
      <div className="section-title-underline" />

      <SearchBox basePath="/collection" defaultValue={query.search} />
      <FilterBar basePath="/collection" facets={facets} />

      {items.length === 0 ? (
        <p className="text-center text-foreground/50 mt-12">Aucun produit ne correspond à cette recherche.</p>
      ) : (
        <>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-10">
            {items.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          <Pagination basePath="/collection" page={query.page ?? 1} totalPages={totalPages} extraParams={searchParamsToExtra(searchParams)} />
        </>
      )}
    </div>
  );
}
