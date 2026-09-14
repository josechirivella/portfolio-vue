import { createError } from 'h3';
import { describe, expect, test, vi } from 'vitest';

// server/utils/likes.ts calls createError(), which Nitro auto-imports at build time.
vi.stubGlobal('createError', createError);

const { MAX_LIKES_PER_USER, getLikesSummary, isValidSlug, withDatabaseErrorHandling } =
  await import('../../server/utils/likes');

type Row = Record<string, unknown>;

/**
 * Stands in for the Drizzle query builder. getLikesSummary issues two
 * `.select().from().where()` chains -- the post total first, then the visitor's own row --
 * so hand back one queued result per call, in that order.
 */
function fakeDb(results: Row[][]) {
  const queued = [...results];
  const chain = {
    from: () => chain,
    where: () => Promise.resolve(queued.shift() ?? []),
  };
  return { select: () => chain } as never;
}

describe('MAX_LIKES_PER_USER', () => {
  test('is the 10-like cap the API contract advertises', () => {
    expect(MAX_LIKES_PER_USER).toBe(10);
  });
});

describe('isValidSlug', () => {
  test.each(['who-am-i', 'a', 'post-123', '2026-in-review'])('accepts %s', (slug) => {
    expect(isValidSlug(slug)).toBe(true);
  });

  test.each([
    ['uppercase', 'Who-Am-I'],
    ['underscores', 'who_am_i'],
    ['a leading hyphen', '-leading'],
    ['path traversal', '../../etc/passwd'],
    ['a nested path', 'blog/who-am-i'],
    ['spaces', 'who am i'],
    ['an empty string', ''],
    ['a SQL-ish payload', "x'; DROP TABLE post_likes;--"],
  ])('rejects %s', (_label, slug) => {
    expect(isValidSlug(slug)).toBe(false);
  });

  test('rejects a slug longer than 200 characters', () => {
    expect(isValidSlug('a'.repeat(200))).toBe(true);
    expect(isValidSlug('a'.repeat(201))).toBe(false);
  });

  test.each([[null], [undefined], [42], [{}], [[]]])('rejects the non-string %s', (value) => {
    expect(isValidSlug(value)).toBe(false);
  });
});

describe('getLikesSummary', () => {
  test('reports the post total alongside the visitor’s own count', async () => {
    const db = fakeDb([[{ total: '12' }], [{ likeCount: 3 }]]);

    await expect(getLikesSummary(db, 'who-am-i', 'hash')).resolves.toEqual({
      totalLikes: 12,
      userLikes: 3,
      remainingLikes: 7,
      maxLikes: 10,
    });
  });

  test('reports zeroes for a post nobody has liked', async () => {
    const db = fakeDb([[{ total: null }], []]);

    await expect(getLikesSummary(db, 'brand-new', 'hash')).resolves.toEqual({
      totalLikes: 0,
      userLikes: 0,
      remainingLikes: 10,
      maxLikes: 10,
    });
  });

  test('counts other visitors’ likes in the total but not in the visitor’s own count', async () => {
    const db = fakeDb([[{ total: '40' }], []]);
    const summary = await getLikesSummary(db, 'popular', 'a-visitor-who-has-not-liked');

    expect(summary.totalLikes).toBe(40);
    expect(summary.userLikes).toBe(0);
    expect(summary.remainingLikes).toBe(10);
  });

  test('reports no remaining likes at the cap', async () => {
    const db = fakeDb([[{ total: '10' }], [{ likeCount: 10 }]]);

    await expect(getLikesSummary(db, 'capped', 'hash')).resolves.toMatchObject({
      userLikes: 10,
      remainingLikes: 0,
    });
  });

  test('never reports a negative remaining count, even for over-cap legacy rows', async () => {
    const db = fakeDb([[{ total: '99' }], [{ likeCount: 99 }]]);

    await expect(getLikesSummary(db, 'legacy', 'hash')).resolves.toMatchObject({
      userLikes: 99,
      remainingLikes: 0,
    });
  });
});

describe('withDatabaseErrorHandling', () => {
  test('returns the value when nothing throws', async () => {
    await expect(withDatabaseErrorHandling(async () => 'ok')).resolves.toBe('ok');
  });

  test('converts an unexpected failure into a 503 rather than leaking a 500', async () => {
    await expect(
      withDatabaseErrorHandling(async () => {
        throw new Error('SQLITE_CANTOPEN: unable to open database file');
      }),
    ).rejects.toMatchObject({ statusCode: 503 });
  });

  test('lets a deliberate 409 through untouched', async () => {
    await expect(
      withDatabaseErrorHandling(async () => {
        throw createError({ statusCode: 409, statusMessage: 'At the limit' });
      }),
    ).rejects.toMatchObject({ statusCode: 409, statusMessage: 'At the limit' });
  });

  test('lets a deliberate 400 through untouched', async () => {
    await expect(
      withDatabaseErrorHandling(async () => {
        throw createError({ statusCode: 400, statusMessage: 'Invalid or missing slug.' });
      }),
    ).rejects.toMatchObject({ statusCode: 400 });
  });
});
