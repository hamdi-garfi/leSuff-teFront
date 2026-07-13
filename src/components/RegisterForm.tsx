'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

const EMPTY_ADDRESS = { street: '', complement: '', postalCode: '', city: '', country: 'France' };

export function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [referralCode, setReferralCode] = useState(searchParams.get('ref') ?? '');
  const [showAddresses, setShowAddresses] = useState(false);
  const [sameBillingAddress, setSameBillingAddress] = useState(true);
  const [shippingAddress, setShippingAddress] = useState(EMPTY_ADDRESS);
  const [billingAddress, setBillingAddress] = useState(EMPTY_ADDRESS);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const hasShippingAddress = showAddresses && shippingAddress.street.trim() !== '';

    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        firstName,
        lastName,
        email,
        password,
        ...(referralCode ? { referralCode } : {}),
        ...(hasShippingAddress ? { shippingAddress } : {}),
        ...(hasShippingAddress
          ? { billingAddress: sameBillingAddress ? shippingAddress : billingAddress }
          : {}),
      }),
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

  function addressFields(
    value: typeof EMPTY_ADDRESS,
    onChange: (next: typeof EMPTY_ADDRESS) => void,
  ) {
    return (
      <div className="space-y-3">
        <input
          value={value.street}
          onChange={(e) => onChange({ ...value, street: e.target.value })}
          placeholder="Adresse"
          className="w-full bg-surface2 border border-foreground/20 px-3 py-2.5 text-sm outline-none focus:border-gold"
        />
        <input
          value={value.complement}
          onChange={(e) => onChange({ ...value, complement: e.target.value })}
          placeholder="Complément (optionnel)"
          className="w-full bg-surface2 border border-foreground/20 px-3 py-2.5 text-sm outline-none focus:border-gold"
        />
        <div className="grid grid-cols-2 gap-3">
          <input
            value={value.postalCode}
            onChange={(e) => onChange({ ...value, postalCode: e.target.value })}
            placeholder="Code postal"
            className="w-full bg-surface2 border border-foreground/20 px-3 py-2.5 text-sm outline-none focus:border-gold"
          />
          <input
            value={value.city}
            onChange={(e) => onChange({ ...value, city: e.target.value })}
            placeholder="Ville"
            className="w-full bg-surface2 border border-foreground/20 px-3 py-2.5 text-sm outline-none focus:border-gold"
          />
        </div>
        <input
          value={value.country}
          onChange={(e) => onChange({ ...value, country: e.target.value })}
          placeholder="Pays"
          className="w-full bg-surface2 border border-foreground/20 px-3 py-2.5 text-sm outline-none focus:border-gold"
        />
      </div>
    );
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

      {showAddresses ? (
        <div className="border-t border-foreground/10 pt-4 space-y-4">
          <div>
            <label className="text-xs tracking-widest2 text-foreground/60 block mb-2">ADRESSE DE LIVRAISON (OPTIONNEL)</label>
            {addressFields(shippingAddress, setShippingAddress)}
          </div>
          <label className="flex items-center gap-2 text-sm cursor-pointer">
            <input
              type="checkbox"
              checked={sameBillingAddress}
              onChange={(e) => setSameBillingAddress(e.target.checked)}
              className="w-auto"
            />
            Utiliser la même adresse pour la facturation
          </label>
          {!sameBillingAddress && (
            <div>
              <label className="text-xs tracking-widest2 text-foreground/60 block mb-2">ADRESSE DE FACTURATION</label>
              {addressFields(billingAddress, setBillingAddress)}
            </div>
          )}
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setShowAddresses(true)}
          className="text-xs tracking-widest2 uppercase text-foreground/50 hover:text-gold transition"
        >
          + Ajouter mes adresses de livraison et facturation (optionnel)
        </button>
      )}

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
