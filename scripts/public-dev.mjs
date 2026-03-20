import { spawn } from 'node:child_process';
import process from 'node:process';
import { commandExists, getCloudflaredInstallHint, isTermux } from './runtime-utils.mjs';

const port = process.env.PORT ?? '3000';
const cloudflaredInstalled = await commandExists('cloudflared');

if (!cloudflaredInstalled) {
  console.error(`[zaragram] cloudflared bulunamadı. ${getCloudflaredInstallHint()}`);
  process.exit(1);
}

console.log(`[zaragram] platform=${process.platform} termux=${isTermux() ? 'yes' : 'no'} port=${port}`);
console.log('[zaragram] Next.js 0.0.0.0 üzerinde başlatılıyor ve ardından cloudflared tüneli açılıyor.');

const web = spawn(process.execPath, ['scripts/dev-host.mjs'], {
  stdio: 'inherit',
  shell: false,
  env: process.env
});

const tunnel = spawn(process.execPath, ['scripts/cloudflared-tunnel.mjs'], {
  stdio: 'inherit',
  shell: false,
  env: process.env
});

const shutdown = (signal) => {
  web.kill(signal);
  tunnel.kill(signal);
};

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));

web.on('exit', (code) => {
  tunnel.kill('SIGTERM');
  process.exit(code ?? 0);
});

tunnel.on('exit', (code) => {
  web.kill('SIGTERM');
  process.exit(code ?? 0);
});
