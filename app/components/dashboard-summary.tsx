const items = [
  { label: 'Telegram oturumlu kullanıcı', value: 'Kimlik doğrulamalı' },
  { label: 'Takip veri modeli', value: 'Kalıcı JSON store' },
  { label: 'Webhook hazır API', value: '/api/telegram' },
  { label: 'Telegram login verify', value: '/api/auth/telegram' }
];

export function DashboardSummary() {
  return (
    <section className="summary-grid">
      {items.map((item) => (
        <article key={item.label} className="summary-card">
          <span>{item.label}</span>
          <strong>{item.value}</strong>
        </article>
      ))}
    </section>
  );
}
