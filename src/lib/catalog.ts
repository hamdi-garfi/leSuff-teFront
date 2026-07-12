import { backendFetch, BackendError } from '@/lib/backend';
import type { Category, Product } from '@/lib/types';

export type PaginatedProducts = {
  items: Product[];
  total: number;
  page: number;
  limit: number;
};

export type ProductQuery = {
  category?: string;
  search?: string;
  page?: number;
  limit?: number;
  featured?: boolean;
  newArrivals?: boolean;
  onSale?: boolean;
  inStock?: boolean;
  size?: string[];
  color?: string[];
  fit?: string[];
  material?: string[];
  minPrice?: number;
  maxPrice?: number;
  sort?: 'price_asc' | 'price_desc' | 'name_asc';
};

export type ProductFacets = {
  sizes: string[];
  colors: string[];
  fits: string[];
  materials: string[];
  priceMin: number;
  priceMax: number;
};

export async function getCategories(): Promise<Category[]> {
  return backendFetch<Category[]>('/api/categories', { next: { revalidate: 60 } });
}

export async function getFacets(category?: string): Promise<ProductFacets> {
  const qs = category ? `?category=${encodeURIComponent(category)}` : '';
  return backendFetch<ProductFacets>(`/api/products/facets${qs}`, { next: { revalidate: 60 } });
}

export async function getProducts(query: ProductQuery = {}): Promise<PaginatedProducts> {
  const params = new URLSearchParams();
  if (query.category) params.set('category', query.category);
  if (query.search) params.set('search', query.search);
  if (query.page) params.set('page', String(query.page));
  if (query.limit) params.set('limit', String(query.limit));
  if (query.featured) params.set('featured', 'true');
  if (query.newArrivals) params.set('newArrivals', 'true');
  if (query.onSale) params.set('onSale', 'true');
  if (query.inStock) params.set('inStock', 'true');
  if (query.size?.length) params.set('size', query.size.join(','));
  if (query.color?.length) params.set('color', query.color.join(','));
  if (query.fit?.length) params.set('fit', query.fit.join(','));
  if (query.material?.length) params.set('material', query.material.join(','));
  if (query.minPrice !== undefined) params.set('minPrice', String(query.minPrice));
  if (query.maxPrice !== undefined) params.set('maxPrice', String(query.maxPrice));
  if (query.sort) params.set('sort', query.sort);

  const qs = params.toString();
  return backendFetch<PaginatedProducts>(`/api/products${qs ? `?${qs}` : ''}`, { next: { revalidate: 30 } });
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  try {
    return await backendFetch<Product>(`/api/products/slug/${encodeURIComponent(slug)}`, { next: { revalidate: 30 } });
  } catch (e) {
    if (e instanceof BackendError && e.status === 404) {
      return null;
    }
    throw e;
  }
}
