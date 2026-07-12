import { NextRequest, NextResponse } from 'next/server';
import { getCategories, getProducts } from '@/lib/catalog';

export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams.get('q')?.trim() ?? '';

  if (q.length < 2) {
    return NextResponse.json({ products: [], categories: [] });
  }

  const [{ items: products }, categories] = await Promise.all([
    getProducts({ search: q, limit: 5 }),
    getCategories(),
  ]);

  const qLower = q.toLowerCase();
  const matchingCategories = categories.filter((c) => c.name.toLowerCase().includes(qLower)).slice(0, 3);

  return NextResponse.json({
    products: products.map((p) => ({
      id: p.id,
      name: p.name,
      slug: p.slug,
      basePrice: p.basePrice,
      imageUrl: p.imageUrl,
    })),
    categories: matchingCategories.map((c) => ({ id: c.id, name: c.name, slug: c.slug })),
  });
}
