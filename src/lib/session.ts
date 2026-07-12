import { backendFetch, BackendError } from '@/lib/backend';
import { getTokenFromCookies } from '@/lib/auth';
import { guestCartHeaders } from '@/lib/guestCart';
import type { Cart, CurrentUser } from '@/lib/types';

export async function getCurrentUser(): Promise<CurrentUser | null> {
  const token = getTokenFromCookies();
  if (!token) {
    return null;
  }

  try {
    return await backendFetch<CurrentUser>('/api/account/me', { token, cache: 'no-store' });
  } catch (e) {
    if (e instanceof BackendError && e.status === 401) {
      return null;
    }
    throw e;
  }
}

export async function getCart(): Promise<Cart | null> {
  const token = getTokenFromCookies();

  try {
    return await backendFetch<Cart>('/api/cart', { token, headers: guestCartHeaders(token), cache: 'no-store' });
  } catch (e) {
    if (e instanceof BackendError && e.status === 401) {
      return null;
    }
    throw e;
  }
}
