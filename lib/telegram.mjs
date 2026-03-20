import { zaraMarkets } from './countries.mjs';
import { createTrackingRecord } from './tracking-store.mjs';

function buildHelpMessage() {
  return [
    'ZaraGram takip botuna hoş geldiniz.',
    'Format: TR https://www.zara.com/tr/en/structured-blazer-p01234567.html 1999',
    `Desteklenen marketlerden bazıları: ${zaraMarkets.slice(0, 8).map((market) => market.code).join(', ')}`
  ].join('\n');
}

export async function processTelegramUpdate(update) {
  const messageText = update?.message?.text ?? '';
  const sender = update?.message?.from ?? {};

  if (!messageText || messageText.startsWith('/start') || messageText.startsWith('/help')) {
    return { reply: buildHelpMessage() };
  }

  if (messageText.startsWith('/countries')) {
    return { reply: zaraMarkets.map((market) => `${market.code} · ${market.name}`).join('\n') };
  }

  const [marketCode, productUrl, priceTargetRaw] = messageText.split(/\s+/);
  const priceTarget = priceTargetRaw ? Number(priceTargetRaw) : undefined;
  const record = await createTrackingRecord({
    marketCode,
    productUrl,
    telegramUserId: sender.id ? String(sender.id) : undefined,
    telegramUsername: sender.username,
    priceTarget: Number.isFinite(priceTarget) ? priceTarget : undefined
  });

  return {
    reply: [
      `Takip oluşturuldu: ${record.lastSnapshot.name}`,
      `Referans: ${record.lastSnapshot.reference}`,
      `Ana fiyat: ${record.lastSnapshot.price} ${record.lastSnapshot.currency}`,
      `Karşılaştırılan market: ${record.comparisonSnapshots.length}`
    ].join('\n')
  };
}
