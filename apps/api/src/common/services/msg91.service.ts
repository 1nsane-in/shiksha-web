import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

interface Msg91Response {
  type?: string;
  reqId?: string;
  message?: string;
}

@Injectable()
export class Msg91Service {
  private readonly logger = new Logger(Msg91Service.name);
  private readonly baseUrl = 'https://control.msg91.com/api/v5';
  private readonly authKey: string;
  private readonly templateId: string;

  constructor(private config: ConfigService) {
    this.authKey = this.config.get<string>('MSG91_AUTH_KEY', '');
    this.templateId = this.config.get<string>('MSG91_TEMPLATE_ID', '');
    if (!this.authKey) {
      this.logger.warn('MSG91_AUTH_KEY not configured — SMS will not work');
    }
    if (!this.templateId) {
      this.logger.warn('MSG91_TEMPLATE_ID not configured — SMS will not send');
    }
  }

  private formatPhone(phone: string): string {
    const digits = phone.replace(/\D/g, '');
    if (digits.length === 10) return `91${digits}`;
    if (digits.startsWith('91') && digits.length === 12) return digits;
    return digits;
  }

  async sendOtp(phone: string, otp?: string): Promise<{ reqId?: string }> {
    if (!this.templateId) {
      this.logger.error('MSG91_TEMPLATE_ID not configured');
      throw new BadRequestException('SMS OTP not configured properly');
    }
    let url = `${this.baseUrl}/otp?mobile=${this.formatPhone(phone)}&authkey=${this.authKey}&template_id=${this.templateId}`;
    if (otp) url += `&otp=${otp}`;
    const res = await fetch(url, { method: 'POST' });
    const data = await this.json<Msg91Response>(res);
    if (!res.ok) {
      this.logger.error(`MSG91 send OTP failed: ${JSON.stringify(data)}`);
      throw new BadRequestException('Failed to send SMS OTP');
    }
    return { reqId: data.reqId };
  }

  async verifyOtp(phone: string, otp: string): Promise<boolean> {
    if (this.config.get('NODE_ENV') === 'development') {
      return true;
    }
    const url = `${this.baseUrl}/otp/verify?mobile=${this.formatPhone(phone)}&otp=${otp}&authkey=${this.authKey}`;
    const res = await fetch(url);
    const data = await this.json<Msg91Response>(res);
    if (!res.ok || data.type === 'error') {
      return false;
    }
    return true;
  }

  async resendOtp(
    phone: string,
    retryType: 'text' | 'voice' = 'text',
  ): Promise<void> {
    const url = `${this.baseUrl}/otp/retry?authkey=${this.authKey}&retrytype=${retryType}&mobile=${this.formatPhone(phone)}`;
    const res = await fetch(url);
    const data = await this.json<Msg91Response>(res);
    if (!res.ok) {
      this.logger.error(`MSG91 resend OTP failed: ${JSON.stringify(data)}`);
      throw new BadRequestException('Failed to resend SMS OTP');
    }
  }

  private async json<T>(res: Response): Promise<T> {
    return res.json() as Promise<T>;
  }
}
