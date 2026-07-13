import { NextRequest, NextResponse } from 'next/server';
import { backendFetch, BackendError } from '@/lib/backend';
import { AUTH_COOKIE, authCookieOptions, getTokenFromCookies } from '@/lib/auth';
import { clearGuestCartToken, guestCartHeaders } from '@/lib/guestCart';

type CheckoutResponse = {
  id: number;
  number: string;
  status: string;
  subtotal: number;
  discount: number;
  shippingCountry: string | null;
  shippingCost: number;
  couponCode: string | null;
  giftCardAmountUsed: number | null;
  total: number;
  clientSecret?: string;
  account?: { created: boolean; email: string; token: string } | null;
};

export async function POST(request: NextRequest) {
  const token = getTokenFromCookies();

  const payload = await request.json().catch(() => ({}));
  const body: {
    couponCode?: string;
    giftCardCode?: string;
    country?: string;
    addressId?: number;
    billingAddressId?: number;
    giftWrap?: boolean;
    giftMessage?: string;
    hidePriceOnSlip?: boolean;
    email?: string;
    firstName?: string;
    lastName?: string;
    street?: string;
    city?: string;
    postalCode?: string;
    complement?: string;
  } = {};
  if (typeof payload.couponCode === 'string' && payload.couponCode.trim() !== '') {
    body.couponCode = payload.couponCode.trim();
  }
  if (typeof payload.giftCardCode === 'string' && payload.giftCardCode.trim() !== '') {
    body.giftCardCode = payload.giftCardCode.trim();
  }
  if (typeof payload.country === 'string' && payload.country.trim() !== '') {
    body.country = payload.country.trim();
  }
  if (typeof payload.addressId === 'number') {
    body.addressId = payload.addressId;
  }
  if (typeof payload.billingAddressId === 'number') {
    body.billingAddressId = payload.billingAddressId;
  }
  if (typeof payload.giftWrap === 'boolean') {
    body.giftWrap = payload.giftWrap;
  }
  if (typeof payload.giftMessage === 'string' && payload.giftMessage.trim() !== '') {
    body.giftMessage = payload.giftMessage.trim();
  }
  if (typeof payload.hidePriceOnSlip === 'boolean') {
    body.hidePriceOnSlip = payload.hidePriceOnSlip;
  }
  if (!token) {
    for (const field of ['email', 'firstName', 'lastName', 'street', 'city', 'postalCode', 'complement'] as const) {
      if (typeof payload[field] === 'string' && payload[field].trim() !== '') {
        body[field] = payload[field].trim();
      }
    }
  }

  try {
    const order = await backendFetch<CheckoutResponse>('/api/checkout', {
      method: 'POST',
      token,
      headers: guestCartHeaders(token),
      body,
    });
    const response = NextResponse.json(order, { status: 201 });
    if (order.account?.token) {
      response.cookies.set(AUTH_COOKIE, order.account.token, authCookieOptions(60 * 60 * 24 * 7));
      clearGuestCartToken(response);
    }
    return response;
  } catch (e) {
    if (e instanceof BackendError) {
      return NextResponse.json(e.body, { status: e.status });
    }
    return NextResponse.json({ error: 'unexpected error' }, { status: 500 });
  }
}
