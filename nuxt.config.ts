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
  devtools: { enabled: true },

  ssr: true,

  runtimeConfig: {
    public: {
      posthogPublicKey: process.env.POSTHOG_PUBLIC_KEY || '',
      posthogHost: process.env.POSTHOG_HOST || '',
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
          content: 'The portfolio website for Jose Chirivella',
        },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'format-detection', content: 'telephone=no' },
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

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    // https://go.nuxtjs.dev/eslint
    '@nuxtjs/eslint-module',
    // https://go.nuxtjs.dev/stylelint
    '@nuxtjs/stylelint-module',
    // https://go.nuxtjs.dev/tailwindcss
    '@nuxtjs/tailwindcss',
    // https://go.nuxtjs.dev/content
    '@nuxt/content',
    'nuxt-icon',
    '@primevue/nuxt-module',
  ],

  primevue: {
    options: {
      ripple: true,
      theme: {
        preset: Noir,
        options: {
          darkModeSelector: 'system',
        },
      },
    },
  },

  eslint: {
    lintOnStart: false,
  },

  stylelint: {
    lintOnStart: false,
    exclude: ['coverage'],
  },

  // Content module configuration: https://go.nuxtjs.dev/config-content
  content: {},

  purgeCSS: {
    whitelistPatterns: [/svg.*/, /fa.*/],
  },

  compatibilityDate: '2024-08-24',
});
