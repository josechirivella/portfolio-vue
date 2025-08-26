import { integer, sqliteTable, text, unique } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';

export const postLikes = sqliteTable(
  'post_likes',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),
    postSlug: text('post_slug').notNull(),
    userHash: text('user_hash').notNull(),
    likeCount: integer('like_count').default(0).notNull(),
    createdAt: text('created_at')
      .default(sql`(datetime('now'))`)
      .notNull(),
    updatedAt: text('updated_at')
      .default(sql`(datetime('now'))`)
      .notNull(),
  },
  (table) => ({
    uniqueUserPost: unique('unique_user_post').on(
      table.postSlug,
      table.userHash,
    ),
  }),
);

export type PostLike = typeof postLikes.$inferSelect;
export type NewPostLike = typeof postLikes.$inferInsert;
