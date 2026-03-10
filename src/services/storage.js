import fs from 'node:fs';

function ensureFile(path) {
  if (!fs.existsSync(path)) {
    fs.writeFileSync(path, JSON.stringify({ products: [] }, null, 2), 'utf-8');
  }
}

export function readStore(path) {
  ensureFile(path);
  return JSON.parse(fs.readFileSync(path, 'utf-8'));
}

export function writeStore(path, data) {
  fs.writeFileSync(path, JSON.stringify(data, null, 2), 'utf-8');
}
