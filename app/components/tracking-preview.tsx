const events = [
  'TR fiyatı hedefe indi ve Telegram bildirimi hazırlandı.',
  'DE ve FR marketlerinde M beden yeniden stoğa girdi.',
  'US storefront için normalize ürün URL eşleşmesi tamamlandı.',
  'Telegram Login doğrulaması ile web oturumu doğrulandı.',
  'Cloudflared public URL üzerinden panel dış erişime açıldı.'
];

export function TrackingPreview() {
  return (
    <aside className="preview-panel">
      <span className="mini-label light">Control Room</span>
      <h2>Takip görünümü</h2>
      <div className="preview-metrics">
        <div>
          <span>Karşılaştırmalı market</span>
          <strong>6</strong>
        </div>
        <div>
          <span>Aktif bildirim kanalı</span>
          <strong>Telegram · Web</strong>
        </div>
      </div>
      <div className="timeline">
        {events.map((event) => (
          <article key={event}>
            <span>Event</span>
            <strong>{event}</strong>
          </article>
        ))}
      </div>
    </aside>
  );
}
