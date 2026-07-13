import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/session';
import { getMyAddresses } from '@/lib/addresses';
import { AddressBook } from '@/components/AddressBook';
import { AccountTabs } from '@/components/AccountTabs';

export const metadata = { title: 'Mes adresses — Le Suffète Classic' };

export default async function AddressesPage() {
  const user = await getCurrentUser();
  if (!user) {
    redirect('/compte/connexion?next=compte/adresses');
  }

  const addresses = await getMyAddresses();

  return (
    <div className="mx-auto max-w-4xl px-6 md:px-8 py-16">
      <h1 className="section-title">MON COMPTE</h1>
      <div className="section-title-underline" />
      <AccountTabs />
      <h2 className="text-xs tracking-widest2 text-foreground/60 mb-6">MES ADRESSES</h2>
      <AddressBook initialAddresses={addresses} />
    </div>
  );
}
