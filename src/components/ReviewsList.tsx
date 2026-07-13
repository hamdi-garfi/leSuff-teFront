'use client';

import { useMemo, useState } from 'react';
import { StarRating } from '@/components/StarRating';
import type { Review } from '@/lib/reviews';

function MiniRatingBadge({ label, value }: { label: string; value: number | null }) {
  if (!value) return null;
  return (
    <span className="text-xs text-foreground/50">
      {label} <span className="text-gold">{value}/5</span>
    </span>
  );
}

export function ReviewsList({ reviews }: { reviews: Review[] }) {
  const [sizeFilter, setSizeFilter] = useState('');
  const [colorFilter, setColorFilter] = useState('');

  const sizes = useMemo(
    () => Array.from(new Set(reviews.map((r) => r.sizeBought).filter((s): s is string => !!s))),
    [reviews],
  );
  const colors = useMemo(
    () => Array.from(new Set(reviews.map((r) => r.colorBought).filter((c): c is string => !!c))),
    [reviews],
  );

  const filtered = reviews.filter(
    (r) => (!sizeFilter || r.sizeBought === sizeFilter) && (!colorFilter || r.colorBought === colorFilter),
  );

  return (
    <div className="space-y-6">
      {(sizes.length > 0 || colors.length > 0) && (
        <div className="flex flex-wrap gap-3 text-xs">
          {sizes.length > 0 && (
            <select
              value={sizeFilter}
              onChange={(e) => setSizeFilter(e.target.value)}
              className="bg-surface2 border border-foreground/20 px-2 py-1.5 outline-none focus:border-gold"
            >
              <option value="">Toutes les tailles</option>
              {sizes.map((s) => (
                <option key={s} value={s}>
                  Taille {s}
                </option>
              ))}
            </select>
          )}
          {colors.length > 0 && (
            <select
              value={colorFilter}
              onChange={(e) => setColorFilter(e.target.value)}
              className="bg-surface2 border border-foreground/20 px-2 py-1.5 outline-none focus:border-gold"
            >
              <option value="">Toutes les couleurs</option>
              {colors.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          )}
        </div>
      )}

      {filtered.length === 0 ? (
        <p className="text-foreground/50 text-sm">Aucun avis ne correspond à ce filtre.</p>
      ) : (
        filtered.map((review) => (
          <div key={review.id} className="border-b border-foreground/10 pb-6">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <StarRating value={review.rating} />
              <span className="text-sm">{review.author}</span>
              {review.verifiedPurchase && (
                <span className="text-xs text-gold border border-gold/40 px-1.5 py-0.5">Achat vérifié</span>
              )}
            </div>
            <p className="text-xs text-foreground/40 mb-2">
              {new Date(review.createdAt).toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' })}
              {(review.sizeBought || review.colorBought) && (
                <>
                  {' — '}
                  {review.sizeBought && `Taille ${review.sizeBought}`}
                  {review.sizeBought && review.colorBought && ', '}
                  {review.colorBought}
                </>
              )}
            </p>
            {review.comment && <p className="text-foreground/70 text-sm mb-2">{review.comment}</p>}
            {(review.fitRating || review.qualityRating || review.comfortRating) && (
              <div className="flex flex-wrap gap-3 mb-2">
                <MiniRatingBadge label="Coupe" value={review.fitRating} />
                <MiniRatingBadge label="Qualité" value={review.qualityRating} />
                <MiniRatingBadge label="Confort" value={review.comfortRating} />
              </div>
            )}
            {review.photoUrl && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={review.photoUrl} alt="Photo client" className="w-20 h-20 object-cover mb-2" />
            )}
            {review.brandReply && (
              <div className="border-l-2 border-gold pl-3 mt-2">
                <p className="text-xs text-gold mb-1">Réponse de Le Suffète Classic</p>
                <p className="text-sm text-foreground/60">{review.brandReply}</p>
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
}
