import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getCurrentUser } from '@/lib/session';
import { getMyOrders } from '@/lib/orders';
import { LogoutButton } from '@/components/LogoutButton';

export const metadata = { title: 'Mon compte — Le Suffète Classic' };

const STATUS_LABELS: Record<string, string> = {
  pending: 'En attente de paiement',
  paid: 'Payée',
  shipped: 'Expédiée',
  completed: 'Livrée',
  cancelled: 'Annulée',
};

export default async function AccountPage() {
  const user = await getCurrentUser();
  if (!user) {
    redirect('/compte/connexion?next=compte');
  }

  const orders = await getMyOrders();

  return (
    <div className="mx-auto max-w-4xl px-6 md:px-8 py-16">
      <h1 className="section-title">MON COMPTE</h1>
      <div className="section-title-underline" />

      <div className="flex items-center justify-between border border-white/10 p-6 mb-12">
        <div>
          <p className="text-sm">
            {user.firstName} {user.lastName}
          </p>
          <p className="text-sm text-white/50">{user.email}</p>
        </div>
        <div className="flex items-center gap-6">
          <Link href="/compte/adresses" className="text-xs tracking-widest2 hover:text-gold transition">
            MES ADRESSES
          </Link>
          <LogoutButton />
        </div>
      </div>

      <h2 className="text-xs tracking-widest2 text-white/60 mb-4">MES COMMANDES</h2>
      {orders.length === 0 ? (
        <p className="text-white/50 text-sm">Vous n&apos;avez pas encore passé de commande.</p>
      ) : (
        <div className="divide-y divide-white/10">
          {orders.map((order) => (
            <div key={order.id} className="py-5">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm">{order.number}</span>
                <span className="text-xs text-gold">{STATUS_LABELS[order.status] ?? order.status}</span>
              </div>
              <p className="text-xs text-white/40 mb-2">
                {new Date(order.createdAt).toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' })}
              </p>
              <ul className="text-xs text-white/50 space-y-1">
                {order.items.map((item, idx) => (
                  <li key={idx}>
                    {item.quantity}× {item.productName} ({item.size}, {item.color})
                  </li>
                ))}
              </ul>
              <p className="text-sm mt-2">{order.total.toFixed(2)} €</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
