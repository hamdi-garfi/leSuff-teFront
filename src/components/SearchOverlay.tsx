'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const RECENT_KEY = 'suffete_recent_searches';
const MAX_RECENT = 5;

type SearchResult = {
  products: { id: number; name: string; slug: string; basePrice: number; imageUrl: string | null }[];
  categories: { id: number; name: string; slug: string }[];
};

function readRecent(): string[] {
  try {
    const raw = localStorage.getItem(RECENT_KEY);
    return raw ? (JSON.parse(raw) as string[]) : [];
  } catch {
    return [];
  }
}

function pushRecent(term: string) {
  const next = [term, ...readRecent().filter((t) => t.toLowerCase() !== term.toLowerCase())].slice(0, MAX_RECENT);
  localStorage.setItem(RECENT_KEY, JSON.stringify(next));
}

export function SearchOverlay() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [result, setResult] = useState<SearchResult>({ products: [], categories: [] });
  const [recent, setRecent] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    if (open) {
      setRecent(readRecent());
      setTimeout(() => inputRef.current?.focus(), 50);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      setQuery('');
      setResult({ products: [], categories: [] });
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, []);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (query.trim().length < 2) {
      setResult({ products: [], categories: [] });
      return;
    }
    debounceRef.current = setTimeout(() => {
      fetch(`/api/search?q=${encodeURIComponent(query.trim())}`)
        .then((res) => (res.ok ? res.json() : { products: [], categories: [] }))
        .then(setResult)
        .catch(() => setResult({ products: [], categories: [] }));
    }, 250);
  }, [query]);

  function goToCollection(term: string) {
    if (!term.trim()) return;
    pushRecent(term.trim());
    setOpen(false);
    router.push(`/collection?q=${encodeURIComponent(term.trim())}`);
  }

  return (
    <>
      <button type="button" onClick={() => setOpen(true)} className="hover:text-gold transition" aria-label="Rechercher">
        <SearchIcon />
      </button>

      {open && (
        <div className="fixed inset-0 z-[100] bg-black/70 flex items-start justify-center px-4 pt-24" onClick={() => setOpen(false)} role="dialog" aria-modal="true">
          <div className="bg-surface border border-foreground/10 max-w-xl w-full max-h-[70vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                goToCollection(query);
              }}
              className="flex items-center border-b border-foreground/10"
            >
              <SearchIcon className="ml-4 shrink-0 text-foreground/40" />
              <input
                ref={inputRef}
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Rechercher un produit, une référence…"
                className="flex-1 bg-transparent px-3 py-4 text-sm outline-none"
              />
              <button type="button" onClick={() => setOpen(false)} aria-label="Fermer" className="px-4 text-foreground/50 hover:text-gold transition text-xl">
                ×
              </button>
            </form>

            <div className="p-4">
              {query.trim().length < 2 && recent.length > 0 && (
                <div className="mb-4">
                  <p className="text-xs tracking-widest2 text-foreground/40 mb-2">RECHERCHES RÉCENTES</p>
                  <div className="flex flex-wrap gap-2">
                    {recent.map((term) => (
                      <button
                        key={term}
                        type="button"
                        onClick={() => goToCollection(term)}
                        className="bg-surface2 border border-foreground/15 px-3 py-1.5 text-xs hover:border-gold transition"
                      >
                        {term}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {result.categories.length > 0 && (
                <div className="mb-4">
                  <p className="text-xs tracking-widest2 text-foreground/40 mb-2">COLLECTIONS</p>
                  {result.categories.map((c) => (
                    <Link
                      key={c.id}
                      href={`/collection/${c.slug}`}
                      onClick={() => setOpen(false)}
                      className="block px-2 py-2 text-sm hover:text-gold transition"
                    >
                      {c.name}
                    </Link>
                  ))}
                </div>
              )}

              {result.products.length > 0 && (
                <div>
                  <p className="text-xs tracking-widest2 text-foreground/40 mb-2">PRODUITS</p>
                  {result.products.map((p) => (
                    <Link
                      key={p.id}
                      href={`/produit/${p.slug}`}
                      onClick={() => { pushRecent(query.trim()); setOpen(false); }}
                      className="flex items-center gap-3 px-2 py-2 hover:bg-surface2 transition"
                    >
                      <div className="w-12 h-14 shrink-0 bg-surface2 overflow-hidden flex items-center justify-center">
                        {p.imageUrl ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={p.imageUrl} alt={p.name} className="w-full h-full object-cover" />
                        ) : (
                          <span className="font-serif text-lg text-foreground/15">{p.name.charAt(0)}</span>
                        )}
                      </div>
                      <div>
                        <p className="text-sm">{p.name}</p>
                        <p className="text-xs text-foreground/50">{p.basePrice.toFixed(2)} €</p>
                      </div>
                    </Link>
                  ))}
                  <button
                    type="button"
                    onClick={() => goToCollection(query)}
                    className="block w-full text-left px-2 py-2 mt-1 text-xs text-gold hover:underline"
                  >
                    Voir tous les résultats pour « {query.trim()} » →
                  </button>
                </div>
              )}

              {query.trim().length >= 2 && result.products.length === 0 && result.categories.length === 0 && (
                <p className="text-sm text-foreground/50 px-2 py-2">Aucun résultat pour « {query.trim()} ».</p>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function SearchIcon({ className }: { className?: string }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={className}>
      <circle cx="10.5" cy="10.5" r="6.5" />
      <path d="M20 20 15.3 15.3" />
    </svg>
  );
}
