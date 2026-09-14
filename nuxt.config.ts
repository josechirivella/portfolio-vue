import { definePreset } from '@primeuix/styled';
import Aura from '@primeuix/themes/aura';
import { resolveDeployEnvironment, resolvePostHogPublicKey } from './app/utils/analytics-env';

const deployEnvironment = resolveDeployEnvironment();
const posthogPublicKey = resolvePostHogPublicKey(deployEnvironment);
const posthogHost = (process.env.POSTHOG_HOST ?? process.env.NUXT_PUBLIC_POSTHOG_HOST ?? 'https://us.i.posthog.com').trim();

const Noir = definePreset(Aura, {
  semantic: {
    primary: {
      50: '{zinc.50}',
      100: '{zinc.100}',
      200: '{zinc.200}',
      300: '{zinc.300}',
      400: '{zinc.400}',
      500: '{zinc.500}',
      600: '{zinc.600}',
      700: '{zinc.700}',
      800: '{zinc.800}',
      900: '{zinc.900}',
      950: '{zinc.950}',
    },
    colorScheme: {
      light: {
        primary: {
          color: '{zinc.950}',
          contrastColor: '#ffffff',
          hoverColor: '{zinc.900}',
          activeColor: '{zinc.800}',
        },
        highlight: {
          background: '{zinc.950}',
          focusBackground: '{zinc.700}',
          color: '#ffffff',
          focusColor: '#ffffff',
        },
      },
      dark: {
        primary: {
          color: '{zinc.50}',
          contrastColor: '{zinc.950}',
          hoverColor: '{zinc.100}',
          activeColor: '{zinc.200}',
        },
        highlight: {
          background: 'rgba(250, 250, 250, .16)',
          focusBackground: 'rgba(250, 250, 250, .24)',
          color: 'rgba(255,255,255,.87)',
          focusColor: 'rgba(255,255,255,.87)',
        },
      },
    },
  },
});

