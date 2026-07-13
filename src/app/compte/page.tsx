import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getCurrentUser } from '@/lib/session';
import { getMyOrders } from '@/lib/orders';
import { getLoyalty } from '@/lib/loyalty';
import { getWishlist } from '@/lib/wishlist';
import { LogoutButton } from '@/components/LogoutButton';
import { AccountTabs } from '@/components/AccountTabs';
import { TrustBadges } from '@/components/TrustBadges';
import { getStoreSettings } from '@/lib/storeSettings';
import { getDisplayStatus, getPrimaryAction } from '@/lib/orderStatus';

export const metadata = { title: 'Mon compte — Le Suffète Classic' };

export default async function AccountPage() {
  const user = await getCurrentUser();
  if (!user) {
    redirect('/compte/connexion?next=compte');
  }

  const [orders, loyalty, wishlist, storeSettings] = await Promise.all([
    getMyOrders(),
    getLoyalty(),
    getWishlist(),
    getStoreSettings(),
  ]);

  const totalSpent = orders.reduce((sum, o) => sum + o.total, 0);
  const recentOrders = orders.slice(0, 3);

  const stats = [
    { label: 'Commandes', value: orders.length },
    { label: 'Total dépensé', value: `${totalSpent.toFixed(2)} €` },
    { label: 'Points fidélité', value: loyalty?.pointsBalance ?? 0 },
    { label: 'Liste de souhaits', value: wishlist.length },
  ];

  return (
    <div className="mx-auto max-w-4xl px-6 md:px-8 py-16">
      <h1 className="section-title">MON COMPTE</h1>
      <div className="section-title-underline" />

      <div className="flex flex-wrap items-center justify-between gap-4 border border-foreground/10 p-6 mb-6">
        <div>
          <p className="text-sm">
            {user.firstName} {user.lastName}
          </p>
          <p className="text-sm text-foreground/50">{user.email}</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link href="/compte/profil" className="btn-outline">
            MODIFIER MES INFORMATIONS
          </Link>
          <LogoutButton />
        </div>
      </div>

      <AccountTabs />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
        {stats.map((s) => (
          <div key={s.label} className="border border-foreground/10 p-5 text-center">
            <p className="text-2xl font-serif text-gold">{s.value}</p>
            <p className="text-xs text-foreground/50 mt-1 tracking-wide">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="grid md:grid-cols-3 gap-10">
        <div className="md:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xs tracking-widest2 text-foreground/60">DERNIÈRES COMMANDES</h2>
            {orders.length > 0 && (
              <Link href="/compte/commandes" className="text-xs text-gold hover:underline">
                Voir tout
              </Link>
            )}
          </div>
          {recentOrders.length === 0 ? (
            <div className="text-center py-16 border border-foreground/10">
              <p className="text-foreground/50 text-sm mb-6">Vous n&apos;avez pas encore passé de commande.</p>
              <Link href="/collection" className="btn-gold">
                DÉCOUVRIR NOS COLLECTIONS
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-foreground/10">
              {recentOrders.map((order) => {
                const display = getDisplayStatus(order);
                const action = getPrimaryAction(order);
                return (
                  <div key={order.id} className="flex items-center justify-between py-5">
                    <div>
                      <p className="text-sm">{order.number}</p>
                      <p className="text-xs text-foreground/40 mt-0.5">
                        {new Date(order.createdAt).toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' })} ·{' '}
                        {order.total.toFixed(2)} € · <span className="text-gold">{display.label}</span>
                      </p>
                    </div>
                    <Link
                      href={`/compte/commandes/${order.id}${action?.href.startsWith('#') ? action.href : ''}`}
                      className="text-xs tracking-widest2 uppercase text-foreground/50 hover:text-gold transition shrink-0"
                    >
                      {action?.label ?? 'VOIR'}
                    </Link>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="border border-foreground/10 p-6 h-fit">
          <h2 className="text-xs tracking-widest2 text-foreground/60 mb-4">VOS AVANTAGES</h2>
          <TrustBadges freeShippingThreshold={storeSettings.freeShippingThreshold} layout="list" />
        </div>
      </div>
    </div>
  );
}
