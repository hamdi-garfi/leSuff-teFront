import { NextResponse } from 'next/server';
import { backendFetch, handleBackendError } from '@/lib/backend';
import { getTokenFromCookies } from '@/lib/auth';
import { guestCartHeaders } from '@/lib/guestCart';

export async function GET(request: Request) {
  const token = getTokenFromCookies();
  const code = new URL(request.url).searchParams.get('code') ?? '';

  try {
    const result = await backendFetch<{ valid: boolean; discount?: number; freeShipping?: boolean; error?: string }>(
      `/api/cart/coupon-preview?code=${encodeURIComponent(code)}`,
      { token, headers: guestCartHeaders(token), cache: 'no-store' },
    );
    return NextResponse.json(result);
  } catch (e) {
    return handleBackendError(e);
  }
}
