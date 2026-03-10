import { fetchCountryLinks } from './zaraScraper.js';

const HELP_TEXT = [
  'Zaragram komutları:',
  '/start - Botu başlatır',
  '/settings - Komutları listeler',
  '/myid - Chat ID gösterir',
  '/follow <zara-url> - Ürünü takip eder',
  '/list - Takip ettiğin ürünleri listeler',
  '/unfollow <zara-url> - Ürün takibini kapatır',
  '/refresh - Fiyatları hemen günceller',
  '/countries - Zara ülke/locale linklerinden örnekler'
].join('\n');

export function createTelegramBot(config, tracker) {
  if (!config.telegramBotToken) {
    return { isEnabled: false, notifyPriceDrop: async () => {}, sendMessage: async () => {} };
  }

  let offset = 0;

  async function request(method, payload) {
    const res = await fetch(`https://api.telegram.org/bot${config.telegramBotToken}/${method}`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(payload)
    });
    return res.json();
  }

  async function sendMessage(chatId, text) {
    await request('sendMessage', { chat_id: chatId, text });
  }

  async function handleText(chatId, text) {
    if (text.startsWith('/start') || text.startsWith('/settings')) {
      await sendMessage(chatId, HELP_TEXT);
      return;
    }

    if (text.startsWith('/myid')) {
      await sendMessage(chatId, `Chat ID: ${chatId}`);
      return;
    }

    if (text.startsWith('/follow ')) {
      const url = text.replace('/follow ', '').trim();
      try {
        const product = await tracker.addProduct(url, String(chatId));
        await sendMessage(chatId, `Takip başladı:\n${product.name}\n${product.price} ${product.currency}`);
      } catch (error) {
        await sendMessage(chatId, `Hata: ${error.message}`);
      }
      return;
    }

    if (text.startsWith('/unfollow ')) {
      const url = text.replace('/unfollow ', '').trim();
      const result = tracker.unfollowProduct(url, String(chatId));
      if (!result.removed) {
        await sendMessage(chatId, 'Bu URL için aktif takip bulunamadı.');
        return;
      }

      const suffix = result.orphanRemoved ? ' (ürün sistemden de kaldırıldı)' : '';
      await sendMessage(chatId, `Takip kapatıldı${suffix}`);
      return;
    }

    if (text.startsWith('/list')) {
      const products = tracker.getProductsByChatId(String(chatId));
      const msg = products.length
        ? products.map((p, i) => `${i + 1}. ${p.name}\n${p.price} ${p.currency}\n${p.url}`).join('\n\n')
        : 'Takip edilen ürün yok.';
      await sendMessage(chatId, msg);
      return;
    }

    if (text.startsWith('/refresh')) {
      await sendMessage(chatId, 'Fiyatlar güncelleniyor...');
      const products = await tracker.refreshPrices();
      await sendMessage(chatId, `Tamamlandı. Güncellenen ürün sayısı: ${products.length}`);
      return;
    }

    if (text.startsWith('/countries')) {
      const links = await fetchCountryLinks();
      const preview = links.slice(0, 20);
      const suffix = links.length > preview.length ? `\n... ve ${links.length - preview.length} link daha` : '';
      await sendMessage(chatId, `Toplam: ${links.length}\n${preview.join('\n')}${suffix}`);
      return;
    }

    await sendMessage(chatId, 'Bilinmeyen komut. /settings ile komutları görebilirsin.');
  }

  setInterval(async () => {
    try {
      const data = await request('getUpdates', { offset, timeout: 20 });
      for (const update of data.result || []) {
        offset = update.update_id + 1;
        const text = update.message?.text;
        const chatId = update.message?.chat?.id;
        if (text && chatId) await handleText(chatId, text);
      }
    } catch {
      // polling retry
    }
  }, 5000);

  return {
    isEnabled: true,
    async notifyPriceDrop(product, oldPrice) {
      for (const chatId of product.chatIds ?? []) {
        await sendMessage(
          chatId,
          `💸 Fiyat düştü!\n${product.name}\nEski: ${oldPrice} ${product.currency}\nYeni: ${product.price} ${product.currency}\n${product.url}`
        );
      }
    },
    sendMessage
  };
}
