import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="mx-auto max-w-2xl px-6 md:px-8 py-32 text-center">
      <p className="font-serif text-6xl text-gold mb-6">404</p>
      <p className="text-foreground/60 mb-10">Cette page n&apos;existe pas ou n&apos;est plus disponible.</p>
      <Link href="/" className="btn-gold">
        RETOUR À L&apos;ACCUEIL
      </Link>
    </div>
  );
}
