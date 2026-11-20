import { totpCode, verifyTotp, generateTotpSecret } from './totp';

// RFC 6238 test secret: base32("12345678901234567890")
const secret = 'GEZDGNBVGY3TQOJQGEZDGNBVGY3TQOJQ';

describe('totp', () => {
  it('matches RFC 6238 vectors', () => {
    expect(totpCode(secret, 59_000)).toBe('287082');
    expect(totpCode(secret, 1_111_111_109_000)).toBe('081804');
  });

  it('accepts codes within one 30s step either way', () => {
    const now = 1_111_111_109_000;
    const code = totpCode(secret, now);
    expect(verifyTotp(secret, code, now - 30_000)).toBe(true);
    expect(verifyTotp(secret, code, now + 30_000)).toBe(true);
  });

  it('rejects malformed or wrong codes', () => {
    expect(verifyTotp(secret, '12ab56', 59_000)).toBe(false);
    expect(verifyTotp(secret, '000000', 59_000)).toBe(false);
  });

  it('generates a 32-char base32 secret', () => {
    expect(generateTotpSecret()).toMatch(/^[A-Z2-7]{32}$/);
  });
});
