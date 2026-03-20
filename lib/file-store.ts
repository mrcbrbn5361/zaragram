import { promises as fs } from 'fs';
import path from 'path';
import { TrackingRecord } from './types';

const storageDir = path.join(process.cwd(), '.data');
const storageFile = path.join(storageDir, 'tracking-records.json');

async function ensureStorage() {
  await fs.mkdir(storageDir, { recursive: true });
  try {
    await fs.access(storageFile);
  } catch {
    await fs.writeFile(storageFile, '[]', 'utf8');
  }
}

export async function readTrackingRecords(): Promise<TrackingRecord[]> {
  await ensureStorage();
  const raw = await fs.readFile(storageFile, 'utf8');
  return JSON.parse(raw) as TrackingRecord[];
}

export async function writeTrackingRecords(records: TrackingRecord[]) {
  await ensureStorage();
  await fs.writeFile(storageFile, JSON.stringify(records, null, 2), 'utf8');
}
