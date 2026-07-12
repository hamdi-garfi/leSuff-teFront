import { NextResponse } from 'next/server';
import { backendFetch, BackendError } from '@/lib/backend';
import { getTokenFromCookies } from '@/lib/auth';

export async function POST(request: Request, { params }: { params: { id: string } }) {
  const token = getTokenFromCookies();
  if (!token) {
    return NextResponse.json({ error: 'authentication required' }, { status: 401 });
  }

  const payload = await request.json();

  try {
    const returnRequest = await backendFetch(`/api/account/orders/${params.id}/returns`, { method: 'POST', token, body: payload });
    return NextResponse.json(returnRequest, { status: 201 });
  } catch (e) {
    if (e instanceof BackendError) {
      return NextResponse.json(e.body, { status: e.status });
    }
    return NextResponse.json({ error: 'unexpected error' }, { status: 500 });
  }
}
