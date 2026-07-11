import { colorToHex } from '@/lib/colors';

export function ColorSwatches({
  colors,
  selected,
  onSelect,
}: {
  colors: string[];
  selected: string;
  onSelect: (color: string) => void;
}) {
  return (
    <div className="flex items-center gap-3 mt-4">
      {colors.map((color) => (
        <button
          key={color}
          type="button"
          onClick={() => onSelect(color)}
          aria-label={color}
          title={color}
          aria-pressed={color === selected}
          className={`w-8 h-8 rounded-full transition ${
            color === selected ? 'ring-2 ring-gold ring-offset-2 ring-offset-surface' : 'hover:ring-2 hover:ring-foreground/30 hover:ring-offset-2 hover:ring-offset-surface'
          }`}
          style={{ backgroundColor: colorToHex(color) }}
        />
      ))}
    </div>
  );
}
