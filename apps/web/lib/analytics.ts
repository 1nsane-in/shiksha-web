import { type QueryClient } from '@tanstack/react-query';
import {
  type NavigateOptions,
  type ToOptions,
  type ParsedLocation,
  type AnyRoute,
  type LinkProps,
} from '@tanstack/react-router';
import posthog from 'posthog-js';

export const initAnalytics = () => {
  if (typeof window !== 'undefined' && process.env.NODE_ENV === 'production') {
    posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY || '', {
      api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://us.i.posthog.com',
      loaded: (ph) => {
        if (process.env.NODE_ENV === 'development') {
          ph.opt_out_capturing();
        }
      },
    });
  }
};

export const identifyUser = (userId: string, properties?: Record<string, any>) => {
  if (typeof window !== 'undefined') {
    posthog.identify(userId, properties);
  }
};

export const trackEvent = (eventName: string, properties?: Record<string, any>) => {
  if (typeof window !== 'undefined') {
    posthog.capture(eventName, properties);
  }
};

export const trackPageView = (properties?: Record<string, any>) => {
  if (typeof window !== 'undefined') {
    posthog.capture('$pageview', properties);
  }
};

export const resetAnalytics = () => {
  if (typeof window !== 'undefined') {
    posthog.reset();
  }
};

export { posthog };

