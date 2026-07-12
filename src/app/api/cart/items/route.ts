import { NextResponse } from 'next/server';
import { backendFetch, BackendError } from '@/lib/backend';
import { getTokenFromCookies } from '@/lib/auth';
import { guestCartHeaders, persistGuestCartToken } from '@/lib/guestCart';
import type { Cart } from '@/lib/types';

export async function POST(request: Request) {
  const token = getTokenFromCookies();
  const payload = await request.json();

  try {
    const cart = await backendFetch<Cart>('/api/cart/items', {
      method: 'POST',
      token,
      headers: guestCartHeaders(token),
      body: payload,
    });
    const response = NextResponse.json(cart, { status: 201 });
    persistGuestCartToken(response, cart);
    return response;
  } catch (e) {
    if (e instanceof BackendError) {
      return NextResponse.json(e.body, { status: e.status });
    }
    return NextResponse.json({ error: 'unexpected error' }, { status: 500 });
  }
}
