import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getCurrentUser } from '@/lib/session';
import { getMyOrders } from '@/lib/orders';
import { AccountTabs } from '@/components/AccountTabs';
import { getDisplayStatus, getPrimaryAction, DELIVERY_MODE_LABELS, PAYMENT_METHOD_LABELS } from '@/lib/orderStatus';

export const metadata = { title: 'Mes commandes — Le Suffète Classic' };

const STATUS_TONE_CLASSES: Record<string, string> = {
  pending: 'text-foreground/50',
  progress: 'text-gold',
  success: 'text-emerald-500',
  muted: 'text-foreground/40',
  danger: 'text-red-400',
};

export default async function OrdersPage() {
  const user = await getCurrentUser();
  if (!user) {
    redirect('/compte/connexion?next=compte/commandes');
  }

  const orders = await getMyOrders();

  return (
    <div className="mx-auto max-w-4xl px-6 md:px-8 py-16">
      <h1 className="section-title">MON COMPTE</h1>
      <div className="section-title-underline" />
      <AccountTabs />

      <h2 className="text-xs tracking-widest2 text-foreground/60 mb-6">MES COMMANDES</h2>

      {orders.length === 0 ? (
        <div className="text-center py-16 border border-foreground/10">
          <p className="text-foreground/50 text-sm mb-6">Vous n&apos;avez pas encore passé de commande.</p>
          <Link href="/collection" className="btn-gold">
            DÉCOUVRIR NOS COLLECTIONS
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => {
            const display = getDisplayStatus(order);
            const action = getPrimaryAction(order);
            return (
              <div key={order.id} className="border border-foreground/10 p-5">
                <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
                  <div>
                    <p className="text-sm">{order.number}</p>
                    <p className="text-xs text-foreground/40 mt-0.5">
                      {new Date(order.createdAt).toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' })} ·{' '}
                      {order.itemCount} article{order.itemCount > 1 ? 's' : ''}
                    </p>
                  </div>
                  <span className={`text-xs tracking-widest2 uppercase ${STATUS_TONE_CLASSES[display.tone]}`}>{display.label}</span>
                </div>

                <div className="flex gap-2 mb-4">
                  {order.items.slice(0, 5).map((item, idx) => (
                    <div key={idx} className="w-14 h-16 bg-surface2 shrink-0 flex items-center justify-center overflow-hidden">
                      {item.imageUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={item.imageUrl} alt={item.productName} className="w-full h-full object-cover" />
                      ) : (
                        <span className="font-serif text-lg text-foreground/15">{item.productName.charAt(0)}</span>
                      )}
                    </div>
                  ))}
                  {order.items.length > 5 && (
                    <div className="w-14 h-16 bg-surface2 shrink-0 flex items-center justify-center text-xs text-foreground/40">
                      +{order.items.length - 5}
                    </div>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-x-6 gap-y-1 text-xs text-foreground/40 mb-4">
                  {order.shippingCity && (
                    <span>
                      Livraison : {order.shippingCity}, {order.shippingCountry}
                    </span>
                  )}
                  <span>{DELIVERY_MODE_LABELS[order.deliveryMode] ?? order.deliveryMode}</span>
                  {order.paymentMethod && <span>{PAYMENT_METHOD_LABELS[order.paymentMethod] ?? order.paymentMethod}</span>}
                </div>

                <div className="flex items-center justify-between">
                  <p className="text-sm">{order.total.toFixed(2)} €</p>
                  <Link
                    href={`/compte/commandes/${order.id}${action?.href.startsWith('#') ? action.href : ''}`}
                    className="text-xs tracking-widest2 uppercase border border-gold text-gold px-4 py-2.5 hover:bg-gold hover:text-background transition"
                  >
                    {action?.label ?? 'VOIR LA COMMANDE'}
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
