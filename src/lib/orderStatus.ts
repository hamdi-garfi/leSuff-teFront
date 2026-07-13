export type DisplayStatus = {
  label: string;
  tone: 'pending' | 'progress' | 'success' | 'muted' | 'danger';
};

/**
 * Orders track a payment/lifecycle status and a separate warehouse fulfillment
 * status. Customers only care about one unified state, so this collapses both
 * into the single label list from the account-page spec.
 */
export function getDisplayStatus(order: { status: string; fulfillmentStatus: string }): DisplayStatus {
  switch (order.status) {
    case 'pending':
      return { label: 'En attente de paiement', tone: 'pending' };
    case 'cancelled':
      return { label: 'Annulée', tone: 'muted' };
    case 'refunded':
      return { label: 'Remboursée', tone: 'muted' };
    case 'partially_refunded':
      return { label: 'Partiellement remboursée', tone: 'muted' };
  }

  switch (order.fulfillmentStatus) {
    case 'prepared':
      return { label: 'En préparation', tone: 'progress' };
    case 'shipped':
      return { label: 'Expédiée', tone: 'progress' };
    case 'delivered':
      return { label: 'Livrée', tone: 'success' };
    case 'failed':
      return { label: 'Échec de livraison', tone: 'danger' };
    case 'returned':
      return { label: 'Retournée', tone: 'muted' };
    default:
      return { label: 'Paiement confirmé', tone: 'progress' };
  }
}

export function getPrimaryAction(order: { status: string; fulfillmentStatus: string }): { label: string; href: string } | null {
  if (order.status === 'cancelled' || order.status === 'refunded') {
    return null;
  }
  if (order.fulfillmentStatus === 'shipped') {
    return { label: 'SUIVRE MON COLIS', href: '#tracking' };
  }
  if (order.fulfillmentStatus === 'delivered') {
    return { label: 'DEMANDER UN RETOUR', href: '#return' };
  }
  return { label: 'VOIR LA COMMANDE', href: '' };
}

export const DELIVERY_MODE_LABELS: Record<string, string> = {
  home: 'Livraison à domicile',
  relay_point: 'Point relais',
  express: 'Livraison express',
};

export const PAYMENT_METHOD_LABELS: Record<string, string> = {
  card: 'Carte bancaire',
  gift_card: 'Carte cadeau',
  free: 'Gratuit',
};
