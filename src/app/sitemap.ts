import type { MetadataRoute } from 'next';
import { getCategories, getProducts } from '@/lib/catalog';
import { getStaticPages } from '@/lib/pages';

// The backend is unreachable during the Docker image build (no network yet),
// so this route must render per-request rather than be prerendered at build time.
export const dynamic = 'force-dynamic';

const SITE_URL = process.env.SITE_URL || 'http://localhost:3000';

async function getAllProductSlugs(): Promise<string[]> {
  const slugs: string[] = [];
  let page = 1;
  const limit = 100;

  while (true) {
    const { items, total } = await getProducts({ page, limit });
    slugs.push(...items.map((p) => p.slug));
    if (slugs.length >= total || items.length === 0) break;
    page += 1;
  }

  return slugs;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [categories, productSlugs, staticPages] = await Promise.all([
    getCategories(),
    getAllProductSlugs(),
    getStaticPages(),
  ]);

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: SITE_URL, changeFrequency: 'daily', priority: 1 },
    { url: `${SITE_URL}/collection`, changeFrequency: 'daily', priority: 0.8 },
  ];

  const categoryRoutes: MetadataRoute.Sitemap = categories.map((c) => ({
    url: `${SITE_URL}/collection/${c.slug}`,
    changeFrequency: 'daily',
    priority: 0.7,
  }));

  const productRoutes: MetadataRoute.Sitemap = productSlugs.map((slug) => ({
    url: `${SITE_URL}/produit/${slug}`,
    changeFrequency: 'weekly',
    priority: 0.6,
  }));

  const pageRoutes: MetadataRoute.Sitemap = staticPages.map((p) => ({
    url: `${SITE_URL}/pages/${p.slug}`,
    changeFrequency: 'monthly',
    priority: 0.3,
  }));

  return [...staticRoutes, ...categoryRoutes, ...productRoutes, ...pageRoutes];
}
