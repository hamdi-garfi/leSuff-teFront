'use client';

import { useState } from 'react';

export function ContactForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'error' | 'sent'>('idle');
  const [error, setError] = useState<string | null>(null);

  if (status === 'sent') {
    return (
      <p className="text-sm text-foreground/60 border border-foreground/10 p-5">
        Merci, votre message a bien été envoyé. Nous vous répondrons dans les meilleurs délais.
      </p>
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus('loading');
    setError(null);

    const res = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, message }),
    });

    if (!res.ok) {
      const data = await res.json();
      setError(data.error ?? (data.errors ? data.errors.join(', ') : 'Une erreur est survenue.'));
      setStatus('error');
      return;
    }

    setStatus('sent');
  }

  return (
    <form onSubmit={handleSubmit} className="border border-foreground/10 p-5 max-w-md space-y-3">
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Votre nom"
        required
        className="w-full bg-surface2 border border-foreground/20 px-3 py-2 text-sm outline-none focus:border-gold"
      />
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Votre email"
        required
        className="w-full bg-surface2 border border-foreground/20 px-3 py-2 text-sm outline-none focus:border-gold"
      />
      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Votre message"
        rows={5}
        required
        className="w-full bg-surface2 border border-foreground/20 px-3 py-2 text-sm outline-none focus:border-gold"
      />
      {error && <p className="text-sm text-red-400">{error}</p>}
      <button type="submit" disabled={status === 'loading'} className="btn-gold disabled:opacity-50">
        {status === 'loading' ? 'Envoi…' : 'ENVOYER'}
      </button>
    </form>
  );
}
