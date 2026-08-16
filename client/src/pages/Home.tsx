import { useMemo, useState } from "react";
import { toast } from "sonner";
import {
  Bell, ChevronDown, CircleHelp, ExternalLink, Globe2, Link2, Menu,
  MoreHorizontal, Pause, Play, Plus, RefreshCw, Search, Settings2,
  ShieldCheck, Sparkles, Trash2, TrendingDown, WalletCards, X, Zap,
} from "lucide-react";

type Market = { code: string; name: string; language: string; currency: string; symbol: string };
type Track = { id: number; name: string; market: string; price: string; previous: string; change: string; state: string; image: string; url: string };

const markets: Market[] = [
  { code: "TR", name: "Türkiye", language: "Türkçe", currency: "TRY", symbol: "₺" },
  { code: "ES", name: "İspanya", language: "Español", currency: "EUR", symbol: "€" },
  { code: "US", name: "ABD", language: "English", currency: "USD", symbol: "$" },
  { code: "GB", name: "Birleşik Krallık", language: "English", currency: "GBP", symbol: "£" },
  { code: "DE", name: "Almanya", language: "Deutsch", currency: "EUR", symbol: "€" },
  { code: "FR", name: "Fransa", language: "Français", currency: "EUR", symbol: "€" },
  { code: "IT", name: "İtalya", language: "Italiano", currency: "EUR", symbol: "€" },
  { code: "AE", name: "Birleşik Arap Emirlikleri", language: "العربية", currency: "AED", symbol: "د.إ" },
  { code: "SA", name: "Suudi Arabistan", language: "العربية", currency: "SAR", symbol: "ر.س" },
  { code: "JP", name: "Japonya", language: "日本語", currency: "JPY", symbol: "¥" },
  { code: "AU", name: "Avustralya", language: "English", currency: "AUD", symbol: "A$" },
  { code: "CA", name: "Kanada", language: "English", currency: "CAD", symbol: "C$" },
];

const initialTracks: Track[] = [
  { id: 1, name: "Kısa Çan Paça Pantolon", market: "Türkiye", price: "₺1.990", previous: "₺2.290", change: "−13%", state: "Fiyat düştü", image: "linear-gradient(145deg,#cdb99e,#6a594d)", url: "https://www.zara.com/tr/tr/woman-best-sellers-l5912.html?v1=2491343" },
  { id: 2, name: "Dantelli Lingerie Elbise", market: "İspanya", price: "€49,95", previous: "€59,95", change: "−17%", state: "Fiyat düştü", image: "linear-gradient(145deg,#d4c6c2,#51434a)", url: "https://www.zara.com/es/en/" },
  { id: 3, name: "Süet Babet", market: "ABD", price: "$89.90", previous: "$89.90", change: "—", state: "İzleniyor", image: "linear-gradient(145deg,#bd845c,#29251f)", url: "https://www.zara.com/us/" },
];

function MarketSelect({ market, onChange }: { market: Market; onChange: (market: Market) => void }) {
  return <label className="market-select"><Globe2 size={17} /><select value={market.code} onChange={(e) => onChange(markets.find((item) => item.code === e.target.value) ?? markets[0])}>{markets.map((item) => <option key={item.code} value={item.code}>{item.name} · {item.currency}</option>)}</select><ChevronDown size={15} /></label>;
}

