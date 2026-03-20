import { ZaraMarket } from '@/lib/types';

export function CountrySelector({ markets }: { markets: ZaraMarket[] }) {
  return (
    <section className="panel">
      <div className="section-head">
        <div>
          <span className="mini-label">Market Registry</span>
          <h2>Kapsanan Zara pazarları</h2>
        </div>
        <strong>{markets.length} market</strong>
      </div>
      <div className="market-grid">
        {markets.map((market) => (
          <article key={market.code} className="market-card">
            <div>
              <strong>{market.name}</strong>
              <span>{market.code} · {market.currency}</span>
            </div>
            <span>{market.region}</span>
            <small>{market.baseUrl}</small>
          </article>
        ))}
      </div>
    </section>
  );
}
