import { getRequestHeader, getRequestIP, type H3Event } from 'h3';
import { createHmac } from 'node:crypto';

// Dev-only fallback so `bun dev` works before anyone sets an env var. Never rely on this
// in production -- it's a fixed public string, so it provides zero privacy protection.
const DEV_ONLY_SALT = 'dev-only-insecure-salt-do-not-use-in-production';

let warnedMissingSalt = false;

function getSalt(): string {
  const salt = useRuntimeConfig().likesHashSalt;
  if (salt) return salt;

  if (!warnedMissingSalt) {
    console.warn('[likes] LIKES_HASH_SALT is not set; using an insecure dev-only salt. Set it in production.');
    warnedMissingSalt = true;
  }
  return DEV_ONLY_SALT;
}

function stripIpv4MappedPrefix(ip: string): string {
  return ip.startsWith('::ffff:') ? ip.slice('::ffff:'.length) : ip;
}

/**
 * True when a proxy we trust to overwrite forwarding headers sits in front of us.
 * `VERCEL` is set by Vercel's own runtime; `TRUST_PROXY_HEADERS` is the manual opt-in for
 * any other reverse proxy that sanitises these headers.
 */
function isBehindTrustedProxy(): boolean {
  return Boolean(process.env.VERCEL) || process.env.TRUST_PROXY_HEADERS === 'true';
}

function firstForwardedEntry(value: string | undefined): string | undefined {
  return value?.split(',')[0]?.trim() || undefined;
}

function extractIp(event: H3Event): string {
  // Forwarding headers are only trustworthy if a proxy we control set them. Vercel sets
  // VERCEL=1 in its runtime and overwrites these headers at the edge, so they can't be
  // forged there. Anywhere else they're just attacker-supplied strings -- trusting them
  // would let a single visitor mint unlimited identities and farm likes past the cap, so
  // off-platform we use the raw socket address and ignore headers entirely.
  const ip =
    (isBehindTrustedProxy()
      ? (firstForwardedEntry(getRequestHeader(event, 'x-vercel-forwarded-for')) ??
        getRequestHeader(event, 'x-real-ip') ??
        firstForwardedEntry(getRequestHeader(event, 'x-forwarded-for')))
      : undefined) ??
    getRequestIP(event) ??
    'unknown';

  return stripIpv4MappedPrefix(ip);
}

/**
 * Derives an anonymous, non-reversible visitor id from the request IP.
 *
 * Keyed HMAC-SHA256, not a bare sha256(ip): IPv4 space is only 2^32 addresses, so an
 * unsalted hash is trivially reversible by brute force. The secret key makes that
 * infeasible.
 *
 * The hash is deliberately *stable* over time -- no date or other rotating component is
 * folded in. Rotating it daily would be better for privacy, but it would also hand every
 * visitor a fresh MAX_LIKES_PER_USER budget every midnight, which is exactly the
 * spam vector this cap exists to prevent. A visitor's budget is therefore permanent.
 */
export function hashVisitor(event: H3Event): string {
  return createHmac('sha256', getSalt()).update(extractIp(event)).digest('hex').slice(0, 32);
}
