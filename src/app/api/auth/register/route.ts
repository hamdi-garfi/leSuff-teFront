import { NextResponse } from 'next/server';
import { backendFetch, BackendError } from '@/lib/backend';
import { AUTH_COOKIE, authCookieOptions } from '@/lib/auth';

export async function POST(request: Request) {
  const payload = await request.json();

  try {
    const data = await backendFetch<{ token: string; user: unknown }>('/api/auth/register', {
      method: 'POST',
      body: payload,
    });

    const response = NextResponse.json({ user: data.user });
    response.cookies.set(AUTH_COOKIE, data.token, authCookieOptions(60 * 60 * 24 * 7));
    return response;
  } catch (e) {
    if (e instanceof BackendError) {
      return NextResponse.json(e.body, { status: e.status });
    }
    return NextResponse.json({ error: 'unexpected error' }, { status: 500 });
  }
}
