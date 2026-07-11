import { NextResponse } from 'next/server';
import { backendFetch, BackendError } from '@/lib/backend';

export async function POST(request: Request) {
  const payload = await request.json();

  try {
    const data = await backendFetch('/api/auth/forgot-password', { method: 'POST', body: payload });
    return NextResponse.json(data);
  } catch (e) {
    if (e instanceof BackendError) {
      return NextResponse.json(e.body, { status: e.status });
    }
    return NextResponse.json({ error: 'unexpected error' }, { status: 500 });
  }
}
