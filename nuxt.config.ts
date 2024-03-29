export default defineNuxtConfig({
  devtools: { enabled: true },
  runtimeConfig: {
    public: {
      posthogPublicKey: '',
      posthogHost: ''
    }
  },
  app: {
    head: {
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'format-detection', content: 'telephone=no' },
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
  ],

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
});
