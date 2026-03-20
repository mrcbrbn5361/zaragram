export const zaraMarkets = [
  { code: 'TR', name: 'Türkiye', locale: 'tr-TR', currency: 'TRY', language: 'Türkçe', baseUrl: 'https://www.zara.com/tr/', region: 'Europe', enabled: true },
  { code: 'US', name: 'United States', locale: 'en-US', currency: 'USD', language: 'English', baseUrl: 'https://www.zara.com/us/', region: 'Americas', enabled: true },
  { code: 'GB', name: 'United Kingdom', locale: 'en-GB', currency: 'GBP', language: 'English', baseUrl: 'https://www.zara.com/uk/', region: 'Europe', enabled: true },
  { code: 'DE', name: 'Germany', locale: 'de-DE', currency: 'EUR', language: 'Deutsch', baseUrl: 'https://www.zara.com/de/', region: 'Europe', enabled: true },
  { code: 'ES', name: 'Spain', locale: 'es-ES', currency: 'EUR', language: 'Español', baseUrl: 'https://www.zara.com/es/', region: 'Europe', enabled: true },
  { code: 'FR', name: 'France', locale: 'fr-FR', currency: 'EUR', language: 'Français', baseUrl: 'https://www.zara.com/fr/', region: 'Europe', enabled: true },
  { code: 'IT', name: 'Italy', locale: 'it-IT', currency: 'EUR', language: 'Italiano', baseUrl: 'https://www.zara.com/it/', region: 'Europe', enabled: true },
  { code: 'NL', name: 'Netherlands', locale: 'nl-NL', currency: 'EUR', language: 'Nederlands', baseUrl: 'https://www.zara.com/nl/', region: 'Europe', enabled: true },
  { code: 'PL', name: 'Poland', locale: 'pl-PL', currency: 'PLN', language: 'Polski', baseUrl: 'https://www.zara.com/pl/', region: 'Europe', enabled: true },
  { code: 'JP', name: 'Japan', locale: 'ja-JP', currency: 'JPY', language: '日本語', baseUrl: 'https://www.zara.com/jp/', region: 'Asia-Pacific', enabled: true },
  { code: 'KR', name: 'South Korea', locale: 'ko-KR', currency: 'KRW', language: '한국어', baseUrl: 'https://www.zara.com/kr/', region: 'Asia-Pacific', enabled: true },
  { code: 'SG', name: 'Singapore', locale: 'en-SG', currency: 'SGD', language: 'English', baseUrl: 'https://www.zara.com/sg/', region: 'Asia-Pacific', enabled: true },
  { code: 'AU', name: 'Australia', locale: 'en-AU', currency: 'AUD', language: 'English', baseUrl: 'https://www.zara.com/au/', region: 'Asia-Pacific', enabled: true },
  { code: 'IN', name: 'India', locale: 'en-IN', currency: 'INR', language: 'English', baseUrl: 'https://www.zara.com/in/', region: 'Asia-Pacific', enabled: true },
  { code: 'SA', name: 'Saudi Arabia', locale: 'ar-SA', currency: 'SAR', language: 'العربية', baseUrl: 'https://www.zara.com/sa/', region: 'Middle East', enabled: true },
  { code: 'AE', name: 'United Arab Emirates', locale: 'en-AE', currency: 'AED', language: 'English', baseUrl: 'https://www.zara.com/ae/', region: 'Middle East', enabled: true },
  { code: 'EG', name: 'Egypt', locale: 'en-EG', currency: 'EGP', language: 'English', baseUrl: 'https://www.zara.com/eg/', region: 'Africa', enabled: true },
  { code: 'ZA', name: 'South Africa', locale: 'en-ZA', currency: 'ZAR', language: 'English', baseUrl: 'https://www.zara.com/za/', region: 'Africa', enabled: true },
  { code: 'WW', name: 'International', locale: 'en-WW', currency: 'EUR', language: 'English', baseUrl: 'https://www.zara.com/ww/', region: 'Europe', enabled: true }
];

export const marketMap = new Map(zaraMarkets.map((market) => [market.code, market]));
export const regionSummary = zaraMarkets.reduce((acc, market) => {
  acc[market.region] = (acc[market.region] ?? 0) + 1;
  return acc;
}, {});
