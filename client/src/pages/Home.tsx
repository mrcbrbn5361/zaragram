import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import {
  Bell, ChevronDown, ExternalLink, Globe2, Link2, Menu, Pause, Play,
  Search, ShieldCheck, Trash2, TrendingDown, Zap,
} from "lucide-react";

type Market = { code: string; name: string; language: string; currency: string; symbol: string };
type Track = { id: number; name: string; market: string; price: string; previous: string; change: string; state: string; image: string; url: string };

const markets: Market[] = [
  { code: "TR", name: "Türkiye", language: "Türkçe", currency: "TRY", symbol: "₺" },
];
const STORAGE_KEY = "zaragram.tracks";
const TELEGRAM_BOT = import.meta.env.VITE_TELEGRAM_BOT_USERNAME || "zaragram_bot";

function MarketSelect({ market, onChange }: { market: Market; onChange: (market: Market) => void }) {
  return <label className="market-select"><Globe2 size={17} /><select value={market.code} onChange={(e) => onChange(markets.find((item) => item.code === e.target.value) ?? markets[0])}>{markets.map((item) => <option key={item.code} value={item.code}>{item.name} · {item.currency}</option>)}</select><ChevronDown size={15} /></label>;
}

function formatPrice(value: number | null, market: Market) { return value === null ? "Analiz edildi" : `${market.symbol}${value.toLocaleString("tr-TR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`; }

