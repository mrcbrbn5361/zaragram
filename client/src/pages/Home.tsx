// Tasarım notu: Gece Vardiyası — üç kolonlu komuta masası, midnight slate yüzeyler, Yankı Kobalt rota vurgusu.
import { useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import {
  Archive, ArrowUpRight, Bell, Check, ChevronDown, CircleHelp, Clock3,
  FileArchive, FileAudio2, FileImage, FileVideo2, Hash, Headphones,
  Image as ImageIcon, Link2, Lock, Mic, MoreHorizontal, Paperclip,
  Pause, Play, Plus, Radio, Search, Send, Settings, ShieldCheck,
  Sparkles, UploadCloud, Users, Video, X, Zap,
} from "lucide-react";

const logo = "/manus-storage/yanki-logo_f3f82750.png";
const texture = "/manus-storage/yanki-hero-texture_6da164de.png";
const orbit = "/manus-storage/yanki-media-orbit_18b0423d.png";

type Message = { id: number; author: string; time: string; avatar: string; color: string; text?: string; attachment?: { type: "image" | "video" | "audio" | "file"; name: string; size: string; provider: string } };

const initialMessages: Message[] = [
  { id: 1, author: "Ece Yılmaz", time: "Bugün 14:32", avatar: "EY", color: "#e879a7", text: "Herkese selam! Yeni medya rotasını test ediyorum. Dosyayı bırakınca sağlayıcıyı otomatik seçiyor.", },
  { id: 2, author: "Mert Can", time: "Bugün 14:34", avatar: "MC", color: "#65b8ff", text: "Güzel görünüyor. Büyük dosyalarda da aynı akış mı çalışıyor?", },
  { id: 3, author: "Derya Akın", time: "Bugün 14:35", avatar: "DA", color: "#a58cff", text: "Evet — önizleme burada, yönlendirme sağ panelde. Depolama yok; sadece akış var.", attachment: { type: "image", name: "gece-yuruyusu.webp", size: "2.4 MB", provider: "Hizliresim" } },
  { id: 4, author: "Bora Kaya", time: "Bugün 14:37", avatar: "BK", color: "#f5bb67", text: "Ses kanalına da kısa bir not bıraktım.", attachment: { type: "audio", name: "not-14-37.webm", size: "0.8 MB", provider: "DosyaUpload Audio" } },
];

const channels = ["genel", "medya-paylasim", "ses-kanali", "proje-yanki", "geri-bildirim"];
const providers = [
  { name: "Hizliresim", status: "Aktif", tone: "green", type: "Görseller", latency: "120 ms" },
  { name: "DosyaUpload", status: "Aktif", tone: "green", type: "Video · Ses", latency: "180 ms" },
  { name: "ResimUpload", status: "Yedek", tone: "amber", type: "Fallback", latency: "240 ms" },
];

function Avatar({ initials, color, small = false }: { initials: string; color: string; small?: boolean }) {
  return <div className={`avatar ${small ? "avatar-small" : ""}`} style={{ background: `linear-gradient(135deg, ${color}, #24203c)` }}>{initials}</div>;
}

function MediaGlyph({ type }: { type: string }) {
  if (type === "image") return <FileImage size={17} />;
  if (type === "video") return <FileVideo2 size={17} />;
  if (type === "audio") return <FileAudio2 size={17} />;
  return <FileArchive size={17} />;
}

function AudioCard({ name }: { name: string }) {
  const [playing, setPlaying] = useState(false);
  return <div className="audio-card">
    <button className="play-button" aria-label={playing ? "Duraklat" : "Oynat"} onClick={() => setPlaying(!playing)}>{playing ? <Pause size={16} fill="currentColor" /> : <Play size={16} fill="currentColor" />}</button>
    <div className="audio-wave" aria-hidden="true">{Array.from({ length: 28 }).map((_, i) => <i key={i} style={{ height: `${8 + ((i * 17) % 20)}px`, opacity: i < 11 && playing ? 1 : 0.48 }} />)}</div>
    <div className="audio-meta"><span>{name}</span><small><b>SES ROTASI</b> · 0:12</small></div>
  </div>;
}

function AttachmentCard({ attachment, onZoom }: { attachment: NonNullable<Message["attachment"]>; onZoom: () => void }) {
  if (attachment.type === "image") return <button className="image-attachment" onClick={onZoom} aria-label="Görseli büyüt">
    <div className="photo-placeholder" style={{ backgroundImage: `url(${texture})` }}><ImageIcon size={22} /><span>Önizlemeyi büyüt</span></div>
    <div className="attachment-caption"><span>{attachment.name}</span><small><b>ROTALANDI</b> · {attachment.size} · {attachment.provider}</small></div>
  </button>;
  if (attachment.type === "audio") return <AudioCard name={attachment.name} />;
  return <div className="file-attachment"><div className="file-icon"><MediaGlyph type={attachment.type} /></div><div><strong>{attachment.name}</strong><small>{attachment.size} · {attachment.provider}</small></div><button aria-label="İndir" onClick={() => toast.success("İndirme bağlantısı hazırlandı")}> <ArrowUpRight size={16} /></button></div>;
}

export default function Home() {
  const [activeChannel, setActiveChannel] = useState("genel");
  const [messages, setMessages] = useState(initialMessages);
  const [draft, setDraft] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [lightbox, setLightbox] = useState(false);
  const [serverSearch, setServerSearch] = useState("");
  const fileInput = useRef<HTMLInputElement>(null);

  const visibleChannels = useMemo(() => channels.filter((channel) => channel.includes(serverSearch.toLowerCase())), [serverSearch]);
  const sendMessage = () => {
    if (!draft.trim()) return;
    setMessages((current) => [...current, { id: Date.now(), author: "Sen", time: "Şimdi", avatar: "SK", color: "#7c6cff", text: draft.trim() }]);
    setDraft("");
    toast.success("Mesaj gönderildi");
  };
  const handleUpload = (file?: File) => {
    if (!file) return;
    setUploading(true);
    window.setTimeout(() => { setUploading(false); toast.success(`${file.name} yönlendirme kuyruğuna alındı`); }, 1200);
  };
  const startRecording = () => { setIsRecording((value) => !value); toast.info(isRecording ? "Ses kaydı tamamlandı" : "Ses kaydı başladı"); };

  return <main className="app-shell" style={{ backgroundImage: `linear-gradient(115deg, rgba(15,14,29,.98) 20%, rgba(15,14,29,.90)), url(${texture})` }}>
    <aside className="server-rail">
      <div className="server-logo"><img src={logo} alt="Yankı" /></div>
      <div className="server-divider" />
      <button className="server-orb active" aria-label="Yankı sunucusu"><span>Y</span></button>
      <button className="server-orb" aria-label="İkinci sunucu"><Radio size={18} /></button>
      <button className="server-orb" aria-label="Sunucu ekle"><Plus size={19} /></button>
      <div className="rail-bottom"><button aria-label="Bildirimler"><Bell size={17} /></button><button aria-label="Ayarlar"><Settings size={17} /></button></div>
    </aside>

    <aside className="channel-sidebar">
      <div className="workspace-head"><div className="brand-lockup"><div className="brand-signal"><img src={logo} alt="Yankı sinyal işareti" /></div><div><p className="eyebrow">YEREL MEDYA AĞI</p><h1>Yankı</h1></div></div><button aria-label="Daha fazla seçenek"><MoreHorizontal size={18} /></button></div>
      <div className="search-wrap"><Search size={15} /><input value={serverSearch} onChange={(e) => setServerSearch(e.target.value)} placeholder="Kanal ara" /></div>
      <div className="sidebar-section"><div className="section-label"><span>METİN KANALLARI</span><button onClick={() => toast.success("Yeni kanal formu yakında")}> <Plus size={14} /></button></div>
        {visibleChannels.map((channel) => <button key={channel} className={`channel-item ${activeChannel === channel ? "selected" : ""}`} onClick={() => setActiveChannel(channel)}><Hash size={16} /><span>{channel}</span>{channel === "genel" && <span className="channel-dot" />}</button>)}
      </div>
      <div className="sidebar-section voice-section"><div className="section-label"><span>SES KANALLARI</span><button><Plus size={14} /></button></div><button className="channel-item"><Headphones size={16} /><span>sohbet odası</span><Users size={14} className="channel-users" /></button><div className="voice-user"><Avatar initials="SK" color="#7c6cff" small /><span>Sen</span><span className="voice-live">CANLI</span></div></div>
      <div className="profile-strip"><Avatar initials="SK" color="#7c6cff" small /><div><strong>Selin Kaya</strong><small>#7812 · çevrimiçi</small></div><button aria-label="Kullanıcı ayarları"><Settings size={16} /></button></div>
    </aside>

    <section className="chat-column">
      <header className="chat-head"><div className="chat-title"><Hash size={21} /><div><h2>{activeChannel}</h2><p>Topluluk, medya ve küçük keşifler.</p></div></div><div className="chat-actions"><button aria-label="Bildirimler"><Bell size={18} /></button><button aria-label="Sabitle"><Lock size={17} /></button><button aria-label="Üyeler"><Users size={18} /></button><div className="head-search"><Search size={15} /><input placeholder="Ara" /></div><button aria-label="Yardım"><CircleHelp size={18} /></button></div></header>
      <div className="chat-scroll">
        <div className="channel-intro"><div className="intro-icon"><Hash size={30} /></div><h3>#{activeChannel}</h3><p>Bu kanalın başlangıcı. Paylaş, konuş, yankı bırak.</p><span className="intro-rule" /></div>
        {messages.map((message) => <article className="message" key={message.id}><Avatar initials={message.avatar} color={message.color} /><div className="message-body"><div className="message-meta"><strong>{message.author}</strong><time>{message.time}</time></div>{message.text && <p>{message.text}</p>}{message.attachment && <AttachmentCard attachment={message.attachment} onZoom={() => setLightbox(true)} />}</div></article>)}
        {uploading && <div className="upload-progress"><div className="spinner"><Zap size={14} /></div><div><strong>Medya rotası hesaplanıyor</strong><small>MIME türü okunuyor · sağlayıcı seçiliyor</small><div className="progress-track"><span /></div></div><span>68%</span></div>}
      </div>
      <div className="composer-wrap"><div className={`composer ${isRecording ? "recording" : ""}`}><button aria-label="Dosya ekle" onClick={() => fileInput.current?.click()}><Paperclip size={19} /></button><input ref={fileInput} type="file" hidden onChange={(e) => handleUpload(e.target.files?.[0])} /><input value={draft} onChange={(e) => setDraft(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") sendMessage(); }} placeholder={isRecording ? "Kayıt sürüyor…" : `#${activeChannel} kanalına mesaj gönder`} /><button className={isRecording ? "recording-button" : ""} aria-label="Ses kaydı" onClick={startRecording}><Mic size={19} /></button><button aria-label="Gönder" className="send-button" onClick={sendMessage}><Send size={17} /></button></div><div className="composer-hint"><span><Paperclip size={11} /> Dosya ekle</span><span><Mic size={11} /> Basılı tutarak ses kaydet</span><span className="hint-right"><Zap size={11} /> Yankı rotası aktif</span></div></div>
    </section>

    <aside className="inspector-panel" style={{ backgroundImage: `linear-gradient(180deg, rgba(24,22,43,.90), rgba(16,15,30,.98)), url(${orbit})` }}>
      <div className="inspector-head"><div><p className="eyebrow">YANKI / ROTA MASASI</p><h2>Akış kontrolü</h2></div><button aria-label="Paneli kapat"><X size={17} /></button></div>
      <div className="route-summary"><div className="summary-icon"><ShieldCheck size={20} /></div><div><strong>Sıfır depolama modu</strong><p>Dosyalar yalnızca akışta işlenir.</p></div><span className="status-pill green">AKTİF</span></div>
      <div className="inspector-block"><div className="block-title"><span>AKTİF MEDYA ROTALARI</span><button><MoreHorizontal size={16} /></button></div>{providers.map((provider) => <div className="provider-row" key={provider.name}><div className="provider-mark"><Check size={13} /></div><div className="provider-copy"><strong>{provider.name}</strong><small>{provider.type} · {provider.latency}</small></div><span className={`status-pill ${provider.tone}`}>{provider.status}</span></div>)}</div>
      <div className="inspector-block quick-actions"><div className="block-title"><span>MEDYA GİRİŞLERİ</span></div><button onClick={() => fileInput.current?.click()}><UploadCloud size={17} /><span>Dosya yönlendir</span><ArrowUpRight size={15} /></button><button onClick={() => toast.info("Pano resmi yakalandı — gönderim için hazır") }><ImageIcon size={17} /><span>Panodan görsel al</span><span className="kbd">⌘ V</span></button><button onClick={startRecording}><Mic size={17} /><span>Sesli not kaydet</span><span className="kbd">REC</span></button></div>
      <div className="inspector-footer"><div className="footer-stat"><span className="pulse-dot" /><div><strong>4 sağlayıcı</strong><small>sağlıklı bağlantı</small></div></div><div className="footer-stat"><Archive size={16} /><div><strong>0 B saklama</strong><small>bu oturumda</small></div></div></div>
    </aside>
    {lightbox && <div className="lightbox" role="dialog" aria-modal="true" onClick={() => setLightbox(false)}><button onClick={() => setLightbox(false)} aria-label="Kapat"><X size={22} /></button><div className="lightbox-art" style={{ backgroundImage: `url(${texture})` }}><Sparkles size={38} /><span>gece-yuruyusu.webp</span></div></div>}
  </main>;
}
