import { marketMap, zaraMarkets } from './countries.mjs';

function hashSeed(value) {
  return value.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
}

export function inferReference(url) {
  const normalized = decodeURIComponent(url);
  const referenceMatch = normalized.match(/p(\d{6,})/i) || normalized.match(/product\/(\d{6,})/i) || normalized.match(/(?:ref|reference)=([\w-]+)/i);
  return referenceMatch?.[1] ?? String(hashSeed(normalized)).padStart(8, '0');
}

export function normalizeZaraProductUrl(url, marketCode) {
  const market = marketMap.get(marketCode);
  if (!market) {
    throw new Error(`Unsupported Zara market: ${marketCode}`);
  }

  const parsed = new URL(url);
  const pathname = parsed.pathname.startsWith('/') ? parsed.pathname.slice(1) : parsed.pathname;
  return new URL(pathname, market.baseUrl).toString();
}

function buildSnapshot(input, compareMarketCode) {
  const marketCode = compareMarketCode ?? input.marketCode;
  const market = marketMap.get(marketCode);
  if (!market) {
    throw new Error(`Unsupported Zara market: ${marketCode}`);
  }

  const reference = inferReference(input.productUrl);
  const seed = hashSeed(`${reference}-${marketCode}`);
  const price = 1290 + (seed % 9) * 230;
  const availabilityIndex = seed % 3;

  return {
    sku: `${marketCode}-${reference}`,
    reference,
    name: `Structured blazer ${reference}`,
    description: `${market.name} storefront normalized product payload for ${reference}. Replace this mock mapper with the live Zara parser/API extractor for production use.`,
    price,
    originalPrice: price + 300,
    currency: market.currency,
    availability: availabilityIndex === 0 ? 'in_stock' : availabilityIndex === 1 ? 'low_stock' : 'out_of_stock',
    color: ['Black', 'Ecru', 'Navy'][seed % 3],
    composition: ['59% polyester', '38% viscose', '3% elastane'],
    images: [
      `https://static.zara.net/photos/${reference}-1.jpg`,
      `https://static.zara.net/photos/${reference}-2.jpg`
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL'].map((size, index) => ({
      size,
      inStock: index <= 2 || availabilityIndex === 0,
      sku: `${marketCode}-${reference}-${size}`
    })),
    canonicalUrl: normalizeZaraProductUrl(input.productUrl, marketCode),
    marketCode,
    checkedAt: new Date().toISOString()
  };
}

export async function fetchPrimarySnapshot(input) {
  return buildSnapshot(input);
}

export async function fetchComparisonSnapshots(input) {
  const market = marketMap.get(input.marketCode);
  return zaraMarkets
    .filter((candidate) => candidate.region === market?.region && candidate.code !== input.marketCode)
    .slice(0, 5)
    .map((candidate) => buildSnapshot(input, candidate.code));
}
