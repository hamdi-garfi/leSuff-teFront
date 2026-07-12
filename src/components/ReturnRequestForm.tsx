'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { RETURN_REASONS } from '@/lib/returnReasons';
import type { AccountOrderItem } from '@/lib/orders';

export function ReturnRequestForm({ orderId, items }: { orderId: number; items: AccountOrderItem[] }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<Record<number, number>>({});
  const [reason, setReason] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState<string | null>(null);

  const eligibleItems = items.filter((i) => i.quantity - i.refundedQuantity > 0);

  function toggle(item: AccountOrderItem) {
    setSelected((prev) => {
      const next = { ...prev };
      if (item.id in next) {
        delete next[item.id];
      } else {
        next[item.id] = item.quantity - item.refundedQuantity;
      }
      return next;
    });
  }

  async function submit() {
    const lines = Object.entries(selected).map(([orderItemId, quantity]) => ({ orderItemId: Number(orderItemId), quantity }));
    if (!reason || lines.length === 0) {
      setStatus('error');
      setMessage('Choisis au moins un article et un motif.');
      return;
    }

    setStatus('loading');
    setMessage(null);

    const res = await fetch(`/api/account/orders/${orderId}/returns`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ reason, items: lines }),
    });
    const data = await res.json();

    if (!res.ok) {
      setStatus('error');
      setMessage(data.error ?? (data.errors ?? []).join(', ') ?? 'Une erreur est survenue.');
      return;
    }

    setStatus('success');
    setMessage(`Demande ${data.number} envoyée. Nous te répondrons rapidement.`);
    router.refresh();
  }

  if (eligibleItems.length === 0) {
    return null;
  }

  if (!open) {
    return (
      <button type="button" onClick={() => setOpen(true)} className="border border-foreground/30 px-5 py-3 text-xs tracking-widest2 uppercase hover:border-gold transition">
        EFFECTUER UN RETOUR
      </button>
    );
  }

  if (status === 'success') {
    return <p className="text-sm text-gold">{message}</p>;
  }

  return (
    <div className="border border-foreground/10 p-6 max-w-lg">
      <h3 className="text-sm tracking-widest2 mb-4">DEMANDE DE RETOUR</h3>

      <div className="space-y-2 mb-4">
        {eligibleItems.map((item) => (
          <label key={item.id} className="flex items-center gap-2 text-sm cursor-pointer">
            <input type="checkbox" checked={item.id in selected} onChange={() => toggle(item)} className="accent-gold" />
            {item.productName} — {item.size}, {item.color} (max {item.quantity - item.refundedQuantity})
          </label>
        ))}
      </div>

      <label className="text-xs tracking-widest2 text-foreground/60 block mb-2">MOTIF</label>
      <select
        value={reason}
        onChange={(e) => setReason(e.target.value)}
        className="w-full bg-surface2 border border-foreground/20 px-3 py-2 text-sm outline-none focus:border-gold mb-4"
      >
        <option value="">Choisir un motif…</option>
        {RETURN_REASONS.map((r) => (
          <option key={r.value} value={r.value}>
            {r.label}
          </option>
        ))}
      </select>

      <div className="flex items-center gap-3">
        <button type="button" onClick={submit} disabled={status === 'loading'} className="btn-gold disabled:opacity-50">
          {status === 'loading' ? 'Envoi…' : 'ENVOYER LA DEMANDE'}
        </button>
        <button type="button" onClick={() => setOpen(false)} className="text-xs text-foreground/50 hover:text-gold transition">
          Annuler
        </button>
      </div>
      {message && status === 'error' && <p className="text-sm text-red-400 mt-3">{message}</p>}
    </div>
  );
}
