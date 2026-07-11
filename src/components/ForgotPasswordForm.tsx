'use client';

import { useState } from 'react';

export function ForgotPasswordForm() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'sent'>('idle');
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus('loading');
    setError(null);

    const res = await fetch('/api/auth/forgot-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });

    if (!res.ok) {
      const data = await res.json();
      setError(data.error ?? 'Une erreur est survenue.');
      setStatus('idle');
      return;
    }

    setStatus('sent');
  }

  if (status === 'sent') {
    return (
      <p className="text-center text-foreground/70 max-w-sm mx-auto">
        Si un compte existe avec cette adresse, un email de réinitialisation vient d&apos;être envoyé. Vérifie ta boîte de
        réception (et tes spams).
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-sm mx-auto">
      <p className="text-sm text-foreground/50 text-center mb-2">
        Indique ton email, nous t&apos;enverrons un lien pour réinitialiser ton mot de passe.
      </p>
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
      {error && <p className="text-sm text-red-400">{error}</p>}
      <button type="submit" disabled={status === 'loading'} className="btn-gold w-full disabled:opacity-50">
        {status === 'loading' ? 'Envoi…' : 'ENVOYER LE LIEN'}
      </button>
    </form>
  );
}
