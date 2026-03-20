import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { createTrackingRecord, getDashboardMetrics, listTrackingRecords } from '@/lib/tracking-store';

const trackingSchema = z.object({
  marketCode: z.string().min(2).max(3),
  productUrl: z.string().url(),
  telegramUserId: z.string().optional(),
  telegramUsername: z.string().optional(),
  sessionId: z.string().optional(),
  priceTarget: z.coerce.number().optional()
});

export async function GET() {
  const [items, metrics] = await Promise.all([listTrackingRecords(), getDashboardMetrics()]);
  return NextResponse.json({ items, metrics });
}

export async function POST(request: NextRequest) {
  const payload = trackingSchema.parse(await request.json());
  const item = await createTrackingRecord(payload);
  return NextResponse.json({ item }, { status: 201 });
}
