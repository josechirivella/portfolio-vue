import { defineNuxtPlugin } from '#app';
import posthog from 'posthog-js';

const runtimeConfig = useRuntimeConfig();

export default defineNuxtPlugin(() => {
  const posthogClient = posthog.init(runtimeConfig.public.posthogPublicKey, {
    api_host: runtimeConfig.public.posthogHost || 'https://app.posthog.com',
    capture_pageview: false, // we add manual pageview capturing below
    loaded: (posthog) => {
      // posthog.debug();
      posthog.opt_out_capturing();
      posthog.set_config({ disable_session_recording: true });
    },
  });

  // Make sure that pageviews are captured with each route change
  const router = useRouter();
  router.afterEach((to, from) => {
    nextTick(() => {
      if (from.fullPath !== to.fullPath) {
        posthog.capture('$pageleave', {
          current_url: from.fullPath,
        });
      }

      posthog.capture('$pageview', {
        current_url: to.fullPath,
      });
    });
  });

  return {
    provide: {
      posthog: () => posthogClient,
    },
  };
});
