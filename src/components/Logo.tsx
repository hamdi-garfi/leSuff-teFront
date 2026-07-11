import fs from 'node:fs';
import path from 'node:path';
import Image from 'next/image';

const LOGO_FILE = path.join(process.cwd(), 'public', 'logo.png');

export function Logo({ size = 56, src }: { size?: number; src?: string | null }) {
  if (src) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={src} alt="Le Suffète" width={size} height={size} className="object-contain" style={{ width: size, height: size }} />;
  }

  const hasLogo = fs.existsSync(LOGO_FILE);

  if (hasLogo) {
    return (
      <Image
        src="/logo.png"
        alt="Le Suffète"
        width={size}
        height={size}
        className="object-contain"
        priority
      />
    );
  }

  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" aria-hidden="true">
      <defs>
        <linearGradient id="goldGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#f8e7a1" />
          <stop offset="100%" stopColor="#8a6d1d" />
        </linearGradient>
      </defs>
      <circle cx="32" cy="32" r="30" stroke="url(#goldGrad)" strokeWidth="1.5" />
      <text
        x="32"
        y="41"
        textAnchor="middle"
        fontFamily="Georgia, serif"
        fontSize="26"
        fill="url(#goldGrad)"
      >
        S
      </text>
    </svg>
  );
}

export function Wordmark({ className = '' }: { className?: string }) {
  return (
    <div className={`flex flex-col items-center ${className}`}>
      <span className="font-serif text-2xl tracking-widest2 bg-gradient-to-b from-gold-light to-gold-dark bg-clip-text text-transparent">
        LE SUFFÈTE
      </span>
      <span className="text-[10px] tracking-[0.35em] text-foreground/60 -mt-1">CLASSIC</span>
    </div>
  );
}
