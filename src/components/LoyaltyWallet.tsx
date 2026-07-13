'use client';

import { useMemo, useRef, useState } from 'react';
import type { Loyalty } from '@/lib/loyaltyLabels';
import { LOYALTY_REASON_LABELS } from '@/lib/loyaltyLabels';

const REDEMPTION_POINTS_PER_EURO = 20;

export function LoyaltyWallet({ initial }: { initial: Loyalty }) {
  const [loyalty, setLoyalty] = useState(initial);
  const [redeemAmount, setRedeemAmount] = useState(100);
  const [redeeming, setRedeeming] = useState(false);
  const [redeemError, setRedeemError] = useState<string | null>(null);
  const [redeemedCode, setRedeemedCode] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const linkInputRef = useRef<HTMLInputElement>(null);

  const referralLink = useMemo(() => {
    if (typeof window === 'undefined') return '';
    return `${window.location.origin}/compte/inscription?ref=${loyalty.referralCode}`;
  }, [loyalty.referralCode]);

  const redeemOptions = useMemo(() => {
    const options: number[] = [];
    for (let p = 100; p <= loyalty.pointsBalance; p += 100) {
      options.push(p);
    }
    return options;
  }, [loyalty.pointsBalance]);

  async function handleCopyLink() {
    try {
      if (!navigator.clipboard) {
        throw new Error('clipboard API unavailable');
      }
      await navigator.clipboard.writeText(referralLink);
    } catch {
      // Clipboard API needs a secure context (HTTPS or localhost); fall back to
      // selecting the text so the user can copy it manually with Ctrl/Cmd+C.
      linkInputRef.current?.select();
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  async function handleRedeem() {
    setRedeeming(true);
    setRedeemError(null);
    setRedeemedCode(null);

    const res = await fetch('/api/account/loyalty/redeem', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ points: redeemAmount }),
    });
    const data = await res.json();

    if (!res.ok) {
      setRedeemError(data.error ?? 'Une erreur est survenue.');
      setRedeeming(false);
      return;
    }

    setRedeemedCode(data.giftCardCode);
    setLoyalty((prev) => ({
      ...prev,
      pointsBalance: prev.pointsBalance - redeemAmount,
      transactions: [
        {
          id: Date.now(),
          points: -redeemAmount,
          reason: 'redemption',
          note: `Échangés contre une carte cadeau de ${(redeemAmount / REDEMPTION_POINTS_PER_EURO).toFixed(2)} €`,
          createdAt: new Date().toISOString(),
        },
        ...prev.transactions,
      ],
    }));
    setRedeeming(false);
  }

  return (
    <div className="space-y-10">
      <div className="border border-foreground/10 p-8 text-center">
        <p className="text-xs tracking-widest2 text-foreground/60 mb-2">SOLDE DE POINTS</p>
        <p className="text-4xl font-light text-gold">{loyalty.pointsBalance}</p>
        <p className="text-xs text-foreground/40 mt-2">
          Soit {(loyalty.pointsBalance / REDEMPTION_POINTS_PER_EURO).toFixed(2)} € en carte cadeau
        </p>
      </div>

      <div className="border border-foreground/10 p-6">
        <h2 className="text-xs tracking-widest2 text-foreground/60 mb-4">PARRAINEZ VOS AMIS</h2>
        <p className="text-sm text-foreground/60 mb-4">
          Offrez 10 € à vos amis et recevez 10 € en carte cadeau dès leur première commande passée avec votre lien.
        </p>
        <div className="flex flex-col sm:flex-row gap-2">
          <input
            ref={linkInputRef}
            readOnly
            value={referralLink}
            onFocus={(e) => e.target.select()}
            className="flex-1 bg-surface2 border border-foreground/20 px-3 py-3 text-sm outline-none"
          />
          <button type="button" onClick={handleCopyLink} className="btn-outline shrink-0">
            {copied ? 'COPIÉ !' : 'COPIER LE LIEN'}
          </button>
        </div>
        <p className="text-xs text-foreground/40 mt-3">
          Votre code : <span className="text-gold">{loyalty.referralCode}</span>
        </p>
      </div>

      <div className="border border-foreground/10 p-6">
        <h2 className="text-xs tracking-widest2 text-foreground/60 mb-4">ÉCHANGER MES POINTS</h2>
        {redeemOptions.length === 0 ? (
          <p className="text-sm text-foreground/50">
            Il vous faut au moins 100 points pour échanger contre une carte cadeau.
          </p>
        ) : (
          <div className="flex flex-col sm:flex-row gap-2 items-start sm:items-center">
            <select
              value={redeemAmount}
              onChange={(e) => setRedeemAmount(Number(e.target.value))}
              className="bg-surface2 border border-foreground/20 px-3 py-3 text-sm outline-none focus:border-gold"
            >
              {redeemOptions.map((opt) => (
                <option key={opt} value={opt}>
                  {opt} points — {(opt / REDEMPTION_POINTS_PER_EURO).toFixed(2)} €
                </option>
              ))}
            </select>
            <button type="button" onClick={handleRedeem} disabled={redeeming} className="btn-gold disabled:opacity-50">
              {redeeming ? 'Échange…' : 'ÉCHANGER CONTRE UNE CARTE CADEAU'}
            </button>
          </div>
        )}
        {redeemError && <p className="text-sm text-red-400 mt-3">{redeemError}</p>}
        {redeemedCode && (
          <p className="text-sm text-gold mt-3">
            Votre carte cadeau <span className="font-medium">{redeemedCode}</span> a été créée et envoyée par e-mail.
          </p>
        )}
      </div>

      <div>
        <h2 className="text-xs tracking-widest2 text-foreground/60 mb-4">HISTORIQUE</h2>
        {loyalty.transactions.length === 0 ? (
          <p className="text-sm text-foreground/50">Aucun mouvement de points pour le moment.</p>
        ) : (
          <div className="divide-y divide-foreground/10">
            {loyalty.transactions.map((t) => (
              <div key={t.id} className="flex items-center justify-between py-3">
                <div>
                  <p className="text-sm">{LOYALTY_REASON_LABELS[t.reason] ?? t.reason}</p>
                  {t.note && <p className="text-xs text-foreground/40">{t.note}</p>}
                  <p className="text-xs text-foreground/30">
                    {new Date(t.createdAt).toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' })}
                  </p>
                </div>
                <span className={`text-sm ${t.points >= 0 ? 'text-gold' : 'text-foreground/50'}`}>
                  {t.points >= 0 ? '+' : ''}
                  {t.points}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
