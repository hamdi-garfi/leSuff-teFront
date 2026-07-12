export function CardIcon() {
  return (
    <svg width="20" height="14" viewBox="0 0 24 16" fill="none" stroke="currentColor" strokeWidth="1.4">
      <rect x="1" y="1" width="22" height="14" rx="2" />
      <line x1="1" y1="5.5" x2="23" y2="5.5" />
      <line x1="4" y1="10.5" x2="9" y2="10.5" />
    </svg>
  );
}

export function PayPalIcon() {
  return (
    <svg width="14" height="16" viewBox="0 0 16 18" fill="none" stroke="currentColor" strokeWidth="1.4">
      <path d="M4 1.5h5.2c2.4 0 4 1.4 3.6 3.7-.4 2.6-2.4 4-4.9 4H5.6L4.6 15" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M6.3 5.2h5c2.4 0 4 1.4 3.6 3.7-.4 2.6-2.4 4-4.9 4H7.7l-1 5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function AppleIcon() {
  return (
    <svg width="13" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M16.7 12.7c0-2.6 2.1-3.9 2.2-4-1.2-1.8-3.1-2-3.8-2-1.6-.2-3.1.9-3.9.9-.8 0-2.1-.9-3.4-.9-1.7 0-3.4 1-4.3 2.6-1.8 3.2-.5 7.9 1.3 10.5.9 1.3 1.9 2.7 3.2 2.6 1.3-.1 1.8-.8 3.3-.8s2 .8 3.3.8c1.4 0 2.3-1.3 3.1-2.5.7-1 1-2 1.4-3.1-2.7-1-3.2-3.9-2.4-5.1z" />
      <path d="M14.2 5.4c.7-.8 1.1-1.9 1-3-1 .1-2.1.7-2.8 1.5-.6.7-1.1 1.8-1 2.9 1.1.1 2.1-.5 2.8-1.4z" />
    </svg>
  );
}

export function TruckIcon() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4">
      <path d="M2 6h11v10H2z" />
      <path d="M13 10h4l4 3.2V16h-8z" />
      <circle cx="6.5" cy="18" r="1.8" />
      <circle cx="16.5" cy="18" r="1.8" />
    </svg>
  );
}

export function ReturnIcon() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4">
      <path d="M4 8V4H8" />
      <path d="M4 4l4.5 4.5A8 8 0 1 1 4 13.5" />
    </svg>
  );
}

export function ShieldIcon() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4">
      <path d="M12 2.5 4 5.5v6c0 5 3.4 8.4 8 10 4.6-1.6 8-5 8-10v-6z" />
      <path d="M8.5 12l2.3 2.3L15.5 9.5" />
    </svg>
  );
}

export function StarBadgeIcon() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4">
      <path d="M12 2.5l2.7 5.7 6.1.7-4.5 4.3 1.2 6.1-5.5-3-5.5 3 1.2-6.1L3.2 8.9l6.1-.7z" strokeLinejoin="round" />
    </svg>
  );
}

export function PaymentMethodsInline() {
  return (
    <span className="inline-flex items-center gap-2 text-foreground/50">
      <CardIcon />
      <PayPalIcon />
      <AppleIcon />
    </span>
  );
}

export function PaymentBadge({ method }: { method: 'visa' | 'mastercard' | 'paypal' | 'apple-pay' }) {
  const config = {
    visa: { icon: <CardIcon />, label: 'VISA' },
    mastercard: { icon: <CardIcon />, label: 'MASTERCARD' },
    paypal: { icon: <PayPalIcon />, label: 'PAYPAL' },
    'apple-pay': { icon: <AppleIcon />, label: 'APPLE PAY' },
  }[method];

  return (
    <span className="inline-flex items-center gap-1.5 border border-foreground/15 rounded px-2.5 py-1.5 text-foreground/50">
      {config.icon}
      <span className="text-[10px] tracking-wide">{config.label}</span>
    </span>
  );
}
