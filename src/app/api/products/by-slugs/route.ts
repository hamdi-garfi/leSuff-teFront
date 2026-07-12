import { NextRequest, NextResponse } from 'next/server';
import { getProductBySlug } from '@/lib/catalog';

export async function GET(request: NextRequest) {
  const slugsParam = request.nextUrl.searchParams.get('slugs') ?? '';
  const slugs = slugsParam
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)
    .slice(0, 8);

  const products = (await Promise.all(slugs.map((slug) => getProductBySlug(slug)))).filter(
    (p): p is NonNullable<typeof p> => p !== null && p.isPublished,
  );

  return NextResponse.json(products);
}
