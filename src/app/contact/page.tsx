import Link from 'next/link';
import { ContactForm } from '@/components/ContactForm';

export const metadata = {
  title: 'Contact — Le Suffète Classic',
  description: 'Une question sur votre commande ou nos produits ? Contactez-nous.',
};

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 md:px-8 py-16">
      <p className="text-xs text-foreground/40 mb-8">
        <Link href="/" className="hover:text-gold">
          Accueil
        </Link>
        {' / '}
        Contact
      </p>
      <h1 className="font-serif text-3xl md:text-4xl mb-6">Contact</h1>
      <p className="text-sm text-foreground/60 mb-10 max-w-xl">
        Une question sur votre commande, un produit ou une collaboration ? Écrivez-nous, nous vous répondrons
        rapidement.
      </p>
      <ContactForm />
    </div>
  );
}
