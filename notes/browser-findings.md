# İlk tarayıcı inceleme bulguları

Tarih: 2026-08-16

My Browser üzerinde `https://www.zara.com/tr/` açıldı. Sayfa başlığı `ZARA Türkiye / Turkey | Online Yeni Koleksiyon` olarak görünüyor. İlk açılışta çerez bildiriminde tanımlama bilgisi ayarları, isteğe bağlı çerezleri reddetme ve tüm çerezleri kabul etme seçenekleri vardı; inceleme için isteğe bağlı çerezler reddedildi.

Ana sayfada sağ üstte arama, sepet, giriş yap ve yardım bağlantıları; solda menüyü açan kontrol; gövde bölümünde büyük görsel tabanlı kategori panosu ve `THE NEW` / `AŞAĞI KAYDIRIN` metinleri bulunuyor. Altbilgide bülten aboneliği, sosyal bağlantılar, yasal belgeler, yapay zekâ kullanımı, gizlilik/çerez politikası ve alışveriş koşulları bağlantıları var.

İlk teknik çıkarım: Uygulama, dinamik görsel/slider tabanlı bir ana sayfa ve minimal metinli üst navigasyon kullanıyor. Ürün/fiyat takibi için ana sayfayı kopyalamak yerine ülke kodlu ürün detay URL'sinin kanonik kimliği, ülke bazlı fiyat/para birimi ve stok/variant verisinin ayrı alanlar olarak modellenmesi gerekiyor. Arayüz, Zara'nın markasını veya özgün tasarımını birebir kopyalamadan aynı alışveriş akışlarını çağdaş ve özgün bir tasarımla sunmalı.

## Ürün listeleme incelemesi

Menüden `ÇOK SATANLAR` açıldığında URL şu yapıda oluşuyor: `https://www.zara.com/tr/tr/woman-best-sellers-l5912.html?v1=2491343`. Bu yapı; market (`tr`), dil (`tr`), kategori slug'ı ve sayısal liste kimliği (`l5912`) ile birlikte sorgu sürüm parametresini (`v1`) içeriyor.

Listeleme ekranında üst navigasyon, kategori sekmeleri, filtreler, görünüm seçenekleri ve ürün kartları bulunuyor. Ürün kartlarında ürün adı, `NEW` etiketi, fiyat ve görsel içeriği yer alıyor. Türkiye örneğinde fiyatlar `1.990,00 TL`, `450,00 TL`, `4.590,00 TL` gibi yerel biçimde gösteriliyor. Aynı sayfada ürün kartları ve liste metni dinamik olarak yüklendi; bu nedenle scraper'ın yalnızca statik HTML'e güvenmemesi, render edilmiş sayfadan veya izin verilen resmi/veri uçlarından ürün verisini alması ve fallback olarak sağlam metin/JSON-LD ayrıştırıcısı bulundurması gerekiyor.

Örnek gözlenen ürünler: `KISA ÇAN PAÇA PANTOLON`, `DANTELLİ LINGERIE ELBİSE`, `SÜET BABET`, `FİTİLLİ MODAL PAMUKLU ASKILI TOP`. Bu veriler yalnızca inceleme ve demo arayüzü içindir; canlı katalog verisi olarak sabitlenmemelidir.
