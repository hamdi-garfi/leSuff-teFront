import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getStaticPage } from '@/lib/pages';

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const page = await getStaticPage(params.slug);
  if (!page) {
    return { title: 'Page introuvable' };
  }

  return {
    title: page.seoTitle || `${page.title} — Le Suffète Classic`,
    description: page.seoDescription || undefined,
    alternates: { canonical: `/pages/${page.slug}` },
  };
}

export default async function StaticPage({ params }: { params: { slug: string } }) {
  const page = await getStaticPage(params.slug);

  if (!page) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-3xl px-6 md:px-8 py-16">
      <p className="text-xs text-foreground/40 mb-8">
        <Link href="/" className="hover:text-gold">
          Accueil
        </Link>
        {' / '}
        {page.title}
      </p>
      <h1 className="font-serif text-3xl md:text-4xl mb-10">{page.title}</h1>
      <div className="text-sm text-foreground/70 leading-relaxed space-y-4">
        {page.content.split('\n\n').map((paragraph, i) => (
          <p key={i}>{paragraph}</p>
        ))}
      </div>
    </div>
  );
}
