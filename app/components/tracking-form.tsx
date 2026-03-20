import { ZaraMarket } from '@/lib/types';

export function TrackingForm({ markets }: { markets: ZaraMarket[] }) {
  return (
    <section className="panel">
      <div className="section-head compact">
        <div>
          <span className="mini-label">Tracking Intake</span>
          <h2>Takip oluşturma akışı</h2>
        </div>
      </div>
      <div className="form-note">
        Web ve bot aynı veri sözleşmesini kullanır. Telegram oturumunda gelen kullanıcı kimliği, web paneli oturumuyla eşleştirilir.
      </div>
      <form className="tracking-form">
        <label>
          <span>Telegram kullanıcı kimliği</span>
          <input placeholder="123456789" />
        </label>
        <label>
          <span>Pazar</span>
          <select defaultValue="TR">
            {markets.map((market) => (
              <option key={market.code} value={market.code}>{market.name} ({market.code})</option>
            ))}
          </select>
        </label>
        <label>
          <span>Ürün linki</span>
          <input placeholder="https://www.zara.com/tr/en/structured-blazer-p01234567.html" />
        </label>
        <label>
          <span>Hedef fiyat</span>
          <input placeholder="1999" />
        </label>
        <button type="button">Takibi başlat</button>
      </form>
    </section>
  );
}
