export type ZaraMarket = {
  code: string;
  name: string;
  locale: string;
  currency: string;
  language: string;
  baseUrl: string;
  region: 'Europe' | 'Americas' | 'Middle East' | 'Asia-Pacific' | 'Africa';
  enabled: boolean;
};

export type ProductVariant = {
  size: string;
  inStock: boolean;
  sku: string;
};

export type ProductSnapshot = {
  sku: string;
  reference: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  currency: string;
  availability: 'in_stock' | 'low_stock' | 'out_of_stock';
  color: string;
  composition: string[];
  images: string[];
  sizes: ProductVariant[];
  canonicalUrl: string;
  marketCode: string;
  checkedAt: string;
};

export type PriceHistoryEntry = {
  checkedAt: string;
  price: number;
  availability: ProductSnapshot['availability'];
  marketCode: string;
};

export type ProductTrackingRequest = {
  marketCode: string;
  productUrl: string;
  telegramUserId?: string;
  telegramUsername?: string;
  sessionId?: string;
  priceTarget?: number;
};

export type TrackingRecord = ProductTrackingRequest & {
  id: string;
  createdAt: string;
  updatedAt: string;
  marketsWatching: string[];
  lastSnapshot: ProductSnapshot;
  comparisonSnapshots: ProductSnapshot[];
  priceHistory: PriceHistoryEntry[];
  notificationChannels: Array<'telegram' | 'web'>;
};

export type TelegramLoginPayload = {
  id: string;
  first_name?: string;
  last_name?: string;
  username?: string;
  photo_url?: string;
  auth_date: string;
  hash: string;
};
