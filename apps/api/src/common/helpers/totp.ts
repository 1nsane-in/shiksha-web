import * as crypto from 'crypto';

const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';

export function generateTotpSecret(bytes = 20): string {
  const buffer = crypto.randomBytes(bytes);
  let bits = 0;
  let value = 0;
  let output = '';
  for (const byte of buffer) {
    value = (value << 8) | byte;
    bits += 8;
    while (bits >= 5) {
      output += ALPHABET[(value >>> (bits - 5)) & 31];
      bits -= 5;
    }
  }
  if (bits > 0) output += ALPHABET[(value << (5 - bits)) & 31];
  return output;
}

function decodeBase32(secret: string): Buffer {
  const clean = secret.toUpperCase().replace(/\s|=+$/g, '');
  let bits = 0;
  let value = 0;
  const bytes: number[] = [];
  for (const char of clean) {
    const index = ALPHABET.indexOf(char);
    if (index < 0) throw new Error('Invalid TOTP secret');
    value = (value << 5) | index;
    bits += 5;
    if (bits >= 8) {
      bytes.push((value >>> (bits - 8)) & 0xff);
      bits -= 8;
    }
  }
  return Buffer.from(bytes);
}

export function totpCode(secret: string, timestamp = Date.now()): string {
  const counter = Math.floor(timestamp / 30_000);
  const buffer = Buffer.alloc(8);
  buffer.writeBigUInt64BE(BigInt(counter));
  const digest = crypto
    .createHmac('sha1', decodeBase32(secret))
    .update(buffer)
    .digest();
  const offset = digest[digest.length - 1]! & 0x0f;
  const code = (digest.readUInt32BE(offset) & 0x7fffffff) % 1_000_000;
  return code.toString().padStart(6, '0');
}

export function verifyTotp(
  secret: string,
  code: string,
  timestamp = Date.now(),
): boolean {
  if (!/^\d{6}$/.test(code)) return false;
  const candidate = Buffer.from(code);
  return [-30_000, 0, 30_000].some((delta) =>
    crypto.timingSafeEqual(Buffer.from(totpCode(secret, timestamp + delta)), candidate),
  );
}

export function otpauthUrl(secret: string, email: string, issuer = 'Shiksha') {
  const label = encodeURIComponent(`${issuer}:${email}`);
  return `otpauth://totp/${label}?secret=${secret}&issuer=${encodeURIComponent(issuer)}&algorithm=SHA1&digits=6&period=30`;
}
