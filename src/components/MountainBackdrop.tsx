export function MountainBackdrop() {
  return (
    <svg
      aria-hidden="true"
      className="mountain-backdrop absolute inset-0 w-full h-full pointer-events-none opacity-[0.35]"
      viewBox="0 0 1600 800"
      preserveAspectRatio="xMidYMax slice"
    >
      <defs>
        <linearGradient id="fadeToInk" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#070707" stopOpacity="0" />
          <stop offset="100%" stopColor="#070707" stopOpacity="1" />
        </linearGradient>
      </defs>

      {/* back range */}
      <path
        d="M0,600 L150,510 L280,560 L420,450 L560,540 L700,430 L840,550 L980,460 L1120,560 L1260,470 L1400,560 L1600,500 L1600,800 L0,800 Z"
        fill="#111111"
      />
      {/* front range */}
      <path
        d="M0,700 L200,630 L360,690 L520,620 L680,700 L860,630 L1020,700 L1180,640 L1360,700 L1600,660 L1600,800 L0,800 Z"
        fill="#0a0a0a"
      />

      <rect x="0" y="600" width="1600" height="200" fill="url(#fadeToInk)" />
    </svg>
  );
}
