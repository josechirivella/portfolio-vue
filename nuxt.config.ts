import { definePreset } from '@primeuix/styled';
import Aura from '@primeuix/themes/aura';
import { fileURLToPath } from 'node:url';

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

  // Server-only: read directly off process.env in server/utils/database.ts and
  // server/utils/hash-ip.ts (no client-exposed public counterparts needed).
  runtimeConfig: {
    tursoDatabaseUrl: process.env.TURSO_DATABASE_URL,
    tursoAuthToken: process.env.TURSO_AUTH_TOKEN,
    likesHashSalt: process.env.LIKES_HASH_SALT,
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
    // Force Node for serverless functions. vercel.json `bunVersion` keeps *install/build*
    // on Bun, but that same key also makes Nitro default the function runtime to Bun —
    // and Vercel Bun fails to link native/ESM graphs here (ResolveMessage → every /api/*
    // 500, including likes). Node runs @libsql/client/web + Content's node:sqlite fine.
    vercel: {
      functions: {
        runtime: 'nodejs22.x',
      },
    },
    // Inlines the generated .sql into the server build. Nitro only bundles JS, so without
    // this the migration plugin finds no migrations folder on a serverless deploy. The path
    // must be absolute: Nitro resolves a relative dir against its own srcDir (<root>/server),
    // not the project root.
    serverAssets: [
      { baseName: 'migrations', dir: fileURLToPath(new URL('./server/database/migrations', import.meta.url)) },
    ],
    prerender: {
      routes: ['/', '/sitemap.xml'],
      crawlLinks: true,
      // crawlLinks would otherwise bake live like counts into static HTML at build time.
      ignore: ['/api/**'],
    },
    rollupConfig: {
      output: {
        sourcemapExcludeSources: false,
      },
    },
  },

  posthogConfig: {
    publicKey: process.env.POSTHOG_PUBLIC_KEY, // Find it in project settings https://app.posthog.com/settings/project
    clientConfig: {
      capture_exceptions: true, // Enables automatic exception capture on the client side (Vue)
    },
    serverConfig: {
      enableExceptionAutocapture: true, // Enables automatic exception capture on the server side (Nitro)
    },
    sourcemaps: {
      enabled: process.env.POSTHOG_SOURCEMAPS_ENABLED === 'true',
      envId: process.env.POSTHOG_ENV_ID as string, // Your environment ID from PostHog settings https://app.posthog.com/settings/environment#variables
      personalApiKey: process.env.POSTHOG_PERSONAL_API_KEY as string, // Your personal API key from PostHog settings https://app.posthog.com/settings/user-api-keys
      project: 'portfolio', // Optional: defaults to git repository name
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
    // Use Node's built-in `node:sqlite` (works on Node prerender *and* Vercel Bun).
    // Do NOT use better-sqlite3: it is a Node ABI addon that Bun cannot load, and it
    // becomes a static import in the Nitro serverless bundle → ResolveMessage on every
    // /api/* cold start. Do NOT use sqliteConnector: 'bun' either: Nitro's prerender
    // worker is Node and cannot resolve the `bun:` scheme.
    experimental: {
      sqliteConnector: 'native',
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

  icon: {
    mode: 'css',
    cssLayer: 'base',
    serverBundle: 'remote',
  },
});

// console.log('process.env', process.env);
