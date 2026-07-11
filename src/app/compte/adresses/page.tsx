import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getCurrentUser } from '@/lib/session';
import { getMyAddresses } from '@/lib/addresses';
import { AddressBook } from '@/components/AddressBook';

export const metadata = { title: 'Mes adresses — Le Suffète Classic' };

export default async function AddressesPage() {
  const user = await getCurrentUser();
  if (!user) {
    redirect('/compte/connexion?next=compte/adresses');
  }

  const addresses = await getMyAddresses();

  return (
    <div className="mx-auto max-w-4xl px-6 md:px-8 py-16">
      <p className="text-xs text-white/40 mb-8">
        <Link href="/compte" className="hover:text-gold">
          Mon compte
        </Link>{' '}
        / <span className="text-white/70">Mes adresses</span>
      </p>
      <h1 className="section-title">MES ADRESSES</h1>
      <div className="section-title-underline" />
      <AddressBook initialAddresses={addresses} />
    </div>
  );
}
