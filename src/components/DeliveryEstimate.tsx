'use client';

import { useState } from 'react';

type EstimateResult = {
  postalCode: string;
  cutoffHour: number;
  cutoffPassed: boolean;
  minDateLabel: string;
  maxDateLabel: string;
  sameRange: boolean;
};

export function DeliveryEstimate({ inStock }: { inStock: boolean }) {
  const [postalCode, setPostalCode] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'error'>('idle');
  const [result, setResult] = useState<EstimateResult | null>(null);

  async function checkEstimate(e: React.FormEvent) {
    e.preventDefault();
    if (!/^\d{4,6}$/.test(postalCode.trim())) {
      setStatus('error');
      setResult(null);
      return;
    }
    setStatus('loading');
    const res = await fetch(`/api/shipping-estimate?postalCode=${encodeURIComponent(postalCode.trim())}`);
    if (!res.ok) {
      setStatus('error');
      setResult(null);
      return;
    }
    setResult(await res.json());
    setStatus('idle');
  }

  if (!inStock) return null;

  return (
    <div className="mt-6 pt-6 border-t border-foreground/10">
      <p className="text-xs tracking-widest2 text-foreground/60 mb-3">LIVRAISON</p>
      <form onSubmit={checkEstimate} className="flex gap-2">
        <input
          type="text"
          inputMode="numeric"
          placeholder="Code postal"
          value={postalCode}
          onChange={(e) => setPostalCode(e.target.value)}
          className="w-32 bg-surface2 border border-foreground/20 px-3 py-2 text-sm outline-none focus:border-gold"
        />
        <button type="submit" disabled={status === 'loading'} className="border border-foreground/30 px-4 py-2 text-xs tracking-widest2 uppercase hover:border-gold transition disabled:opacity-50">
          Vérifier
        </button>
      </form>

      {status === 'error' && <p className="text-xs text-red-400 mt-2">Code postal invalide.</p>}

      {result && (
        <div className="text-xs text-foreground/60 mt-3 space-y-1">
          <p>
            Livraison à <span className="text-foreground/90">{result.postalCode}</span>
          </p>
          <p>
            {result.cutoffPassed
              ? `Commandé après ${result.cutoffHour}h — expédition le prochain jour ouvré`
              : `Commandez avant ${result.cutoffHour}h pour une expédition aujourd'hui`}
          </p>
          <p className="text-gold">
            Livraison estimée : {result.sameRange ? result.minDateLabel : `entre le ${result.minDateLabel} et le ${result.maxDateLabel}`}
          </p>
        </div>
      )}
    </div>
  );
}
