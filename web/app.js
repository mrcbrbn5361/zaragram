async function fetchJson(url, options) {
  const response = await fetch(url, options);
  const payload = await response.json();
  if (!response.ok) {
    throw new Error(payload.error ?? 'Request failed');
  }
  return payload;
}

function renderSummary(metrics = {}) {
  const summaryGrid = document.getElementById('summary-grid');
  const items = [
    ['Aktif takip', metrics.trackingCount ?? 0],
    ['İzlenen market', metrics.totalMarketsWatched ?? 0],
    ['Düşük stok', metrics.lowStockCount ?? 0],
    ['Hedefe ulaşan', metrics.targetReachedCount ?? 0]
  ];

  summaryGrid.innerHTML = items.map(([label, value]) => `<article class="summary-card"><span>${label}</span><strong>${value}</strong></article>`).join('');
}

function renderMarkets(markets = []) {
  document.getElementById('market-count').textContent = `${markets.length} market`;
  document.getElementById('market-grid').innerHTML = markets.map((market) => `
    <article class="market-card">
      <div><strong>${market.name}</strong><span>${market.code} · ${market.currency}</span></div>
      <span>${market.region}</span>
      <small>${market.baseUrl}</small>
    </article>
  `).join('');

  document.getElementById('market-select').innerHTML = markets.map((market) => `<option value="${market.code}">${market.name} (${market.code})</option>`).join('');
}

function renderTracking(items = []) {
  document.getElementById('tracking-feed').innerHTML = items.length
    ? items.map((item) => `
      <article>
        <span>${item.lastSnapshot.marketCode} · ${item.lastSnapshot.currency}</span>
        <strong>${item.lastSnapshot.name}</strong>
        <span>Fiyat: ${item.lastSnapshot.price} ${item.lastSnapshot.currency}</span>
      </article>
    `).join('')
    : '<article><span>Henüz takip yok</span><strong>İlk takibi formdan oluştur.</strong></article>';
}

async function bootstrap() {
  const [{ items: markets }, { items: tracks, metrics }] = await Promise.all([
    fetchJson('/api/markets'),
    fetchJson('/api/track')
  ]);

  renderMarkets(markets);
  renderTracking(tracks);
  renderSummary(metrics);
}

document.getElementById('tracking-form').addEventListener('submit', async (event) => {
  event.preventDefault();
  const form = new FormData(event.currentTarget);
  const payload = Object.fromEntries(form.entries());
  if (payload.priceTarget) payload.priceTarget = Number(payload.priceTarget);

  try {
    const result = await fetchJson('/api/track', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(payload)
    });
    document.getElementById('form-result').textContent = JSON.stringify(result.item, null, 2);
    await bootstrap();
  } catch (error) {
    document.getElementById('form-result').textContent = error.message;
  }
});

bootstrap().catch((error) => {
  document.getElementById('form-result').textContent = error.message;
});
