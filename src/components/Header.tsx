import Link from 'next/link';
import { Logo, Wordmark } from '@/components/Logo';
import { getCategories } from '@/lib/catalog';
import type { CurrentUser } from '@/lib/types';
import { ThemeToggle } from '@/components/ThemeToggle';

export async function Header({ cartCount, user }: { cartCount: number; user: CurrentUser | null }) {
  const categories = await getCategories();

  return (
    <header className="sticky top-0 z-50 bg-surface/95 backdrop-blur border-b border-foreground/10">
      <div className="bg-gold-dark/90 text-ink text-[11px] tracking-widest2 text-center py-1.5 px-4">
        LIVRAISON OFFERTE DÈS 80€ D&apos;ACHAT
      </div>

      <div className="mx-auto max-w-7xl px-4 md:px-8 py-4 flex items-center justify-between gap-4">
        <nav className="hidden md:flex items-center gap-6 text-xs tracking-widest2 uppercase flex-1">
          <Link href="/" className="hover:text-gold transition">
            Accueil
          </Link>
          <Link href="/collection" className="hover:text-gold transition">
            Collection
          </Link>
          {categories.map((c) => (
            <Link key={c.id} href={`/collection/${c.slug}`} className="hover:text-gold transition">
              {c.name}
            </Link>
          ))}
        </nav>

        <Link href="/" className="flex items-center gap-3 shrink-0">
          <Logo size={48} />
          <Wordmark className="hidden sm:flex" />
        </Link>

        <div className="flex items-center gap-5 flex-1 justify-end">
          <ThemeToggle />
          <Link
            href={user ? '/compte' : '/compte/connexion'}
            className="hover:text-gold transition text-xs tracking-widest2 uppercase hidden sm:inline"
          >
            {user ? user.firstName : 'Connexion'}
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

      <nav className="md:hidden flex items-center gap-4 overflow-x-auto px-4 pb-3 text-xs tracking-widest2 uppercase">
        <Link href="/collection" className="hover:text-gold transition whitespace-nowrap">
          Collection
        </Link>
        {categories.map((c) => (
          <Link key={c.id} href={`/collection/${c.slug}`} className="hover:text-gold transition whitespace-nowrap">
            {c.name}
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
