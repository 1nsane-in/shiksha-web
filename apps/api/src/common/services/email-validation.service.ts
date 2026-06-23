import { Injectable, BadRequestException, Logger } from '@nestjs/common';
import { promises as dns } from 'dns';
import disposableEmailDomains from 'disposable-email-domains';

const disposableSet = new Set(
  Array.isArray(disposableEmailDomains)
    ? disposableEmailDomains.map((d: string) => d.toLowerCase())
    : [],
);

const MX_CACHE_TTL = 60 * 60 * 1000;

@Injectable()
export class EmailValidationService {
  private readonly logger = new Logger(EmailValidationService.name);
  private mxCache = new Map<string, { valid: boolean; expiresAt: number }>();

  validateEmail(email: string): void {
    const domain = this.extractDomain(email);
    if (!domain) {
      throw new BadRequestException('Invalid email address');
    }

    if (this.isDisposableDomain(domain)) {
      throw new BadRequestException(
        'Business emails only. Please use a valid email address.',
      );
    }
  }

  async validateEmailAsync(email: string): Promise<void> {
    const domain = this.extractDomain(email);
    if (!domain) {
      throw new BadRequestException('Invalid email address');
    }

    if (this.isDisposableDomain(domain)) {
      throw new BadRequestException(
        'Business emails only. Please use a valid email address.',
      );
    }

    const hasMx = await this.hasValidMxRecord(domain);
    if (!hasMx) {
      throw new BadRequestException(
        'Business emails only. Please use a valid email address.',
      );
    }
  }

  private extractDomain(email: string): string | null {
    const parts = email.trim().toLowerCase().split('@');
    if (parts.length !== 2 || !parts[1]) return null;
    return parts[1];
  }

  private isDisposableDomain(domain: string): boolean {
    return disposableSet.has(domain);
  }

  private async hasValidMxRecord(domain: string): Promise<boolean> {
    const cached = this.mxCache.get(domain);
    if (cached && cached.expiresAt > Date.now()) {
      return cached.valid;
    }

    try {
      const mxRecords = await dns.resolveMx(domain);
      const valid =
        mxRecords.length > 0 &&
        mxRecords.some((r) => r.exchange && r.priority > 0);
      this.mxCache.set(domain, { valid, expiresAt: Date.now() + MX_CACHE_TTL });
      return valid;
    } catch {
      this.mxCache.set(domain, {
        valid: false,
        expiresAt: Date.now() + MX_CACHE_TTL,
      });
      return false;
    }
  }
}
