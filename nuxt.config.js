const fontAwesomeIcons = ['faTimes', 'faAdjust', 'faPaperPlane', 'faFilePdf'];
const fontAwesomeBrandIcons = [
  'faLinkedin',
  'faFacebook',
  'faTwitter',
  'faGithub',
];

export default {
  // Target: https://go.nuxtjs.dev/config-target
  target: 'static',

  // Global page headers: https://go.nuxtjs.dev/config-head
  app: {
    title: 'Jose Chirivella - Software Engineer',
    htmlAttrs: {
      lang: 'en',
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' },
      { name: 'format-detection', content: 'telephone=no' },
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
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
    '@nuxtjs/fontawesome',
    '@nuxtjs/google-analytics',
    // https://go.nuxtjs.dev/axios
    '@nuxtjs/axios',
    // https://go.nuxtjs.dev/content
    '@nuxt/content',
  ],

  // Axios module configuration: https://go.nuxtjs.dev/config-axios
  axios: {},

  // Content module configuration: https://go.nuxtjs.dev/config-content
  content: {},

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {},

  purgeCSS: {
    whitelistPatterns: [/svg.*/, /fa.*/],
  },

  googleAnalytics: {
    id: process.env.GA,
    checkDuplicatedScript: true,
    dev: process.env.BASE_URL !== 'https://jchirivella.com',
  },
};
