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
};

export async function getCategories(): Promise<Category[]> {
  return backendFetch<Category[]>('/api/categories', { next: { revalidate: 60 } });
}

export async function getProducts(query: ProductQuery = {}): Promise<PaginatedProducts> {
  const params = new URLSearchParams();
  if (query.category) params.set('category', query.category);
  if (query.search) params.set('search', query.search);
  if (query.page) params.set('page', String(query.page));
  if (query.limit) params.set('limit', String(query.limit));
  if (query.featured) params.set('featured', 'true');
  if (query.newArrivals) params.set('newArrivals', 'true');

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
