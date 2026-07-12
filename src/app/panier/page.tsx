import { getCart, getCurrentUser } from '@/lib/session';
import { getShippingZones } from '@/lib/shipping';
import { getMyAddresses } from '@/lib/addresses';
import { CartClient } from '@/components/CartClient';

export const metadata = { title: 'Mon panier — Le Suffète Classic' };

export default async function CartPage() {
  const [cart, shippingZones, addresses, user] = await Promise.all([
    getCart(),
    getShippingZones(),
    getMyAddresses(),
    getCurrentUser(),
  ]);

  return (
    <div className="mx-auto max-w-6xl px-6 md:px-8 py-16">
      <h1 className="section-title">MON PANIER</h1>
      <div className="section-title-underline" />
      <CartClient initialCart={cart} shippingZones={shippingZones} addresses={addresses} isAuthenticated={!!user} />
    </div>
  );
}
