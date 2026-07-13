import { NextResponse } from 'next/server';
import { backendFetch, handleBackendError } from '@/lib/backend';
import { getTokenFromCookies } from '@/lib/auth';

export async function POST(request: Request) {
  const token = getTokenFromCookies();
  if (!token) {
    return NextResponse.json({ error: 'authentication required' }, { status: 401 });
  }

  const payload = await request.json();

  try {
    const result = await backendFetch('/api/account/change-password', { method: 'POST', token, body: payload });
    return NextResponse.json(result);
  } catch (e) {
    return handleBackendError(e);
  }
}
