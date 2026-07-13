import { NextResponse } from 'next/server';
import { backendFetch, handleBackendError } from '@/lib/backend';
import { AUTH_COOKIE, authCookieOptions } from '@/lib/auth';
import { mergeGuestCartIfPresent } from '@/lib/guestCart';

export async function POST(request: Request) {
  const payload = await request.json();

  try {
    const data = await backendFetch<{ token: string; user: unknown }>('/api/auth/register', {
      method: 'POST',
      body: payload,
    });

    const response = NextResponse.json({ user: data.user });
    response.cookies.set(AUTH_COOKIE, data.token, authCookieOptions(60 * 60 * 24 * 7));
    await mergeGuestCartIfPresent(data.token, response);
    return response;
  } catch (e) {
    return handleBackendError(e);
  }
}
