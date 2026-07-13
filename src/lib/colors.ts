const COLOR_MAP: Record<string, string> = {
  Marine: '#1e2a4a',
  Vert: '#2f4d3a',
  Blanc: '#f2f0ea',
  Noir: '#161616',
  'Gris Chiné': '#8b8b8b',
  Beige: '#d8c7a1',
  Bordeaux: '#5c1f2b',
  Camel: '#b07a44',
  Marron: '#5a3b23',
  Anthracite: '#2b2f36',
};

export function colorToHex(color: string, hex?: string | null): string {
  if (hex && /^#[0-9a-f]{6}$/i.test(hex)) {
    return hex;
  }
  return COLOR_MAP[color] ?? '#6b7280';
}
