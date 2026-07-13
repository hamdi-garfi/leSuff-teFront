import type { Metadata } from 'next';
import { Cormorant_Garamond, Montserrat } from 'next/font/google';
import './globals.css';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { getCart, getCurrentUser } from '@/lib/session';
import { getStoreSettings } from '@/lib/storeSettings';
import { WishlistProvider } from '@/lib/WishlistContext';
import { CartProvider } from '@/lib/CartContext';
import { CartDrawer } from '@/components/CartDrawer';
import { CookieConsentBanner } from '@/components/CookieConsentBanner';

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  variable: '--font-playfair',
  weight: ['500', '600', '700'],
});

const montserrat = Montserrat({
  subsets: ['latin'],
  variable: '--font-inter',
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.SITE_URL || 'http://localhost:3000'),
  title: 'Le Suffète Classic — Force. Style. Héritage.',
  description: "L'élégance affirmée. L'héritage qui inspire. Polos, t-shirts, sweats et casquettes Le Suffète.",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const [user, cart, storeSettings] = await Promise.all([getCurrentUser(), getCart(), getStoreSettings()]);

  return (
    <html lang="fr" className={`${cormorant.variable} ${montserrat.variable}`}>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `try{if(localStorage.getItem('theme')==='light'){document.documentElement.setAttribute('data-theme','light');}}catch(e){}`,
          }}
        />
      </head>
      <body className="font-sans">
        <WishlistProvider isAuthenticated={!!user}>
          <CartProvider initialCart={cart} freeShippingThreshold={storeSettings.freeShippingThreshold}>
            <Header user={user} />
            <main>{children}</main>
            <Footer />
            <CartDrawer />
            <CookieConsentBanner />
          </CartProvider>
        </WishlistProvider>
      </body>
    </html>
  );
}
