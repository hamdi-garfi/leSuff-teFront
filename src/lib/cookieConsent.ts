const CONSENT_KEY = 'suffete_cookie_consent';

export type CookieConsent = 'accepted' | 'rejected';

export function getCookieConsent(): CookieConsent | null {
  if (typeof window === 'undefined') return null;
  const value = localStorage.getItem(CONSENT_KEY);
  return value === 'accepted' || value === 'rejected' ? value : null;
}

export function setCookieConsent(value: CookieConsent) {
  localStorage.setItem(CONSENT_KEY, value);
}

export function hasAnalyticsConsent(): boolean {
  return getCookieConsent() === 'accepted';
}
