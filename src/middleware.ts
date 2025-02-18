/**
 * Middleware function to handle rate limiting for incoming requests.
 *
 * @param {NextRequest} req - The incoming request object.
 * @returns {Promise<NextResponse>} - The response object, either allowing the request to proceed or indicating rate limit exceeded.
 */
//! src/middleware.ts

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { Redis } from "@upstash/redis";
import { Ratelimit } from "@upstash/ratelimit";

/**
 * Initializes a new Redis client instance using the Upstash Redis REST URL and token
 * from the environment variables.
 *
 * @constant {Redis} redis - The Redis client instance.
 * @property {string} url - The URL for the Upstash Redis REST API, retrieved from the environment variable `UPSTASH_REDIS_REST_URL`.
 * @property {string} token - The token for authenticating with the Upstash Redis REST API, retrieved from the environment variable `UPSTASH_REDIS_REST_TOKEN`.
 */
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

// Initialize rate limiter with sliding window strategy
const ratelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(10, "60s"),
  prefix: "upstash/ratelimit",
  analytics: true,
  timeout: 60000,
});

/**
 * Middleware function to handle rate limiting for incoming requests.
 *
 * @param {NextRequest} req - The incoming request object.
 * @returns {Promise<NextResponse>} - The response object, either allowing the request to proceed or indicating rate limit exceeded.
 */
export async function middleware(req: NextRequest) {
  // Extract IP address from request headers
  const ip =
    req.headers.get("x-real-ip") ||
    req.headers.get("x-forwarded-for")?.split(",")[0] ||
    "unknown";

  // Apply rate limiting
  const { success, pending, limit, remaining, reset } = await ratelimit.limit(
    ip
  );

  // Log rate
  await pending;

  const date = new Date(reset);
  const timeUntilReset = Math.floor((date.getTime() - Date.now()) / 1000);

  // Log rate limit status
  console.log(`Rate limiter executed in ${req.nextUrl.pathname}`);
  console.log(
    `Max requests: ${limit.toString()}, Remaining: ${remaining.toString()}, Reset: ${timeUntilReset.toString()} seconds`
  );

  // If the request is over the limit, return a 429 status code
  if (!success) {
    return new NextResponse(
      JSON.stringify({ message: "Rate limit exceeded. Try again later" }),
      { status: 429, headers: { "Content-Type": "application/json" } }
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/api/passwords/:path((?!strength).)*"],
};
