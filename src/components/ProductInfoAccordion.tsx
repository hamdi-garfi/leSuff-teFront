import Link from 'next/link';
import type { Product } from '@/lib/types';

function Section({ title, defaultOpen, children }: { title: string; defaultOpen?: boolean; children: React.ReactNode }) {
  return (
    <details className="group border-b border-foreground/10" open={defaultOpen}>
      <summary className="flex items-center justify-between py-4 cursor-pointer text-sm tracking-[0.04em] uppercase list-none">
        {title}
        <span className="text-foreground/40 group-open:rotate-45 transition-transform text-lg leading-none">+</span>
      </summary>
      <div className="pb-4 text-sm text-foreground/60 leading-relaxed">{children}</div>
    </details>
  );
}

export function ProductInfoAccordion({ product }: { product: Product }) {
  const hasComposition = product.material || product.fit || product.fabricWeightGsm || product.origin;

  return (
    <div className="mt-10">
      {hasComposition && (
        <Section title="Composition & coupe" defaultOpen>
          <dl className="space-y-1.5">
            {product.material && (
              <div className="flex gap-2">
                <dt className="text-foreground/40 min-w-[110px]">Matière</dt>
                <dd>{product.material}</dd>
              </div>
            )}
            {product.fit && (
              <div className="flex gap-2">
                <dt className="text-foreground/40 min-w-[110px]">Coupe</dt>
                <dd>{product.fit}</dd>
              </div>
            )}
            {product.fabricWeightGsm && (
              <div className="flex gap-2">
                <dt className="text-foreground/40 min-w-[110px]">Grammage</dt>
                <dd>{product.fabricWeightGsm} g/m²</dd>
              </div>
            )}
            {product.origin && (
              <div className="flex gap-2">
                <dt className="text-foreground/40 min-w-[110px]">Origine</dt>
                <dd>{product.origin}</dd>
              </div>
            )}
          </dl>
        </Section>
      )}

      {product.careInstructions && (
        <Section title="Entretien">
          <p className="whitespace-pre-line">{product.careInstructions}</p>
        </Section>
      )}

      <Section title="Livraison & retours">
        <p>
          {product.shippingNote || 'Livraison en France métropolitaine et en Europe.'}{' '}
          <Link href="/pages/livraison-retours" className="text-gold hover:underline">
            Voir les modalités complètes
          </Link>
        </p>
      </Section>

      <Section title="Guide des tailles">
        <p>
          Besoin d&apos;aide pour choisir votre taille ?{' '}
          <Link href="/pages/guide-des-tailles" className="text-gold hover:underline">
            Consulter le guide des tailles
          </Link>
        </p>
      </Section>
    </div>
  );
}
