# Zaragram

Zaragram, Zara ürünlerini web arayüzünden takip etmenizi ve fiyat düşünce Telegram üzerinden bildirim almanızı sağlayan bir uygulamadır.

## Özellikler
- Zara ürün URL'sinden ürün adı, görseli ve fiyatını çekme.
- Zara ülke bağlantılarını (`/api/countries`) otomatik tarama.
- Web panelinden ürün ekleme ve fiyatları manuel güncelleme.
- Telegram bot ile ayar/komut yönetimi: `/settings`, `/myid`, `/follow`, `/unfollow`, `/list`, `/refresh`, `/countries`.
- Periyodik fiyat kontrolü + fiyat düşüşü bildirimi.

## Kurulum
```bash
npm install
cp .env.example .env
npm start
```

## Ortam değişkenleri
- `PORT=3000`
- `TELEGRAM_BOT_TOKEN=...`
- `TELEGRAM_CHAT_ID=...` (opsiyonel varsayılan chat)
- `POLLING_INTERVAL_MS=1800000`

## Telegram kullanım
1. BotFather ile bot oluşturup token alın.
2. Uygulamayı `TELEGRAM_BOT_TOKEN` ile başlatın.
3. Telegram'da:
   - `/start`
   - `/follow https://www.zara.com/tr/tr/...`
   - `/list`
   - `/unfollow https://www.zara.com/tr/tr/...`
   - `/refresh`
   - `/countries`
   - `/settings`
   - `/myid`
