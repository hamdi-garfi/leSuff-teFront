import Link from 'next/link';
import { getCategories, getProducts } from '@/lib/catalog';
import { ProductCard } from '@/components/ProductCard';

const CATEGORY_GRADIENTS: Record<string, string> = {
  polos: 'linear-gradient(155deg, #1e2a4a 0%, #0a0a0a 130%)',
  't-shirts': 'linear-gradient(155deg, #3a3a3a 0%, #0a0a0a 130%)',
  'sweats-hoodies': 'linear-gradient(155deg, #161616 0%, #0a0a0a 130%)',
  casquettes: 'linear-gradient(155deg, #4a3b1e 0%, #0a0a0a 130%)',
};

export default async function HomePage() {
  const [categories, products] = await Promise.all([getCategories(), getProducts({ limit: 5 })]);
  const bestSellers = products.items;

  return (
    <div>
      <section className="relative overflow-hidden border-b border-white/10">
        <div className="mx-auto max-w-7xl px-6 md:px-8 py-20 md:py-28 grid md:grid-cols-2 gap-12 items-center">
          <div>
            <p className="text-gold text-xs tracking-widest2 mb-4">FORCE. STYLE. HÉRITAGE.</p>
            <h1 className="font-serif text-5xl md:text-6xl leading-[1.05] mb-6">
              LE SUFFÈTE
              <br />
              CLASSIC
            </h1>
            <p className="text-white/60 mb-8 max-w-sm">
              L&apos;élégance affirmée.
              <br />
              L&apos;héritage qui inspire.
            </p>
            <Link href="/collection" className="btn-gold">
              DÉCOUVRIR LA COLLECTION
            </Link>
          </div>
          <div className="relative aspect-square rounded-full mx-auto w-full max-w-md flex items-center justify-center border border-gold/20">
            <div className="absolute inset-6 rounded-full border border-gold/10" />
            <span className="font-serif text-[8rem] leading-none bg-gradient-to-b from-gold-light to-gold-dark bg-clip-text text-transparent select-none">
              S
            </span>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 md:px-8 py-20">
        <h2 className="section-title">NOS COLLECTIONS</h2>
        <div className="section-title-underline" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {categories.map((category) => (
            <Link key={category.id} href={`/collection/${category.slug}`} className="group block">
              <div
                className="aspect-[4/5] flex items-end p-4 relative overflow-hidden"
                style={{ background: CATEGORY_GRADIENTS[category.slug] ?? 'linear-gradient(155deg,#222,#0a0a0a)' }}
              >
                <div>
                  <h3 className="font-serif text-lg tracking-wide">{category.name.toUpperCase()}</h3>
                  <span className="text-[10px] tracking-widest2 text-gold group-hover:underline">
                    VOIR LA COLLECTION
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 md:px-8 pb-24">
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
