import { backendFetch, BackendError } from '@/lib/backend';
import { getTokenFromCookies } from '@/lib/auth';

export type AccountOrder = {
  id: number;
  number: string;
  status: string;
  total: number;
  createdAt: string;
  items: { productName: string; size: string; color: string; quantity: number; unitPrice: number }[];
};

export async function getMyOrders(): Promise<AccountOrder[]> {
  const token = getTokenFromCookies();
  if (!token) {
    return [];
  }

  try {
    return await backendFetch<AccountOrder[]>('/api/account/orders', { token, cache: 'no-store' });
  } catch (e) {
    if (e instanceof BackendError && e.status === 401) {
      return [];
    }
    throw e;
  }
}
