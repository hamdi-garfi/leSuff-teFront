import { NextResponse } from 'next/server';
import { backendFetch, handleBackendError } from '@/lib/backend';
import { getTokenFromCookies } from '@/lib/auth';

export async function DELETE(_request: Request, { params }: { params: { productId: string } }) {
  const token = getTokenFromCookies();
  if (!token) {
    return NextResponse.json({ error: 'authentication required' }, { status: 401 });
  }

  try {
    const data = await backendFetch<{ success: boolean }>(`/api/wishlist/${params.productId}`, { method: 'DELETE', token });
    return NextResponse.json(data);
  } catch (e) {
    return handleBackendError(e);
  }
}
