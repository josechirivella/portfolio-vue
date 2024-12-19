import { defineNuxtPlugin } from '#app';
import posthog from 'posthog-js';

const production = import.meta.env.NODE_ENV === 'production';

export default defineNuxtPlugin(() => {
  const runtimeConfig = useRuntimeConfig();
  const posthogClient = posthog.init(runtimeConfig.public.posthogPublicKey, {
    api_host: runtimeConfig.public.posthogHost || 'https://app.posthog.com',
    capture_pageview: false, // we add manual pageview capturing below
    loaded: (posthog) => {
      if (!production) {
        // posthog.debug();
        posthog.opt_out_capturing();
        posthog.set_config({disable_session_recording: true})
      }
    },
  });

  // Make sure that pageviews are captured with each route change
  const router = useRouter();
  router.afterEach((to) => {
    nextTick(() => {
      if (!production) return;
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