export default function Home() {
  const [market, setMarket] = useState(markets[0]);
  const [tracks, setTracks] = useState(initialTracks);
  const [url, setUrl] = useState("");
  const [query, setQuery] = useState("");
  const [paused, setPaused] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
  const filtered = useMemo(() => tracks.filter((item) => item.name.toLowerCase().includes(query.toLowerCase())), [tracks, query]);

  const addTrack = async () => {
    if (!url.trim()) return toast.error("Takip başlatmak için bir ürün bağlantısı ekleyin.");
    const submittedUrl = url.trim();
    const item: Track = { id: Date.now(), name: "Yeni Zara ürünü", market: market.name, price: "Analiz ediliyor", previous: "—", change: "—", state: "İlk tarama kuyruğunda", image: "linear-gradient(145deg,#dedbd5,#87827a)", url: submittedUrl };
    setTracks((current) => [item, ...current]); setUrl(""); toast.success(`${market.name} mağazasında takip başlatıldı.`);
    try {
      const response = await fetch("/api/track", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ url: submittedUrl }) });
      if (!response.ok) throw new Error("İlk tarama beklemede");
      const result = await response.json();
      if (result.product?.title) setTracks((current) => current.map((track) => track.id === item.id ? { ...track, name: result.product.title, price: result.product.price ? `${result.product.currency ?? market.currency} ${result.product.price}` : "Analiz edildi", state: "İzleniyor" } : track));
    } catch { /* deployment veya rate limit durumunda öğe kuyruğa alınmış halde kalır */ }
  };
  const removeTrack = (id: number) => { setTracks((current) => current.filter((item) => item.id !== id)); toast.success("Takip kaldırıldı."); };

  return <div className="app-shell">
    <header className="topbar"><button className="icon-button mobile-only" onClick={() => setMobileMenu(!mobileMenu)} aria-label="Menüyü aç"><Menu size={21} /></button><div className="brand"><span className="brand-mark">Z</span><div><strong>zaragram</strong><small>price intelligence</small></div></div><nav className={mobileMenu ? "main-nav open" : "main-nav"}><a className="active" href="#overview">Genel görünüm</a><a href="#tracks">Takip listem</a><a href="#markets">Marketler</a><a href="#activity">Aktivite</a></nav><div className="top-actions"><MarketSelect market={market} onChange={setMarket} /><button className="icon-button" aria-label="Bildirimler"><Bell size={18} /><i /></button><button className="avatar">SK</button></div></header>
    <main className="layout">
      <aside className="sidebar"><div className="sidebar-title"><span>ÇALIŞMA ALANI</span><button className="icon-button"><MoreHorizontal size={17} /></button></div><div className="profile-card"><div className="avatar large">SK</div><div><strong>Selin Kaya</strong><span>Premium izleme</span></div><span className="online-dot" /></div><div className="side-group"><span className="side-label">YÖNETİM</span><a className="side-link selected" href="#overview"><Sparkles size={17} />Genel görünüm</a><a className="side-link" href="#tracks"><Link2 size={17} />Takip listem <b>{tracks.length}</b></a><a className="side-link" href="#activity"><Bell size={17} />Bildirim geçmişi</a></div><div className="side-group"><span className="side-label">AYARLAR</span><a className="side-link" href="#markets"><Globe2 size={17} />Ülke ve para birimi</a><a className="side-link" href="#telegram"><Zap size={17} />Telegram botu <em>bağlı</em></a><a className="side-link" href="#settings"><Settings2 size={17} />Tercihler</a></div><div className="sidebar-footer"><ShieldCheck size={16} /><span>Güvenli veri akışı<br /><small>Rate-limit uyumlu tarama</small></span></div></aside>
      <section className="content" id="overview"><div className="page-heading"><div><p className="eyebrow">PAZAR İZLEME MERKEZİ</p><h1>Fiyat değişimlerini<br /><span>kaçırmayın.</span></h1><p className="subheading">Zara ürün bağlantısını ekleyin; ülke, dil ve para birimi bağlamını koruyarak fiyatı sizin için izleyelim.</p></div><div className="heading-meta"><span className="live-dot" />Son tarama 2 dk önce<br /><small>12 market aktif</small></div></div>
        <div className="hero-card"><div><span className="card-kicker">YENİ TAKİP EKLE</span><h2>Bir ürün bağlantısı bırakın.</h2><p>Ürün sayfası hangi Zara marketine aitse otomatik algılanır. İsterseniz yukarıdan hedef marketi seçerek başlayın.</p><div className="url-form"><Link2 size={18} /><input value={url} onChange={(e) => setUrl(e.target.value)} onKeyDown={(e) => e.key === "Enter" && addTrack()} placeholder="https://www.zara.com/tr/tr/..." /><button onClick={addTrack}>Takibe al <ExternalLink size={15} /></button></div><div className="form-note"><ShieldCheck size={14} /> Yalnızca herkese açık ürün bilgileri okunur <span /> <RefreshCw size={13} /> İlk kontrol 5 dakika içinde</div></div><div className="hero-orbit"><div className="orbit-ring one" /><div className="orbit-ring two" /><div className="orbit-center"><TrendingDown size={27} /><strong>−13%</strong><small>ortalama fırsat</small></div></div></div>
        <div className="stats-grid"><div className="stat-card"><span>AKTİF TAKİPLER</span><strong>{tracks.length}</strong><small><TrendingDown size={13} /> 2 üründe düşüş var</small></div><div className="stat-card"><span>İZLENEN MARKETLER</span><strong>12</strong><small><Globe2 size={13} /> 38 dil / para birimi</small></div><div className="stat-card"><span>BU AY YAKALANAN</span><strong>₺4.280</strong><small><Sparkles size={13} /> tahmini tasarruf</small></div><div className="stat-card accent"><span>TELEGRAM</span><strong>Bağlı</strong><small><Zap size={13} /> Anlık bildirimler açık</small></div></div>
        <div className="section-heading" id="tracks"><div><p className="eyebrow">TAKİP LİSTEM</p><h2>Son fiyat hareketleri</h2></div><div className="section-actions"><div className="search-box"><Search size={15} /><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Ürün ara" /></div><button className={paused ? "pause-button active" : "pause-button"} onClick={() => setPaused(!paused)}>{paused ? <Play size={15} /> : <Pause size={15} />} {paused ? "Devam et" : "Taramayı duraklat"}</button></div></div>
        <div className="tracking-table"><div className="table-head"><span>ÜRÜN</span><span>MARKET</span><span>GÜNCEL FİYAT</span><span>DEĞİŞİM</span><span>DURUM</span><span /></div>{filtered.map((item) => <article className="track-row" key={item.id}><div className="product-cell"><div className="product-thumb" style={{ background: item.image }} /><div><strong>{item.name}</strong><span>{item.url.replace("https://www.", "").slice(0, 33)}…</span></div></div><span className="market-cell"><i className="flag">{item.market === "Türkiye" ? "TR" : item.market === "İspanya" ? "ES" : "US"}</i>{item.market}</span><div className="price-cell"><strong>{item.price}</strong><span>önce {item.previous}</span></div><span className={item.change.startsWith("−") ? "change down" : "change"}>{item.change}</span><span className={item.state === "Fiyat düştü" ? "state good" : "state"}><i />{item.state}</span><button className="icon-button row-menu" onClick={() => removeTrack(item.id)} aria-label="Takibi kaldır"><Trash2 size={16} /></button></article>)}</div>
        <div className="bottom-grid"><div className="telegram-card" id="telegram"><div className="telegram-icon">✦</div><div><span className="card-kicker">TELEGRAM BİLDİRİMLERİ</span><h3>Bildirimler hazır.</h3><p>Fiyat değiştiğinde <b>Türkçe · TRY</b> formatında anında haber veriyoruz.</p></div><button onClick={() => toast.info("Telegram bot ayarları yakında açılacak.")}>Ayarları yönet <ChevronDown size={15} /></button></div><div className="market-card" id="markets"><div className="section-heading compact"><div><span className="card-kicker">AKTİF MARKET</span><h3>{market.name}</h3></div><MarketSelect market={market} onChange={setMarket} /></div><p>{market.language} · {market.currency} · fiyat biçimi yerel</p><div className="market-progress"><span style={{ width: "78%" }} /></div><small>Son tarama kararlılığı <b>78%</b></small></div></div>
      </section>
    </main>
  </div>;
}
