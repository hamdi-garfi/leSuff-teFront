export function StarRating({ value, size = 14 }: { value: number; size?: number }) {
  return (
    <span style={{ fontSize: size }} className="text-gold" aria-label={`${value} sur 5`}>
      {'★'.repeat(Math.round(value))}
      <span className="text-foreground/20">{'★'.repeat(5 - Math.round(value))}</span>
    </span>
  );
}
