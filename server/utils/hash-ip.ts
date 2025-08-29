import crypto from 'crypto';
import type { H3Event } from 'h3';

/**
 * Creates a hash from an IP address for anonymous user identification
 * Based on Josh Comeau's approach for privacy-friendly user tracking
 * @param ip - The IP address to hash
 * @returns A hashed string representing the user
 */
export function hashIP(ip: string): string {
  // Normalize IPv6 addresses and handle edge cases
  const normalizedIP = ip.replace(/^::ffff:/, ''); // Remove IPv4-mapped IPv6 prefix

  // Create a hash using SHA-256
  return crypto
    .createHash('sha256')
    .update(normalizedIP)
    .digest('hex')
    .substring(0, 16); // Truncate to 16 characters for storage efficiency
}

/**
 * Extracts and validates IP address from Nitro event
 * @param event - Nitro event object
 * @returns The client IP address or 'unknown' if not found
 */
export function getClientIPFromEvent(event: H3Event): string {
  // Try multiple headers in order of preference
  const ip =
    getRequestIP(event) || // Nitro's built-in helper
    getHeader(event, 'x-forwarded-for') ||
    getHeader(event, 'x-real-ip') ||
    getHeader(event, 'cf-connecting-ip') || // Cloudflare
    event.node?.req?.connection?.remoteAddress ||
    event.node?.req?.socket?.remoteAddress ||
    'unknown';

  // If x-forwarded-for has multiple IPs, take the first one
  if (typeof ip === 'string' && ip.includes(',')) {
    return ip.split(',')[0].trim();
  }

  return typeof ip === 'string' ? ip : 'unknown';
}
