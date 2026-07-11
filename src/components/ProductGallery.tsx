'use client';

import { useState } from 'react';

export function ProductGallery({
  name,
  images,
  fallbackGradient,
  badge,
}: {
  name: string;
  images: string[];
  fallbackGradient: string;
  badge?: React.ReactNode;
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeImage = images[activeIndex];

  return (
    <div>
      <div
        className="aspect-square flex items-center justify-center overflow-hidden relative"
        style={activeImage ? undefined : { background: fallbackGradient }}
      >
        {activeImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={activeImage} alt={name} className="w-full h-full object-cover" />
        ) : (
          <span className="font-serif text-9xl text-foreground/10 select-none">{name.charAt(0)}</span>
        )}
        {badge}
      </div>

      {images.length > 1 && (
        <div className="flex gap-2 mt-3">
          {images.map((image, index) => (
            <button
              key={image + index}
              type="button"
              onClick={() => setActiveIndex(index)}
              aria-label={`Voir l'image ${index + 1}`}
              className={`w-16 h-16 shrink-0 overflow-hidden border transition ${
                index === activeIndex ? 'border-gold' : 'border-foreground/15 hover:border-foreground/40'
              }`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={image} alt="" className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
