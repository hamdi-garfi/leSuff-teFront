import { NextResponse } from 'next/server';
import { backendFetch, handleBackendError } from '@/lib/backend';

export async function POST(request: Request) {
  const payload = await request.json();

  try {
    const data = await backendFetch('/api/auth/reset-password', { method: 'POST', body: payload });
    return NextResponse.json(data);
  } catch (e) {
    return handleBackendError(e);
  }
}
