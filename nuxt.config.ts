// https://nuxt.com/docs/api/configuration/nuxt-config
const fontAwesomeIcons = ['faTimes', 'faAdjust', 'faPaperPlane', 'faFilePdf'];
const fontAwesomeBrandIcons = [
  'faLinkedin',
  'faFacebook',
  'faTwitter',
  'faGithub',
];

export default defineNuxtConfig({
  devtools: { enabled: true },
  // components: true,
  app: {
    head: {
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { hid: 'description', name: 'description', content: '' },
        { name: 'format-detection', content: 'telephone=no' },
      ],
    },
  },
  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [],

  fontawesome: {
    icons: {
      solid: [...fontAwesomeIcons],
      brands: [...fontAwesomeBrandIcons],
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
  ],

  // Content module configuration: https://go.nuxtjs.dev/config-content
  content: {},

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {},

  purgeCSS: {
    whitelistPatterns: [/svg.*/, /fa.*/],
  },
});
