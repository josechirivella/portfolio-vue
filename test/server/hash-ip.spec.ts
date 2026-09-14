import type { H3Event } from 'h3';
import { createError } from 'h3';

import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';

// server/utils/hash-ip.ts calls useRuntimeConfig()/createError(), which Nitro auto-imports
// at build time. Outside a Nitro build those globals don't exist, so stub before importing.
const runtimeConfig = { likesHashSalt: 'test-salt' as string | undefined };
vi.stubGlobal('useRuntimeConfig', () => runtimeConfig);
vi.stubGlobal('createError', createError);

const { hashVisitor } = await import('../../server/utils/hash-ip');

/** Minimal stand-in for the parts of an H3Event that h3's IP/header helpers touch. */
function makeEvent(headers: Record<string, string> = {}, remoteAddress?: string): H3Event {
  return {
    context: {},
    node: {
      req: { headers, socket: { remoteAddress } },
    },
  } as unknown as H3Event;
}

describe('hashVisitor', () => {
  beforeEach(() => {
    runtimeConfig.likesHashSalt = 'test-salt';
  });

  test('returns a 32-char hex digest', () => {
    const hash = hashVisitor(makeEvent({}, '203.0.113.7'));

    expect(hash).toMatch(/^[0-9a-f]{32}$/);
  });

  test('never returns the raw IP', () => {
    const ip = '203.0.113.7';

    expect(hashVisitor(makeEvent({}, ip))).not.toContain(ip);
  });

  test('is stable across calls, so a like budget cannot be reset by waiting', () => {
    const first = hashVisitor(makeEvent({}, '203.0.113.7'));
    const second = hashVisitor(makeEvent({}, '203.0.113.7'));

    expect(second).toBe(first);
  });

  test('is stable across a UTC day boundary', () => {
    vi.useFakeTimers();
    try {
      vi.setSystemTime(new Date('2026-08-21T23:59:59Z'));
      const before = hashVisitor(makeEvent({}, '203.0.113.7'));

      vi.setSystemTime(new Date('2026-08-22T00:00:01Z'));
      const after = hashVisitor(makeEvent({}, '203.0.113.7'));

      expect(after).toBe(before);
    } finally {
      vi.useRealTimers();
    }
  });

  test('different IPs produce different hashes', () => {
    expect(hashVisitor(makeEvent({}, '203.0.113.7'))).not.toBe(hashVisitor(makeEvent({}, '203.0.113.8')));
  });

  test('a different salt produces a different hash for the same IP', () => {
    const withFirstSalt = hashVisitor(makeEvent({}, '203.0.113.7'));

    runtimeConfig.likesHashSalt = 'a-completely-different-salt';
    expect(hashVisitor(makeEvent({}, '203.0.113.7'))).not.toBe(withFirstSalt);
  });

  test('falls back to the dev salt without throwing when none is configured off Vercel', () => {
    runtimeConfig.likesHashSalt = undefined;

    expect(hashVisitor(makeEvent({}, '203.0.113.7'))).toMatch(/^[0-9a-f]{32}$/);
  });

  test('fails closed on Vercel when LIKES_HASH_SALT is unset', () => {
    process.env.VERCEL = '1';
    runtimeConfig.likesHashSalt = undefined;

    try {
      expect(() => hashVisitor(makeEvent({}, '203.0.113.7'))).toThrowError(/LIKES_HASH_SALT/);
    } finally {
      delete process.env.VERCEL;
    }
  });

  describe('IP extraction behind a trusted proxy', () => {
    beforeEach(() => {
      process.env.VERCEL = '1';
    });
    afterEach(() => {
      delete process.env.VERCEL;
    });

    test("prefers Vercel's own header over a client-supplied x-forwarded-for", () => {
      const spoofed = makeEvent({
        'x-vercel-forwarded-for': '203.0.113.7',
        'x-forwarded-for': '198.51.100.99',
      });
      const genuine = makeEvent({ 'x-vercel-forwarded-for': '203.0.113.7' });

      expect(hashVisitor(spoofed)).toBe(hashVisitor(genuine));
    });

    test('takes the first entry of a comma-separated forwarded chain', () => {
      const chained = makeEvent({ 'x-vercel-forwarded-for': '203.0.113.7, 70.41.3.18, 150.172.238.178' });
      const direct = makeEvent({ 'x-vercel-forwarded-for': '203.0.113.7' });

      expect(hashVisitor(chained)).toBe(hashVisitor(direct));
    });

    test('treats an IPv4-mapped IPv6 address as the same visitor', () => {
      const mapped = makeEvent({ 'x-vercel-forwarded-for': '::ffff:203.0.113.7' });
      const plain = makeEvent({ 'x-vercel-forwarded-for': '203.0.113.7' });

      expect(hashVisitor(mapped)).toBe(hashVisitor(plain));
    });

    test('falls back to x-real-ip, then x-forwarded-for', () => {
      const direct = makeEvent({ 'x-vercel-forwarded-for': '203.0.113.7' });

      expect(hashVisitor(makeEvent({ 'x-real-ip': '203.0.113.7' }))).toBe(hashVisitor(direct));
      expect(hashVisitor(makeEvent({ 'x-forwarded-for': '203.0.113.7' }))).toBe(hashVisitor(direct));
    });

    test('distinguishes genuinely different forwarded visitors', () => {
      const a = makeEvent({ 'x-vercel-forwarded-for': '203.0.113.7' });
      const b = makeEvent({ 'x-vercel-forwarded-for': '198.51.100.99' });

      expect(hashVisitor(a)).not.toBe(hashVisitor(b));
    });
  });

  describe('IP extraction with no trusted proxy', () => {
    test('ignores forged forwarding headers and uses the socket address', () => {
      // The spam vector: without this, one visitor could mint a fresh 10-like budget per
      // forged header value and farm a post indefinitely.
      const socketAddress = '203.0.113.7';
      const honest = hashVisitor(makeEvent({}, socketAddress));

      for (const forged of ['1.2.3.4', '5.6.7.8', '9.10.11.12']) {
        expect(hashVisitor(makeEvent({ 'x-forwarded-for': forged }, socketAddress))).toBe(honest);
        expect(hashVisitor(makeEvent({ 'x-real-ip': forged }, socketAddress))).toBe(honest);
        expect(hashVisitor(makeEvent({ 'x-vercel-forwarded-for': forged }, socketAddress))).toBe(honest);
      }
    });

    test('still distinguishes genuinely different socket addresses', () => {
      expect(hashVisitor(makeEvent({}, '203.0.113.7'))).not.toBe(hashVisitor(makeEvent({}, '203.0.113.8')));
    });

    test('honours the TRUST_PROXY_HEADERS opt-in for non-Vercel proxies', () => {
      process.env.TRUST_PROXY_HEADERS = 'true';
      try {
        const viaHeader = hashVisitor(makeEvent({ 'x-forwarded-for': '198.51.100.99' }, '203.0.113.7'));
        const socketOnly = hashVisitor(makeEvent({}, '203.0.113.7'));

        expect(viaHeader).not.toBe(socketOnly);
      } finally {
        delete process.env.TRUST_PROXY_HEADERS;
      }
    });

    test('does not throw when no IP can be determined', () => {
      expect(hashVisitor(makeEvent())).toMatch(/^[0-9a-f]{32}$/);
    });
  });
});