// @ts-ignore
export default defineNuxtConfig({
  srcDir: 'app',
  css: ['@/assets/main.scss'],

  experimental: {
    viewTransition: true,
  },

  vite: {
    optimizeDeps: {
      include: ['@vue/devtools-core', '@vue/devtools-kit'],
    },
  },

  devtools: { enabled: true },
  ssr: true,

  runtimeConfig: {
    public: {
      analytics: {
        environment: deployEnvironment,
        enabled: Boolean(posthogPublicKey),
        host: posthogHost,
      },
    },
  },

  sitemap: {
    zeroRuntime: true,
  },

  site: {
    url: 'https://www.jchirivella.com',
    name: 'Jose Chirivella | Software Engineer',
  },

  app: {
    head: {
      htmlAttrs: {
        lang: 'en',
      },
      title: 'Jose Chirivella | Software Engineer',
      meta: [
        { charset: 'utf-8' },
        {
          name: 'description',
          content: 'The portfolio website for Jose Chirivella. Software Engineer who writes and codes.',
        },
        { name: 'og:title', content: 'Jose Chirivella | Software Engineer' },
        {
          name: 'og:description',
          content: 'The portfolio website for Jose Chirivella. Software Engineer who writes and codes.',
        },
        {
          name: 'og:image',
          content: '/jchirivella-portrait-flq-resized-700px.png',
        },
        { name: 'og:type', content: 'website' },
        { name: 'og:url', content: 'https://jchirivella.com' },
        {
          name: 'og:site_name',
          content: 'Jose Chirivella | Software Engineer',
        },
        { name: 'og:locale', content: 'en_US' },
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:site', content: '@chiri14' },
        { name: 'twitter:creator', content: '@chiri14' },
        {
          name: 'twitter:title',
          content: 'Jose Chirivella',
        },
        {
          name: 'twitter:description',
          content: 'The portfolio website for Jose Chirivella. Software Engineer who writes and codes.',
        },
        {
          name: 'twitter:image',
          content: '/jchirivella-portrait-flq-resized-700px.png',
        },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'format-detection', content: 'telephone=no' },
        { name: 'author', content: 'Jose Chirivella' },
        { name: 'robots', content: 'index, follow' },
      ],
      link: [
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Rubik:ital,wght@0,300..900;1,300..900&display=swap',
        },
        {
          rel: 'apple-touch-icon',
          sizes: '180x180',
          href: '/apple-touch-icon.png',
        },
        {
          rel: 'icon',
          type: 'image/png',
          sizes: '32x32',
          href: '/favicon-32x32.png',
        },
        {
          rel: 'icon',
          type: 'image/png',
          sizes: '16x16',
          href: '/favicon-16x16.png',
        },
        {
          rel: 'manifest',
          href: '/site.webmanifest',
        },
      ],
    },
  },

  modules: [
    '@posthog/nuxt',
    '@nuxtjs/stylelint-module',
    '@nuxt/test-utils/module',
    '@nuxtjs/tailwindcss',
    '@nuxtjs/sitemap',
    '@nuxt/content',
    '@primevue/nuxt-module',
    '@nuxt/icon',
    '@nuxt/image',
    '@vercel/speed-insights',
  ],

  nitro: {
    preset: process.env.NITRO_PRESET,
    prerender: {
      routes: ['/', '/sitemap.xml'],
      crawlLinks: true,
    },
    rollupConfig: {
      output: {
        sourcemapExcludeSources: false,
      },
    },
  },

  // Client capture stays off until the consent banner opts the visitor in.
  // Preview vs production: optional POSTHOG_PUBLIC_KEY_PREVIEW, plus `environment` super property
  // registered from `app/plugins/analytics.client.ts` after init / opt-in.
  posthogConfig: {
    publicKey: posthogPublicKey,
    host: posthogHost,
    clientConfig: {
      capture_exceptions: true,
      // No events (incl. autocapture / pageviews / replay) until opt_in_capturing().
      opt_out_capturing_by_default: true,
      opt_out_capturing_persistence_type: 'localStorage',
      persistence: 'localStorage+cookie',
      person_profiles: 'identified_only',
      capture_pageview: true,
      capture_pageleave: true,
      // Avoid noisy local/preview sessions even if a key is present.
      disable_session_recording: deployEnvironment !== 'production',
    },
    serverConfig: {
      enableExceptionAutocapture: true,
    },
    sourcemaps: {
      enabled: process.env.POSTHOG_SOURCEMAPS_ENABLED === 'true',
      envId: process.env.POSTHOG_ENV_ID as string,
      personalApiKey: process.env.POSTHOG_PERSONAL_API_KEY as string,
      project: 'portfolio',
    },
  },

  // primevue / @primeuix/themes / @primevue/nuxt-module are pinned to the v4.x / v2.x
  // MIT-licensed lines on purpose: v5 switches to a commercial dual-license
  // (community tier requires annual revenue/headcount recertification). This repo only
  // uses PrimeVue for the Noir theme's CSS tokens below, no components are rendered, so
  // there's no upside to taking on the license. See PR #512 for the full writeup.
  primevue: {
    options: {
      ripple: true,
      theme: {
        preset: Noir,
        // options: {
        //   darkModeSelector: true,
        // },
      },
    },
    components: {
      exclude: ['Form', 'FormField', 'Editor', 'Chart'],
    },
  },

  stylelint: {
    lintOnStart: false,
    exclude: ['coverage'],
  },

  content: {
    database: {
      type: 'sqlite',
      filename: ':memory:',
    },
    build: {
      markdown: {
        highlight: {
          theme: {
            default: 'one-dark-pro',
            dark: 'github-dark',
          },
        },
      },
    },
  },

  // todo: investigate if this still needed
  // @ts-ignore
  purgeCSS: {
    whitelistPatterns: [/svg.*/, /fa.*/],
  },

  compatibilityDate: 'latest',

  sourcemap: {
    client: 'hidden',
  },

  vercel: {
    functions: {
      runtime: 'bun1.x',
    },
  },

  icon: {
    mode: 'css',
    cssLayer: 'base',
    serverBundle: 'remote',
  },
});

// console.log('process.env', process.env);
