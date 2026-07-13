'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getCookieConsent, setCookieConsent } from '@/lib/cookieConsent';

export function CookieConsentBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(getCookieConsent() === null);
  }, []);

  function choose(value: 'accepted' | 'rejected') {
    setCookieConsent(value);
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 inset-x-0 z-50 border-t border-foreground/10 bg-surface/98 backdrop-blur">
      <div className="mx-auto max-w-7xl px-6 md:px-8 py-5 flex flex-col md:flex-row items-center gap-4">
        <p className="text-xs text-foreground/60 leading-relaxed flex-1">
          Nous utilisons des cookies essentiels au fonctionnement du site (panier, connexion) et, avec votre accord,
          des cookies de mesure d&apos;audience pour améliorer votre expérience. Consultez notre{' '}
          <Link href="/pages/confidentialite" className="text-gold hover:underline">
            politique de confidentialité
          </Link>
          .
        </p>
        <div className="flex gap-3 shrink-0">
          <button
            type="button"
            onClick={() => choose('rejected')}
            className="text-xs tracking-widest2 uppercase border border-foreground/20 px-4 py-2.5 hover:border-gold transition"
          >
            Refuser
          </button>
          <button type="button" onClick={() => choose('accepted')} className="btn-gold text-xs px-4 py-2.5">
            TOUT ACCEPTER
          </button>
        </div>
      </div>
    </div>
  );
}
