//! src/lib/ratelimitConfig.ts

import { Redis } from "@upstash/redis";
import { Ratelimit } from "@upstash/ratelimit";

//* Initialize Redis client
export const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

//* Initialize Ratelimit
export const ratelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(20, "60s"),
  prefix: "upstash/ratelimit",
  analytics: true,
  timeout: 60000,
});