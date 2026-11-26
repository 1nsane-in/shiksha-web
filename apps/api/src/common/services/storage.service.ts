import { Injectable, BadRequestException, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  HeadObjectCommand,
  DeleteObjectCommand,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { randomUUID } from 'crypto';
import { assertFileAllowed } from '../helpers/file-type';

/** Folders whose objects are intentionally public site assets. */
const PUBLIC_FOLDERS = new Set([
  'gallery',
  'gallery-images',
  'video-tours',
  'logos',
  'banners',
  'brochures',
  'avatars',
]);

/** Every other folder is private: stored as a key, served via signed URL. */
const PRIVATE_PREFIXES = [
  'documents/',
  'admission-letters/',
  'invitation-letters/',
  'uploads/',
];

const SIGNED_URL_TTL = 60 * 60;

/**
 * Two-bucket layout:
 *  - public bucket (`R2_PUBLIC_BUCKET_NAME`) for marketing assets only
 *  - private bucket (`R2_BUCKET_NAME`) for documents/letters/IDs, never public
 * When no public bucket is configured both live in one bucket; set
 * R2_PUBLIC_BUCKET_NAME in production so private files cannot be served via a
 * public domain even if someone guesses the key.
 */
@Injectable()
export class StorageService {
  private readonly logger = new Logger(StorageService.name);
  private readonly s3: S3Client;
  private readonly bucket: string;
  private readonly publicBucket: string;
  private readonly publicUrl: string;

  constructor(private config: ConfigService) {
    this.bucket = this.config.get<string>('R2_BUCKET_NAME') || 'documents';
    this.publicBucket = this.config.get<string>('R2_PUBLIC_BUCKET_NAME') || '';
    this.publicUrl = this.config.get<string>('R2_PUBLIC_URL') || '';

    if (this.publicUrl && !this.publicBucket) {
      this.logger.warn(
        'R2_PUBLIC_URL is set without R2_PUBLIC_BUCKET_NAME: private documents share the public bucket. Configure a separate public bucket.',
      );
    }

    this.s3 = new S3Client({
      region: 'auto',
      endpoint: this.config.get<string>('R2_ENDPOINT') || '',
      credentials: {
        accessKeyId: this.config.get<string>('R2_ACCESS_KEY_ID') || '',
        secretAccessKey: this.config.get<string>('R2_SECRET_ACCESS_KEY') || '',
      },
    });
  }

  /**
   * Stores a file under a random, owner-scoped key so keys cannot be guessed
   * and uploads never overwrite each other. Private folders return a short
   * lived signed URL; public folders return the public URL.
   */
  async upload(
    file: Express.Multer.File,
    folder = 'uploads',
    ownerId = 'shared',
  ): Promise<{
    url: string;
    key: string;
    fileName: string;
    fileSize: number;
    mimeType: string;
    expiresIn?: number;
  }> {
    // per-purpose caps; video folders get more room, documents 15MB, rest 8MB
    const maxBytes =
      folder.startsWith('gallery') || folder === 'video-tours'
        ? 50 * 1024 * 1024
        : ['documents', 'admission-letters', 'invitation-letters'].includes(folder)
          ? 15 * 1024 * 1024
          : 8 * 1024 * 1024;
    assertFileAllowed(file, maxBytes);

    const ext = (file.originalname.match(/\.[a-z0-9]{1,8}$/i)?.[0] || '').toLowerCase();
    const key = `${folder}/${ownerId}/${randomUUID()}${ext}`;

    await this.s3.send(
      new PutObjectCommand({
        Bucket: this.bucketFor(key),
        Key: key,
        Body: file.buffer,
        ContentType: file.mimetype,
      }),
    );

    const isPublic = PUBLIC_FOLDERS.has(folder) && !!this.publicUrl;
    return {
      url: isPublic ? `${this.publicUrl}/${key}` : await this.getSignedUrl(key),
      key,
      fileName: file.originalname,
      fileSize: file.size,
      mimeType: file.mimetype,
      ...(isPublic ? {} : { expiresIn: SIGNED_URL_TTL }),
    };
  }

  /** Bucket that owns a key: public assets go to the public bucket. */
  private bucketFor(key: string): string {
    const topFolder = key.split('/')[0] ?? '';
    return PUBLIC_FOLDERS.has(topFolder) && this.publicBucket
      ? this.publicBucket
      : this.bucket;
  }

  /** True when the stored value is a bucket key in a private folder. */
  isPrivateKey(value: string): boolean {
    return (
      !!value &&
      !/^https?:\/\//i.test(value) &&
      PRIVATE_PREFIXES.some((p) => value.startsWith(p))
    );
  }

  /** Resolves a stored value (key or legacy URL) to a viewable URL. */
  async viewUrl(stored: string | null | undefined): Promise<string | null> {
    if (!stored) return null;
    if (!this.isPrivateKey(stored)) return stored;
    return this.getSignedUrl(stored);
  }

  /**
   * Recursively replaces private bucket keys with signed URLs. Legacy public
   * URLs pass through unchanged, so old rows keep working.
   */
  async signDeep<T>(value: T): Promise<T> {
    if (typeof value === 'string') {
      return (this.isPrivateKey(value)
        ? await this.viewUrl(value)
        : value) as unknown as T;
    }
    if (Array.isArray(value)) {
      return (await Promise.all(value.map((v) => this.signDeep(v)))) as unknown as T;
    }
    if (value && typeof value === 'object' && !(value instanceof Date)) {
      const entries = await Promise.all(
        Object.entries(value as Record<string, unknown>).map(
          async ([k, v]) => [k, await this.signDeep(v)] as const,
        ),
      );
      return Object.fromEntries(entries) as unknown as T;
    }
    return value;
  }

  /** Throws unless `key` exists in the bucket. */
  async assertExists(key: string): Promise<void> {
    try {
      await this.s3.send(
        new HeadObjectCommand({ Bucket: this.bucketFor(key), Key: key }),
      );
    } catch {
      throw new BadRequestException('Uploaded file not found');
    }
  }

  async getSignedUrl(key: string, expiresIn = SIGNED_URL_TTL): Promise<string> {
    const command = new GetObjectCommand({
      Bucket: this.bucketFor(key),
      Key: key,
    });
    return getSignedUrl(this.s3, command, { expiresIn });
  }

  async delete(key: string): Promise<void> {
    await this.s3.send(
      new DeleteObjectCommand({
        Bucket: this.bucketFor(key),
        Key: key,
      }),
    );
  }

  async deleteFromUrl(url: string): Promise<void> {
    if (!url) return;
    // If publicUrl is configured, URLs are `${publicUrl}/${key}`
    if (this.publicUrl) {
      const prefix = this.publicUrl.endsWith('/')
        ? this.publicUrl
        : `${this.publicUrl}/`;
      if (url.startsWith(prefix)) {
        const key = url.slice(prefix.length);
        await this.delete(key);
      }
    }
    // For signed URLs, extraction is unreliable — skip
  }
}
