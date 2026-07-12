'use client';

import { useRouter } from 'next/navigation';
import { useWishlist } from '@/lib/WishlistContext';

export function WishlistButton({ productId, className }: { productId: number; className?: string }) {
  const router = useRouter();
  const { isAuthenticated, isWishlisted, toggle } = useWishlist();
  const active = isWishlisted(productId);

  return (
    <button
      type="button"
      aria-label={active ? 'Retirer de la liste de souhaits' : 'Ajouter à la liste de souhaits'}
      aria-pressed={active}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        if (!isAuthenticated) {
          router.push('/compte/connexion');
          return;
        }
        toggle(productId);
      }}
      className={className ?? 'w-8 h-8 flex items-center justify-center'}
    >
      <svg width="18" height="18" viewBox="0 0 24 24" fill={active ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.5">
        <path d="M12 21s-7.5-4.6-10.2-9.1C.2 8.9 1.6 5 5.3 5c2 0 3.4 1 4.7 2.8C11.3 6 12.7 5 14.7 5c3.7 0 5.1 3.9 3.5 6.9C19.5 16.4 12 21 12 21z" />
      </svg>
    </button>
  );
}
