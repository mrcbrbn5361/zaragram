function parsePrice(raw) {
  const normalized = raw?.replace(/[^\d,.-]/g, '').replace(',', '.');
  const value = Number.parseFloat(normalized);
  return Number.isFinite(value) ? value : null;
}

function extractMeta(html, property) {
  const regex = new RegExp(`<meta[^>]+(?:property|name)=["']${property}["'][^>]+content=["']([^"']+)["']`, 'i');
  return html.match(regex)?.[1] ?? '';
}

function extractFirst(html, regex) {
  return html.match(regex)?.[1]?.trim() ?? '';
}

function normalizeCountryLink(url) {
  try {
    const parsed = new URL(url, 'https://www.zara.com');
    const pathParts = parsed.pathname.split('/').filter(Boolean);
    if (!pathParts.length) return null;
    const countryCode = pathParts[0].toLowerCase();
    if (!/^[a-z]{2}$/.test(countryCode)) return null;

    const localeCode = pathParts[1]?.toLowerCase();
    if (localeCode && /^[a-z]{2}$/.test(localeCode)) {
      return `https://www.zara.com/${countryCode}/${localeCode}/`;
    }

    return `https://www.zara.com/${countryCode}/`;
  } catch {
    return null;
  }
}

function findLinks(html) {
  const hrefRegex = /href=["']([^"']+)["']/gi;
  const links = [];
  let match;
  while ((match = hrefRegex.exec(html)) !== null) {
    links.push(match[1]);
  }
  return links;
}

export async function fetchCountryLinks() {
  const targets = ['https://www.zara.com/', 'https://www.zara.com/country-selector', 'https://www.zara.com/tr/tr/'];
  const links = new Set();

  for (const target of targets) {
    try {
      const res = await fetch(target, { headers: { 'user-agent': 'Mozilla/5.0 ZaragramBot/1.0' } });
      const html = await res.text();
      for (const href of findLinks(html)) {
        const normalized = normalizeCountryLink(href);
        if (normalized) links.add(normalized);
      }
    } catch {
      // continue
    }
  }

  return Array.from(links).sort();
}

export async function scrapeProduct(url) {
  const res = await fetch(url, { headers: { 'user-agent': 'Mozilla/5.0 ZaragramBot/1.0' } });
  if (!res.ok) throw new Error(`Ürün sayfası alınamadı: HTTP ${res.status}`);

  const html = await res.text();

  const name = extractMeta(html, 'og:title') || extractFirst(html, /<title>([^<]+)<\/title>/i);
  const image = extractMeta(html, 'og:image') || extractFirst(html, /<img[^>]+src=["']([^"']+)["']/i);
  const metaPrice = extractMeta(html, 'product:price:amount');
  const inlinePrice = extractFirst(html, /(?:price|fiyat)[^\d]{0,15}(\d+[\.,]\d+)/i);
  const rawPrice = metaPrice || inlinePrice;
  const currency = extractMeta(html, 'product:price:currency') || 'TRY';
  const price = parsePrice(rawPrice);

  if (!name || !price) throw new Error('Ürün bilgileri ayrıştırılamadı. URL formatını kontrol edin.');

  return { url, name, image, price, currency, checkedAt: new Date().toISOString() };
}
