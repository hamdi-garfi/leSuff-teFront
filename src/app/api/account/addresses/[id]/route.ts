import { NextResponse } from 'next/server';
import { backendFetch, handleBackendError } from '@/lib/backend';
import { getTokenFromCookies } from '@/lib/auth';
import type { Address } from '@/lib/types';

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  const token = getTokenFromCookies();
  if (!token) {
    return NextResponse.json({ error: 'authentication required' }, { status: 401 });
  }

  const payload = await request.json();

  try {
    const address = await backendFetch<Address>(`/api/account/addresses/${params.id}`, {
      method: 'PATCH',
      token,
      body: payload,
    });
    return NextResponse.json(address);
  } catch (e) {
    return handleBackendError(e);
  }
}

export async function DELETE(_request: Request, { params }: { params: { id: string } }) {
  const token = getTokenFromCookies();
  if (!token) {
    return NextResponse.json({ error: 'authentication required' }, { status: 401 });
  }

  try {
    const result = await backendFetch<{ deleted: boolean; id: number }>(`/api/account/addresses/${params.id}`, {
      method: 'DELETE',
      token,
    });
    return NextResponse.json(result);
  } catch (e) {
    return handleBackendError(e);
  }
}
