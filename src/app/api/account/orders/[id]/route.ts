import { NextResponse } from 'next/server';
import { backendFetch, BackendError } from '@/lib/backend';
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
    if (e instanceof BackendError) {
      return NextResponse.json(e.body, { status: e.status });
    }
    return NextResponse.json({ error: 'unexpected error' }, { status: 500 });
  }
}
