import { defineNuxtPlugin } from '#app';
import posthog from 'posthog-js';

//eslint-disable-next-line
export default defineNuxtPlugin((nuxtApp) => {
  const runtimeConfig = useRuntimeConfig();
  // const production = !!runtimeConfig.public.production;
  const posthogClient = posthog.init(runtimeConfig.public.posthogPublicKey, {
    api_host: runtimeConfig.public.posthogHost || 'https://us.i.posthog.com',
    capture_pageview: false, // we add manual pageview capturing below
    loaded: (posthog) => {
      posthog.debug();
      // if (!runtimeConfig.public.production) {
      //   posthog.opt_out_capturing();
      //   posthog.set_config({ disable_session_recording: true });
      // }
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
