import type { ProductQuery } from '@/lib/catalog';

export type CollectionSearchParams = {
  q?: string;
  page?: string;
  size?: string;
  color?: string;
  fit?: string;
  material?: string;
  minPrice?: string;
  maxPrice?: string;
  inStock?: string;
  onSale?: string;
  sort?: string;
};

const SORT_VALUES = new Set(['price_asc', 'price_desc', 'name_asc']);

export function parseCollectionSearchParams(searchParams: CollectionSearchParams, limit: number): ProductQuery & { search: string } {
  const page = Math.max(1, Number(searchParams.page ?? 1) || 1);
  const search = searchParams.q ?? '';
  const sort = searchParams.sort && SORT_VALUES.has(searchParams.sort) ? (searchParams.sort as ProductQuery['sort']) : undefined;

  return {
    search,
    page,
    limit,
    size: searchParams.size?.split(',').filter(Boolean),
    color: searchParams.color?.split(',').filter(Boolean),
    fit: searchParams.fit?.split(',').filter(Boolean),
    material: searchParams.material?.split(',').filter(Boolean),
    minPrice: searchParams.minPrice ? Number(searchParams.minPrice) : undefined,
    maxPrice: searchParams.maxPrice ? Number(searchParams.maxPrice) : undefined,
    inStock: searchParams.inStock === 'true',
    onSale: searchParams.onSale === 'true',
    sort,
  };
}

export function searchParamsToExtra(searchParams: CollectionSearchParams): Record<string, string> {
  const extra: Record<string, string> = {};
  if (searchParams.q) extra.q = searchParams.q;
  if (searchParams.size) extra.size = searchParams.size;
  if (searchParams.color) extra.color = searchParams.color;
  if (searchParams.fit) extra.fit = searchParams.fit;
  if (searchParams.material) extra.material = searchParams.material;
  if (searchParams.minPrice) extra.minPrice = searchParams.minPrice;
  if (searchParams.maxPrice) extra.maxPrice = searchParams.maxPrice;
  if (searchParams.inStock) extra.inStock = searchParams.inStock;
  if (searchParams.onSale) extra.onSale = searchParams.onSale;
  if (searchParams.sort) extra.sort = searchParams.sort;
  return extra;
}
