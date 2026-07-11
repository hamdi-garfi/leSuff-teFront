import { backendFetch, BackendError } from '@/lib/backend';
import { getTokenFromCookies } from '@/lib/auth';
import type { Address } from '@/lib/types';

export async function getMyAddresses(): Promise<Address[]> {
  const token = getTokenFromCookies();
  if (!token) {
    return [];
  }

  try {
    return await backendFetch<Address[]>('/api/account/addresses', { token, cache: 'no-store' });
  } catch (e) {
    if (e instanceof BackendError && e.status === 401) {
      return [];
    }
    throw e;
  }
}
