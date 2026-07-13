import { NextResponse } from 'next/server';
import { backendFetch, handleBackendError } from '@/lib/backend';
import { getTokenFromCookies } from '@/lib/auth';
import { guestCartHeaders, persistGuestCartToken } from '@/lib/guestCart';
import type { Cart } from '@/lib/types';

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  const token = getTokenFromCookies();
  const payload = await request.json();

  try {
    const cart = await backendFetch<Cart>(`/api/cart/items/${params.id}`, {
      method: 'PATCH',
      token,
      headers: guestCartHeaders(token),
      body: payload,
    });
    const response = NextResponse.json(cart);
    persistGuestCartToken(response, cart);
    return response;
  } catch (e) {
    return handleBackendError(e);
  }
}

export async function DELETE(_request: Request, { params }: { params: { id: string } }) {
  const token = getTokenFromCookies();

  try {
    const cart = await backendFetch<Cart>(`/api/cart/items/${params.id}`, {
      method: 'DELETE',
      token,
      headers: guestCartHeaders(token),
    });
    const response = NextResponse.json(cart);
    persistGuestCartToken(response, cart);
    return response;
  } catch (e) {
    return handleBackendError(e);
  }
}
