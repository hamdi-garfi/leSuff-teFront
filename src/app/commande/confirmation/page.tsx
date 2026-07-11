import Link from 'next/link';

export const metadata = { title: 'Commande confirmée — Le Suffète Classic' };

export default function OrderConfirmationPage({
  searchParams,
}: {
  searchParams: { number?: string; discount?: string; giftCard?: string };
}) {
  const hasReduction = Boolean(searchParams.discount || searchParams.giftCard);

  return (
    <div className="mx-auto max-w-2xl px-6 md:px-8 py-24 text-center">
      <p className="text-gold text-xs tracking-widest2 mb-4">MERCI</p>
      <h1 className="font-serif text-4xl mb-6">Votre commande est confirmée</h1>
      {searchParams.number && (
        <p className="text-white/60 mb-2">
          Numéro de commande : <span className="text-white">{searchParams.number}</span>
        </p>
      )}
      {searchParams.discount && (
        <p className="text-gold text-sm mb-1">Réduction appliquée : -{searchParams.discount} €</p>
      )}
      {searchParams.giftCard && (
        <p className="text-gold text-sm mb-1">Carte cadeau utilisée : -{searchParams.giftCard} €</p>
      )}
      {hasReduction ? <div className="mb-7" /> : <div className="mb-10" />}
      <div className="flex gap-4 justify-center">
        <Link href="/compte" className="btn-gold">
          VOIR MES COMMANDES
        </Link>
        <Link href="/collection" className="btn-outline">
          CONTINUER MES ACHATS
        </Link>
      </div>
    </div>
  );
}
