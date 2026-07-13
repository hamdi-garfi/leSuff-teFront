import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/session';
import { getLoyalty } from '@/lib/loyalty';
import { LoyaltyWallet } from '@/components/LoyaltyWallet';

export const metadata = { title: 'Mon portefeuille — Le Suffète Classic' };

export default async function LoyaltyPage() {
  const user = await getCurrentUser();
  if (!user) {
    redirect('/compte/connexion?next=compte/portefeuille');
  }

  const loyalty = await getLoyalty();
  if (!loyalty) {
    redirect('/compte/connexion?next=compte/portefeuille');
  }

  return (
    <div className="mx-auto max-w-3xl px-6 md:px-8 py-16">
      <h1 className="section-title">MON PORTEFEUILLE</h1>
      <div className="section-title-underline" />
      <p className="text-sm text-foreground/60 mb-10">
        Gagnez 1 point par euro dépensé, 100 points à l&apos;inscription et 50 points pour chaque avis publié.
      </p>
      <LoyaltyWallet initial={loyalty} />
    </div>
  );
}
