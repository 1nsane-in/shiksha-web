import { Injectable } from '@nestjs/common';
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

  constructor() {
    const apiKey = process.env.POSTHOG_KEY;
    const host = process.env.POSTHOG_HOST || 'https://us.i.posthog.com';
    this.enabled = !!(process.env.NODE_ENV === 'production' || process.env.POSTHOG_KEY);

    if (this.enabled && apiKey) {
      this.posthog = new PostHog(apiKey, { host });
    }
  }

  async track(data: AnalyticsEvent): Promise<void> {
    if (!this.posthog || !this.enabled) {
      return;
    }

    this.posthog.capture({
      distinctId: data.distinctId,
      event: data.event,
      properties: data.properties,
    });
  }

  async identify(distinctId: string, properties?: Record<string, any>): Promise<void> {
    if (!this.posthog || !this.enabled) {
      return;
    }

    this.posthog.identify({
      distinctId,
      properties,
    });
  }

  async alias(distinctId: string, alias: string): Promise<void> {
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
