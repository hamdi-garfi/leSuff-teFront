import { TruckIcon, ReturnIcon, ShieldIcon, StarBadgeIcon, PaymentMethodsInline } from '@/components/PaymentIcons';

export function TrustBadges({
  freeShippingThreshold,
  layout = 'grid',
}: {
  freeShippingThreshold: number;
  layout?: 'grid' | 'list';
}) {
  const perks = [
    { title: 'Livraison offerte', desc: `Dès ${freeShippingThreshold}€ d'achat`, icon: <TruckIcon /> },
    { title: 'Retours faciles', desc: '30 jours pour changer d’avis', icon: <ReturnIcon /> },
    { title: 'Paiement sécurisé', desc: <PaymentMethodsInline />, icon: <ShieldIcon /> },
    { title: 'Qualité premium', desc: 'Sélection des meilleurs matériaux', icon: <StarBadgeIcon /> },
  ];

  if (layout === 'list') {
    return (
      <div className="space-y-5">
        {perks.map((p) => (
          <div key={p.title} className="flex items-start gap-3">
            <span className="text-gold shrink-0">{p.icon}</span>
            <div>
              <p className="text-sm font-semibold tracking-wide">{p.title}</p>
              <p className="text-xs text-foreground/50">{p.desc}</p>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-foreground/10">
      {perks.map((p) => (
        <div key={p.title} className="flex flex-col items-center text-center gap-2 py-8 px-4">
          <span className="text-gold">{p.icon}</span>
          <span className="text-sm font-semibold tracking-wide">{p.title}</span>
          <span className="text-xs text-foreground/50">{p.desc}</span>
        </div>
      ))}
    </div>
  );
}
