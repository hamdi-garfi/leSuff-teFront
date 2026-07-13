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

      <div className="flex items-center justify-between border border-foreground/10 p-6 mb-6">
        <div>
          <p className="text-sm">
            {user.firstName} {user.lastName}
          </p>
          <p className="text-sm text-foreground/50">{user.email}</p>
        </div>
        <LogoutButton />
      </div>

      <div className="flex flex-wrap gap-3 mb-12">
        <Link href="/compte/portefeuille" className="text-xs tracking-widest2 uppercase border border-gold text-gold px-4 py-2.5 hover:bg-gold hover:text-background transition">
          Mon portefeuille
        </Link>
        <Link href="/compte/profil" className="text-xs tracking-widest2 uppercase border border-foreground/20 px-4 py-2.5 hover:border-gold transition">
          Mon profil
        </Link>
        <Link href="/compte/adresses" className="text-xs tracking-widest2 uppercase border border-foreground/20 px-4 py-2.5 hover:border-gold transition">
          Mes adresses
        </Link>
        <Link href="/liste-de-souhaits" className="text-xs tracking-widest2 uppercase border border-foreground/20 px-4 py-2.5 hover:border-gold transition">
          Liste de souhaits
        </Link>
        <Link href="/vu-recemment" className="text-xs tracking-widest2 uppercase border border-foreground/20 px-4 py-2.5 hover:border-gold transition">
          Vu récemment
        </Link>
      </div>

      <h2 className="text-xs tracking-widest2 text-foreground/60 mb-4">MES COMMANDES</h2>
      {orders.length === 0 ? (
        <p className="text-foreground/50 text-sm">Vous n&apos;avez pas encore passé de commande.</p>
      ) : (
        <div className="divide-y divide-foreground/10">
          {orders.map((order) => (
            <Link key={order.id} href={`/compte/commandes/${order.id}`} className="block py-5 hover:bg-surface2 transition -mx-4 px-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm">{order.number}</span>
                <span className="text-xs text-gold">{STATUS_LABELS[order.status] ?? order.status}</span>
              </div>
              <p className="text-xs text-foreground/40 mb-2">
                {new Date(order.createdAt).toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' })}
              </p>
              <ul className="text-xs text-foreground/50 space-y-1">
                {order.items.map((item, idx) => (
                  <li key={idx}>
                    {item.quantity}× {item.productName} ({item.size}, {item.color})
                  </li>
                ))}
              </ul>
              <p className="text-sm mt-2">{order.total.toFixed(2)} €</p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
