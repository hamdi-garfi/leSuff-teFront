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
  const [type, setType] = useState<'refund' | 'exchange'>('refund');
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
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

  function setQuantity(item: AccountOrderItem, quantity: number) {
    const max = item.quantity - item.refundedQuantity;
    setSelected((prev) => ({ ...prev, [item.id]: Math.min(Math.max(1, quantity), max) }));
  }

  async function handlePhotoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingPhoto(true);
    const formData = new FormData();
    formData.append('photo', file);

    const res = await fetch('/api/account/returns/photo', { method: 'POST', body: formData });
    const data = await res.json();

    if (!res.ok) {
      setStatus('error');
      setMessage(data.error ?? "Échec de l'envoi de la photo.");
      setUploadingPhoto(false);
      return;
    }

    setPhotoUrl(data.url);
    setUploadingPhoto(false);
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
      body: JSON.stringify({ reason, type, photoUrl, items: lines }),
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

      <div className="space-y-3 mb-4">
        {eligibleItems.map((item) => {
          const max = item.quantity - item.refundedQuantity;
          const isSelected = item.id in selected;
          return (
            <div key={item.id}>
              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <input type="checkbox" checked={isSelected} onChange={() => toggle(item)} className="accent-gold" />
                {item.productName} — {item.size}, {item.color} (max {max})
              </label>
              {isSelected && max > 1 && (
                <div className="flex items-center gap-2 mt-1 ml-6">
                  <label className="text-xs text-foreground/50">Quantité</label>
                  <input
                    type="number"
                    min={1}
                    max={max}
                    value={selected[item.id]}
                    onChange={(e) => setQuantity(item, Number(e.target.value))}
                    className="w-16 bg-surface2 border border-foreground/20 px-2 py-1 text-sm outline-none focus:border-gold"
                  />
                </div>
              )}
            </div>
          );
        })}
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

      <label className="text-xs tracking-widest2 text-foreground/60 block mb-2">SOUHAIT</label>
      <div className="flex gap-4 mb-4">
        <label className="flex items-center gap-2 text-sm cursor-pointer">
          <input type="radio" name="returnType" checked={type === 'refund'} onChange={() => setType('refund')} className="accent-gold" />
          Remboursement
        </label>
        <label className="flex items-center gap-2 text-sm cursor-pointer">
          <input type="radio" name="returnType" checked={type === 'exchange'} onChange={() => setType('exchange')} className="accent-gold" />
          Échange
        </label>
      </div>

      <label className="text-xs tracking-widest2 text-foreground/60 block mb-2">PHOTO (OPTIONNEL)</label>
      {photoUrl ? (
        <div className="flex items-center gap-3 mb-4">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={photoUrl} alt="" className="w-14 h-14 object-cover" />
          <button type="button" onClick={() => setPhotoUrl(null)} className="text-xs text-red-400/70 hover:text-red-400">
            Retirer
          </button>
        </div>
      ) : (
        <input
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={handlePhotoChange}
          disabled={uploadingPhoto}
          className="mb-1 text-sm"
        />
      )}
      {uploadingPhoto && <p className="text-xs text-foreground/40 mb-4">Envoi en cours…</p>}

      <div className="flex items-center gap-3 mt-4">
        <button type="button" onClick={submit} disabled={status === 'loading' || uploadingPhoto} className="btn-gold disabled:opacity-50">
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
