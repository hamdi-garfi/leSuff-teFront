import { NextResponse } from 'next/server';
import { backendFetch, BackendError } from '@/lib/backend';
import { AUTH_COOKIE, authCookieOptions } from '@/lib/auth';
import { mergeGuestCartIfPresent } from '@/lib/guestCart';

export async function POST(request: Request) {
  const payload = await request.json();

  try {
    const data = await backendFetch<{ token: string }>('/api/auth/login', {
      method: 'POST',
      body: payload,
    });

    const response = NextResponse.json({ success: true });
    response.cookies.set(AUTH_COOKIE, data.token, authCookieOptions(60 * 60 * 24 * 7));
    await mergeGuestCartIfPresent(data.token, response);
    return response;
  } catch (e) {
    if (e instanceof BackendError) {
      return NextResponse.json({ error: 'identifiants invalides' }, { status: e.status });
    }
    return NextResponse.json({ error: 'unexpected error' }, { status: 500 });
  }
}
