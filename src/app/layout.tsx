import type { Metadata } from 'next';
import { Playfair_Display, Inter } from 'next/font/google';
import './globals.css';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { getCart, getCurrentUser } from '@/lib/session';

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  weight: ['500', '600', '700'],
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: 'Le Suffète Classic — Force. Style. Héritage.',
  description: "L'élégance affirmée. L'héritage qui inspire. Polos, t-shirts, sweats et casquettes Le Suffète.",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const [user, cart] = await Promise.all([getCurrentUser(), getCart()]);
  const cartCount = cart?.items.reduce((sum, item) => sum + item.quantity, 0) ?? 0;

  return (
    <html lang="fr" className={`${playfair.variable} ${inter.variable}`}>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `try{if(localStorage.getItem('theme')==='light'){document.documentElement.setAttribute('data-theme','light');}}catch(e){}`,
          }}
        />
      </head>
      <body className="font-sans">
        <Header cartCount={cartCount} user={user} />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
