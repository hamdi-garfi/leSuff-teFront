'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

function MiniStarPicker({ label, value, onChange }: { label: string; value: number; onChange: (n: number) => void }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="text-xs text-foreground/60">{label}</span>
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            type="button"
            onClick={() => onChange(n === value ? 0 : n)}
            className={`text-sm ${n <= value ? 'text-gold' : 'text-foreground/20'}`}
            aria-label={`${label}: ${n}`}
          >
            ★
          </button>
        ))}
      </div>
    </div>
  );
}

export function ReviewForm({ productId, isAuthenticated }: { productId: number; isAuthenticated: boolean }) {
  const router = useRouter();
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [fitRating, setFitRating] = useState(0);
  const [qualityRating, setQualityRating] = useState(0);
  const [comfortRating, setComfortRating] = useState(0);
  const [sizeBought, setSizeBought] = useState('');
  const [colorBought, setColorBought] = useState('');
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [status, setStatus] = useState<'idle' | 'loading' | 'error' | 'submitted'>('idle');
  const [error, setError] = useState<string | null>(null);

  if (status === 'submitted') {
    return (
      <p className="text-sm text-foreground/60 border border-foreground/10 p-5 max-w-md">
        Merci pour votre avis ! Il sera visible sur la fiche produit après validation par notre équipe.
      </p>
    );
  }

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

  async function handlePhotoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingPhoto(true);
    setError(null);

    const formData = new FormData();
    formData.append('photo', file);

    const res = await fetch(`/api/reviews/${productId}/photo`, { method: 'POST', body: formData });
    const data = await res.json();

    if (!res.ok) {
      setError(data.error ?? "Échec de l'envoi de la photo.");
      setUploadingPhoto(false);
      return;
    }

    setPhotoUrl(data.url);
    setUploadingPhoto(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus('loading');
    setError(null);

    const res = await fetch(`/api/reviews/${productId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        rating,
        comment: comment || null,
        fitRating: fitRating || null,
        qualityRating: qualityRating || null,
        comfortRating: comfortRating || null,
        sizeBought: sizeBought || null,
        colorBought: colorBought || null,
        photoUrl,
      }),
    });

    if (!res.ok) {
      const data = await res.json();
      setError(data.error ?? 'Une erreur est survenue.');
      setStatus('error');
      return;
    }

    setComment('');
    setStatus('submitted');
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="border border-foreground/10 p-5 max-w-md space-y-4">
      <div>
        <label className="text-xs tracking-widest2 text-foreground/60 block mb-2">NOTE</label>
        <div className="flex gap-1">
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
      </div>

      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Votre avis (optionnel)"
        rows={3}
        className="w-full bg-surface2 border border-foreground/20 px-3 py-2 text-sm outline-none focus:border-gold"
      />

      <div className="space-y-2 border-t border-foreground/10 pt-4">
        <MiniStarPicker label="Coupe" value={fitRating} onChange={setFitRating} />
        <MiniStarPicker label="Qualité" value={qualityRating} onChange={setQualityRating} />
        <MiniStarPicker label="Confort" value={comfortRating} onChange={setComfortRating} />
      </div>

      <div className="grid grid-cols-2 gap-3 border-t border-foreground/10 pt-4">
        <div>
          <label className="text-xs text-foreground/60 block mb-1">Taille achetée</label>
          <input
            value={sizeBought}
            onChange={(e) => setSizeBought(e.target.value)}
            placeholder="ex: M"
            className="w-full bg-surface2 border border-foreground/20 px-2 py-2 text-xs outline-none focus:border-gold"
          />
        </div>
        <div>
          <label className="text-xs text-foreground/60 block mb-1">Couleur achetée</label>
          <input
            value={colorBought}
            onChange={(e) => setColorBought(e.target.value)}
            placeholder="ex: Marine"
            className="w-full bg-surface2 border border-foreground/20 px-2 py-2 text-xs outline-none focus:border-gold"
          />
        </div>
      </div>
      <p className="text-xs text-foreground/30 -mt-2">
        Si vous avez acheté cet article, la taille et la couleur seront détectées automatiquement.
      </p>

      <div className="border-t border-foreground/10 pt-4">
        <label className="text-xs text-foreground/60 block mb-2">Ajouter une photo (optionnel)</label>
        {photoUrl ? (
          <div className="flex items-center gap-3">
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
            className="text-xs"
          />
        )}
        {uploadingPhoto && <p className="text-xs text-foreground/40 mt-1">Envoi en cours…</p>}
      </div>

      {error && <p className="text-sm text-red-400">{error}</p>}
      <button type="submit" disabled={status === 'loading' || uploadingPhoto} className="btn-gold disabled:opacity-50">
        {status === 'loading' ? 'Envoi…' : 'PUBLIER MON AVIS'}
      </button>
    </form>
  );
}
