import { NextRequest, NextResponse } from 'next/server';
import { backendFetch } from '@/lib/backend';

const CUTOFF_HOUR = 14;

type ShippingZone = { country: string; estimatedDaysMin: number; estimatedDaysMax: number };

function getParisNow(): Date {
  return new Date(new Date().toLocaleString('en-US', { timeZone: 'Europe/Paris' }));
}

function isBusinessDay(d: Date): boolean {
  const day = d.getDay();
  return day !== 0 && day !== 6;
}

function addBusinessDays(start: Date, days: number): Date {
  const d = new Date(start);
  let added = 0;
  while (added < days) {
    d.setDate(d.getDate() + 1);
    if (isBusinessDay(d)) added++;
  }
  return d;
}

export async function GET(request: NextRequest) {
  const postalCode = request.nextUrl.searchParams.get('postalCode')?.trim() ?? '';

  if (!/^\d{4,6}$/.test(postalCode)) {
    return NextResponse.json({ error: 'Code postal invalide.' }, { status: 400 });
  }

  const zones = await backendFetch<ShippingZone[]>('/api/shipping-zones', { next: { revalidate: 300 } });
  const zone = zones.find((z) => z.country.toLowerCase() === 'france') ?? zones[0];

  if (!zone) {
    return NextResponse.json({ error: 'Aucune zone de livraison configurée.' }, { status: 404 });
  }

  const now = getParisNow();
  const cutoffPassed = now.getHours() >= CUTOFF_HOUR;

  const shipBase = new Date(now);
  if (cutoffPassed) shipBase.setDate(shipBase.getDate() + 1);
  while (!isBusinessDay(shipBase)) shipBase.setDate(shipBase.getDate() + 1);

  const minDate = addBusinessDays(shipBase, zone.estimatedDaysMin);
  const maxDate = addBusinessDays(shipBase, zone.estimatedDaysMax);

  const fmt = (d: Date) => d.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' });

  return NextResponse.json({
    postalCode,
    cutoffHour: CUTOFF_HOUR,
    cutoffPassed,
    minDateLabel: fmt(minDate),
    maxDateLabel: fmt(maxDate),
    sameRange: fmt(minDate) === fmt(maxDate),
  });
}
