import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

// Upstash creds come from the Vercel Upstash/KV integration (KV_REST_API_*),
// or the standard Upstash names. If neither is set (e.g. local dev), limiting
// is disabled and all requests pass.
const url = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
const token = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;

const redis = url && token ? new Redis({ url, token }) : null;

// 5 checkout attempts per minute per IP.
export const checkoutLimiter = redis
  ? new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(5, "1 m"),
      prefix: "rl:checkout",
      analytics: false,
    })
  : null;

// 15 coupon validations per minute per IP (blocks code brute-forcing).
export const couponLimiter = redis
  ? new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(15, "1 m"),
      prefix: "rl:coupon",
      analytics: false,
    })
  : null;

// 10 booking attempts per minute per IP (protects the Google Calendar API).
export const scheduleLimiter = redis
  ? new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(10, "1 m"),
      prefix: "rl:schedule",
      analytics: false,
    })
  : null;

function clientIp(request: Request): string {
  const fwd = request.headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0].trim();
  return request.headers.get("x-real-ip") || "anonymous";
}

// Returns true if the request is allowed, false if it should be rejected (429).
export async function allowRequest(limiter: Ratelimit | null, request: Request): Promise<boolean> {
  if (!limiter) return true;
  try {
    const { success } = await limiter.limit(clientIp(request));
    return success;
  } catch {
    // Fail open: never block a real customer because Redis hiccuped.
    return true;
  }
}
