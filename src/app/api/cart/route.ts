import { NextResponse } from 'next/server';
import { backendFetch, BackendError } from '@/lib/backend';
import { getTokenFromCookies } from '@/lib/auth';
import { guestCartHeaders, persistGuestCartToken } from '@/lib/guestCart';
import type { Cart } from '@/lib/types';

export async function GET() {
  const token = getTokenFromCookies();

  try {
    const cart = await backendFetch<Cart>('/api/cart', { token, headers: guestCartHeaders(token), cache: 'no-store' });
    const response = NextResponse.json(cart);
    persistGuestCartToken(response, cart);
    return response;
  } catch (e) {
    if (e instanceof BackendError) {
      return NextResponse.json(e.body, { status: e.status });
    }
    return NextResponse.json({ error: 'unexpected error' }, { status: 500 });
  }
}
