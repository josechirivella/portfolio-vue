import type { BaseSQLiteDatabase } from 'drizzle-orm/sqlite-core';

import { createClient } from '@libsql/client';
import { drizzle as drizzleLibsql } from 'drizzle-orm/libsql';
import { existsSync, mkdirSync } from 'node:fs';
import { dirname } from 'node:path';

import * as schema from '../database/schema';

// A plain `LibSQLDatabase<S> | BetterSQLite3Database<S>` union breaks overload
// resolution on chained query builder calls (`.select().from().where()`) once you hand
// it to a function -- TS can't merge two differently-parameterized overload sets across
// a union. Widening TResultKind/TRunResult on the *same* BaseSQLiteDatabase class instead
// gives handlers one concrete-enough type to build queries against.
export type AppDatabase = BaseSQLiteDatabase<'sync' | 'async', unknown, typeof schema>;

const LOCAL_DB_PATH = './data/portfolio.db';

// undefined = not yet attempted, null = attempted and unavailable (env missing / connect failed).
// The in-flight promise is cached too, so concurrent first requests share one connection.
let connection: Promise<AppDatabase | null> | undefined;

async function connect(): Promise<AppDatabase | null> {
  try {
    const { tursoDatabaseUrl, tursoAuthToken } = useRuntimeConfig();
    if (tursoDatabaseUrl) {
      const client = createClient({ url: tursoDatabaseUrl, authToken: tursoAuthToken });
      return drizzleLibsql(client, { schema });
    }

    // Local dev fallback: a file-backed sqlite db, no Turso account required.
    //
    // better-sqlite3 is imported dynamically rather than at the top of this module on
    // purpose. It's a native addon, and a static import would load it on every cold start
    // in production -- where Turso is configured and this branch never runs -- turning an
    // unused 5MB binary into a live failure mode under the bun function runtime. Nitro
    // still traces a dynamic import, so the local path keeps working from a built output.
    const { default: Database } = await import('better-sqlite3');

    const dir = dirname(LOCAL_DB_PATH);
    if (!existsSync(dir)) mkdirSync(dir, { recursive: true });

    const sqlite = new Database(LOCAL_DB_PATH);
    sqlite.pragma('journal_mode = WAL');
    sqlite.pragma('foreign_keys = ON');

    const { drizzle: drizzleBetterSqlite3 } = await import('drizzle-orm/better-sqlite3');
    return drizzleBetterSqlite3(sqlite, { schema });
  } catch (err) {
    console.error('[likes] failed to initialize database:', err);
    return null;
  }
}

/** Lazily-created singleton Drizzle instance. Resolves to null if no DB is configured/reachable. */
export function useDatabase(): Promise<AppDatabase | null> {
  connection ??= connect();
  return connection;
}
