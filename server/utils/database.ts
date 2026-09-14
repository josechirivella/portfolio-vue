import type { BaseSQLiteDatabase } from 'drizzle-orm/sqlite-core';

import { createClient } from '@libsql/client';
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

    // Local fallback: same @libsql/client driver with a file: URL.
    //
    // Do NOT import better-sqlite3 — Nitro traces it into the Vercel Bun (`bun1.x`)
    // serverless bundle as a static import, and Bun cannot load that Node ABI addon
    // (ResolveMessage → process exit → every /api/* 500). Do NOT import bun:sqlite
    // either — Nitro's prerender worker is Node and rejects the `bun:` scheme.
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
  connection ??= connect();
  return connection;
}
