'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

export function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [referralCode, setReferralCode] = useState(searchParams.get('ref') ?? '');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ firstName, lastName, email, password, ...(referralCode ? { referralCode } : {}) }),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(Array.isArray(data.errors) ? data.errors.join(', ') : (data.error ?? 'Une erreur est survenue.'));
      setLoading(false);
      return;
    }

    router.push('/compte');
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-sm mx-auto">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-xs tracking-widest2 text-foreground/60 block mb-2">PRÉNOM</label>
          <input
            required
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            className="w-full bg-surface2 border border-foreground/20 px-3 py-3 text-sm outline-none focus:border-gold"
          />
        </div>
        <div>
          <label className="text-xs tracking-widest2 text-foreground/60 block mb-2">NOM</label>
          <input
            required
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            className="w-full bg-surface2 border border-foreground/20 px-3 py-3 text-sm outline-none focus:border-gold"
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
          className="w-full bg-surface2 border border-foreground/20 px-3 py-3 text-sm outline-none focus:border-gold"
        />
      </div>
      <div>
        <label className="text-xs tracking-widest2 text-foreground/60 block mb-2">MOT DE PASSE</label>
        <input
          type="password"
          required
          minLength={8}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full bg-surface2 border border-foreground/20 px-3 py-3 text-sm outline-none focus:border-gold"
        />
        <p className="text-xs text-foreground/40 mt-1">8 caractères minimum.</p>
      </div>
      <div>
        <label className="text-xs tracking-widest2 text-foreground/60 block mb-2">CODE DE PARRAINAGE (OPTIONNEL)</label>
        <input
          value={referralCode}
          onChange={(e) => setReferralCode(e.target.value.toUpperCase())}
          placeholder="ABCD1234"
          className="w-full bg-surface2 border border-foreground/20 px-3 py-3 text-sm outline-none focus:border-gold"
        />
      </div>
      {error && <p className="text-sm text-red-400">{error}</p>}
      <button type="submit" disabled={loading} className="btn-gold w-full disabled:opacity-50">
        {loading ? 'Création…' : 'CRÉER MON COMPTE'}
      </button>
      <p className="text-sm text-foreground/50 text-center">
        Déjà client ?{' '}
        <Link href="/compte/connexion" className="text-gold hover:underline">
          Se connecter
        </Link>
      </p>
    </form>
  );
}
