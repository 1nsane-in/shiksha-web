import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';


@Injectable()
export class StorageService {
  private readonly s3: S3Client;
  private readonly bucket: string;
  private readonly publicUrl: string;

  constructor(private config: ConfigService) {
    this.bucket = this.config.get<string>('R2_BUCKET_NAME') || 'documents';
    this.publicUrl = this.config.get<string>('R2_PUBLIC_URL') || '';

    this.s3 = new S3Client({
      region: 'auto',
      endpoint: this.config.get<string>('R2_ENDPOINT') || '',
      credentials: {
        accessKeyId: this.config.get<string>('R2_ACCESS_KEY_ID') || '',
        secretAccessKey: this.config.get<string>('R2_SECRET_ACCESS_KEY') || '',
      },
    });
  }

  async upload(
    file: Express.Multer.File,
    folder = 'uploads',
  ): Promise<{
    url: string;
    key: string;
    fileName: string;
    fileSize: number;
    mimeType: string;
  }> {
    const sanitized = file.originalname.replace(/[/\\]/g, '-');
    const key = `${folder}/${sanitized}`;

    await this.s3.send(
      new PutObjectCommand({
        Bucket: this.bucket,
        Key: key,
        Body: file.buffer,
        ContentType: file.mimetype,
      }),
    );

    const url = this.publicUrl
      ? `${this.publicUrl}/${key}`
      : await this.getSignedUrl(key);

    return {
      url,
      key,
      fileName: file.originalname,
      fileSize: file.size,
      mimeType: file.mimetype,
    };
  }

  async getSignedUrl(key: string, expiresIn = 3600): Promise<string> {
    const command = new GetObjectCommand({
      Bucket: this.bucket,
      Key: key,
    });
    return getSignedUrl(this.s3, command, { expiresIn });
  }

  async delete(key: string): Promise<void> {
    await this.s3.send(
      new DeleteObjectCommand({
        Bucket: this.bucket,
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
