import { backendFetch } from '@/lib/backend';
import { getTokenFromCookies } from '@/lib/auth';
import type { WishlistItem } from '@/lib/types';

export async function getWishlist(): Promise<WishlistItem[]> {
  const token = getTokenFromCookies();
  if (!token) {
    return [];
  }

  try {
    return await backendFetch<WishlistItem[]>('/api/wishlist', { token, cache: 'no-store' });
  } catch {
    return [];
  }
}
