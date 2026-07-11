import Link from 'next/link';

export function Pagination({
  basePath,
  page,
  totalPages,
  extraParams = {},
}: {
  basePath: string;
  page: number;
  totalPages: number;
  extraParams?: Record<string, string>;
}) {
  if (totalPages <= 1) {
    return null;
  }

  function hrefFor(p: number) {
    const params = new URLSearchParams(extraParams);
    params.set('page', String(p));
    return `${basePath}?${params.toString()}`;
  }

  return (
    <div className="flex items-center justify-center gap-2 mt-16">
      <Link
        href={hrefFor(Math.max(1, page - 1))}
        aria-disabled={page <= 1}
        className={`w-9 h-9 flex items-center justify-center border border-foreground/20 ${page <= 1 ? 'pointer-events-none opacity-30' : 'hover:border-gold hover:text-gold'}`}
      >
        ‹
      </Link>
      {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
        <Link
          key={p}
          href={hrefFor(p)}
          className={`w-9 h-9 flex items-center justify-center border text-sm ${
            p === page ? 'border-gold text-gold' : 'border-foreground/20 hover:border-gold hover:text-gold'
          }`}
        >
          {p}
        </Link>
      ))}
      <Link
        href={hrefFor(Math.min(totalPages, page + 1))}
        aria-disabled={page >= totalPages}
        className={`w-9 h-9 flex items-center justify-center border border-foreground/20 ${page >= totalPages ? 'pointer-events-none opacity-30' : 'hover:border-gold hover:text-gold'}`}
      >
        ›
      </Link>
    </div>
  );
}
