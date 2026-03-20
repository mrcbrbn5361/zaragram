# ZaraGram

ZaraGram, Zara'nın farklı ülke/pazar sitelerindeki ürünleri tek veri modelinde toplayıp Telegram botu ve Zara estetiğini referans alan web panel üzerinden takip etmek için hazırlanmış bir Next.js uygulama iskeletidir.

## Bu güncellemede düzeltilen kritik noktalar

- Termux ve Android paylaşımlı depolama alanlarında görülen `EACCES: permission denied, symlink ... node_modules/.bin/*` hatası için repo bazında `bin-links=false` ayarı eklendi.
- `package.json` scriptleri artık `next`, `eslint` ve `tsc` ikililerine `.bin` symlink'i üzerinden değil, doğrudan `node_modules/...` altındaki gerçek CLI dosyaları üzerinden çalışıyor; böylece `next: not found` problemi engelleniyor.
- Güvenlik/deprecation uyarılarını azaltmak için Next.js, React, ESLint ve TypeScript sürümleri güncellendi.
- Windows, macOS, Linux ve Termux için cloudflared tabanlı public yayın akışı korunup daha güvenli hale getirildi.

## Mevcut ürün kapsamı

- Çok ülkeli Zara market registry (`lib/countries.ts`) ve bölgesel özet API'si.
- Ürün linkinden referans kodu çıkaran, markete göre normalize URL üreten ve karşılaştırmalı snapshot oluşturan Zara adapter katmanı.
- Telegram bot akışı: market kodu + ürün linki + opsiyonel hedef fiyat ile takip oluşturma.
- Telegram Login doğrulama API'si (`/api/auth/telegram`) için HMAC tabanlı doğrulama yardımcıları.
- Dosya tabanlı kalıcı tracking store (`.data/tracking-records.json`) sayesinde bot ve web arasında ortak veri modeli.
- Zara'ya yakın görsel dilde hazırlanmış kontrol paneli, mimari akış blokları ve çoklu market görünümü.
- Cloudflared ile public HTTPS URL üretme ve Telegram webhook'a bağlama akışı.

## API uçları

- `GET /api/markets`: tüm pazarlar ve bölgesel dağılım.
- `GET /api/track`: kayıtlı takipler ve dashboard metrikleri.
- `POST /api/track`: yeni takip oluşturur.
- `POST /api/telegram`: Telegram webhook giriş noktası.
- `POST /api/auth/telegram`: Telegram Login Widget doğrulaması.
- `GET /api/health`: lokal veya public ortam sağlık kontrolü.

## Scriptler

```bash
npm run dev          # Next.js geliştirme
npm run dev:host     # 0.0.0.0 üzerinde dinler
npm run tunnel       # sadece cloudflared tüneli açar
npm run dev:public   # web + cloudflared birlikte başlar
npm run termux:setup # Termux için hızlı kurulum rehberi yazdırır
npm run lint         # ESLint 9 ile lint
npm run typecheck    # TypeScript kontrolü
```

## Standart kurulum

```bash
npm install
cp .env.example .env.local
npm run dev
```

## Termux için önerilen kurulum

> En güvenli yöntem: projeyi `/data/data/com.termux/files/home/...` altında tut.
> Android paylaşımlı klasörlerde (`/storage/emulated/0/...`) symlink kısıtları daha sık sorun çıkarır.

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

Eğer proje mecburen `Download/` gibi paylaşımlı depolama altındaysa:

```bash
npm install --no-bin-links
cp .env.example .env.local
npm run dev
```

Bu repo zaten `.npmrc` içinde `bin-links=false` ayarı içerdiği için Termux tarafında `.bin` symlink üretme ihtiyacını azaltır.

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

**Linux**
```bash
cloudflared --version
```

**Termux**
```bash
pkg install cloudflared
```

### 2. Public dev modunu başlat

```bash
npm install
cp .env.example .env.local
npm run dev:public
```

Bu komut:
- Next.js uygulamasını `0.0.0.0:3000` üzerinde başlatır.
- Cloudflared ile public HTTPS URL üretir.
- Terminal çıktısındaki URL üzerinden web panelini herkese açar.

### 3. Sağlık kontrolü

Lokal:
```bash
curl http://127.0.0.1:3000/api/health
```

Public:
```bash
curl https://<cloudflared-url>/api/health
```

### 4. Telegram webhook bağla

```text
https://<cloudflared-url>/api/telegram
```

Cloudflared çıktısındaki public URL ile bu endpoint'i birleştirip Telegram webhook adresi olarak kullan.

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

## Kaynak notu

Sürüm güncellemeleri için npm paket sayfalarındaki güncel yayın bilgilerinden yararlanıldı: Next.js `15.5.2`, `eslint-config-next 15.5.2`, React `19.1.1`, React DOM `19.1.1`, ESLint `9.35.0`, TypeScript `5.8.3`.
