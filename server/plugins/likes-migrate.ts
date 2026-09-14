import { sql } from 'drizzle-orm';

import { useDatabase } from '../utils/database';

// Migrations are read from Nitro's server assets, not the filesystem. Drizzle's own
// migrator takes a folder path, but Nitro bundles JS and leaves loose .sql files behind,
// so on a serverless deploy (Vercel) that folder simply does not exist and every likes
// endpoint would 503. Registering ./server/database/migrations as a server asset inlines
// the SQL into the build, which keeps the generated .sql files the single source of
// truth while still working everywhere.
const MIGRATIONS_STORAGE = 'assets:migrations';
const BOOKKEEPING_TABLE = '__likes_migrations';

// drizzle-kit separates statements with this marker.
const STATEMENT_BREAKPOINT = '--> statement-breakpoint';

// Applies pending migrations on server boot so the feature works on a fresh clone and on
// a fresh deploy with no manual db:migrate step. Idempotent, and deliberately non-fatal:
// a failure here logs and lets the server boot, so the rest of the site keeps working.
export default defineNitroPlugin(async () => {
  const db = await useDatabase();
  if (!db) return; // no DB configured -- nothing to migrate

  try {
    const storage = useStorage(MIGRATIONS_STORAGE);

    // drizzle-kit prefixes files with a zero-padded sequence (0000_, 0001_, ...), so a
    // lexicographic sort is the intended apply order.
    const names = (await storage.getKeys()).filter((key) => key.endsWith('.sql')).sort();

    if (!names.length) {
      console.warn('[likes] no migrations found in server assets; skipping.');
      return;
    }

    await db.run(
      sql.raw(`CREATE TABLE IF NOT EXISTS ${BOOKKEEPING_TABLE} (
        name text PRIMARY KEY,
        applied_at text NOT NULL DEFAULT (datetime('now'))
      )`),
    );

    for (const name of names) {
      const applied = await db.get<{ name: string } | undefined>(
        sql.raw(`SELECT name FROM ${BOOKKEEPING_TABLE} WHERE name = '${name.replace(/'/g, "''")}'`),
      );
      if (applied) continue;

      const contents = await storage.getItem<string>(name);
      if (typeof contents !== 'string') {
        console.error(`[likes] migration ${name} could not be read; skipping.`);
        continue;
      }

      for (const statement of contents.split(STATEMENT_BREAKPOINT)) {
        const trimmed = statement.trim();
        if (trimmed) await db.run(sql.raw(trimmed));
      }

      await db.run(sql.raw(`INSERT INTO ${BOOKKEEPING_TABLE} (name) VALUES ('${name.replace(/'/g, "''")}')`));
      console.log(`[likes] applied migration ${name}`);
    }
  } catch (err) {
    console.error('[likes] failed to apply database migrations:', err);
  }
});
