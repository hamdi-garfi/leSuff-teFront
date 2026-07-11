import Link from 'next/link';
import Image from 'next/image';
import { getCategories, getProducts } from '@/lib/catalog';
import { getHomepageSettings } from '@/lib/homepage';
import { ProductCard } from '@/components/ProductCard';
import { MountainBackdrop } from '@/components/MountainBackdrop';

const CATEGORY_GRADIENTS: Record<string, string> = {
  polos: 'linear-gradient(155deg, #1e2a4a 0%, #0a0a0a 130%)',
  't-shirts': 'linear-gradient(155deg, #3a3a3a 0%, #0a0a0a 130%)',
  'sweats-hoodies': 'linear-gradient(155deg, #161616 0%, #0a0a0a 130%)',
  casquettes: 'linear-gradient(155deg, #4a3b1e 0%, #0a0a0a 130%)',
};

export default async function HomePage() {
  const [categories, homepage, featured, latest] = await Promise.all([
    getCategories(),
    getHomepageSettings(),
    getProducts({ featured: true, limit: 5 }),
    getProducts({ limit: 4 }),
  ]);
  const bestSellers = featured.items.length > 0 ? featured.items : (await getProducts({ limit: 5 })).items;

  return (
    <div>
      <section className="relative overflow-hidden border-b border-foreground/10">
        <MountainBackdrop />
        <div className="relative mx-auto max-w-7xl px-6 md:px-8 py-12 md:py-16 grid md:grid-cols-2 gap-12 items-center">
          <div className="max-w-[450px]">
            <p className="text-gold text-[13px] tracking-[0.08em] mb-4">{homepage.heroKicker}</p>
            <h1 className="font-serif text-[58px] md:text-[68px] leading-[1.05] mb-6 text-foreground">{homepage.heroTitle}</h1>
            <p className="text-foreground/70 text-[17px] md:text-[18px] mb-8 whitespace-pre-line">{homepage.heroSubtitle}</p>
            <Link href={homepage.heroButtonLink} className="btn-gold">
              {homepage.heroButtonLabel} →
            </Link>
          </div>
          <div className="relative aspect-square mx-auto w-full max-w-[357px] flex items-center justify-center">
            <div className="absolute inset-0 rounded-full bg-gold/10 blur-3xl" />
            <div className="absolute inset-0 rounded-full border border-gold/15" />
            <Image src="/logo.png" alt="Le Suffète" width={280} height={280} className="object-contain relative z-10 p-8" priority />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 md:px-8 py-20">
        <h2 className="section-title">NOS COLLECTIONS</h2>
        <div className="section-title-underline" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {categories.map((category) => (
            <Link key={category.id} href={`/collection/${category.slug}`} className="group block">
              <div
                className="aspect-[3/4] overflow-hidden"
                style={{ background: CATEGORY_GRADIENTS[category.slug] ?? 'linear-gradient(155deg,#222,#0a0a0a)' }}
              >
                <div className="w-full h-full transition-transform duration-500 group-hover:scale-[1.04]" />
              </div>
              <div className="pt-3 text-center">
                <h3 className="font-serif text-lg tracking-wide">{category.name.toUpperCase()}</h3>
                <span className="text-[10px] tracking-widest2 text-gold group-hover:underline">
                  VOIR LA COLLECTION
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {latest.items.length > 0 && (
        <section className="mx-auto max-w-7xl px-6 md:px-8 pb-24">
          <h2 className="section-title">NOUVEAUTÉS</h2>
          <div className="section-title-underline" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {latest.items.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      )}

      <section className="bg-surface2 py-20">
        <div className="mx-auto max-w-4xl px-6 md:px-8 text-center">
          <h2 className="section-title">L&apos;HÉRITAGE LE SUFFÈTE</h2>
          <div className="section-title-underline" />
          <p className="text-foreground/70 text-[17px] leading-relaxed">
            Le suffète était le plus haut magistrat de Carthage, garant de l&apos;autorité et de l&apos;élégance du pouvoir.
            Le Suffète Classic puise dans cet héritage pour concevoir des pièces intemporelles, taillées pour ceux qui
            savent qu&apos;une allure affirmée ne se démode jamais.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 md:px-8 py-24">
        <h2 className="section-title">BEST-SELLERS</h2>
        <div className="section-title-underline" />
        <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
          {bestSellers.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
    </div>
  );
}
