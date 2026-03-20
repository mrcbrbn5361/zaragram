import { access } from 'node:fs/promises';
import { constants } from 'node:fs';
import path from 'node:path';

export function isTermux() {
  return Boolean(process.env.TERMUX_VERSION || process.env.PREFIX?.includes('com.termux'));
}

export function getNpmCommand() {
  return process.platform === 'win32' ? 'npm.cmd' : 'npm';
}

export async function commandExists(command) {
  const pathEntries = (process.env.PATH ?? '').split(path.delimiter);
  const extensions = process.platform === 'win32' ? ['.exe', '.cmd', '.bat', ''] : [''];

  for (const entry of pathEntries) {
    for (const extension of extensions) {
      const fullPath = path.join(entry, `${command}${extension}`);
      try {
        await access(fullPath, constants.X_OK);
        return true;
      } catch {
        // continue searching
      }
    }
  }

  return false;
}

export function getCloudflaredInstallHint() {
  if (isTermux()) {
    return 'Termux: pkg update && pkg install cloudflared';
  }

  if (process.platform === 'win32') {
    return 'Windows: winget install Cloudflare.cloudflared';
  }

  if (process.platform === 'darwin') {
    return 'macOS: brew install cloudflared';
  }

  return 'Linux: install cloudflared from Cloudflare package repo or your distro package manager';
}
