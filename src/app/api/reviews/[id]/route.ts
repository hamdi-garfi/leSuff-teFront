import { NextResponse } from 'next/server';
import { backendFetch, handleBackendError } from '@/lib/backend';
import { getTokenFromCookies } from '@/lib/auth';

export async function POST(request: Request, { params }: { params: { id: string } }) {
  const token = getTokenFromCookies();
  if (!token) {
    return NextResponse.json({ error: 'authentication required' }, { status: 401 });
  }

  const payload = await request.json();

  try {
    const review = await backendFetch(`/api/reviews/${params.id}`, { method: 'POST', token, body: payload });
    return NextResponse.json(review, { status: 201 });
  } catch (e) {
    return handleBackendError(e);
  }
}
