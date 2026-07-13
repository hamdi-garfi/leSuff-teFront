import { NextResponse } from 'next/server';
import { backendFetch, handleBackendError } from '@/lib/backend';
import { getTokenFromCookies } from '@/lib/auth';
import type { Address } from '@/lib/types';

export async function GET() {
  const token = getTokenFromCookies();
  if (!token) {
    return NextResponse.json({ error: 'authentication required' }, { status: 401 });
  }

  try {
    const addresses = await backendFetch<Address[]>('/api/account/addresses', { token, cache: 'no-store' });
    return NextResponse.json(addresses);
  } catch (e) {
    return handleBackendError(e);
  }
}

export async function POST(request: Request) {
  const token = getTokenFromCookies();
  if (!token) {
    return NextResponse.json({ error: 'authentication required' }, { status: 401 });
  }

  const payload = await request.json();

  try {
    const address = await backendFetch<Address>('/api/account/addresses', { method: 'POST', token, body: payload });
    return NextResponse.json(address, { status: 201 });
  } catch (e) {
    return handleBackendError(e);
  }
}
