import { mkdir, access, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

const storageDir = path.join(process.cwd(), '.data');
const storageFile = path.join(storageDir, 'tracking-records.json');

async function ensureStorage() {
  await mkdir(storageDir, { recursive: true });
  try {
    await access(storageFile);
  } catch {
    await writeFile(storageFile, '[]', 'utf8');
  }
}

export async function readTrackingRecords() {
  await ensureStorage();
  const raw = await readFile(storageFile, 'utf8');
  return JSON.parse(raw);
}

export async function writeTrackingRecords(records) {
  await ensureStorage();
  await writeFile(storageFile, JSON.stringify(records, null, 2), 'utf8');
}
