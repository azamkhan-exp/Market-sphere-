import { NextRequest } from "next/server";

interface RateLimitStore {
  count: number;
  resetTime: number;
}

const rateLimitMap = new Map<string, RateLimitStore>();

export interface RateLimitOptions {
  windowMs?: number; // Time window in milliseconds (default: 60s)
  max?: number;      // Max allowed requests in window (default: 30)
}

/**
 * In-memory token bucket rate limiter
 * Architecture allows easy substitution with Redis (ioredis / @upstash/ratelimit) in distributed environments
 */
export function rateLimit(
  req: NextRequest,
  keyPrefix = "global",
  options: RateLimitOptions = {}
): { allowed: boolean; remaining: number; reset: number } {
  const windowMs = options.windowMs || 60 * 1000;
  const max = options.max || 30;

  // Derive client identifier from headers or fallback
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0].trim() ||
    req.headers.get("x-real-ip") ||
    "127.0.0.1";

  const key = `${keyPrefix}:${ip}`;
  const now = Date.now();
  const entry = rateLimitMap.get(key);

  // Clean expired or initialize
  if (!entry || now > entry.resetTime) {
    rateLimitMap.set(key, { count: 1, resetTime: now + windowMs });
    return { allowed: true, remaining: max - 1, reset: now + windowMs };
  }

  if (entry.count >= max) {
    return { allowed: false, remaining: 0, reset: entry.resetTime };
  }

  entry.count += 1;
  return { allowed: true, remaining: max - entry.count, reset: entry.resetTime };
}
