import { NextRequest, NextResponse } from 'next/server';
import { backendFetch, BackendError } from '@/lib/backend';
import { getTokenFromCookies } from '@/lib/auth';

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
};

export async function POST(request: NextRequest) {
  const token = getTokenFromCookies();
  if (!token) {
    return NextResponse.json({ error: 'authentication required' }, { status: 401 });
  }

  const payload = await request.json().catch(() => ({}));
  const body: { couponCode?: string; giftCardCode?: string; country?: string } = {};
  if (typeof payload.couponCode === 'string' && payload.couponCode.trim() !== '') {
    body.couponCode = payload.couponCode.trim();
  }
  if (typeof payload.giftCardCode === 'string' && payload.giftCardCode.trim() !== '') {
    body.giftCardCode = payload.giftCardCode.trim();
  }
  if (typeof payload.country === 'string' && payload.country.trim() !== '') {
    body.country = payload.country.trim();
  }

  try {
    const order = await backendFetch<CheckoutResponse>('/api/checkout', { method: 'POST', token, body });
    return NextResponse.json(order, { status: 201 });
  } catch (e) {
    if (e instanceof BackendError) {
      return NextResponse.json(e.body, { status: e.status });
    }
    return NextResponse.json({ error: 'unexpected error' }, { status: 500 });
  }
}
