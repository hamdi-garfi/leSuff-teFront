'use client';

import Link from 'next/link';
import { useWishlist } from '@/lib/WishlistContext';

export function WishlistHeaderLink() {
  const { ids } = useWishlist();

  return (
    <Link href="/liste-de-souhaits" className="relative hover:text-gold transition hidden sm:inline-flex" aria-label="Liste de souhaits">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M12 21s-7.5-4.6-10.2-9.1C.2 8.9 1.6 5 5.3 5c2 0 3.4 1 4.7 2.8C11.3 6 12.7 5 14.7 5c3.7 0 5.1 3.9 3.5 6.9C19.5 16.4 12 21 12 21z" />
      </svg>
      {ids.size > 0 && (
        <span className="absolute -top-2 -right-2 bg-gold text-ink text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
          {ids.size}
        </span>
      )}
    </Link>
  );
}
