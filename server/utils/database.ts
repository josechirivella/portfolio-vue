import type { BaseSQLiteDatabase } from 'drizzle-orm/sqlite-core';

import { drizzle as drizzleLibsql } from 'drizzle-orm/libsql';
import { existsSync, mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';

import * as schema from '../database/schema';

// A plain `LibSQLDatabase<S> | …` union breaks overload resolution on chained query
// builder calls (`.select().from().where()`) once you hand it to a function -- TS can't
// merge two differently-parameterized overload sets across a union. Widening
// TResultKind/TRunResult on the *same* BaseSQLiteDatabase class instead gives handlers
// one concrete-enough type to build queries against.
export type AppDatabase = BaseSQLiteDatabase<'sync' | 'async', unknown, typeof schema>;

const LOCAL_DB_PATH = './data/portfolio.db';

// Successful connections only. A null/failed attempt must not stick for the life of the
// isolate — otherwise a single cold-start Turso blip makes every later request 503 until
// the instance is recycled.
let connection: AppDatabase | undefined;
let connecting: Promise<AppDatabase | null> | undefined;

function isVercelRuntime(): boolean {
  return Boolean(process.env.VERCEL);
}

async function connect(): Promise<AppDatabase | null> {
  try {
    const { tursoDatabaseUrl, tursoAuthToken } = useRuntimeConfig();
    if (tursoDatabaseUrl) {
      // Web/HTTP client: no native `@libsql/linux-*` addon. The default `@libsql/client`
      // entry resolves to the Node native driver at Nitro build time, which Vercel's Bun
      // function runtime then fails to link (ResolveMessage → process exit → every /api/*).
      const { createClient } = await import('@libsql/client/web');
      const client = createClient({ url: tursoDatabaseUrl, authToken: tursoAuthToken });
      return drizzleLibsql(client, { schema });
    }

    // Serverless has no durable local disk. Falling back to file: here would either fail
    // oddly or "work" against an ephemeral FS that loses likes per instance.
    if (isVercelRuntime()) {
      console.error('[likes] TURSO_DATABASE_URL is unset on Vercel; likes API will 503.');
      return null;
    }

    // Local `bun dev` fallback: Node libsql driver + file: URL.
    // Dynamic import keeps the native addon out of the Vercel serverless graph when Turso
    // is configured (the common Preview/Production path).
    const { createClient } = await import('@libsql/client/node');
    const absolutePath = resolve(LOCAL_DB_PATH);
    const dir = dirname(absolutePath);
    if (!existsSync(dir)) mkdirSync(dir, { recursive: true });

    const client = createClient({ url: `file:${absolutePath}` });
    return drizzleLibsql(client, { schema });
  } catch (err) {
    console.error('[likes] failed to initialize database:', err);
    return null;
  }
}

/** Lazily-created singleton Drizzle instance. Resolves to null if no DB is configured/reachable. */
export function useDatabase(): Promise<AppDatabase | null> {
  if (connection) return Promise.resolve(connection);
  if (!connecting) {
    connecting = connect().then((db) => {
      connecting = undefined;
      if (db) connection = db;
      return db;
    });
  }
  return connecting;
}
