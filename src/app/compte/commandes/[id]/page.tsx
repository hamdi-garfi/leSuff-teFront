import { redirect, notFound } from 'next/navigation';
import Link from 'next/link';
import { getCurrentUser } from '@/lib/session';
import { getOrderDetail } from '@/lib/orders';
import { OrderTimeline } from '@/components/OrderTimeline';
import { ReorderButton } from '@/components/ReorderButton';
import { ReturnRequestForm } from '@/components/ReturnRequestForm';
import { PrintButton } from '@/components/PrintButton';
import { RETURN_REASON_LABELS, RETURN_STATUS_LABELS } from '@/lib/returnReasons';

const STATUS_LABELS: Record<string, string> = {
  pending: 'En attente de paiement',
  paid: 'Payée',
  shipped: 'Expédiée',
  completed: 'Livrée',
  cancelled: 'Annulée',
};

export const metadata = { title: 'Détail de la commande — Le Suffète Classic' };

export default async function OrderDetailPage({ params }: { params: { id: string } }) {
  const user = await getCurrentUser();
  if (!user) {
    redirect(`/compte/connexion?next=compte/commandes/${params.id}`);
  }

  const order = await getOrderDetail(Number(params.id));
  if (!order) {
    notFound();
  }

  const subtotal = order.items.reduce((sum, i) => sum + i.unitPrice * i.quantity, 0);

  return (
    <div className="mx-auto max-w-4xl px-6 md:px-8 py-16">
      <p className="text-xs text-foreground/40 mb-8 print:hidden">
        <Link href="/compte" className="hover:text-gold">
          Mon compte
        </Link>{' '}
        / <span className="text-foreground/70">Commande {order.number}</span>
      </p>

      <div className="flex items-start justify-between mb-10">
        <div>
          <h1 className="section-title">COMMANDE {order.number}</h1>
          <div className="section-title-underline" />
          <p className="text-sm text-foreground/50 mt-2">
            {new Date(order.createdAt).toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' })} ·{' '}
            {STATUS_LABELS[order.status] ?? order.status}
          </p>
        </div>
        <PrintButton />
      </div>

      <div className="grid md:grid-cols-2 gap-10 mb-12">
        <div>
          <h2 className="text-xs tracking-widest2 text-foreground/60 mb-4">SUIVI DE LIVRAISON</h2>
          <OrderTimeline status={order.status} fulfillmentStatus={order.fulfillmentStatus} />
          {order.trackingNumber && (
            <p className="text-xs text-foreground/50 mt-4">
              {order.carrier ?? 'Transporteur'} — n° {order.trackingNumber}
            </p>
          )}
        </div>

        {order.shippingAddress && (
          <div>
            <h2 className="text-xs tracking-widest2 text-foreground/60 mb-4">ADRESSE DE LIVRAISON</h2>
            <p className="text-sm text-foreground/80">
              {order.shippingAddress.street}
              {order.shippingAddress.complement && <>, {order.shippingAddress.complement}</>}
              <br />
              {order.shippingAddress.postalCode} {order.shippingAddress.city}
              <br />
              {order.shippingAddress.country}
            </p>
            {order.giftWrap && (
              <p className="text-xs text-gold mt-3">
                🎁 Emballage cadeau{order.giftMessage ? ` — "${order.giftMessage}"` : ''}
              </p>
            )}
          </div>
        )}

        {(order.billingAddress || order.shippingAddress) && (
          <div>
            <h2 className="text-xs tracking-widest2 text-foreground/60 mb-4">ADRESSE DE FACTURATION</h2>
            <p className="text-sm text-foreground/80">
              {(order.billingAddress ?? order.shippingAddress)!.street}
              {(order.billingAddress ?? order.shippingAddress)!.complement && (
                <>, {(order.billingAddress ?? order.shippingAddress)!.complement}</>
              )}
              <br />
              {(order.billingAddress ?? order.shippingAddress)!.postalCode} {(order.billingAddress ?? order.shippingAddress)!.city}
              <br />
              {(order.billingAddress ?? order.shippingAddress)!.country}
            </p>
          </div>
        )}
      </div>

      <h2 className="text-xs tracking-widest2 text-foreground/60 mb-4">ARTICLES</h2>
      <div className="divide-y divide-foreground/10 mb-6">
        {order.items.map((item) => (
          <div key={item.id} className="flex items-center justify-between py-4">
            <div>
              <Link href={`/produit/${item.productSlug}`} className="text-sm hover:text-gold transition">
                {item.productName}
              </Link>
              <p className="text-xs text-foreground/40 mt-0.5">
                Taille {item.size} · {item.color} · Réf. {item.sku}
                {item.refundedQuantity > 0 && <span className="text-gold"> · {item.refundedQuantity} retourné(s)</span>}
              </p>
            </div>
            <p className="text-sm shrink-0">
              {item.quantity} × {item.unitPrice.toFixed(2)} €
            </p>
          </div>
        ))}
      </div>

      <div className="max-w-xs ml-auto text-sm space-y-1 mb-12">
        <div className="flex justify-between">
          <span className="text-foreground/50">Sous-total</span>
          <span>{subtotal.toFixed(2)} €</span>
        </div>
        {order.discountAmount !== null && order.discountAmount > 0 && (
          <div className="flex justify-between text-gold">
            <span>Réduction</span>
            <span>-{order.discountAmount.toFixed(2)} €</span>
          </div>
        )}
        {order.shippingCost !== null && (
          <div className="flex justify-between">
            <span className="text-foreground/50">Livraison</span>
            <span>{order.shippingCost === 0 ? 'Offerte' : `${order.shippingCost.toFixed(2)} €`}</span>
          </div>
        )}
        <div className="flex justify-between text-base border-t border-foreground/10 pt-2 mt-2">
          <span>Total</span>
          <span>{order.total.toFixed(2)} €</span>
        </div>
      </div>

      {order.returns.length > 0 && (
        <div className="mb-12">
          <h2 className="text-xs tracking-widest2 text-foreground/60 mb-4">RETOURS EN COURS</h2>
          <div className="space-y-3">
            {order.returns.map((r) => (
              <div key={r.id} className="border border-foreground/10 p-4 text-sm">
                <div className="flex items-center justify-between mb-1">
                  <span>{r.number}</span>
                  <span className="text-xs text-gold">{RETURN_STATUS_LABELS[r.status] ?? r.status}</span>
                </div>
                <p className="text-xs text-foreground/40">{RETURN_REASON_LABELS[r.reason] ?? r.reason}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="flex flex-wrap items-start gap-4 print:hidden">
        <ReorderButton items={order.items.map((i) => ({ variantId: i.variantId, quantity: i.quantity }))} />
        <ReturnRequestForm orderId={order.id} items={order.items} />
        <Link href="/contact" className="border border-foreground/30 px-5 py-3 text-xs tracking-widest2 uppercase hover:border-gold transition">
          CONTACTER LE SUPPORT
        </Link>
      </div>
    </div>
  );
}
