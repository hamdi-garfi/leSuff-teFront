'use client';

import { useState } from 'react';
import { ExpressCheckoutElement, PaymentElement, useElements, useStripe } from '@stripe/react-stripe-js';
import type { StripeExpressCheckoutElementConfirmEvent } from '@stripe/stripe-js';

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
  const [expressAvailable, setExpressAvailable] = useState(false);

  const returnUrl = () => {
    const extraParams = (discount ? `&discount=${discount}` : '') + (giftCard ? `&giftCard=${giftCard}` : '');
    return `${window.location.origin}/commande/confirmation?number=${encodeURIComponent(orderNumber)}${extraParams}`;
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!stripe || !elements) {
      return;
    }

    setLoading(true);
    setError(null);

    const { error: confirmError } = await stripe.confirmPayment({
      elements,
      confirmParams: { return_url: returnUrl() },
    });

    if (confirmError) {
      setError(confirmError.message ?? 'Le paiement a échoué.');
      setLoading(false);
    }
  }

  async function handleExpressConfirm(_event: StripeExpressCheckoutElementConfirmEvent) {
    if (!stripe || !elements) {
      return;
    }
    setLoading(true);
    setError(null);

    const { error: submitError } = await elements.submit();
    if (submitError) {
      setError(submitError.message ?? 'Le paiement a échoué.');
      setLoading(false);
      return;
    }

    const { error: confirmError } = await stripe.confirmPayment({
      elements,
      confirmParams: { return_url: returnUrl() },
    });

    if (confirmError) {
      setError(confirmError.message ?? 'Le paiement a échoué.');
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Renders nothing if no Apple Pay / Google Pay / Link is available for this browser and Stripe account. */}
      <ExpressCheckoutElement
        onConfirm={handleExpressConfirm}
        onReady={({ availablePaymentMethods }) => setExpressAvailable(!!availablePaymentMethods)}
      />
      {expressAvailable && (
        <div className="flex items-center gap-3 text-xs text-foreground/40">
          <div className="flex-1 h-px bg-foreground/10" />
          OU PAYER PAR CARTE
          <div className="flex-1 h-px bg-foreground/10" />
        </div>
      )}
      <PaymentElement />
      {error && <p className="text-sm text-red-400">{error}</p>}
      <button type="submit" disabled={!stripe || loading} className="btn-gold w-full disabled:opacity-50">
        {loading ? 'Paiement en cours…' : 'PAYER MA COMMANDE'}
      </button>
    </form>
  );
}
