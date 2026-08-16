import express from "express";
import { createServer } from "http";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
const server = createServer(app);
app.use(express.json({ limit: "32kb" }));

const MARKETS = [
  { code: "TR", slug: "tr", name: "Türkiye", language: "tr", currency: "TRY", symbol: "₺" },
  { code: "ES", slug: "es", name: "İspanya", language: "es", currency: "EUR", symbol: "€" },
  { code: "US", slug: "us", name: "ABD", language: "en", currency: "USD", symbol: "$" },
  { code: "GB", slug: "uk", name: "Birleşik Krallık", language: "en", currency: "GBP", symbol: "£" },
  { code: "DE", slug: "de", name: "Almanya", language: "de", currency: "EUR", symbol: "€" },
  { code: "FR", slug: "fr", name: "Fransa", language: "fr", currency: "EUR", symbol: "€" },
  { code: "IT", slug: "it", name: "İtalya", language: "it", currency: "EUR", symbol: "€" },
  { code: "AE", slug: "ae", name: "Birleşik Arap Emirlikleri", language: "ar", currency: "AED", symbol: "د.إ" },
  { code: "SA", slug: "sa", name: "Suudi Arabistan", language: "ar", currency: "SAR", symbol: "ر.س" },
  { code: "JP", slug: "jp", name: "Japonya", language: "ja", currency: "JPY", symbol: "¥" },
  { code: "AU", slug: "au", name: "Avustralya", language: "en", currency: "AUD", symbol: "A$" },
  { code: "CA", slug: "ca", name: "Kanada", language: "en", currency: "CAD", symbol: "C$" },
];
const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
const lastFetch = new Map<string, number>();
const ALLOWED_HOSTS = new Set(["zara.com", "www.zara.com"]);

type Product = { title: string; price: number | null; currency: string | null; image: string | null; availability: string | null; sourceUrl: string; market: string | null; fetchedAt: string };

function jsonLdProduct(html: string): Record<string, any> | null {
  const scripts = Array.from(html.matchAll(/<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi));
  for (const match of scripts) {
    try {
      const value = JSON.parse(match[1]);
      const candidates = Array.isArray(value) ? value : [value, ...(value?.["@graph"] ?? [])];
      const product = candidates.find((item) => item && (item["@type"] === "Product" || item["@type"]?.includes?.("Product")));
      if (product) return product;
    } catch { /* malformed JSON-LD is ignored */ }
  }
  return null;
}
function decodeEntities(value: string) { return value.replace(/&amp;/g, "&").replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&lt;/g, "<").replace(/&gt;/g, ">"); }
function parsePrice(value: unknown): number | null { if (typeof value === "number") return value; if (typeof value !== "string") return null; const clean = value.replace(/[^0-9,.]/g, "").replace(/\.(?=.*\.)/g, "").replace(",", "."); const number = Number(clean); return Number.isFinite(number) ? number : null; }
async function canFetch(host: string) { try { const response = await fetch(`https://${host}/robots.txt`, { headers: { "User-Agent": "zaragram-price-monitor/1.0 (+public product monitoring)" } }); if (!response.ok) return true; const text = (await response.text()).toLowerCase(); return !text.split(/\r?\n/).some((line) => line.trim().startsWith("disallow: /")); } catch { return true; } }

async function scrapeProduct(rawUrl: string): Promise<Product> {
  const parsed = new URL(rawUrl);
  if (!ALLOWED_HOSTS.has(parsed.hostname)) throw new Error("Yalnızca zara.com ürün bağlantıları kabul edilir.");
  if (parsed.protocol !== "https:") throw new Error("Güvenlik nedeniyle yalnızca HTTPS bağlantıları kabul edilir.");
  if (!(await canFetch(parsed.hostname))) throw new Error("Bu marketin robots.txt politikası otomatik okumaya izin vermiyor.");
  const previous = lastFetch.get(parsed.hostname) ?? 0;
  const wait = 1200 - (Date.now() - previous);
  if (wait > 0) await sleep(wait);
  lastFetch.set(parsed.hostname, Date.now());
  const response = await fetch(parsed.toString(), { headers: { "User-Agent": "zaragram-price-monitor/1.0 (+public product monitoring)", Accept: "text/html,application/xhtml+xml" } });
  if (!response.ok) throw new Error(`Ürün sayfası ${response.status} durumuyla döndü.`);
  const html = await response.text();
  const structured = jsonLdProduct(html);
  const title = String(structured?.name ?? decodeEntities(html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1] ?? "Zara ürünü")).replace(/\s+/g, " ").trim();
  const offer = Array.isArray(structured?.offers) ? structured.offers[0] : structured?.offers;
  const price = parsePrice(offer?.price ?? structured?.price ?? html.match(/(?:price|fiyat)[^0-9]{0,30}([0-9.,]+)/i)?.[1]);
  const currency = String(offer?.priceCurrency ?? parsed.pathname.match(/^\/([a-z]{2})\//i)?.[1] ?? "").toUpperCase() || null;
  const image = Array.isArray(structured?.image) ? String(structured.image[0]) : structured?.image ? String(structured.image) : null;
  return { title, price, currency, image, availability: offer?.availability ? String(offer.availability) : null, sourceUrl: parsed.toString(), market: parsed.pathname.split("/")[1]?.toUpperCase() ?? null, fetchedAt: new Date().toISOString() };
}

app.get("/api/health", (_req, res) => res.json({ ok: true, service: "zaragram-monitor", markets: MARKETS.length }));
app.get("/api/markets", (_req, res) => res.json(MARKETS));
app.post("/api/track", async (req, res) => { const url = typeof req.body?.url === "string" ? req.body.url.trim() : ""; if (!url) return res.status(400).json({ error: "url_required" }); try { return res.json({ ok: true, product: await scrapeProduct(url) }); } catch (error) { return res.status(422).json({ error: error instanceof Error ? error.message : "scrape_failed" }); } });
app.post("/api/telegram/webhook", async (req, res) => { const message = req.body?.message; if (!message?.chat?.id || !message?.text) return res.json({ ok: true, ignored: true }); const text = String(message.text).trim(); const language = /^\/(tr|en|es|de|fr|it|ar|ja)(?:@\w+)?$/i.exec(text)?.[1]?.toLowerCase(); const reply = language ? `Dil seçildi: ${language.toUpperCase()}. Şimdi takip etmek istediğiniz Zara ürün bağlantısını gönderin.` : text.startsWith("http") ? "Bağlantı alındı. Ürün ilk kez taranıyor; fiyat değiştiğinde bu sohbete bildirim göndereceğim." : "Merhaba. Dil seçmek için /tr, /en, /es veya /de yazın; ardından ürün bağlantısını gönderin."; if (process.env.TELEGRAM_BOT_TOKEN) await fetch(`https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ chat_id: message.chat.id, text: reply }) }); return res.json({ ok: true, reply }); });

const staticPath = process.env.NODE_ENV === "production" ? path.resolve(__dirname, "public") : path.resolve(__dirname, "..", "dist", "public");
app.use(express.static(staticPath));
app.get("*", (_req, res) => res.sendFile(path.join(staticPath, "index.html")));
const port = Number(process.env.PORT || 3000);
server.listen(port, () => console.log(`zaragram monitor listening on ${port}`));
