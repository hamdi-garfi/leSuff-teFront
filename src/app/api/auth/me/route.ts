import { NextResponse } from 'next/server';
import { backendFetch, handleBackendError } from '@/lib/backend';
import { getTokenFromCookies } from '@/lib/auth';
import type { CurrentUser } from '@/lib/types';

export async function GET() {
  const token = getTokenFromCookies();
  if (!token) {
    return NextResponse.json({ error: 'authentication required' }, { status: 401 });
  }

  try {
    const user = await backendFetch<CurrentUser>('/api/account/me', { token });
    return NextResponse.json(user);
  } catch (e) {
    return handleBackendError(e);
  }
}
