'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import type { CurrentUser } from '@/lib/types';

export function ProfileForm({ user }: { user: CurrentUser }) {
  const router = useRouter();
  const [firstName, setFirstName] = useState(user.firstName);
  const [lastName, setLastName] = useState(user.lastName);
  const [email, setEmail] = useState(user.email);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    const res = await fetch('/api/account/me', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ firstName, lastName, email }),
    });
    const data = await res.json();

    if (!res.ok) {
      setError(data.error ?? 'Une erreur est survenue.');
      setLoading(false);
      return;
    }

    setSuccess(true);
    setLoading(false);
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="border border-foreground/10 p-6 space-y-4 max-w-lg">
      <h2 className="text-xs tracking-widest2 text-foreground/60">INFORMATIONS PERSONNELLES</h2>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-xs tracking-widest2 text-foreground/60 block mb-2">PRÉNOM</label>
          <input
            required
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            className="w-full bg-surface2 border border-foreground/20 px-3 py-2.5 text-sm outline-none focus:border-gold"
          />
        </div>
        <div>
          <label className="text-xs tracking-widest2 text-foreground/60 block mb-2">NOM</label>
          <input
            required
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            className="w-full bg-surface2 border border-foreground/20 px-3 py-2.5 text-sm outline-none focus:border-gold"
          />
        </div>
      </div>
      <div>
        <label className="text-xs tracking-widest2 text-foreground/60 block mb-2">E-MAIL</label>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full bg-surface2 border border-foreground/20 px-3 py-2.5 text-sm outline-none focus:border-gold"
        />
      </div>
      {error && <p className="text-sm text-red-400">{error}</p>}
      {success && <p className="text-sm text-gold">Modifications enregistrées.</p>}
      <button type="submit" disabled={loading} className="btn-gold disabled:opacity-50">
        {loading ? 'Enregistrement…' : 'ENREGISTRER'}
      </button>
    </form>
  );
}
