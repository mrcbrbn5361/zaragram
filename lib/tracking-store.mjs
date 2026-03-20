import { readTrackingRecords, writeTrackingRecords } from './file-store.mjs';
import { fetchComparisonSnapshots, fetchPrimarySnapshot } from './zara.mjs';

function assertTrackingPayload(input) {
  if (!input || typeof input !== 'object') throw new Error('Tracking payload missing');
  if (typeof input.marketCode !== 'string' || input.marketCode.length < 2) throw new Error('marketCode is required');
  if (typeof input.productUrl !== 'string') throw new Error('productUrl is required');
  new URL(input.productUrl);
}

function buildId(input, reference) {
  return `${input.telegramUserId ?? input.sessionId ?? 'guest'}-${input.marketCode}-${reference}`;
}

export async function createTrackingRecord(input) {
  assertTrackingPayload(input);
  const primarySnapshot = await fetchPrimarySnapshot(input);
  const comparisonSnapshots = await fetchComparisonSnapshots(input);
  const records = await readTrackingRecords();

  const record = {
    ...input,
    id: buildId(input, primarySnapshot.reference),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    marketsWatching: [input.marketCode, ...comparisonSnapshots.map((snapshot) => snapshot.marketCode)],
    lastSnapshot: primarySnapshot,
    comparisonSnapshots,
    priceHistory: [
      {
        checkedAt: primarySnapshot.checkedAt,
        price: primarySnapshot.price,
        availability: primarySnapshot.availability,
        marketCode: primarySnapshot.marketCode
      },
      ...comparisonSnapshots.map((snapshot) => ({
        checkedAt: snapshot.checkedAt,
        price: snapshot.price,
        availability: snapshot.availability,
        marketCode: snapshot.marketCode
      }))
    ],
    notificationChannels: ['telegram', 'web']
  };

  const filtered = records.filter((item) => item.id !== record.id);
  filtered.unshift(record);
  await writeTrackingRecords(filtered);
  return record;
}

export async function listTrackingRecords() {
  return readTrackingRecords();
}

export async function getDashboardMetrics() {
  const records = await readTrackingRecords();
  const totalMarketsWatched = records.reduce((acc, record) => acc + record.marketsWatching.length, 0);
  const lowStockCount = records.filter((record) => record.lastSnapshot.availability === 'low_stock').length;
  const targetReachedCount = records.filter((record) => typeof record.priceTarget === 'number' && record.lastSnapshot.price <= record.priceTarget).length;

  return {
    trackingCount: records.length,
    totalMarketsWatched,
    lowStockCount,
    targetReachedCount
  };
}
