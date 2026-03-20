import { Telegraf } from 'telegraf';
import { marketMap, zaraMarkets } from './countries';
import { createTrackingRecord } from './tracking-store';

export function getTelegramBot() {
  const token = process.env.TELEGRAM_BOT_TOKEN;

  if (!token) {
    throw new Error('TELEGRAM_BOT_TOKEN is not configured');
  }

  const bot = new Telegraf(token);

  bot.start(async (ctx) => {
    await ctx.reply(
      [
        'ZaraGram takip botuna hoş geldiniz.',
        '1) /countries ile pazar kodlarını görün.',
        '2) `TR https://www.zara.com/tr/... 1999` formatında mesaj atın.',
        '3) Aynı takip web panelinde Telegram oturumunuzla görünür hale gelir.'
      ].join('\n')
    );
  });

  bot.command('countries', async (ctx) => {
    await ctx.reply(zaraMarkets.map((market) => `${market.code} · ${market.name}`).join('\n'));
  });

  bot.command('help', async (ctx) => {
    await ctx.reply('Komut örneği: TR https://www.zara.com/tr/en/structured-blazer-p01234567.html 1999');
  });

  bot.on('text', async (ctx) => {
    const [marketCode, productUrl, priceTargetRaw] = ctx.message.text.split(/\s+/);
    if (!marketMap.has(marketCode) || !productUrl) {
      await ctx.reply('Geçerli format: TR https://www.zara.com/... 1999');
      return;
    }

    const priceTarget = priceTargetRaw ? Number(priceTargetRaw) : undefined;
    const record = await createTrackingRecord({
      marketCode,
      productUrl,
      telegramUserId: String(ctx.from.id),
      telegramUsername: ctx.from.username,
      priceTarget: Number.isFinite(priceTarget) ? priceTarget : undefined
    });

    await ctx.reply(
      [
        `Takip oluşturuldu: ${record.lastSnapshot.name}`,
        `Referans: ${record.lastSnapshot.reference}`,
        `Ana fiyat: ${record.lastSnapshot.price} ${record.lastSnapshot.currency}`,
        `Karşılaştırılan pazar sayısı: ${record.comparisonSnapshots.length}`,
        `Bildirim kanalları: ${record.notificationChannels.join(', ')}`
      ].join('\n')
    );
  });

  return bot;
}
