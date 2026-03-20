const blocks = [
  {
    title: '1. Zara market registry',
    text: 'Her ülke/pazar için base URL, para birimi, dil ve bölge tanımları merkezî registry üzerinden yönetilir.'
  },
  {
    title: '2. Product normalization',
    text: 'Girilen Zara linkinden referans kodu çıkarılır, her market için normalize URL üretilir ve tek formatta snapshot oluşturulur.'
  },
  {
    title: '3. Telegram session bridge',
    text: 'Botta oluşan takipler Telegram kullanıcı kimliği ile web paneline taşınır; Telegram Login doğrulaması ile aynı kullanıcı eşleşir.'
  },
  {
    title: '4. Notification engine',
    text: 'Hedef fiyat, stok dönüşü ve pazar farklılıkları için hem bot hem panel bildirimleri tetiklenir.'
  }
];

export function ArchitecturePanel() {
  return (
    <section className="panel">
      <div className="section-head compact">
        <div>
          <span className="mini-label">System Design</span>
          <h2>Eksiksiz ürün akışı</h2>
        </div>
      </div>
      <div className="architecture-grid">
        {blocks.map((block) => (
          <article key={block.title} className="architecture-card">
            <strong>{block.title}</strong>
            <p>{block.text}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
