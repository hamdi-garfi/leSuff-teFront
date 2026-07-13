import { getCategories, getProducts } from '@/lib/catalog';
import { OutfitBuilder } from '@/components/OutfitBuilder';

export const metadata = { title: 'Créez votre tenue — Le Suffète Classic' };

export default async function OutfitPage() {
  const categories = await getCategories();

  const slots = await Promise.all(
    categories.map(async (category) => {
      const result = await getProducts({ category: category.slug, limit: 24 });
      return {
        categorySlug: category.slug,
        categoryName: category.name,
        products: result.items.filter((p) => p.variants.some((v) => v.stock > 0)),
      };
    }),
  );

  return (
    <div className="mx-auto max-w-7xl px-6 md:px-8 py-16">
      <h1 className="section-title">CRÉEZ VOTRE TENUE</h1>
      <div className="section-title-underline" />
      <p className="text-foreground/60 text-sm mb-12 max-w-2xl">
        Choisissez un article par catégorie pour composer votre tenue et profitez de -10% sur l&apos;ensemble dès 2 articles.
      </p>
      <OutfitBuilder slots={slots.filter((s) => s.products.length > 0)} />
    </div>
  );
}
