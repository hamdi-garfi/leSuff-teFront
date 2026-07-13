import Link from 'next/link';
import Image from 'next/image';
import { getCategories, getProducts } from '@/lib/catalog';
import { getHomepageSettings } from '@/lib/homepage';
import { getHomepageSections } from '@/lib/homepageSections';
import { ProductCard } from '@/components/ProductCard';
import { MountainBackdrop } from '@/components/MountainBackdrop';

const CATEGORY_GRADIENTS: Record<string, string> = {
  polos: 'linear-gradient(155deg, #1e2a4a 0%, #0a0a0a 130%)',
  't-shirts': 'linear-gradient(155deg, #3a3a3a 0%, #0a0a0a 130%)',
  'sweats-hoodies': 'linear-gradient(155deg, #161616 0%, #0a0a0a 130%)',
  casquettes: 'linear-gradient(155deg, #4a3b1e 0%, #0a0a0a 130%)',
};

export default async function HomePage() {
  const [categories, homepage, sections, featured, newArrivals] = await Promise.all([
    getCategories(),
    getHomepageSettings(),
    getHomepageSections(),
    getProducts({ featured: true, limit: 5 }),
    getProducts({ newArrivals: true, limit: 4 }),
  ]);
  const bestSellers = featured.items.length > 0 ? featured.items : (await getProducts({ limit: 5 })).items;
  const latest = newArrivals.items.length > 0 ? newArrivals.items : (await getProducts({ limit: 4 })).items;

  const sectionsByType: Record<string, React.ReactNode> = {
    hero: (
      <section key="hero" className="relative overflow-hidden border-b border-foreground/10">
        {homepage.heroVideoUrl ? (
          <>
            <video
              src={homepage.heroVideoUrl}
              autoPlay
              muted
              loop
              playsInline
              className="absolute inset-0 w-full h-full object-cover opacity-50"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-surface/45 via-surface/55 to-surface" />
            <div className="absolute inset-0 bg-gradient-to-r from-surface/70 via-surface/25 to-transparent" />
          </>
        ) : (
          <MountainBackdrop />
        )}
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
            {homepage.logoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={homepage.logoUrl}
                alt="Le Suffète"
                className="object-contain relative z-10 p-8"
                style={{ width: 280, height: 280 }}
              />
            ) : (
              <Image src="/logo.png" alt="Le Suffète" width={280} height={280} className="object-contain relative z-10 p-8" priority />
            )}
          </div>
        </div>
      </section>
    ),

    collections: (
      <section key="collections" className="mx-auto max-w-7xl px-6 md:px-8 py-20">
        <h2 className="section-title">NOS COLLECTIONS</h2>
        <div className="section-title-underline" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {categories.map((category) => (
            <Link key={category.id} href={`/collection/${category.slug}`} className="group block">
              <div
                className="aspect-[3/4] overflow-hidden"
                style={category.imageUrl ? undefined : { background: CATEGORY_GRADIENTS[category.slug] ?? 'linear-gradient(155deg,#222,#0a0a0a)' }}
              >
                {category.imageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={category.imageUrl}
                    alt={category.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                  />
                ) : (
                  <div className="w-full h-full transition-transform duration-500 group-hover:scale-[1.04]" />
                )}
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
    ),

    new_arrivals:
      latest.length > 0 ? (
        <section key="new_arrivals" className="mx-auto max-w-7xl px-6 md:px-8 pb-24">
          <h2 className="section-title">NOUVEAUTÉS</h2>
          <div className="section-title-underline" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {latest.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      ) : null,

    outfit_builder: (
      <section key="outfit_builder" className="bg-surface2 py-20">
        <div className="mx-auto max-w-4xl px-6 md:px-8 text-center">
          <h2 className="section-title">CRÉEZ VOTRE TENUE</h2>
          <div className="section-title-underline" />
          <p className="text-foreground/70 text-[17px] leading-relaxed mb-8">
            Composez une tenue complète parmi nos collections et profitez de -10% sur l&apos;ensemble.
          </p>
          <Link href="/tenue" className="btn-gold">
            COMPOSER MA TENUE →
          </Link>
        </div>
      </section>
    ),

    heritage: (
      <section key="heritage" className="bg-surface2 py-20">
        <div className="mx-auto max-w-4xl px-6 md:px-8 text-center">
          <h2 className="section-title">{homepage.heritageTitle}</h2>
          <div className="section-title-underline" />
          <p className="text-foreground/70 text-[17px] leading-relaxed whitespace-pre-line">{homepage.heritageBody}</p>
        </div>
      </section>
    ),

    best_sellers: (
      <section key="best_sellers" className="mx-auto max-w-7xl px-6 md:px-8 py-24">
        <h2 className="section-title">BEST-SELLERS</h2>
        <div className="section-title-underline" />
        <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
          {bestSellers.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
    ),
  };

  return (
    <div>
      {sections
        .filter((s) => s.enabled)
        .map((s) => sectionsByType[s.type] ?? null)}
    </div>
  );
}
