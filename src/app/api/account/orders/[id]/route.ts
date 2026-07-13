import { NextResponse } from 'next/server';
import { backendFetch, handleBackendError } from '@/lib/backend';
import { getTokenFromCookies } from '@/lib/auth';
import type { AccountOrderDetail } from '@/lib/orders';

export async function GET(_request: Request, { params }: { params: { id: string } }) {
  const token = getTokenFromCookies();
  if (!token) {
    return NextResponse.json({ error: 'authentication required' }, { status: 401 });
  }

  try {
    const order = await backendFetch<AccountOrderDetail>(`/api/account/orders/${params.id}`, { token, cache: 'no-store' });
    return NextResponse.json(order);
  } catch (e) {
    return handleBackendError(e);
  }
}
