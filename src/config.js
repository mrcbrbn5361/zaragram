export const config = {
  port: Number(process.env.PORT || 3000),
  telegramBotToken: process.env.TELEGRAM_BOT_TOKEN || '',
  telegramDefaultChatId: process.env.TELEGRAM_CHAT_ID || '',
  pollingIntervalMs: Number(process.env.POLLING_INTERVAL_MS || 1000 * 60 * 30),
  dataFile: process.env.DATA_FILE || 'data/tracked-products.json'
};
