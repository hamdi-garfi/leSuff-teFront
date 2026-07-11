'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import type { Address } from '@/lib/types';

const EMPTY_FORM = { street: '', complement: '', postalCode: '', city: '', country: 'France' };

export function AddressBook({ initialAddresses }: { initialAddresses: Address[] }) {
  const router = useRouter();
  const [addresses, setAddresses] = useState(initialAddresses);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function startEdit(address: Address) {
    setEditingId(address.id);
    setIsAdding(false);
    setForm({
      street: address.street,
      complement: address.complement ?? '',
      postalCode: address.postalCode,
      city: address.city,
      country: address.country,
    });
  }

  function startAdd() {
    setIsAdding(true);
    setEditingId(null);
    setForm(EMPTY_FORM);
    setError(null);
  }

  function cancel() {
    setIsAdding(false);
    setEditingId(null);
    setError(null);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const isEditing = editingId !== null;
    const res = await fetch(isEditing ? `/api/account/addresses/${editingId}` : '/api/account/addresses', {
      method: isEditing ? 'PATCH' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    const data = await res.json();

    if (!res.ok) {
      setError(data.errors?.join(', ') ?? data.error ?? 'Une erreur est survenue.');
      setLoading(false);
      return;
    }

    setAddresses((prev) => (isEditing ? prev.map((a) => (a.id === editingId ? data : a)) : [...prev, data]));
    setLoading(false);
    cancel();
    router.refresh();
  }

  async function handleDelete(id: number) {
    setAddresses((prev) => prev.filter((a) => a.id !== id));
    const res = await fetch(`/api/account/addresses/${id}`, { method: 'DELETE' });
    if (res.ok) {
      router.refresh();
    }
  }

  const showForm = isAdding || editingId !== null;

  return (
    <div>
      {addresses.length === 0 && !showForm && <p className="text-foreground/50 text-sm mb-6">Aucune adresse enregistrée.</p>}

      {addresses.length > 0 && (
        <div className="grid md:grid-cols-2 gap-4 mb-8">
          {addresses.map((address) => (
            <div key={address.id} className="border border-foreground/10 p-5">
              <p className="text-sm">{address.street}</p>
              {address.complement && <p className="text-sm text-foreground/60">{address.complement}</p>}
              <p className="text-sm text-foreground/60">
                {address.postalCode} {address.city}
              </p>
              <p className="text-sm text-foreground/60 mb-4">{address.country}</p>
              <div className="flex gap-4 text-xs tracking-widest2">
                <button type="button" onClick={() => startEdit(address)} className="hover:text-gold transition">
                  MODIFIER
                </button>
                <button type="button" onClick={() => handleDelete(address.id)} className="text-foreground/40 hover:text-red-400 transition">
                  SUPPRIMER
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showForm ? (
        <form onSubmit={handleSubmit} className="border border-foreground/10 p-6 space-y-4 max-w-lg">
          <div>
            <label className="text-xs tracking-widest2 text-foreground/60 block mb-2">ADRESSE</label>
            <input
              type="text"
              required
              value={form.street}
              onChange={(e) => setForm({ ...form, street: e.target.value })}
              className="w-full bg-surface2 border border-foreground/20 px-3 py-2 text-sm outline-none focus:border-gold"
            />
          </div>
          <div>
            <label className="text-xs tracking-widest2 text-foreground/60 block mb-2">COMPLÉMENT (OPTIONNEL)</label>
            <input
              type="text"
              value={form.complement}
              onChange={(e) => setForm({ ...form, complement: e.target.value })}
              className="w-full bg-surface2 border border-foreground/20 px-3 py-2 text-sm outline-none focus:border-gold"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs tracking-widest2 text-foreground/60 block mb-2">CODE POSTAL</label>
              <input
                type="text"
                required
                value={form.postalCode}
                onChange={(e) => setForm({ ...form, postalCode: e.target.value })}
                className="w-full bg-surface2 border border-foreground/20 px-3 py-2 text-sm outline-none focus:border-gold"
              />
            </div>
            <div>
              <label className="text-xs tracking-widest2 text-foreground/60 block mb-2">VILLE</label>
              <input
                type="text"
                required
                value={form.city}
                onChange={(e) => setForm({ ...form, city: e.target.value })}
                className="w-full bg-surface2 border border-foreground/20 px-3 py-2 text-sm outline-none focus:border-gold"
              />
            </div>
          </div>
          <div>
            <label className="text-xs tracking-widest2 text-foreground/60 block mb-2">PAYS</label>
            <input
              type="text"
              required
              value={form.country}
              onChange={(e) => setForm({ ...form, country: e.target.value })}
              className="w-full bg-surface2 border border-foreground/20 px-3 py-2 text-sm outline-none focus:border-gold"
            />
          </div>
          {error && <p className="text-sm text-red-400">{error}</p>}
          <div className="flex gap-3">
            <button type="submit" disabled={loading} className="btn-gold disabled:opacity-50">
              {loading ? 'ENREGISTREMENT…' : editingId !== null ? 'METTRE À JOUR' : 'AJOUTER'}
            </button>
            <button type="button" onClick={cancel} className="btn-outline">
              ANNULER
            </button>
          </div>
        </form>
      ) : (
        <button type="button" onClick={startAdd} className="btn-outline">
          + AJOUTER UNE ADRESSE
        </button>
      )}
    </div>
  );
}
