import { backendFetch } from '@/lib/backend';

export type HomepageSection = {
  id: number;
  type: string;
  position: number;
  enabled: boolean;
};

export async function getHomepageSections(): Promise<HomepageSection[]> {
  return backendFetch<HomepageSection[]>('/api/homepage/sections', { next: { revalidate: 60 } });
}
