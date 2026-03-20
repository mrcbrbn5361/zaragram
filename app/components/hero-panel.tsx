export function HeroPanel() {
  return (
    <section className="hero-panel">
      <div className="eyebrow">ZARAGRAM / TELEGRAM-FIRST COMMERCE INTELLIGENCE</div>
      <div className="hero-grid">
        <div>
          <h1>Zara estetiğinde, çok ülkeli ürün takip platformu.</h1>
          <p>
            Kullanıcı Telegram botunda ülkesini seçer, Zara ürün linkini gönderir ve aynı ürünü farklı pazarlarda fiyat, stok, beden, renk ve görsel bazında izler.
            Web panelinde Telegram oturumu ile giriş yaparak tüm takiplerini tek ekranda yönetir.
          </p>
        </div>
        <div className="hero-card dark">
          <span>Canlı akış</span>
          <strong>Telegram bot + webhook + web panel senkron</strong>
          <p>Takip oluşturma, market karşılaştırma ve hedef fiyat bildirimleri tek model üzerinden ilerler.</p>
        </div>
      </div>
      <div className="hero-actions">
        <button>Telegram ile giriş</button>
        <button className="secondary">Takip API&apos;sini görüntüle</button>
      </div>
    </section>
  );
}
