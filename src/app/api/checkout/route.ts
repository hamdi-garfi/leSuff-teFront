import { NextResponse } from 'next/server';
import { backendFetch, BackendError } from '@/lib/backend';
import { getTokenFromCookies } from '@/lib/auth';

type CheckoutResponse = {
  id: number;
  number: string;
  status: string;
  total: number;
  clientSecret?: string;
};

export async function POST() {
  const token = getTokenFromCookies();
  if (!token) {
    return NextResponse.json({ error: 'authentication required' }, { status: 401 });
  }

  try {
    const order = await backendFetch<CheckoutResponse>('/api/checkout', { method: 'POST', token });
    return NextResponse.json(order, { status: 201 });
  } catch (e) {
    if (e instanceof BackendError) {
      return NextResponse.json(e.body, { status: e.status });
    }
    return NextResponse.json({ error: 'unexpected error' }, { status: 500 });
  }
}
