import http from 'node:http';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { zaraMarkets, regionSummary } from './lib/countries.mjs';
import { listTrackingRecords, createTrackingRecord, getDashboardMetrics } from './lib/tracking-store.mjs';
import { verifyTelegramLogin } from './lib/telegram-auth.mjs';
import { processTelegramUpdate } from './lib/telegram.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const port = Number(process.env.PORT ?? 3000);
const host = process.env.HOST ?? '0.0.0.0';

function sendJson(response, status, payload) {
  response.writeHead(status, {
    'content-type': 'application/json; charset=utf-8',
    'access-control-allow-origin': '*'
  });
  response.end(JSON.stringify(payload));
}

function sendText(response, status, payload, contentType = 'text/plain; charset=utf-8') {
  response.writeHead(status, { 'content-type': contentType });
  response.end(payload);
}

async function readJsonBody(request) {
  const chunks = [];
  for await (const chunk of request) {
    chunks.push(chunk);
  }
  const raw = Buffer.concat(chunks).toString('utf8');
  return raw ? JSON.parse(raw) : {};
}

async function serveStatic(response, filePath, contentType) {
  const fullPath = path.join(__dirname, 'web', filePath);
  const content = await readFile(fullPath, 'utf8');
  sendText(response, 200, content, contentType);
}

const server = http.createServer(async (request, response) => {
  try {
    const url = new URL(request.url ?? '/', `http://${request.headers.host ?? 'localhost'}`);

    if (request.method === 'OPTIONS') {
      response.writeHead(204, {
        'access-control-allow-origin': '*',
        'access-control-allow-methods': 'GET,POST,OPTIONS',
        'access-control-allow-headers': 'content-type'
      });
      response.end();
      return;
    }

    if (request.method === 'GET' && url.pathname === '/') {
      await serveStatic(response, 'index.html', 'text/html; charset=utf-8');
      return;
    }

    if (request.method === 'GET' && url.pathname === '/app.css') {
      await serveStatic(response, 'app.css', 'text/css; charset=utf-8');
      return;
    }

    if (request.method === 'GET' && url.pathname === '/app.js') {
      await serveStatic(response, 'app.js', 'application/javascript; charset=utf-8');
      return;
    }

    if (request.method === 'GET' && url.pathname === '/api/health') {
      sendJson(response, 200, { ok: true, service: 'zaragram', timestamp: new Date().toISOString() });
      return;
    }

    if (request.method === 'GET' && url.pathname === '/api/markets') {
      sendJson(response, 200, { items: zaraMarkets, summary: { total: zaraMarkets.length, byRegion: regionSummary } });
      return;
    }

    if (request.method === 'GET' && url.pathname === '/api/track') {
      const [items, metrics] = await Promise.all([listTrackingRecords(), getDashboardMetrics()]);
      sendJson(response, 200, { items, metrics });
      return;
    }

    if (request.method === 'POST' && url.pathname === '/api/track') {
      const payload = await readJsonBody(request);
      const item = await createTrackingRecord(payload);
      sendJson(response, 201, { item });
      return;
    }

    if (request.method === 'POST' && url.pathname === '/api/auth/telegram') {
      const payload = await readJsonBody(request);
      const botToken = process.env.TELEGRAM_BOT_TOKEN;
      if (!botToken) {
        sendJson(response, 500, { error: 'TELEGRAM_BOT_TOKEN missing' });
        return;
      }

      const verified = verifyTelegramLogin(payload, botToken);
      if (!verified) {
        sendJson(response, 401, { error: 'Telegram login verification failed' });
        return;
      }

      sendJson(response, 200, {
        session: {
          telegramUserId: payload.id,
          username: payload.username,
          firstName: payload.first_name,
          avatar: payload.photo_url
        }
      });
      return;
    }

    if (request.method === 'POST' && url.pathname === '/api/telegram') {
      const update = await readJsonBody(request);
      const result = await processTelegramUpdate(update);
      sendJson(response, 200, { ok: true, result });
      return;
    }

    sendJson(response, 404, { error: 'Not found' });
  } catch (error) {
    sendJson(response, 500, {
      error: error instanceof Error ? error.message : 'Unknown server error'
    });
  }
});

server.listen(port, host, () => {
  console.log(`[zaragram] running on http://${host}:${port}`);
});
