const BACKEND_URL = process.env.BACKEND_INTERNAL_URL ?? 'http://app:8000';

export class BackendError extends Error {
  constructor(
    public status: number,
    public body: unknown,
  ) {
    super(typeof body === 'object' && body && 'error' in body ? String((body as { error: unknown }).error) : 'backend error');
  }
}

type BackendFetchOptions = {
  method?: string;
  token?: string | null;
  body?: unknown;
  cache?: RequestCache;
  next?: NextFetchRequestConfig;
};

export async function backendFetch<T>(path: string, options: BackendFetchOptions = {}): Promise<T> {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
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
