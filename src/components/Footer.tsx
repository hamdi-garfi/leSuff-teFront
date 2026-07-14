import Link from 'next/link';
import { Logo } from '@/components/Logo';
import { getHomepageSettings } from '@/lib/homepage';
import { getStaticPages } from '@/lib/pages';
import { getStoreSettings } from '@/lib/storeSettings';
import { PaymentBadge } from '@/components/PaymentIcons';
import { TrustBadges } from '@/components/TrustBadges';

const infoPageOrder = ['a-propos', 'guide-des-tailles', 'livraison-retours', 'cgv', 'confidentialite', 'faq', 'mentions-legales'];

export async function Footer() {
  const [homepage, staticPages, storeSettings] = await Promise.all([getHomepageSettings(), getStaticPages(), getStoreSettings()]);
  const publishedSlugs = new Set(staticPages.map((p) => p.slug));
  const pageLabels = new Map(staticPages.map((p) => [p.slug, p.title]));
  const infoLinks = [
    ...infoPageOrder
      .filter((slug) => publishedSlugs.has(slug))
      .map((slug) => ({ href: `/pages/${slug}`, label: pageLabels.get(slug) ?? slug })),
    { href: '/contact', label: 'Contact' },
  ];

  return (
    <footer className="print:hidden mt-24 border-t border-foreground/10">
      <div className="border-b border-foreground/10">
        <TrustBadges freeShippingThreshold={storeSettings.freeShippingThreshold} />
      </div>

      <div className="mx-auto max-w-7xl px-6 md:px-8 py-14 grid grid-cols-1 md:grid-cols-4 gap-10">
        <div>
          <Logo size={48} src={homepage.logoUrl} />
          <p className="mt-4 text-sm text-foreground/50 leading-relaxed max-w-xs">
            Plus qu&apos;une marque, un héritage. Des pièces intemporelles conçues pour ceux qui savent se distinguer.
          </p>
        </div>

        <FooterColumn
          title="Boutique"
          links={[
            { href: '/collection/polos', label: 'Polos' },
            { href: '/collection/t-shirts', label: 'T-Shirts' },
            { href: '/collection/sweats-hoodies', label: 'Sweats & Hoodies' },
            { href: '/collection/casquettes', label: 'Casquettes' },
            { href: '/collection', label: 'Toutes les collections' },
          ]}
        />

        {infoLinks.length > 0 && <FooterColumn title="Informations" links={infoLinks} />}

        <div>
          <h3 className="text-xs tracking-widest2 uppercase text-foreground/70 mb-4">Newsletter</h3>
          <p className="text-sm text-foreground/50 mb-4">
            Inscrivez-vous et recevez 10% de réduction sur votre première commande.
          </p>
          <form className="flex">
            <input
              type="email"
              placeholder="Votre e-mail"
              className="flex-1 min-w-0 bg-surface2 border border-foreground/20 px-3 py-2 text-sm outline-none focus:border-gold"
            />
            <button type="submit" className="shrink-0 bg-gradient-to-br from-gold-light to-gold-dark text-ink px-4 font-semibold">
              →
            </button>
          </form>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 md:px-8 pb-10 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-foreground/40">
        <span>© {new Date().getFullYear()} Le Suffète Classic — Tous droits réservés</span>
        <div className="flex flex-wrap justify-center gap-2">
          <PaymentBadge method="visa" />
          <PaymentBadge method="mastercard" />
          <PaymentBadge method="cb" />
          <PaymentBadge method="paypal" />
          <PaymentBadge method="apple-pay" />
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({ title, links }: { title: string; links: { href: string; label: string }[] }) {
  return (
    <div>
      <h3 className="text-xs tracking-widest2 uppercase text-foreground/70 mb-4">{title}</h3>
      <ul className="space-y-2">
        {links.map((l) => (
          <li key={l.label}>
            <Link href={l.href} className="text-sm text-foreground/50 hover:text-gold transition">
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
