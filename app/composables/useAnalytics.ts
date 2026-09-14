/**
 * Safe analytics helpers. Events only fire after explicit consent.
 */
export function useAnalytics() {
  const { hasConsent, analyticsEnabled } = useAnalyticsConsent();
  const runtimeConfig = useRuntimeConfig();

  const environment = computed(() => runtimeConfig.public.analytics?.environment ?? 'development');

  const capture = (event: string, properties: Record<string, unknown> = {}) => {
    if (!import.meta.client || !analyticsEnabled.value || !hasConsent.value) {
      return;
    }

    const posthog = usePostHog();
    posthog?.capture?.(event, {
      environment: environment.value,
      ...properties,
    });
  };

  const trackExternalLink = (destination: string, context: string) => {
    capture('external_link_clicked', {
      destination,
      context,
    });
  };

  const trackBlogPostView = (payload: { path: string; title?: string }) => {
    capture('blog_post_viewed', {
      path: payload.path,
      title: payload.title,
    });
  };

  return {
    capture,
    trackExternalLink,
    trackBlogPostView,
    environment,
    hasConsent,
    analyticsEnabled,
  };
}
