export type LoyaltyTransaction = {
  id: number;
  points: number;
  reason: string;
  note: string | null;
  createdAt: string;
};

export type Loyalty = {
  pointsBalance: number;
  referralCode: string;
  transactions: LoyaltyTransaction[];
};

export const LOYALTY_REASON_LABELS: Record<string, string> = {
  purchase: 'Achat',
  signup: 'Création de compte',
  review: 'Avis publié',
  referral_referrer: 'Parrainage',
  referral_referee: 'Bienvenue (parrainage)',
  birthday: 'Anniversaire',
  redemption: 'Échange contre une carte cadeau',
  admin_adjustment: 'Ajustement',
};
