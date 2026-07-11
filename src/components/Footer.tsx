import Link from 'next/link';
import { Logo } from '@/components/Logo';

const perks = [
  { title: 'Livraison offerte', desc: "Dès 80€ d'achat" },
  { title: 'Retours faciles', desc: '30 jours pour changer d’avis' },
  { title: 'Paiement sécurisé', desc: 'CB, PayPal, Apple Pay' },
  { title: 'Qualité premium', desc: 'Sélection des meilleurs matériaux' },
];

export function Footer() {
  return (
    <footer className="mt-24 border-t border-white/10">
      <div className="grid grid-cols-2 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-white/10 border-b border-white/10">
        {perks.map((p) => (
          <div key={p.title} className="flex flex-col items-center text-center gap-1 py-8 px-4">
            <span className="text-sm font-semibold tracking-wide">{p.title}</span>
            <span className="text-xs text-white/50">{p.desc}</span>
          </div>
        ))}
      </div>

      <div className="mx-auto max-w-7xl px-6 md:px-8 py-14 grid grid-cols-1 md:grid-cols-4 gap-10">
        <div>
          <Logo size={48} />
          <p className="mt-4 text-sm text-white/50 leading-relaxed max-w-xs">
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

        <FooterColumn
          title="Informations"
          links={[
            { href: '/', label: 'À propos' },
            { href: '/', label: 'Livraison & Retours' },
            { href: '/', label: 'Conditions Générales' },
            { href: '/', label: 'FAQ' },
            { href: '/', label: 'Contact' },
          ]}
        />

        <div>
          <h3 className="text-xs tracking-widest2 uppercase text-white/70 mb-4">Newsletter</h3>
          <p className="text-sm text-white/50 mb-4">
            Inscrivez-vous et recevez 10% de réduction sur votre première commande.
          </p>
          <form className="flex">
            <input
              type="email"
              placeholder="Votre e-mail"
              className="flex-1 bg-panel border border-white/20 px-3 py-2 text-sm outline-none focus:border-gold"
            />
            <button type="submit" className="bg-gradient-to-br from-gold-light to-gold-dark text-ink px-4 font-semibold">
              →
            </button>
          </form>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 md:px-8 pb-10 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-white/40">
        <span>© {new Date().getFullYear()} Le Suffète Classic — Tous droits réservés</span>
        <div className="flex gap-3">
          <span>VISA</span>
          <span>MASTERCARD</span>
          <span>PAYPAL</span>
          <span>APPLE PAY</span>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({ title, links }: { title: string; links: { href: string; label: string }[] }) {
  return (
    <div>
      <h3 className="text-xs tracking-widest2 uppercase text-white/70 mb-4">{title}</h3>
      <ul className="space-y-2">
        {links.map((l) => (
          <li key={l.label}>
            <Link href={l.href} className="text-sm text-white/50 hover:text-gold transition">
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
