const STORAGE_KEY = 'suffete_recently_viewed';
const MAX_ITEMS = 8;
const UPDATE_EVENT = 'suffete:recently-viewed-updated';

export function readViewedSlugs(): string[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as string[]) : [];
  } catch {
    return [];
  }
}

export function recordView(slug: string): string[] {
  const previous = readViewedSlugs().filter((s) => s !== slug);
  const updated = [slug, ...previous].slice(0, MAX_ITEMS);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  window.dispatchEvent(new Event(UPDATE_EVENT));
  return updated;
}

export function clearHistory(): void {
  localStorage.removeItem(STORAGE_KEY);
  window.dispatchEvent(new Event(UPDATE_EVENT));
}

export function subscribeToRecentlyViewed(callback: () => void): () => void {
  window.addEventListener(UPDATE_EVENT, callback);
  window.addEventListener('storage', callback);
  return () => {
    window.removeEventListener(UPDATE_EVENT, callback);
    window.removeEventListener('storage', callback);
  };
}
