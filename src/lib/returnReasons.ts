export const RETURN_REASONS: { value: string; label: string }[] = [
  { value: 'wrong_size', label: 'Mauvaise taille' },
  { value: 'color_mismatch', label: 'Couleur différente des attentes' },
  { value: 'damaged', label: 'Article endommagé' },
  { value: 'wrong_item', label: 'Erreur de commande' },
  { value: 'changed_mind', label: "Changement d'avis" },
];

export const RETURN_REASON_LABELS: Record<string, string> = Object.fromEntries(
  RETURN_REASONS.map((r) => [r.value, r.label]),
);

export const RETURN_STATUS_LABELS: Record<string, string> = {
  requested: 'Retour demandé',
  accepted: 'Retour accepté',
  received: 'Colis reçu',
  refunded: 'Remboursement effectué',
  refused: 'Retour refusé',
};