export default function Home() {
  const [market, setMarket] = useState(markets[0]);
  const [tracks, setTracks] = useState<Track[]>(() => { try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]") as Track[]; } catch { return []; } });
  const [url, setUrl] = useState("");
  const [query, setQuery] = useState("");
  const [paused, setPaused] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [telegramConnected, setTelegramConnected] = useState(() => localStorage.getItem("zaragram.telegram") === "connected");
  const filtered = useMemo(() => tracks.filter((item) => item.name.toLowerCase().includes(query.toLowerCase())), [tracks, query]);

  useEffect(() => { localStorage.setItem(STORAGE_KEY, JSON.stringify(tracks)); }, [tracks]);

  const requestBrowserNotifications = async () => {
    if (!("Notification" in window)) return toast.error("Bu tarayıcı site bildirimlerini desteklemiyor.");
    const permission = await Notification.requestPermission();
    if (permission === "granted") { toast.success("Site bildirimleri açıldı."); new Notification("zaragram bildirimleri aktif", { body: "Fiyat değişiklikleri bu tarayıcıya gönderilecek." }); }
    else toast.error("Bildirim izni verilmedi; Telegram üzerinden bildirim alabilirsiniz.");
  };

  const connectTelegram = () => { localStorage.setItem("zaragram.telegram", "connected"); setTelegramConnected(true); window.open(`https://t.me/${TELEGRAM_BOT}?start=connect`, "_blank", "noopener,noreferrer"); toast.success("Telegram bağlantı akışı açıldı."); };
  const addTrack = async () => {
    if (!url.trim()) return toast.error("Takip başlatmak için bir Zara ürün bağlantısı ekleyin.");
    const submittedUrl = url.trim();
    let parsed: Track = { id: Date.now(), name: "Yeni Zara ürünü", market: market.name, price: "İlk tarama", previous: "—", change: "—", state: "Tarama kuyruğunda", image: "linear-gradient(145deg,#d9d9d9,#707070)", url: submittedUrl };
    setTracks((current) => [parsed, ...current]); setUrl(""); toast.success(`${market.name} marketinde takip başlatıldı.`);
    try {
      const response = await fetch("/api/track", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ url: submittedUrl }) });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "İlk tarama tamamlanamadı");
      parsed = { ...parsed, name: result.product.title, price: formatPrice(result.product.price, market), state: "İzleniyor" };
      setTracks((current) => current.map((item) => item.id === parsed.id ? parsed : item));
      toast.success("İlk ürün taraması tamamlandı.");
    } catch (error) { toast.error(error instanceof Error ? error.message : "İlk tarama kuyrukta bekliyor."); }
  };
  const removeTrack = (id: number) => { setTracks((current) => current.filter((item) => item.id !== id)); toast.success("Takip kaldırıldı."); };

  return <div className="app-shell">
    <header className="topbar"><button className="icon-button mobile-only" onClick={() => setMobileMenu(!mobileMenu)} aria-label="Menüyü aç"><Menu size={21} /></button><a className="brand" href="#overview"><span className="brand-mark">Z</span><div><strong>zaragram</strong><small>price intelligence</small></div></a><nav className={mobileMenu ? "main-nav open" : "main-nav"}><a className="active" href="#overview">Genel görünüm</a><a href="#tracks">Takip listem</a><a href="#markets">Marketler</a><a href="#notifications">Bildirimler</a></nav><div className="top-actions"><MarketSelect market={market} onChange={setMarket} /><button className="icon-button" onClick={requestBrowserNotifications} aria-label="Site bildirimlerini aç"><Bell size={18} /></button><button className={telegramConnected ? "account-button connected" : "account-button"} onClick={connectTelegram}>{telegramConnected ? "Telegram bağlı" : "Telegram ile bağlan"}</button></div></header>
    <main className="layout">
      <aside className="sidebar"><div className="sidebar-title"><span>HESAP</span></div><div className="profile-card"><div className="avatar large">TG</div><div><strong>{telegramConnected ? "Telegram hesabı" : "Misafir takip"}</strong><span>{telegramConnected ? "Bildirimler etkin" : "Site hesabı"}</span></div><span className="online-dot" /></div><div className="side-group"><span className="side-label">TAKİP</span><a className="side-link selected" href="#overview"><TrendingDown size={17} />Genel görünüm</a><a className="side-link" href="#tracks"><Link2 size={17} />Takip listem <b>{tracks.length}</b></a><a className="side-link" href="#markets"><Globe2 size={17} />Ülke ve para birimi</a></div><div className="sidebar-footer"><ShieldCheck size={16} /><span>İzinli veri akışı<br /><small>Yalnızca herkese açık ürün sayfaları</small></span></div></aside>
      <section className="content" id="overview"><div className="page-heading"><div><p className="eyebrow">FİYAT TAKİP MERKEZİ</p><h1>Fiyat değişimlerini<br /><span>kaçırmayın.</span></h1><p className="subheading">Ürün bağlantısını ekleyin. Telegram bağlıysa anlık mesaj, değilse bu tarayıcı üzerinden bildirim alın.</p></div><div className="heading-meta"><span className="live-dot" />{paused ? "Tarama duraklatıldı" : "Tarama hazır"}<br /><small>{tracks.length} aktif ürün · Türkiye</small></div></div>
        <div className="hero-card"><div><span className="card-kicker">YENİ TAKİP EKLE</span><h2>Bir ürün bağlantısı bırakın.</h2><p>Market, dil ve para birimi ürün URL’sinden algılanır. Fiyat yükseldiğinde veya düştüğünde seçtiğiniz kanala izinli bildirim gönderilir.</p><div className="url-form"><Link2 size={18} /><input value={url} onChange={(e) => setUrl(e.target.value)} onKeyDown={(e) => e.key === "Enter" && addTrack()} placeholder="https://www.zara.com/tr/tr/..." /><button onClick={addTrack}>Takibe al <ExternalLink size={15} /></button></div><div className="form-note"><ShieldCheck size={14} /> Hesap parolası istenmez <span /> <Bell size={13} /> Bildirim izni ayrıca alınır</div></div></div>
        <div className="stats-grid"><div className="stat-card"><span>AKTİF TAKİPLER</span><strong>{tracks.length}</strong><small><Link2 size={13} /> Site hesabında saklanır</small></div><div className="stat-card"><span>İZLENEN MARKETLER</span><strong>{new Set(tracks.map((item) => item.market)).size}</strong><small><Globe2 size={13} /> Türkiye · TRY</small></div><div className="stat-card"><span>FİYAT DEĞİŞİMİ</span><strong>{tracks.filter((item) => item.change !== "—").length}</strong><small><TrendingDown size={13} /> Gerçek tarama sonucu</small></div><div className="stat-card accent"><span>BİLDİRİM KANALI</span><strong>{telegramConnected ? "Telegram" : "Site"}</strong><small><Bell size={13} /> {telegramConnected ? "Telegram hazır" : "İzin bekliyor"}</small></div></div>
        <div className="section-heading" id="tracks"><div><p className="eyebrow">TAKİP LİSTEM</p><h2>{tracks.length ? "İzlenen ürünler" : "Henüz ürün takip edilmiyor"}</h2></div><div className="section-actions">{tracks.length > 0 && <><div className="search-box"><Search size={15} /><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Ürün ara" /></div><button className={paused ? "pause-button active" : "pause-button"} onClick={() => setPaused(!paused)}>{paused ? <Play size={15} /> : <Pause size={15} />} {paused ? "Devam et" : "Duraklat"}</button></>}</div></div>
        <div className="tracking-table">{filtered.length === 0 ? <div className="empty-state"><Link2 size={24} /><strong>Takip listeniz boş.</strong><span>Yukarıdaki forma herkese açık bir Zara ürün bağlantısı ekleyerek başlayın.</span></div> : <>{<div className="table-head"><span>ÜRÜN</span><span>MARKET</span><span>GÜNCEL FİYAT</span><span>DEĞİŞİM</span><span>DURUM</span><span /></div>}{filtered.map((item) => <article className="track-row" key={item.id}><div className="product-cell"><div className="product-thumb" style={{ background: item.image }} /><div><strong>{item.name}</strong><span>{item.url.replace("https://www.", "").slice(0, 33)}…</span></div></div><span className="market-cell"><i className="flag">{item.market.slice(0, 2).toUpperCase()}</i>{item.market}</span><div className="price-cell"><strong>{item.price}</strong><span>önce {item.previous}</span></div><span className={item.change.startsWith("−") ? "change down" : "change"}>{item.change}</span><span className="state"><i />{item.state}</span><button className="icon-button row-menu" onClick={() => removeTrack(item.id)} aria-label="Takibi kaldır"><Trash2 size={16} /></button></article>)}</>}</div>
        <div className="bottom-grid"><div className="telegram-card" id="notifications"><div className="telegram-icon"><Zap size={16} /></div><div><span className="card-kicker">BİLDİRİM KANALI</span><h3>{telegramConnected ? "Telegram bağlı." : "Bildirim kanalını seçin."}</h3><p>{telegramConnected ? "Fiyat yükseldiğinde veya düştüğünde Telegram sohbetinize mesaj gönderilir." : "Telegram ile bağlanın ya da bu tarayıcı için bildirim izni verin."}</p><div className="notification-actions"><button onClick={connectTelegram}>Telegram ile bağlan <ExternalLink size={14} /></button><button onClick={requestBrowserNotifications}>Site bildirimini aç <Bell size={14} /></button></div></div></div><div className="market-card" id="markets"><div className="section-heading compact"><div><span className="card-kicker">AKTİF MARKET</span><h3>{market.name}</h3></div><MarketSelect market={market} onChange={setMarket} /></div><p>{market.language} · {market.currency} · fiyat biçimi yerel</p><div className="market-progress"><span style={{ width: tracks.length ? "100%" : "0%" }} /></div><small>{tracks.length ? "Takip için hazır" : "Ürün eklenmesini bekliyor"}</small></div></div>
      </section>
    </main>
  </div>;
}
