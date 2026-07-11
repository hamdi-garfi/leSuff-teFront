'use client';

import { Suspense, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import { StripePaymentForm } from '@/components/StripePaymentForm';

const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ?? '';
const stripePromise = publishableKey ? loadStripe(publishableKey) : null;

export default function PaymentPage() {
  return (
    <Suspense>
      <PaymentPageContent />
    </Suspense>
  );
}

function PaymentPageContent() {
  const searchParams = useSearchParams();
  const clientSecret = searchParams.get('client_secret');
  const number = searchParams.get('number') ?? '';
  const discount = searchParams.get('discount') ?? undefined;
  const giftCard = searchParams.get('giftCard') ?? undefined;

  const options = useMemo(() => (clientSecret ? { clientSecret } : undefined), [clientSecret]);

  if (!clientSecret) {
    return (
      <div className="mx-auto max-w-2xl px-6 md:px-8 py-24 text-center text-white/60">
        Aucun paiement en cours. Retournez à votre panier.
      </div>
    );
  }

  if (!stripePromise) {
    return (
      <div className="mx-auto max-w-2xl px-6 md:px-8 py-24 text-center text-white/60">
        Le paiement n&apos;est pas encore configuré côté boutique (clé publique Stripe manquante).
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-md px-6 md:px-8 py-16">
      <h1 className="section-title">PAIEMENT</h1>
      <div className="section-title-underline" />
      <p className="text-center text-white/50 text-sm mb-2">Commande {number}</p>
      {discount && <p className="text-center text-gold text-xs mb-1">Réduction appliquée : -{discount} €</p>}
      {giftCard && <p className="text-center text-gold text-xs mb-1">Carte cadeau utilisée : -{giftCard} €</p>}
      <div className="mb-6" />
      <Elements stripe={stripePromise} options={options}>
        <StripePaymentForm orderNumber={number} discount={discount} giftCard={giftCard} />
      </Elements>
    </div>
  );
}
