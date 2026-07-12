import { cookies } from 'next/headers';
import type { NextResponse } from 'next/server';
import { backendFetch } from '@/lib/backend';

export const GUEST_CART_COOKIE = 'suffete_guest_cart';

export function getGuestCartTokenFromCookies(): string | null {
  return cookies().get(GUEST_CART_COOKIE)?.value ?? null;
}

export function guestCartCookieOptions(maxAgeSeconds: number = 60 * 60 * 24 * 30) {
  return {
    httpOnly: true,
    secure: process.env.COOKIE_SECURE === 'true',
    sameSite: 'lax' as const,
    path: '/',
    maxAge: maxAgeSeconds,
  };
}

/** Headers to forward the guest cart token to the backend when there's no JWT. */
export function guestCartHeaders(token: string | null): Record<string, string> {
  const guestToken = token ? null : getGuestCartTokenFromCookies();
  return guestToken ? { 'X-Guest-Cart-Token': guestToken } : {};
}

/** If the backend minted a new guest cart token, persist it as a cookie on the outgoing response. */
export function persistGuestCartToken(response: NextResponse, data: unknown): void {
  if (data && typeof data === 'object' && 'guestToken' in data && typeof data.guestToken === 'string') {
    response.cookies.set(GUEST_CART_COOKIE, data.guestToken, guestCartCookieOptions());
  }
}

/** Clears the guest cart cookie, e.g. after it has been merged into a user's cart. */
export function clearGuestCartToken(response: NextResponse): void {
  response.cookies.delete(GUEST_CART_COOKIE);
}

/** Folds any guest cart into the just-authenticated user's cart, then clears the guest cookie. Best-effort. */
export async function mergeGuestCartIfPresent(userToken: string, response: NextResponse): Promise<void> {
  const guestToken = getGuestCartTokenFromCookies();
  if (!guestToken) {
    return;
  }

  try {
    await backendFetch('/api/cart/merge-guest', { method: 'POST', token: userToken, body: { guestToken } });
  } catch {
    // Non-fatal: worst case the guest's items stay in their old guest cart, unreachable
    // without the token. Never block login/registration on this.
  }
  clearGuestCartToken(response);
}
