export function MountainBackdrop() {
  return (
    <svg
      aria-hidden="true"
      className="mountain-backdrop absolute inset-0 w-full h-full pointer-events-none"
      viewBox="0 0 1600 800"
      preserveAspectRatio="xMidYMax slice"
    >
      <defs>
        <radialGradient id="peakGlow" cx="72%" cy="55%" r="42%">
          <stop offset="0%" stopColor="#c9a227" stopOpacity="0.16" />
          <stop offset="60%" stopColor="#c9a227" stopOpacity="0.05" />
          <stop offset="100%" stopColor="#c9a227" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="fadeToInk" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#0a0a0a" stopOpacity="0" />
          <stop offset="100%" stopColor="#0a0a0a" stopOpacity="1" />
        </linearGradient>
      </defs>

      <rect x="0" y="0" width="1600" height="800" fill="url(#peakGlow)" />

      {/* back range */}
      <path
        d="M0,560 L120,440 L230,510 L360,360 L470,470 L620,320 L760,480 L900,380 L1040,500 L1180,400 L1320,520 L1460,420 L1600,540 L1600,800 L0,800 Z"
        fill="#171717"
      />
      {/* mid range */}
      <path
        d="M0,640 L150,520 L280,590 L400,470 L540,600 L680,480 L820,610 L960,510 L1100,620 L1250,500 L1400,610 L1600,530 L1600,800 L0,800 Z"
        fill="#121212"
      />
      {/* front range */}
      <path
        d="M0,720 L180,620 L320,690 L480,600 L620,700 L800,610 L960,700 L1120,620 L1280,700 L1440,630 L1600,700 L1600,800 L0,800 Z"
        fill="#0d0d0d"
      />

      <rect x="0" y="600" width="1600" height="200" fill="url(#fadeToInk)" />
    </svg>
  );
}
