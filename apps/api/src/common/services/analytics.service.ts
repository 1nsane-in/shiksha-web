import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PostHog } from 'posthog-node';

export interface AnalyticsEvent {
  distinctId: string;
  event: string;
  properties?: Record<string, any>;
}

@Injectable()
export class AnalyticsService {
  private posthog: PostHog | null = null;
  private enabled: boolean;

  constructor(config: ConfigService) {
    const apiKey = config.get<string>('POSTHOG_KEY');
    const host = config.get<string>('POSTHOG_HOST', 'https://us.i.posthog.com');
    const nodeEnv = config.get<string>('NODE_ENV');
    this.enabled = !!(nodeEnv === 'production' || apiKey);

    if (this.enabled && apiKey) {
      this.posthog = new PostHog(apiKey, { host });
    }
  }

  track(data: AnalyticsEvent): void {
    if (!this.posthog || !this.enabled) {
      return;
    }

    this.posthog.capture({
      distinctId: data.distinctId,
      event: data.event,
      properties: data.properties,
    });
  }

  identify(distinctId: string, properties?: Record<string, any>): void {
    if (!this.posthog || !this.enabled) {
      return;
    }

    this.posthog.identify({
      distinctId,
      properties,
    });
  }

  alias(distinctId: string, alias: string): void {
    if (!this.posthog || !this.enabled) {
      return;
    }

    this.posthog.alias({
      distinctId,
      alias,
    });
  }

  async shutdown(): Promise<void> {
    if (this.posthog) {
      await this.posthog.shutdown();
    }
  }
}
