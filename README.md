# ZaraGram

ZaraGram artık **sıfır harici runtime bağımlılığı** ile çalışan bir Node.js uygulamasıdır. Amaç; Zara ürünlerini çoklu ülkede takip eden, Telegram bot/web panel/cloudflared tünel akışını Termux dahil tüm yaygın terminal ortamlarında daha güvenilir çalıştırmaktır.

## Neden Next.js kaldırıldı?

Sizin paylaştığınız Termux çıktısında iki kritik problem vardı:

1. `npm install` sırasında `napi-postinstall: not found`
2. Sonrasında `node_modules/next/dist/bin/next` bulunamadığı için `npm run dev` başarısızlığı

Bu sorunlar Next.js ve ilişkili bağımlılık zincirinin Termux + paylaşımlı Android depolama kombinasyonunda kırılgan hale gelmesinden kaynaklanıyordu. Bu yüzden uygulama, **vanilla Node HTTP server + static web UI** mimarisine çevrildi.

## Bu sürümde ne var?

- Harici çalışma zamanı bağımlılığı olmayan Node sunucusu (`server.mjs`)
- Web paneli için static HTML/CSS/JS (`web/`)
- API uçları:
  - `GET /api/health`
  - `GET /api/markets`
  - `GET /api/track`
  - `POST /api/track`
  - `POST /api/telegram`
  - `POST /api/auth/telegram`
- Dosya tabanlı takip kayıt sistemi (`.data/tracking-records.json`)
- Zara market registry, mock ürün normalize edici ve Telegram update işleyici
- Cloudflared ile public HTTPS yayın akışı
- Windows / macOS / Linux / Termux uyumlu yardımcı scriptler

## Kurulum

```bash
npm install
cp .env.example .env.local
npm run dev
```

> Bu projede harici paket bulunmadığı için `npm install` hızlı tamamlanır ve Next.js benzeri postinstall problemleri yaşatmaz.

## Termux kurulumu

```bash
pkg update && pkg upgrade
pkg install nodejs git cloudflared
cd ~
git clone <repo-url> zaragram
cd zaragram
npm install
cp .env.example .env.local
npm run dev
```

## Public yayın (cloudflared)

```bash
npm run dev:public
```

Bu komut:
- Node web sunucusunu başlatır
- cloudflared ile HTTPS public URL açar
- Telegram webhook için kullanabileceğiniz public endpoint sağlar

Webhook örneği:

```text
https://<cloudflared-url>/api/telegram
```

## API örneği

```bash
curl -X POST http://127.0.0.1:3000/api/track \
  -H 'content-type: application/json' \
  -d '{
    "marketCode": "TR",
    "productUrl": "https://www.zara.com/tr/en/structured-blazer-p01234567.html",
    "telegramUserId": "123456789",
    "priceTarget": 1999
  }'
```

## Ortam değişkenleri

```env
TELEGRAM_BOT_TOKEN=your_bot_token
NEXT_PUBLIC_APP_URL=http://localhost:3000
PORT=3000
TUNNEL_LOCAL_URL=http://127.0.0.1:3000
TUNNEL_HOSTNAME=
```
