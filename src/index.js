import fs from 'node:fs';
import path from 'node:path';
import { createServer } from 'node:http';
import { fileURLToPath } from 'node:url';
import { config } from './config.js';
import { createTracker } from './services/tracker.js';
import { createTelegramBot } from './services/telegramBot.js';
import { fetchCountryLinks } from './services/zaraScraper.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const botRef = { current: null };
const tracker = createTracker(config, botRef);
botRef.current = createTelegramBot(config, tracker);

function json(res, statusCode, payload) {
  res.writeHead(statusCode, { 'content-type': 'application/json; charset=utf-8' });
  res.end(JSON.stringify(payload));
}

async function readBody(req) {
  let raw = '';
  for await (const chunk of req) raw += chunk;
  return raw ? JSON.parse(raw) : {};
}

const server = createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);

  if (req.method === 'GET' && url.pathname === '/api/health') return json(res, 200, { ok: true });

  if (req.method === 'GET' && url.pathname === '/api/countries') {
    const links = await fetchCountryLinks();
    return json(res, 200, { count: links.length, links });
  }

  if (req.method === 'GET' && url.pathname === '/api/products') {
    return json(res, 200, { products: tracker.listProducts() });
  }

  if (req.method === 'POST' && url.pathname === '/api/products') {
    try {
      const body = await readBody(req);
      const product = await tracker.addProduct(body.url, body.chatId);
      return json(res, 201, product);
    } catch (error) {
      return json(res, 400, { error: error.message });
    }
  }

  if (req.method === 'POST' && url.pathname === '/api/refresh') {
    const products = await tracker.refreshPrices();
    return json(res, 200, { products });
  }

  const filePath = path.join(rootDir, 'public', url.pathname === '/' ? 'index.html' : url.pathname);
  if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
    const ext = path.extname(filePath);
    const type = ext === '.html' ? 'text/html' : 'text/plain';
    res.writeHead(200, { 'content-type': `${type}; charset=utf-8` });
    res.end(fs.readFileSync(filePath));
    return;
  }

  json(res, 404, { error: 'Not found' });
});

setInterval(async () => {
  await tracker.refreshPrices();
}, config.pollingIntervalMs);

server.listen(config.port, () => {
  console.log(`Zaragram running on http://localhost:${config.port}`);
});
