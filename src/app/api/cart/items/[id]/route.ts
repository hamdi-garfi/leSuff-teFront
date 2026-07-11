import { NextResponse } from 'next/server';
import { backendFetch, BackendError } from '@/lib/backend';
import { getTokenFromCookies } from '@/lib/auth';
import type { Cart } from '@/lib/types';

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  const token = getTokenFromCookies();
  if (!token) {
    return NextResponse.json({ error: 'authentication required' }, { status: 401 });
  }

  const payload = await request.json();

  try {
    const cart = await backendFetch<Cart>(`/api/cart/items/${params.id}`, { method: 'PATCH', token, body: payload });
    return NextResponse.json(cart);
  } catch (e) {
    if (e instanceof BackendError) {
      return NextResponse.json(e.body, { status: e.status });
    }
    return NextResponse.json({ error: 'unexpected error' }, { status: 500 });
  }
}

export async function DELETE(_request: Request, { params }: { params: { id: string } }) {
  const token = getTokenFromCookies();
  if (!token) {
    return NextResponse.json({ error: 'authentication required' }, { status: 401 });
  }

  try {
    const cart = await backendFetch<Cart>(`/api/cart/items/${params.id}`, { method: 'DELETE', token });
    return NextResponse.json(cart);
  } catch (e) {
    if (e instanceof BackendError) {
      return NextResponse.json(e.body, { status: e.status });
    }
    return NextResponse.json({ error: 'unexpected error' }, { status: 500 });
  }
}
