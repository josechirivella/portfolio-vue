import { and, eq, sql } from 'drizzle-orm';
import { isError } from 'h3';

import type { AppDatabase } from './database';

import { postLikes } from '../database/schema';

// Josh Comeau-style cap: a visitor may like a single post up to this many times.
export const MAX_LIKES_PER_USER = 10;

// Slugs are only ever blog post routes; rejecting anything else stops arbitrary POSTs
// from seeding junk rows.
const SLUG_PATTERN = /^[a-z0-9][a-z0-9-]{0,199}$/;

export function isValidSlug(slug: unknown): slug is string {
  return typeof slug === 'string' && SLUG_PATTERN.test(slug);
}

export interface LikesSummary {
  totalLikes: number;
  userLikes: number;
  remainingLikes: number;
  maxLikes: number;
}

function toSummary(totalLikes: number, userLikes: number): LikesSummary {
  return {
    totalLikes,
    userLikes,
    // Clamped: pre-existing rows could exceed a lowered cap, and a negative remaining
    // count would render as nonsense in the UI.
    remainingLikes: Math.max(0, MAX_LIKES_PER_USER - userLikes),
    maxLikes: MAX_LIKES_PER_USER,
  };
}

/** Authoritative read: the post's global total plus this visitor's own count. */
export async function getLikesSummary(db: AppDatabase, slug: string, userHash: string): Promise<LikesSummary> {
  const [totalRow] = await db
    .select({ total: sql<string | null>`sum(${postLikes.likeCount})` })
    .from(postLikes)
    .where(eq(postLikes.postSlug, slug));

  const [userRow] = await db
    .select({ likeCount: postLikes.likeCount })
    .from(postLikes)
    .where(and(eq(postLikes.postSlug, slug), eq(postLikes.userHash, userHash)));

  return toSummary(Number(totalRow?.total ?? 0), userRow?.likeCount ?? 0);
}

/**
 * Runs a DB-touching handler body and turns any *unexpected* failure (bad connection,
 * missing table because migrations haven't run yet, etc.) into a 503. Deliberate
 * H3Errors thrown for validation (400) or business rules (409) pass through untouched.
 */
export async function withDatabaseErrorHandling<T>(fn: () => Promise<T>): Promise<T> {
  try {
    return await fn();
  } catch (err) {
    if (isError(err)) throw err;
    console.error('[likes] database operation failed:', err);
    throw createError({ statusCode: 503, statusMessage: 'Likes database is unavailable.' });
  }
}
