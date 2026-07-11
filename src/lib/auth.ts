import { cookies } from 'next/headers';

export const AUTH_COOKIE = 'suffete_token';

export function getTokenFromCookies(): string | null {
  return cookies().get(AUTH_COOKIE)?.value ?? null;
}

export function authCookieOptions(maxAgeSeconds: number) {
  return {
    httpOnly: true,
    // Distinct from NODE_ENV=production, which we set for Next's build optimizations
    // even when serving over plain HTTP locally (Docker on localhost). Only mark the
    // cookie Secure once the site is actually served over HTTPS in real deployment.
    secure: process.env.COOKIE_SECURE === 'true',
    sameSite: 'lax' as const,
    path: '/',
    maxAge: maxAgeSeconds,
  };
}
