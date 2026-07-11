export function SearchBox({ basePath, defaultValue }: { basePath: string; defaultValue?: string }) {
  return (
    <form action={basePath} method="GET" className="flex justify-center max-w-md mx-auto mb-4">
      <input
        type="search"
        name="q"
        defaultValue={defaultValue}
        placeholder="Rechercher un produit…"
        className="flex-1 bg-panel border border-white/20 px-4 py-3 text-sm outline-none focus:border-gold"
      />
      <button type="submit" className="btn-gold px-5">
        OK
      </button>
    </form>
  );
}
