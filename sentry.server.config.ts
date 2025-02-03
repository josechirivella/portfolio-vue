import * as Sentry from '@sentry/nuxt';

if (process.env.SENTRY_DSN) {
  Sentry.init({
    dsn: 'https://4b6d740a23ac182df208104fdaedce13@o4508702962548736.ingest.us.sentry.io/4508702965301248',

    // We recommend adjusting this value in production, or using tracesSampler
    // for finer control
    tracesSampleRate: 1.0,

    // Setting this option to true will print useful information to the console while you're setting up Sentry.
    debug: false,
  });
}
