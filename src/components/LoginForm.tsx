'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    if (!res.ok) {
      const data = await res.json();
      setError(data.error ?? 'Identifiants invalides.');
      setLoading(false);
      return;
    }

    const next = searchParams.get('next');
    router.push(next ? `/${next}` : '/compte');
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-sm mx-auto">
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
        <div className="flex items-center justify-between mb-2">
          <label className="text-xs tracking-widest2 text-foreground/60">MOT DE PASSE</label>
          <Link href="/compte/mot-de-passe-oublie" className="text-xs text-foreground/40 hover:text-gold">
            Oublié ?
          </Link>
        </div>
        <input
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full bg-surface2 border border-foreground/20 px-3 py-3 text-sm outline-none focus:border-gold"
        />
      </div>
      {error && <p className="text-sm text-red-400">{error}</p>}
      <button type="submit" disabled={loading} className="btn-gold w-full disabled:opacity-50">
        {loading ? 'Connexion…' : 'SE CONNECTER'}
      </button>
      <p className="text-sm text-foreground/50 text-center">
        Pas encore de compte ?{' '}
        <Link href="/compte/inscription" className="text-gold hover:underline">
          Créer un compte
        </Link>
      </p>
    </form>
  );
}
