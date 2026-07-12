'use client';

export function PrintButton() {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="print:hidden shrink-0 border border-foreground/30 px-4 py-2 text-xs tracking-widest2 uppercase hover:border-gold transition"
    >
      Imprimer la facture
    </button>
  );
}
