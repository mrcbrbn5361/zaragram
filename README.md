# ZaraGram

ZaraGram, Zara'nın farklı ülke/pazar sitelerindeki ürünleri tek veri modelinde toplayıp Telegram botu ve Zara estetiğini referans alan web panel üzerinden takip etmek için hazırlanmış bir Next.js uygulama iskeletidir.

## Bu sürümde tamamlanan alanlar

- Çok ülkeli Zara market registry (`lib/countries.ts`) ve bölgesel özet API'si.
- Ürün linkinden referans kodu çıkaran, markete göre normalize URL üreten ve karşılaştırmalı snapshot oluşturan Zara adapter katmanı.
- Telegram bot akışı: market kodu + ürün linki + opsiyonel hedef fiyat ile takip oluşturma.
- Telegram Login doğrulama API'si (`/api/auth/telegram`) için HMAC tabanlı doğrulama yardımcıları.
- Dosya tabanlı kalıcı tracking store (`.data/tracking-records.json`) sayesinde bot ve web arasında ortak veri modeli.
- Zara'ya yakın görsel dilde hazırlanmış kontrol paneli, mimari akış blokları ve çoklu market görünümü.

## API uçları

- `GET /api/markets`: tüm pazarlar ve bölgesel dağılım.
- `GET /api/track`: kayıtlı takipler ve dashboard metrikleri.
- `POST /api/track`: yeni takip oluşturur.
- `POST /api/telegram`: Telegram webhook giriş noktası.
- `POST /api/auth/telegram`: Telegram Login Widget doğrulaması.

## Örnek takip oluşturma isteği

```bash
curl -X POST http://localhost:3000/api/track \
  -H 'content-type: application/json' \
  -d '{
    "marketCode": "TR",
    "productUrl": "https://www.zara.com/tr/en/structured-blazer-p01234567.html",
    "telegramUserId": "123456789",
    "priceTarget": 1999
  }'
```

## Kurulum

```bash
npm install
cp .env.example .env.local
npm run dev
```

## Ortam değişkenleri

```env
TELEGRAM_BOT_TOKEN=your_bot_token
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Production için sonraki adımlar

1. `lib/zara.ts` içindeki mock snapshot üreticisini canlı Zara veri çıkarıcısı ile değiştirmek.
2. JSON store yerine PostgreSQL/Prisma kullanmak.
3. Cron veya queue tabanlı tekrar kontrol sistemi kurmak.
4. Kullanıcı bazlı panel, favoriler, olay logları ve bildirim tercihleri eklemek.
5. Telegram Login Widget istemci entegrasyonunu tamamlamak.
