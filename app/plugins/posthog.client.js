import posthog from "posthog-js";
import { defineNuxtPlugin } from "#app";

//eslint-disable-next-line
export default defineNuxtPlugin((nuxtApp) => {
  const runtimeConfig = useRuntimeConfig();
  // const production = !!runtimeConfig.public.production;
  const posthogClient = posthog.init(runtimeConfig.public.posthogPublicKey, {
    api_host: runtimeConfig.public.posthogHost || "https://us.i.posthog.com",
    person_profiles: "identified_only", // or 'always' to create profiles for anonymous users as well
    capture_pageview: false, // we add manual pageview capturing below

    loaded: (posthog) => {
      if (import.meta.env.MODE === "development") posthog.debug();
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
        posthog.capture("$pageleave", {
          current_url: from.fullPath,
        });
      }

      posthog.capture("$pageview", {
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
