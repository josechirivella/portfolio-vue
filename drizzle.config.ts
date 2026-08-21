import { defineConfig } from 'drizzle-kit';

// Local dev / `bun run db:generate`: generates SQL against the sqlite dialect, no
// network connection required.
//
// To point this at Turso instead (e.g. to run `drizzle-kit migrate` against prod by
// hand), swap the block below for:
//
//   export default defineConfig({
//     schema: './server/database/schema.ts',
//     out: './server/database/migrations',
//     dialect: 'turso',
//     dbCredentials: {
//       url: process.env.TURSO_DATABASE_URL!,
//       authToken: process.env.TURSO_AUTH_TOKEN,
//     },
//   });
//
// In normal operation this is unnecessary -- server/plugins/likes-migrate.ts applies
// migrations against whichever driver is configured on server boot, including on Vercel.
export default defineConfig({
  schema: './server/database/schema.ts',
  out: './server/database/migrations',
  dialect: 'sqlite',
  dbCredentials: {
    url: './data/portfolio.db',
  },
});
