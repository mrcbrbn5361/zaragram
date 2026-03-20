# ZaraGram

ZaraGram, Zara'nın farklı ülke/pazar sitelerindeki ürünleri tek veri modelinde toplayıp Telegram botu ve Zara estetiğini referans alan web panel üzerinden takip etmek için hazırlanmış bir Next.js uygulama iskeletidir.

## Bu güncellemede eklenenler

- Cloudflared tünel ile web uygulamasını herkese açık HTTPS URL üzerinden yayınlama akışı.
- Windows, macOS, Linux ve Termux terminallerinde aynı mantıkla çalışabilecek çapraz platform başlatma scriptleri.
- `GET /api/health` sağlık kontrol ucu; tünel açıldıktan sonra canlı erişimi hızlıca doğrulamak için kullanılabilir.
- `npm run dev:public` ile hem Next.js host süreci hem cloudflared tüneli tek komutta ayağa kaldırma desteği.

## Mevcut ürün kapsamı

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
- `GET /api/health`: lokal veya public ortam sağlık kontrolü.

## Scriptler

```bash
npm run dev          # standart Next.js geliştirme
npm run dev:host     # 0.0.0.0 üzerinde dinler
npm run tunnel       # sadece cloudflared tüneli açar
npm run dev:public   # web + cloudflared birlikte başlar
npm run termux:setup # Termux için hızlı kurulum rehberi yazdırır
```

## Cloudflared ile herkese açık yayın

### 1. Cloudflared kur

**Windows (PowerShell / CMD)**
```powershell
winget install Cloudflare.cloudflared
```

**macOS (Terminal)**
```bash
brew install cloudflared
```

**Linux (bash / zsh / fish)**
```bash
# dağıtıma göre cloudflared paketi kur
cloudflared --version
```

**Termux**
```bash
pkg update && pkg install cloudflared
```

### 2. Projeyi çalıştır

```bash
npm install
cp .env.example .env.local
npm run dev:public
```

Bu komut:
- Next.js uygulamasını `0.0.0.0:3000` üzerinde başlatır.
- Cloudflared ile public HTTPS URL üretir.
- Terminal çıktısındaki public URL üzerinden herkese açık erişim sağlar.

### 3. Canlı olduğunu doğrula

Lokal:
```bash
curl http://127.0.0.1:3000/api/health
```

Public:
```bash
curl https://<cloudflared-url>/api/health
```

### 4. Telegram webhook için kullan

Cloudflared çıktısındaki public HTTPS URL'i şu endpoint ile birleştir:

```text
https://<cloudflared-url>/api/telegram
```

Bunu Telegram bot webhook adresi olarak kullanabilirsin.

## Termux akışı

```bash
pkg update && pkg upgrade
pkg install nodejs cloudflared git
npm install
cp .env.example .env.local
npm run dev:public
```

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

## Ortam değişkenleri

```env
TELEGRAM_BOT_TOKEN=your_bot_token
NEXT_PUBLIC_APP_URL=http://localhost:3000
PORT=3000
TUNNEL_LOCAL_URL=http://127.0.0.1:3000
TUNNEL_HOSTNAME=
```

## Production için sonraki adımlar

1. `lib/zara.ts` içindeki mock snapshot üreticisini canlı Zara veri çıkarıcısı ile değiştirmek.
2. JSON store yerine PostgreSQL/Prisma kullanmak.
3. Cloudflared yerine named tunnel + kalıcı hostname yapılandırması eklemek.
4. Kullanıcı bazlı panel, favoriler, olay logları ve bildirim tercihleri eklemek.
5. Telegram Login Widget istemci entegrasyonunu tamamlamak.
