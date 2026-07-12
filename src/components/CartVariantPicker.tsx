'use client';

import type { CartItem } from '@/lib/types';

export function CartVariantPicker({ item, onChange, className }: { item: CartItem; onChange: (variantId: number) => void; className?: string }) {
  if (item.availableVariants.length <= 1) {
    return (
      <p className="text-xs text-foreground/40">
        Taille {item.variant.size} · {item.variant.color}
      </p>
    );
  }

  return (
    <select
      value={item.variant.id}
      onChange={(e) => onChange(Number(e.target.value))}
      className={className ?? 'bg-transparent border border-foreground/20 text-xs px-1.5 py-1 outline-none focus:border-gold'}
    >
      {item.availableVariants.map((v) => (
        <option key={v.id} value={v.id} disabled={v.stock === 0}>
          {v.size} — {v.color}
          {v.stock === 0 ? ' (rupture)' : ''}
        </option>
      ))}
    </select>
  );
}
