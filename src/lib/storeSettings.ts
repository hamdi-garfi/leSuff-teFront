import { backendFetch } from '@/lib/backend';

export type StoreSettings = {
  defaultVatRatePercent: number;
  freeShippingThreshold: number;
  companyName: string | null;
  companyAddress: string | null;
  companyRegistrationNumber: string | null;
  socialInstagram: string | null;
  socialFacebook: string | null;
  socialTiktok: string | null;
  maintenanceModeEnabled: boolean;
};

export async function getStoreSettings(): Promise<StoreSettings> {
  return backendFetch<StoreSettings>('/api/store-settings', { next: { revalidate: 60 } });
}
