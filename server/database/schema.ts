import { sql } from 'drizzle-orm';
import { index, integer, sqliteTable, text, unique } from 'drizzle-orm/sqlite-core';

// One row per (post, visitor). totalLikes for a post is the SUM of like_count across
// all rows for that slug; userLikes is a single row's like_count for the current visitor.
export const postLikes = sqliteTable(
  'post_likes',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),
    postSlug: text('post_slug').notNull(),
    userHash: text('user_hash').notNull(),
    likeCount: integer('like_count').notNull().default(0),
    createdAt: text('created_at')
      .notNull()
      .default(sql`(datetime('now'))`),
    updatedAt: text('updated_at')
      .notNull()
      .default(sql`(datetime('now'))`),
  },
  (table) => [
    // One row per visitor per post so we can cap their like_count at MAX_LIKES_PER_USER.
    unique('unique_user_post').on(table.postSlug, table.userHash),
    // The GET handler sums like_count by slug on every page view.
    index('post_slug_idx').on(table.postSlug),
  ],
);

export type PostLike = typeof postLikes.$inferSelect;
export type NewPostLike = typeof postLikes.$inferInsert;
