import { NextResponse } from 'next/server';
import { AUTH_COOKIE } from '@/lib/auth';

const BACKEND_URL = process.env.BACKEND_INTERNAL_URL ?? 'http://app:8000';

function normalizeErrorBody(status: number, body: unknown): { error: string; code?: string; [key: string]: unknown } {
  // 401 always gets the friendly, actionable French message — Lexik's raw "Expired
  // JWT Token" (and similar) is technical, in English, and gives the user nothing to
  // do. code: 'session_expired' lets callers offer a real recovery action.
  if (status === 401) {
    return { error: 'Votre session a expiré, veuillez vous reconnecter.', code: 'session_expired' };
  }

  if (typeof body === 'object' && body !== null) {
    const obj = body as Record<string, unknown>;
    if (typeof obj.error === 'string') {
      return obj as { error: string };
    }
    // Lexik JWT (and some other Symfony error responses) use "message" instead of
    // "error" — without this, other errors surfaced as a generic fallback string
    // everywhere instead of a message a user could actually act on.
    if (typeof obj.message === 'string') {
      return { ...obj, error: obj.message };
    }
  }
  return { error: 'unexpected error' };
}

export class BackendError extends Error {
  public body: { error: string; [key: string]: unknown };

  constructor(
    public status: number,
    rawBody: unknown,
  ) {
    const body = normalizeErrorBody(status, rawBody);
    super(body.error);
    this.body = body;
  }
}

type BackendFetchOptions = {
  method?: string;
  token?: string | null;
  headers?: Record<string, string>;
  body?: unknown;
  cache?: RequestCache;
  next?: NextFetchRequestConfig;
};

export async function backendFetch<T>(path: string, options: BackendFetchOptions = {}): Promise<T> {
  const headers: Record<string, string> = { 'Content-Type': 'application/json', ...options.headers };
  if (options.token) {
    headers.Authorization = `Bearer ${options.token}`;
  }

  const res = await fetch(`${BACKEND_URL}${path}`, {
    method: options.method ?? 'GET',
    headers,
    body: options.body !== undefined ? JSON.stringify(options.body) : undefined,
    cache: options.cache,
    next: options.next,
  });

  const contentType = res.headers.get('content-type') ?? '';
  const data = contentType.includes('application/json') ? await res.json() : null;

  if (!res.ok) {
    throw new BackendError(res.status, data);
  }

  return data as T;
}

/**
 * Shared catch-block handler for API proxy routes: builds the error response and, for
 * an expired/invalid session (401), also clears the now-useless auth cookie so the
 * client stops presenting the user as logged in while every request keeps failing.
 */
export function handleBackendError(e: unknown): NextResponse {
  if (e instanceof BackendError) {
    const response = NextResponse.json(e.body, { status: e.status });
    if (e.status === 401) {
      response.cookies.delete(AUTH_COOKIE);
    }
    return response;
  }
  return NextResponse.json({ error: 'unexpected error' }, { status: 500 });
}
