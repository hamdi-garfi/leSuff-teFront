'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { readViewedSlugs, subscribeToRecentlyViewed } from '@/lib/recentlyViewed';

export function RecentlyViewedHeaderLink() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const sync = () => setCount(readViewedSlugs().length);
    sync();
    return subscribeToRecentlyViewed(sync);
  }, []);

  if (count === 0) return null;

  return (
    <Link href="/vu-recemment" className="relative hover:text-gold transition hidden sm:inline-flex" aria-label="Vu récemment">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7v5l3.5 2" />
      </svg>
      <span className="absolute -top-2 -right-2 bg-gold text-ink text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
        {count}
      </span>
    </Link>
  );
}
