export default defineNuxtPlugin({
  name: 'analytics-consent',
  // Run after @posthog/nuxt's client plugin so usePostHog() is available.
  dependsOn: ['posthog-client'],
  setup() {
    if (!import.meta.client) {
      return;
    }

    const { analyticsEnabled, hydrate, hasConsent, status } = useAnalyticsConsent();
    const runtimeConfig = useRuntimeConfig();

    hydrate();

    if (!analyticsEnabled.value) {
      return;
    }

    const posthog = usePostHog();
    const environment = runtimeConfig.public.analytics?.environment ?? 'development';

    // Always stamp environment on the client instance for when capture is enabled.
    posthog?.register?.({
      environment,
      deploy_environment: environment,
    });

    // Re-apply a previously granted choice after soft navigations / reloads.
    if (status.value === 'granted' || hasConsent.value) {
      posthog?.opt_in_capturing?.();
    } else if (status.value === 'denied') {
      posthog?.opt_out_capturing?.();
    }
  },
});
