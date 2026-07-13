import { backendFetch } from '@/lib/backend';

export type Review = {
  id: number;
  rating: number;
  comment: string | null;
  author: string;
  createdAt: string;
  verifiedPurchase: boolean;
  sizeBought: string | null;
  colorBought: string | null;
  fitRating: number | null;
  qualityRating: number | null;
  comfortRating: number | null;
  photoUrl: string | null;
  brandReply: string | null;
  brandReplyAt: string | null;
};

export type ProductReviews = {
  average: number | null;
  count: number;
  items: Review[];
};

export async function getProductReviews(productId: number): Promise<ProductReviews> {
  return backendFetch<ProductReviews>(`/api/reviews/${productId}`, { cache: 'no-store' });
}
