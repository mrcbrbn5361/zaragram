import { spawn } from 'node:child_process';
import { commandExists, getCloudflaredInstallHint } from './runtime-utils.mjs';

const port = process.env.PORT ?? '3000';
const localUrl = process.env.TUNNEL_LOCAL_URL ?? `http://127.0.0.1:${port}`;
const tunnelHostname = process.env.TUNNEL_HOSTNAME;

if (!(await commandExists('cloudflared'))) {
  console.error(`[zaragram] cloudflared bulunamadı. ${getCloudflaredInstallHint()}`);
  process.exit(1);
}

const args = tunnelHostname ? ['tunnel', '--url', localUrl, '--hostname', tunnelHostname] : ['tunnel', '--url', localUrl];
const child = spawn('cloudflared', args, { stdio: 'inherit', shell: false, env: process.env });
child.on('exit', (code) => process.exit(code ?? 0));
