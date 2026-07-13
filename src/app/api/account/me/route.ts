import { NextResponse } from 'next/server';
import { backendFetch, handleBackendError } from '@/lib/backend';
import { getTokenFromCookies } from '@/lib/auth';

export async function PATCH(request: Request) {
  const token = getTokenFromCookies();
  if (!token) {
    return NextResponse.json({ error: 'authentication required' }, { status: 401 });
  }

  const payload = await request.json();

  try {
    const user = await backendFetch('/api/account/me', { method: 'PATCH', token, body: payload });
    return NextResponse.json(user);
  } catch (e) {
    return handleBackendError(e);
  }
}
