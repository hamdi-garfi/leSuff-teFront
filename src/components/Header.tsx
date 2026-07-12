import Link from 'next/link';
import { Logo, Wordmark } from '@/components/Logo';
import { getCategories, getProducts } from '@/lib/catalog';
import { getHomepageSettings } from '@/lib/homepage';
import type { CurrentUser, Product } from '@/lib/types';
import { ThemeToggle } from '@/components/ThemeToggle';
import { NavMegaMenu } from '@/components/NavMegaMenu';
import { NAV_LABELS } from '@/lib/navLabels';
import { WishlistHeaderLink } from '@/components/WishlistHeaderLink';
import { RecentlyViewedHeaderLink } from '@/components/RecentlyViewedHeaderLink';
import { SearchOverlay } from '@/components/SearchOverlay';

export async function Header({ cartCount, user }: { cartCount: number; user: CurrentUser | null }) {
  const [categories, homepage] = await Promise.all([getCategories(), getHomepageSettings()]);

  const categoryProductLists = await Promise.all(
    categories.map(async (c) => {
      const featured = await getProducts({ category: c.slug, featured: true, limit: 4 });
      const items = featured.items.length > 0 ? featured.items : (await getProducts({ category: c.slug, limit: 4 })).items;
      return [c.id, items] as [number, Product[]];
    }),
  );
  const categoryProducts = Object.fromEntries(categoryProductLists);

  return (
    <header className="sticky top-0 z-50 bg-surface/95 backdrop-blur border-b border-foreground/10">
      {homepage.promoBannerEnabled && (
        <div className="bg-gold-dark/90 text-ink text-[11px] tracking-widest2 text-center py-1.5 px-4">
          {homepage.promoBannerText}
        </div>
      )}

      <div className="mx-auto max-w-7xl px-6 md:px-10 h-[75px] flex items-center justify-between gap-6">
        <NavMegaMenu categories={categories} categoryProducts={categoryProducts} />

        <Link href="/" className="flex items-center gap-3 shrink-0 px-2">
          <Logo size={56} src={homepage.logoUrl} />
          <Wordmark className="hidden sm:flex" />
        </Link>

        <div className="flex items-center gap-6 flex-1 justify-end">
          <ThemeToggle />
          <SearchOverlay />
          <RecentlyViewedHeaderLink />
          <WishlistHeaderLink />
          <Link
            href={user ? '/compte' : '/compte/connexion'}
            className="hover:text-gold transition text-[13px] tracking-[0.06em] uppercase hidden sm:inline"
          >
            {user ? user.firstName : 'Compte'}
          </Link>
          <Link
            href={user ? '/compte' : '/compte/connexion'}
            className="hover:text-gold transition sm:hidden"
            aria-label="Mon compte"
          >
            <UserIcon />
          </Link>
          <Link href="/panier" className="relative hover:text-gold transition" aria-label="Panier">
            <CartIcon />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-gold text-ink text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </Link>
        </div>
      </div>

      <nav className="md:hidden flex items-center gap-4 overflow-x-auto px-4 pb-3 text-[13px] tracking-[0.06em] uppercase">
        <Link href="/collection" className="hover:text-gold transition whitespace-nowrap">
          Collection
        </Link>
        {categories.map((c) => (
          <Link key={c.id} href={`/collection/${c.slug}`} className="hover:text-gold transition whitespace-nowrap">
            {NAV_LABELS[c.slug] ?? c.name}
          </Link>
        ))}
      </nav>
    </header>
  );
}

function UserIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="12" cy="8" r="3.5" />
      <path d="M4.5 20c1.2-4 4.2-6 7.5-6s6.3 2 7.5 6" />
    </svg>
  );
}

function CartIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M6 6h15l-1.5 9h-12z" />
      <path d="M6 6 5 3H2" />
      <circle cx="9.5" cy="20" r="1" fill="currentColor" />
      <circle cx="17.5" cy="20" r="1" fill="currentColor" />
    </svg>
  );
}
