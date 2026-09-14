export type DeployEnvironment = 'production' | 'preview' | 'development';

export type AnalyticsConsentStatus = 'granted' | 'denied' | 'pending';

export const ANALYTICS_CONSENT_STORAGE_KEY = 'jc-analytics-consent';

/**
 * Resolve the deploy environment for PostHog tagging.
 * Prefer Vercel’s `VERCEL_ENV`, then an explicit override, else development.
 */
export function resolveDeployEnvironment(
  env: Record<string, string | undefined> = process.env,
): DeployEnvironment {
  const vercelEnv = env.VERCEL_ENV;
  if (vercelEnv === 'production' || vercelEnv === 'preview') {
    return vercelEnv;
  }

  const explicit = env.NUXT_PUBLIC_DEPLOY_ENV ?? env.DEPLOY_ENV;
  if (explicit === 'production' || explicit === 'preview' || explicit === 'development') {
    return explicit;
  }

  return 'development';
}

/**
 * Pick the PostHog project token for the current environment.
 * Preview can use a dedicated key; otherwise it falls back to the production key
 * and relies on the `environment` super property for filtering.
 * Local/dev stays off unless `POSTHOG_ENABLE_DEV=true`.
 */
export function resolvePostHogPublicKey(
  environment: DeployEnvironment,
  env: Record<string, string | undefined> = process.env,
): string {
  const productionKey = (env.POSTHOG_PUBLIC_KEY ?? env.NUXT_PUBLIC_POSTHOG_KEY ?? '').trim();
  const previewKey = (env.POSTHOG_PUBLIC_KEY_PREVIEW ?? '').trim();
  const developmentKey = (env.POSTHOG_PUBLIC_KEY_DEV ?? '').trim();

  if (environment === 'production') {
    return productionKey;
  }

  if (environment === 'preview') {
    return previewKey || productionKey;
  }

  if (env.POSTHOG_ENABLE_DEV === 'true') {
    return developmentKey || previewKey || productionKey;
  }

  return '';
}

export function isAnalyticsConsentStatus(value: unknown): value is AnalyticsConsentStatus {
  return value === 'granted' || value === 'denied' || value === 'pending';
}
