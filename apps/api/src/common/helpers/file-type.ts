import { BadRequestException } from '@nestjs/common';

export const SAFE_UPLOAD_MIMES = [
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
  'video/mp4',
  'video/webm',
  'video/x-msvideo',
  'video/quicktime',
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
] as const;

const ascii = (buffer: Buffer, offset: number, value: string) =>
  buffer.subarray(offset, offset + value.length).toString('latin1') === value;

const hex = (buffer: Buffer, offset: number, bytes: number[]) =>
  bytes.every((byte, index) => buffer[offset + index] === byte);

const SIGNATURES: { mime: string; matches: (buffer: Buffer) => boolean }[] = [
  { mime: 'image/jpeg', matches: (b) => hex(b, 0, [0xff, 0xd8, 0xff]) },
  {
    mime: 'image/png',
    matches: (b) => hex(b, 0, [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
  },
  {
    mime: 'image/gif',
    matches: (b) => ascii(b, 0, 'GIF87a') || ascii(b, 0, 'GIF89a'),
  },
  {
    mime: 'image/webp',
    matches: (b) => ascii(b, 0, 'RIFF') && ascii(b, 8, 'WEBP'),
  },
  {
    mime: 'video/x-msvideo',
    matches: (b) => ascii(b, 0, 'RIFF') && ascii(b, 8, 'AVI '),
  },
  { mime: 'video/mp4', matches: (b) => ascii(b, 4, 'ftyp') },
  {
    mime: 'video/webm',
    matches: (b) => hex(b, 0, [0x1a, 0x45, 0xdf, 0xa3]),
  },
  { mime: 'application/pdf', matches: (b) => ascii(b, 0, '%PDF-') },
  {
    mime: 'application/msword',
    matches: (b) => hex(b, 0, [0xd0, 0xcf, 0x11, 0xe0, 0xa1, 0xb1, 0x1a, 0xe1]),
  },
  {
    mime: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    matches: (b) => hex(b, 0, [0x50, 0x4b, 0x03, 0x04]),
  },
];

/**
 * Trusts file content, not the client-declared mimetype. Mutates file.mimetype
 * to the detected value so storage writes the correct Content-Type.
 */
export function assertFileAllowed(
  file: Express.Multer.File,
  maxBytes: number,
  allowed: readonly string[] = SAFE_UPLOAD_MIMES,
): string {
  if (!file?.buffer) {
    throw new BadRequestException('File content unavailable');
  }
  if (file.size > maxBytes) {
    throw new BadRequestException(
      `File too large. Maximum ${Math.floor(maxBytes / 1024 / 1024)}MB`,
    );
  }

  const detected = SIGNATURES.find((rule) => rule.matches(file.buffer));
  if (!detected || !allowed.includes(detected.mime)) {
    throw new BadRequestException('Unsupported or invalid file content');
  }
  file.mimetype = detected.mime;
  return detected.mime;
}
