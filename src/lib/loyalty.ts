import { backendFetch, BackendError } from '@/lib/backend';
import { getTokenFromCookies } from '@/lib/auth';
import type { Loyalty } from '@/lib/loyaltyLabels';

export type { Loyalty, LoyaltyTransaction } from '@/lib/loyaltyLabels';
export { LOYALTY_REASON_LABELS } from '@/lib/loyaltyLabels';

export async function getLoyalty(): Promise<Loyalty | null> {
  const token = getTokenFromCookies();
  if (!token) {
    return null;
  }

  try {
    return await backendFetch<Loyalty>('/api/account/loyalty', { token, cache: 'no-store' });
  } catch (e) {
    if (e instanceof BackendError && e.status === 401) {
      return null;
    }
    throw e;
  }
}
