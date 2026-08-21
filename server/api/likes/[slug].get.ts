import { useDatabase } from '../../utils/database';
import { hashVisitor } from '../../utils/hash-ip';
import { getLikesSummary, isValidSlug, withDatabaseErrorHandling } from '../../utils/likes';

export default defineEventHandler(async (event) => {
  const slug = getRouterParam(event, 'slug');
  if (!isValidSlug(slug)) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid or missing slug.' });
  }

  return withDatabaseErrorHandling(async () => {
    const db = await useDatabase();
    if (!db) {
      throw createError({ statusCode: 503, statusMessage: 'Likes database is unavailable.' });
    }

    return getLikesSummary(db, slug, hashVisitor(event));
  });
});
