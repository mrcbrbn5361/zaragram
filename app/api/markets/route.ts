import { NextResponse } from 'next/server';
import { regionSummary, zaraMarkets } from '@/lib/countries';

export async function GET() {
  return NextResponse.json({
    items: zaraMarkets,
    summary: {
      total: zaraMarkets.length,
      byRegion: regionSummary
    }
  });
}
