import Aura from '@primevue/themes/aura';
import { definePreset } from '@primeuix/styled';

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
          inverseColor: '#ffffff',
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
          inverseColor: '{zinc.950}',
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

export default defineNuxtConfig({
  css: ['@/assets/main.scss'],

  experimental: {
    viewTransition: true,
  },

  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          api: 'modern',
        },
      },
    },
  },

  devtools: { enabled: true },
  ssr: true,

  runtimeConfig: {
    SENTRY_DSN: process.env.SENTRY_DSN || '',
    public: {
      posthogPublicKey: process.env.POSTHOG_PUBLIC_KEY || '',
      posthogHost: process.env.POSTHOG_HOST || '',
      production: import.meta.env.PROD,
    },
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
          content:
            'The portfolio website for Jose Chirivella. Software Engineer who writes and codes.',
        },
        { name: 'og:title', content: 'Jose Chirivella | Software Engineer' },
        {
          name: 'og:description',
          content:
            'The portfolio website for Jose Chirivella. Software Engineer who writes and codes.',
        },
        {
          name: 'og:image',
          content: '/jchirivella-portrait-flq-resized-700px.png',
        },
        { name: 'og:type', content: 'website' },
        { name: 'og:url', content: 'https://josechirivella.com' },
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
          content:
            'The portfolio website for Jose Chirivella. Software Engineer who writes and codes.',
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
    '@nuxt/eslint',
    '@nuxtjs/stylelint-module',
    '@nuxtjs/tailwindcss',
    '@nuxt/content',
    '@primevue/nuxt-module',
    '@nuxt/icon',
    '@nuxt/image',
    '@sentry/nuxt/module',
  ],

  nitro: {
    prerender: {
      routes: ['/', '/sitemap.xml'],
      crawlLinks: true,
    },
  },

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

  eslint: {
    lintOnStart: false,
  },

  stylelint: {
    lintOnStart: false,
    exclude: ['coverage'],
  },

  content: {
    contentHead: false,
    highlight: {
      theme: {
        default: 'one-dark-pro',
        dark: 'github-dark',
      },
    },
  },

  purgeCSS: {
    whitelistPatterns: [/svg.*/, /fa.*/],
  },

  compatibilityDate: '2025-01-03',

  sentry: {
    sourceMapsUploadOptions: {
      org: 'frustrated-developer',
      project: 'portfolio-vue',
    },

    autoInjectServerSentry: 'top-level-import',
  },

  sourcemap: {
    client: 'hidden',
  },
});
