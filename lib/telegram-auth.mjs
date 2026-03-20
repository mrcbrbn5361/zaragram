import crypto from 'node:crypto';

export function verifyTelegramLogin(payload, botToken) {
  const { hash, ...data } = payload ?? {};
  if (!hash || !botToken) {
    return false;
  }

  const secretKey = crypto.createHash('sha256').update(botToken).digest();
  const dataCheckString = Object.entries(data)
    .filter(([, value]) => value !== undefined && value !== '')
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, value]) => `${key}=${value}`)
    .join('\n');

  const digest = crypto.createHmac('sha256', secretKey).update(dataCheckString).digest('hex');
  return digest === hash;
}
