import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { verifyTelegramLogin } from '@/lib/telegram-auth';

const telegramLoginSchema = z.object({
  id: z.string(),
  first_name: z.string().optional(),
  last_name: z.string().optional(),
  username: z.string().optional(),
  photo_url: z.string().optional(),
  auth_date: z.string(),
  hash: z.string()
});

export async function POST(request: NextRequest) {
  const payload = telegramLoginSchema.parse(await request.json());
  const botToken = process.env.TELEGRAM_BOT_TOKEN;

  if (!botToken) {
    return NextResponse.json({ error: 'TELEGRAM_BOT_TOKEN missing' }, { status: 500 });
  }

  const verified = verifyTelegramLogin(payload, botToken);

  if (!verified) {
    return NextResponse.json({ error: 'Telegram login verification failed' }, { status: 401 });
  }

  return NextResponse.json({
    session: {
      telegramUserId: payload.id,
      username: payload.username,
      firstName: payload.first_name,
      avatar: payload.photo_url
    }
  });
}
