'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export function ReviewForm({ productId, isAuthenticated }: { productId: number; isAuthenticated: boolean }) {
  const router = useRouter();
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'error'>('idle');
  const [error, setError] = useState<string | null>(null);

  if (!isAuthenticated) {
    return (
      <p className="text-sm text-foreground/50">
        <a href="/compte/connexion" className="text-gold hover:underline">
          Connecte-toi
        </a>{' '}
        pour laisser un avis.
      </p>
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus('loading');
    setError(null);

    const res = await fetch(`/api/reviews/${productId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ rating, comment: comment || null }),
    });

    if (!res.ok) {
      const data = await res.json();
      setError(data.error ?? 'Une erreur est survenue.');
      setStatus('error');
      return;
    }

    setComment('');
    setStatus('idle');
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="border border-foreground/10 p-5 max-w-md">
      <label className="text-xs tracking-widest2 text-foreground/60 block mb-2">NOTE</label>
      <div className="flex gap-1 mb-4">
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            type="button"
            onClick={() => setRating(n)}
            className={`text-xl ${n <= rating ? 'text-gold' : 'text-foreground/20'}`}
            aria-label={`${n} étoiles`}
          >
            ★
          </button>
        ))}
      </div>
      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Votre avis (optionnel)"
        rows={3}
        className="w-full bg-surface2 border border-foreground/20 px-3 py-2 text-sm outline-none focus:border-gold mb-3"
      />
      {error && <p className="text-sm text-red-400 mb-3">{error}</p>}
      <button type="submit" disabled={status === 'loading'} className="btn-gold disabled:opacity-50">
        {status === 'loading' ? 'Envoi…' : 'PUBLIER MON AVIS'}
      </button>
    </form>
  );
}
