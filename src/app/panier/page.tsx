import { getCart } from '@/lib/session';
import { CartClient } from '@/components/CartClient';

export const metadata = { title: 'Mon panier — Le Suffète Classic' };

export default async function CartPage() {
  const cart = await getCart();

  return (
    <div className="mx-auto max-w-6xl px-6 md:px-8 py-16">
      <h1 className="section-title">MON PANIER</h1>
      <div className="section-title-underline" />
      <CartClient initialCart={cart} />
    </div>
  );
}
