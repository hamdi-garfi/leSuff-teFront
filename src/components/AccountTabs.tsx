'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const TABS = [
  { href: '/compte', label: 'Vue d’ensemble' },
  { href: '/compte/commandes', label: 'Mes commandes' },
  { href: '/compte/profil', label: 'Mon profil' },
  { href: '/compte/adresses', label: 'Mes adresses' },
  { href: '/liste-de-souhaits', label: 'Liste de souhaits' },
];

export function AccountTabs() {
  const pathname = usePathname();

  return (
    <div className="mb-10 border-b border-foreground/10 overflow-x-auto">
      <nav className="flex gap-6 min-w-max">
        {TABS.map((tab) => {
          const active = tab.href === '/compte' ? pathname === '/compte' : pathname.startsWith(tab.href);
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`whitespace-nowrap text-xs tracking-widest2 uppercase pb-3 border-b-2 transition ${
                active ? 'text-gold border-gold' : 'text-foreground/50 border-transparent hover:text-foreground/80'
              }`}
            >
              {tab.label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
