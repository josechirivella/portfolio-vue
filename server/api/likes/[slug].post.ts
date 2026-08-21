import { and, eq, sql } from 'drizzle-orm';

import { postLikes } from '../../database/schema';
import { useDatabase } from '../../utils/database';
import { hashVisitor } from '../../utils/hash-ip';
import { getLikesSummary, isValidSlug, MAX_LIKES_PER_USER, withDatabaseErrorHandling } from '../../utils/likes';

type LikeAction = 'add' | 'remove';

function isLikeAction(value: unknown): value is LikeAction {
  return value === 'add' || value === 'remove';
}

export default defineEventHandler(async (event) => {
  const slug = getRouterParam(event, 'slug');
  if (!isValidSlug(slug)) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid or missing slug.' });
  }

  const body = await readBody(event).catch(() => null);
  const action = (body as { action?: unknown } | null)?.action;
  if (!isLikeAction(action)) {
    throw createError({ statusCode: 400, statusMessage: 'Body must be { "action": "add" | "remove" }.' });
  }

  return withDatabaseErrorHandling(async () => {
    const db = await useDatabase();
    if (!db) {
      throw createError({ statusCode: 503, statusMessage: 'Likes database is unavailable.' });
    }

    const userHash = hashVisitor(event);

    const [existing] = await db
      .select({ likeCount: postLikes.likeCount })
      .from(postLikes)
      .where(and(eq(postLikes.postSlug, slug), eq(postLikes.userHash, userHash)));
    const currentUserLikes = existing?.likeCount ?? 0;

    // Best-effort pre-check for a clear 409 message. The min()/max() SQL expressions
    // below are the real guard against exceeding the cap under concurrent requests --
    // SQLite serializes writes, so each clamp always sees the latest committed value.
    if (action === 'add' && currentUserLikes >= MAX_LIKES_PER_USER) {
      throw createError({
        statusCode: 409,
        statusMessage: `You've already liked this post the maximum of ${MAX_LIKES_PER_USER} times.`,
      });
    }
    if (action === 'remove' && currentUserLikes <= 0) {
      throw createError({ statusCode: 409, statusMessage: "You haven't liked this post yet." });
    }

    if (action === 'add') {
      await db
        .insert(postLikes)
        .values({ postSlug: slug, userHash, likeCount: 1 })
        .onConflictDoUpdate({
          target: [postLikes.postSlug, postLikes.userHash],
          set: {
            likeCount: sql`min(${postLikes.likeCount} + 1, ${MAX_LIKES_PER_USER})`,
            updatedAt: sql`(datetime('now'))`,
          },
        });
    } else {
      // A row is guaranteed to exist here (currentUserLikes > 0 above), so a plain
      // update is enough -- no need for an upsert on the remove path.
      await db
        .update(postLikes)
        .set({ likeCount: sql`max(${postLikes.likeCount} - 1, 0)`, updatedAt: sql`(datetime('now'))` })
        .where(and(eq(postLikes.postSlug, slug), eq(postLikes.userHash, userHash)));
    }

    return getLikesSummary(db, slug, userHash);
  });
});
