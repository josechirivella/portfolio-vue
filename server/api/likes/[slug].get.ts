import { and, eq, sum } from 'drizzle-orm';
import { postLikes } from '../../database/schema';
import { getClientIPFromEvent, hashIP } from '~~/server/utils/hash-ip';
import { getDatabase } from '~~/server/utils/database';

export default defineEventHandler(async (event) => {
  const slug = getRouterParam(event, 'slug');

  if (!slug) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Post slug is required',
    });
  }

  try {
    const db = getDatabase();
    const clientIP = getClientIPFromEvent(event);
    const userHash = hashIP(clientIP);

    // Get total likes for the post
    const totalLikesResult = await db
      .select({
        totalLikes: sum(postLikes.likeCount),
      })
      .from(postLikes)
      .where(eq(postLikes.postSlug, slug));

    const totalLikes = Number(totalLikesResult[0]?.totalLikes) || 0;

    // Get current user's likes
    const userLikesResult = await db
      .select({
        likeCount: postLikes.likeCount,
      })
      .from(postLikes)
      .where(
        and(eq(postLikes.postSlug, slug), eq(postLikes.userHash, userHash)),
      )
      .limit(1);

    const userLikes = userLikesResult[0]?.likeCount || 0;
    const remainingLikes = Math.max(0, 10 - userLikes);

    return {
      totalLikes,
      userLikes,
      remainingLikes,
      canLike: remainingLikes > 0,
    };
  } catch (error: unknown) {
    if (error && typeof error === 'object' && 'statusCode' in error) {
      throw error;
    }

    console.error('Unexpected error fetching likes:', error);
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal server error',
    });
  }
});
