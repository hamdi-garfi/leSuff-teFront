type Step = { label: string; done: boolean; current: boolean };

const FULFILLMENT_TIER: Record<string, number> = {
  to_prepare: 0,
  prepared: 1,
  shipped: 2,
  delivered: 3,
};

export function OrderTimeline({ status, fulfillmentStatus }: { status: string; fulfillmentStatus: string }) {
  if (status === 'cancelled') {
    return <p className="text-sm text-red-400">Cette commande a été annulée.</p>;
  }
  if (fulfillmentStatus === 'failed') {
    return <p className="text-sm text-red-400">La livraison de cette commande a rencontré un problème. Notre équipe vous contactera.</p>;
  }
  if (fulfillmentStatus === 'returned') {
    return <p className="text-sm text-gold">Ce colis a été retourné à l&apos;expéditeur.</p>;
  }

  const paid = status !== 'pending';
  const tier = FULFILLMENT_TIER[fulfillmentStatus] ?? 0;

  const steps: Step[] = [
    { label: 'Commande confirmée', done: true, current: !paid },
    { label: 'Paiement accepté', done: paid, current: paid && tier === 0 },
    { label: 'Préparation en cours', done: tier >= 1, current: tier === 0 && paid },
    { label: 'Expédiée', done: tier >= 2, current: tier === 1 },
    { label: 'Livrée', done: tier >= 3, current: tier === 2 },
  ];

  return (
    <ol className="space-y-3">
      {steps.map((step, i) => (
        <li key={step.label} className="flex items-center gap-3 text-sm">
          <span
            className={`w-5 h-5 shrink-0 rounded-full flex items-center justify-center text-[10px] ${
              step.done
                ? 'bg-gold text-ink'
                : step.current
                  ? 'border-2 border-gold text-gold'
                  : 'border border-foreground/20 text-foreground/30'
            }`}
          >
            {step.done ? '✓' : i + 1}
          </span>
          <span className={step.done || step.current ? 'text-foreground/90' : 'text-foreground/40'}>{step.label}</span>
        </li>
      ))}
    </ol>
  );
}
