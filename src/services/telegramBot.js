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
    if (text.startsWith('/start')) {
      await sendMessage(chatId, 'Zaragram aktif. /follow <url> ve /list komutlarını kullanabilirsiniz.');
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

    if (text.startsWith('/list')) {
      const products = tracker.getProductsByChatId(String(chatId));
      const msg = products.length
        ? products.map((p, i) => `${i + 1}. ${p.name}\n${p.price} ${p.currency}\n${p.url}`).join('\n\n')
        : 'Takip edilen ürün yok.';
      await sendMessage(chatId, msg);
    }
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
