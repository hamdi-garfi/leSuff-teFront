import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getCurrentUser } from '@/lib/session';
import { getWishlist } from '@/lib/wishlist';
import { WishlistButton } from '@/components/WishlistButton';

export const metadata = { title: 'Liste de souhaits — Le Suffète Classic' };

export default async function WishlistPage() {
  const user = await getCurrentUser();
  if (!user) {
    redirect('/compte/connexion?next=liste-de-souhaits');
  }

  const items = await getWishlist();

  return (
    <div className="mx-auto max-w-6xl px-6 md:px-8 py-16">
      <h1 className="section-title">MA LISTE DE SOUHAITS</h1>
      <div className="section-title-underline" />

      {items.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-foreground/50 mb-6">Votre liste de souhaits est vide.</p>
          <Link href="/collection" className="btn-gold">
            DÉCOUVRIR LA COLLECTION
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {items.map((item) => {
            const onSale = item.product.compareAtPrice !== null && item.product.compareAtPrice > item.product.basePrice;
            return (
              <div key={item.id} className="group">
                <div className="relative">
                  <Link href={`/produit/${item.product.slug}`} className="block">
                    <div className="aspect-[3/4] w-full flex items-center justify-center relative overflow-hidden bg-surface2">
                      {item.product.imageUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={item.product.imageUrl}
                          alt={item.product.name}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                      ) : (
                        <span className="font-serif text-5xl text-foreground/15 select-none">{item.product.name.charAt(0)}</span>
                      )}
                      {!item.product.inStock && (
                        <span className="absolute top-3 left-3 bg-black/80 text-white text-[10px] font-bold px-2 py-1 tracking-wide">
                          RUPTURE
                        </span>
                      )}
                    </div>
                  </Link>
                  <WishlistButton
                    productId={item.productId}
                    className="absolute top-2 right-2 w-8 h-8 flex items-center justify-center text-white hover:text-gold transition drop-shadow-md"
                  />
                </div>
                <div className="pt-3">
                  <Link href={`/produit/${item.product.slug}`} className="text-sm text-foreground/90 hover:text-gold transition">
                    {item.product.name}
                  </Link>
                  <p className="text-sm mt-0.5">
                    <span className={onSale ? 'text-gold font-semibold' : 'text-foreground/60'}>
                      {item.product.basePrice.toFixed(2)} €
                    </span>
                    {onSale && (
                      <span className="text-foreground/40 line-through ml-2 text-xs">{item.product.compareAtPrice!.toFixed(2)} €</span>
                    )}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
