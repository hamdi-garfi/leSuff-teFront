import { backendFetch, BackendError } from '@/lib/backend';

export type StaticPageSummary = {
  slug: string;
  title: string;
};

export type StaticPage = StaticPageSummary & {
  content: string;
  seoTitle: string | null;
  seoDescription: string | null;
};

export async function getStaticPages(): Promise<StaticPageSummary[]> {
  return backendFetch<StaticPageSummary[]>('/api/pages', { next: { revalidate: 300 } });
}

export async function getStaticPage(slug: string): Promise<StaticPage | null> {
  try {
    return await backendFetch<StaticPage>(`/api/pages/${encodeURIComponent(slug)}`, { next: { revalidate: 300 } });
  } catch (e) {
    if (e instanceof BackendError && e.status === 404) {
      return null;
    }
    throw e;
  }
}
