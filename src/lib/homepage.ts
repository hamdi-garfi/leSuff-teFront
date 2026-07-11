import { backendFetch } from '@/lib/backend';
import type { HomepageSettings } from '@/lib/types';

export async function getHomepageSettings(): Promise<HomepageSettings> {
  return backendFetch<HomepageSettings>('/api/homepage', { next: { revalidate: 60 } });
}
