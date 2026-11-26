import { ConfigService } from '@nestjs/config';
import { StorageService } from './storage.service';

jest.mock('@aws-sdk/s3-request-presigner', () => ({
  getSignedUrl: jest.fn(async () => 'https://signed.example/key'),
}));

function makeService(env: Record<string, string>) {
  const config = {
    get: (k: string) => env[k],
  } as unknown as ConfigService;
  const service = new StorageService(config);
  // never hit the network
  (service as unknown as { s3: { send: jest.Mock } }).s3.send = jest
    .fn()
    .mockResolvedValue({});
  return service;
}

const file = (name: string): Express.Multer.File =>
  ({
    originalname: name,
    mimetype: 'application/pdf',
    size: 1024,
    buffer: Buffer.from('%PDF-1.4 test'),
  }) as Express.Multer.File;

describe('StorageService keys and visibility', () => {
  it('same filename twice ⇒ two distinct owner-scoped keys, no original name', async () => {
    const service = makeService({ R2_BUCKET_NAME: 'private' });
    const a = await service.upload(file('passport.pdf'), 'documents', 'user-1');
    const b = await service.upload(file('passport.pdf'), 'documents', 'user-1');

    expect(a.key).not.toBe(b.key);
    expect(a.key).toMatch(
      /^documents\/user-1\/[0-9a-f-]{36}\.pdf$/,
    );
    expect(a.key).not.toContain('passport');
    expect(a.url).toBe('https://signed.example/key');
  });

  it('public folders use the public URL; private never does', async () => {
    const service = makeService({
      R2_BUCKET_NAME: 'private',
      R2_PUBLIC_BUCKET_NAME: 'public',
      R2_PUBLIC_URL: 'https://cdn.example',
    });

    const logo = await service.upload(file('logo.png'), 'logos', 'admin-1');
    const doc = await service.upload(file('aadhaar.pdf'), 'documents', 'u1');

    expect(logo.url).toBe(`https://cdn.example/${logo.key}`);
    expect(doc.url).toBe('https://signed.example/key');
    expect(service.isPrivateKey(doc.key)).toBe(true);
    expect(service.isPrivateKey(logo.key)).toBe(false);
    expect(service.isPrivateKey('https://cdn.example/logos/x.png')).toBe(false);
  });
});
