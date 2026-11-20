import { BadRequestException } from '@nestjs/common';
import { assertFileAllowed, SAFE_UPLOAD_MIMES } from './file-type';

function file(buffer: Buffer, mimetype = 'application/octet-stream') {
  return { buffer, size: buffer.length, mimetype } as Express.Multer.File;
}

const png = Buffer.from([
  0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0x00, 0x00,
]);
const jpeg = Buffer.from([0xff, 0xd8, 0xff, 0xe0, 0x00]);
const svg = Buffer.from('<?xml version="1.0"?><svg onload="alert(1)"/>');

describe('assertFileAllowed', () => {
  it('detects real PNG content and fixes the mimetype', () => {
    const upload = file(png, 'text/plain');
    expect(assertFileAllowed(upload, 1024, SAFE_UPLOAD_MIMES)).toBe('image/png');
    expect(upload.mimetype).toBe('image/png');
  });

  it('rejects SVG payloads disguised as images', () => {
    expect(() => assertFileAllowed(file(svg, 'image/png'), 1024)).toThrow(
      BadRequestException,
    );
  });

  it('rejects content whose real type is not in the allowlist', () => {
    expect(() =>
      assertFileAllowed(file(png, 'image/png'), 1024, ['application/pdf']),
    ).toThrow(/Unsupported/);
  });

  it('enforces the size cap', () => {
    expect(() => assertFileAllowed(file(jpeg, 'image/jpeg'), 2)).toThrow(
      /too large/i,
    );
  });
});
