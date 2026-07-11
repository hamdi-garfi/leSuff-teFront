'use client';

import { useState } from 'react';
import { PaymentElement, useElements, useStripe } from '@stripe/react-stripe-js';

export function StripePaymentForm({
  orderNumber,
  discount,
  giftCard,
}: {
  orderNumber: string;
  discount?: string;
  giftCard?: string;
}) {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!stripe || !elements) {
      return;
    }

    setLoading(true);
    setError(null);

    const extraParams = (discount ? `&discount=${discount}` : '') + (giftCard ? `&giftCard=${giftCard}` : '');

    const { error: confirmError } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/commande/confirmation?number=${encodeURIComponent(orderNumber)}${extraParams}`,
      },
    });

    if (confirmError) {
      setError(confirmError.message ?? 'Le paiement a échoué.');
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <PaymentElement />
      {error && <p className="text-sm text-red-400">{error}</p>}
      <button type="submit" disabled={!stripe || loading} className="btn-gold w-full disabled:opacity-50">
        {loading ? 'Paiement en cours…' : 'PAYER MA COMMANDE'}
      </button>
    </form>
  );
}
