import {
  ANALYTICS_CONSENT_STORAGE_KEY,
  type AnalyticsConsentStatus,
  isAnalyticsConsentStatus,
} from '@/utils/analytics-env';

function readStoredConsent(): AnalyticsConsentStatus {
  if (!import.meta.client) {
    return 'pending';
  }

  try {
    const stored = window.localStorage.getItem(ANALYTICS_CONSENT_STORAGE_KEY);
    if (isAnalyticsConsentStatus(stored)) {
      return stored;
    }
  } catch {
    // Ignore storage failures (private mode, blocked storage, etc.)
  }

  return 'pending';
}

function writeStoredConsent(status: Exclude<AnalyticsConsentStatus, 'pending'>) {
  if (!import.meta.client) {
    return;
  }

  try {
    window.localStorage.setItem(ANALYTICS_CONSENT_STORAGE_KEY, status);
  } catch {
    // Ignore storage failures; PostHog persistence remains a fallback when available.
  }
}

/**
 * Consent gate for PostHog. Capturing stays off until the visitor accepts.
 * Choice is mirrored in localStorage so the banner stays dismissed on later visits.
 */
export function useAnalyticsConsent() {
  const runtimeConfig = useRuntimeConfig();
  const analyticsEnabled = computed(() => Boolean(runtimeConfig.public.analytics?.enabled));

  const status = useState<AnalyticsConsentStatus>('analytics-consent-status', () => 'pending');
  const hydrated = useState<boolean>('analytics-consent-hydrated', () => false);

  const syncFromPostHog = () => {
    if (!import.meta.client || !analyticsEnabled.value) {
      return;
    }

    const posthog = usePostHog();
    const phStatus = posthog?.get_explicit_consent_status?.();
    if (phStatus === 'granted' || phStatus === 'denied') {
      status.value = phStatus;
      writeStoredConsent(phStatus);
      return;
    }

    const stored = readStoredConsent();
    if (stored !== 'pending') {
      status.value = stored;
      if (stored === 'granted') {
        posthog?.opt_in_capturing?.();
      } else {
        posthog?.opt_out_capturing?.();
      }
    }
  };

  const hydrate = () => {
    if (!import.meta.client || hydrated.value) {
      return;
    }

    const stored = readStoredConsent();
    if (stored !== 'pending') {
      status.value = stored;
    }

    syncFromPostHog();
    hydrated.value = true;
  };

  const accept = () => {
    if (!import.meta.client) {
      return;
    }

    status.value = 'granted';
    writeStoredConsent('granted');

    const posthog = usePostHog();
    const environment = runtimeConfig.public.analytics?.environment ?? 'development';
    posthog?.register?.({
      environment,
      deploy_environment: environment,
    });
    posthog?.opt_in_capturing?.({
      captureEventName: 'analytics_consent_updated',
      captureProperties: {
        consent: 'granted',
        environment,
      },
    });
  };

  const decline = () => {
    if (!import.meta.client) {
      return;
    }

    status.value = 'denied';
    writeStoredConsent('denied');
    // Intentionally no capture — declined visitors must not send events.
    usePostHog()?.opt_out_capturing?.();
  };

  const showBanner = computed(() => {
    return analyticsEnabled.value && hydrated.value && status.value === 'pending';
  });

  const hasConsent = computed(() => status.value === 'granted');

  return {
    analyticsEnabled,
    status,
    hydrated,
    showBanner,
    hasConsent,
    hydrate,
    accept,
    decline,
    syncFromPostHog,
  };
}
