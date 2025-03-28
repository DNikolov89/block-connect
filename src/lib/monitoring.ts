import * as Sentry from '@sentry/react';
import { BrowserTracing } from '@sentry/tracing';
import posthog from 'posthog-js';

// Initialize Sentry
export const initSentry = () => {
  if (import.meta.env.VITE_SENTRY_DSN) {
    Sentry.init({
      dsn: import.meta.env.VITE_SENTRY_DSN,
      integrations: [
        new BrowserTracing({
          tracePropagationTargets: ['localhost', /^https:\/\/yourdomain\.com/],
        }),
      ],
      // Performance Monitoring
      tracesSampleRate: 1.0, // Capture 100% of transactions in development
      // Set to a lower value in production
      environment: import.meta.env.MODE,
    });
  }
};

// Initialize PostHog
export const initPostHog = () => {
  if (import.meta.env.VITE_POSTHOG_KEY) {
    posthog.init(import.meta.env.VITE_POSTHOG_KEY, {
      api_host: import.meta.env.VITE_POSTHOG_HOST || 'https://app.posthog.com',
      loaded: (posthog) => {
        if (import.meta.env.MODE === 'development') posthog.opt_out_capturing();
      },
    });
  }
};

// Error tracking with Sentry
export const captureError = (error: Error, context?: Record<string, any>) => {
  Sentry.captureException(error, { extra: context });
};

// Analytics tracking with PostHog
export const trackEvent = (eventName: string, properties?: Record<string, any>) => {
  posthog.capture(eventName, properties);
};

// User identification
export const identifyUser = (userId: string, traits?: Record<string, any>) => {
  posthog.identify(userId, traits);
  Sentry.setUser({ id: userId, ...traits });
};

// Reset user identification
export const resetUser = () => {
  posthog.reset();
  Sentry.setUser(null);
}; 