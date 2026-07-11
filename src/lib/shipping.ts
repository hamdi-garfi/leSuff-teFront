import { backendFetch } from '@/lib/backend';
import type { ShippingZone } from '@/lib/types';

export async function getShippingZones(): Promise<ShippingZone[]> {
  return backendFetch<ShippingZone[]>('/api/shipping-zones', { next: { revalidate: 60 } });
}
