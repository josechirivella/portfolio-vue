import { describe, expect, test } from 'vitest';

import {
  ANALYTICS_CONSENT_STORAGE_KEY,
  isAnalyticsConsentStatus,
  resolveDeployEnvironment,
  resolvePostHogPublicKey,
} from '../../app/utils/analytics-env';

describe('analytics-env', () => {
  test('resolveDeployEnvironment prefers VERCEL_ENV', () => {
    expect(resolveDeployEnvironment({ VERCEL_ENV: 'preview' })).toBe('preview');
    expect(resolveDeployEnvironment({ VERCEL_ENV: 'production' })).toBe('production');
  });

  test('resolveDeployEnvironment falls back to explicit override then development', () => {
    expect(resolveDeployEnvironment({ NUXT_PUBLIC_DEPLOY_ENV: 'preview' })).toBe('preview');
    expect(resolveDeployEnvironment({})).toBe('development');
  });

  test('resolvePostHogPublicKey uses preview key when set', () => {
    expect(
      resolvePostHogPublicKey('preview', {
        POSTHOG_PUBLIC_KEY: 'phc_prod',
        POSTHOG_PUBLIC_KEY_PREVIEW: 'phc_preview',
      }),
    ).toBe('phc_preview');
  });

  test('resolvePostHogPublicKey falls back to production key on preview', () => {
    expect(
      resolvePostHogPublicKey('preview', {
        POSTHOG_PUBLIC_KEY: 'phc_prod',
      }),
    ).toBe('phc_prod');
  });

  test('resolvePostHogPublicKey disables development unless explicitly enabled', () => {
    expect(
      resolvePostHogPublicKey('development', {
        POSTHOG_PUBLIC_KEY: 'phc_prod',
      }),
    ).toBe('');

    expect(
      resolvePostHogPublicKey('development', {
        POSTHOG_PUBLIC_KEY: 'phc_prod',
        POSTHOG_ENABLE_DEV: 'true',
      }),
    ).toBe('phc_prod');
  });

  test('consent status helpers', () => {
    expect(isAnalyticsConsentStatus('granted')).toBe(true);
    expect(isAnalyticsConsentStatus('denied')).toBe(true);
    expect(isAnalyticsConsentStatus('pending')).toBe(true);
    expect(isAnalyticsConsentStatus('maybe')).toBe(false);
    expect(ANALYTICS_CONSENT_STORAGE_KEY).toBe('jc-analytics-consent');
  });
});
