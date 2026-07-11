'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

export function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'done'>('idle');
  const [error, setError] = useState<string | null>(null);

  if (!token) {
    return (
      <p className="text-center text-white/50 max-w-sm mx-auto">
        Lien invalide.{' '}
        <Link href="/compte/mot-de-passe-oublie" className="text-gold hover:underline">
          Demander un nouveau lien
        </Link>
        .
      </p>
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (password !== confirm) {
      setError('Les mots de passe ne correspondent pas.');
      return;
    }
    setStatus('loading');
    setError(null);

    const res = await fetch('/api/auth/reset-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, newPassword: password }),
    });

    if (!res.ok) {
      const data = await res.json();
      setError(data.error ?? 'Une erreur est survenue.');
      setStatus('idle');
      return;
    }

    setStatus('done');
    setTimeout(() => router.push('/compte/connexion'), 2000);
  }

  if (status === 'done') {
    return <p className="text-center text-green-400 max-w-sm mx-auto">Mot de passe mis à jour. Redirection…</p>;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-sm mx-auto">
      <div>
        <label className="text-xs tracking-widest2 text-white/60 block mb-2">NOUVEAU MOT DE PASSE</label>
        <input
          type="password"
          required
          minLength={8}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full bg-panel border border-white/20 px-3 py-3 text-sm outline-none focus:border-gold"
        />
        <p className="text-xs text-white/40 mt-1">8 caractères minimum.</p>
      </div>
      <div>
        <label className="text-xs tracking-widest2 text-white/60 block mb-2">CONFIRMER LE MOT DE PASSE</label>
        <input
          type="password"
          required
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          className="w-full bg-panel border border-white/20 px-3 py-3 text-sm outline-none focus:border-gold"
        />
      </div>
      {error && <p className="text-sm text-red-400">{error}</p>}
      <button type="submit" disabled={status === 'loading'} className="btn-gold w-full disabled:opacity-50">
        {status === 'loading' ? 'Enregistrement…' : 'RÉINITIALISER'}
      </button>
    </form>
  );
}
