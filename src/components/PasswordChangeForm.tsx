'use client';

import { useState } from 'react';

export function PasswordChangeForm() {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    const res = await fetch('/api/account/change-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ currentPassword, newPassword }),
    });
    const data = await res.json();

    if (!res.ok) {
      setError(data.error ?? 'Une erreur est survenue.');
      setLoading(false);
      return;
    }

    setCurrentPassword('');
    setNewPassword('');
    setSuccess(true);
    setLoading(false);
  }

  return (
    <form onSubmit={handleSubmit} className="border border-foreground/10 p-6 space-y-4 max-w-lg">
      <h2 className="text-xs tracking-widest2 text-foreground/60">MOT DE PASSE</h2>
      <div>
        <label className="text-xs tracking-widest2 text-foreground/60 block mb-2">MOT DE PASSE ACTUEL</label>
        <input
          type="password"
          required
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          className="w-full bg-surface2 border border-foreground/20 px-3 py-2.5 text-sm outline-none focus:border-gold"
        />
      </div>
      <div>
        <label className="text-xs tracking-widest2 text-foreground/60 block mb-2">NOUVEAU MOT DE PASSE</label>
        <input
          type="password"
          required
          minLength={8}
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          className="w-full bg-surface2 border border-foreground/20 px-3 py-2.5 text-sm outline-none focus:border-gold"
        />
        <p className="text-xs text-foreground/40 mt-1">8 caractères minimum.</p>
      </div>
      {error && <p className="text-sm text-red-400">{error}</p>}
      {success && <p className="text-sm text-gold">Mot de passe mis à jour.</p>}
      <button type="submit" disabled={loading} className="btn-gold disabled:opacity-50">
        {loading ? 'Enregistrement…' : 'CHANGER LE MOT DE PASSE'}
      </button>
    </form>
  );
}
