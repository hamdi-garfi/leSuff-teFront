import { backendFetch } from '@/lib/backend';

export type Review = {
  id: number;
  rating: number;
  comment: string | null;
  author: string;
  createdAt: string;
};

export type ProductReviews = {
  average: number | null;
  count: number;
  items: Review[];
};

export async function getProductReviews(productId: number): Promise<ProductReviews> {
  return backendFetch<ProductReviews>(`/api/reviews/${productId}`, { cache: 'no-store' });
}
