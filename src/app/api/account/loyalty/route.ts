import { NextResponse } from 'next/server';
import { backendFetch, handleBackendError } from '@/lib/backend';
import { getTokenFromCookies } from '@/lib/auth';
import type { Loyalty } from '@/lib/loyalty';

export async function GET() {
  const token = getTokenFromCookies();
  if (!token) {
    return NextResponse.json({ error: 'authentication required' }, { status: 401 });
  }

  try {
    const loyalty = await backendFetch<Loyalty>('/api/account/loyalty', { token, cache: 'no-store' });
    return NextResponse.json(loyalty);
  } catch (e) {
    return handleBackendError(e);
  }
}
