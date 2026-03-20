import { NextRequest, NextResponse } from 'next/server';
import { getTelegramBot } from '@/lib/telegram';

export async function POST(request: NextRequest) {
  const update = await request.json();
  const bot = getTelegramBot();
  await bot.handleUpdate(update);
  return NextResponse.json({ ok: true, receivedAt: new Date().toISOString() });
}
