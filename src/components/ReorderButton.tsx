'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/lib/CartContext';

export function ReorderButton({ items }: { items: { variantId: number; quantity: number }[] }) {
  const router = useRouter();
  const { refresh: refreshCart, openDrawer } = useCart();
  const [loading, setLoading] = useState(false);
  const [failedCount, setFailedCount] = useState(0);

  async function reorder() {
    setLoading(true);
    setFailedCount(0);
    let failures = 0;
    for (const item of items) {
      const res = await fetch('/api/cart/items', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ variantId: item.variantId, quantity: item.quantity }),
      });
      if (!res.ok) failures += 1;
    }
    setLoading(false);
    setFailedCount(failures);
    await refreshCart();
    if (failures < items.length) openDrawer();
    router.refresh();
  }

  return (
    <div>
      <button type="button" onClick={reorder} disabled={loading} className="btn-gold disabled:opacity-50">
        {loading ? 'Ajout…' : 'RENOUVELER LA COMMANDE'}
      </button>
      {failedCount > 0 && (
        <p className="text-xs text-red-400 mt-2">
          {failedCount} article{failedCount > 1 ? 's' : ''} indisponible{failedCount > 1 ? 's' : ''} et non ajouté{failedCount > 1 ? 's' : ''}.
        </p>
      )}
    </div>
  );
}
