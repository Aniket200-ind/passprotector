//! app/api/passwords/strength/route.ts

import { evaluatePasswordStrength } from "@/lib/passwords/strength";
import { NextRequest, NextResponse } from "next/server";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { RatelimitResponse } from "@/lib/types/ratelimit";
import { applySecurityHeaders } from "@/lib/middleware/securityHeaders";
import logger from "@/lib/logger";

// Initialize the Upstash redis client
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

// Rate limit setup (20 requests per minute per IP)
const ratelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(20, "60s"),
  prefix: "upstash/ratelimit",
  analytics: true,
  timeout: 60000,
})

/**
 * API route to analyze password strength.
 *  - Receives a password string from the request body.
 *  - Evaluates it's strength using predefined security checks.
 *  - Returns the strength rating and relevant feedback.
 *
 * @param {NextRequest} req - The incoming request object.
 * @returns {Promise<NextResponse>} - The response object with password strength details.
 */
export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const startTime = Date.now(); // Start time for measuring request duration

    // **Rate limit check**

    // Extract IP address from request headers
    const ip =
      req.headers.get("x-real-ip") ||
      req.headers.get("x-forwarded-for")?.split(",")[0] ||
      "unknown";

      // Apply rate limiting
      const { success, limit, remaining, reset }: RatelimitResponse = await ratelimit.limit(ip);

      const date = new Date(reset);
      const timeUntilReset = Math.floor((date.getTime() - Date.now()) / 1000);

      // Log rate limit status
      logger.info("Rate limiter executed in /api/passwords/strength");
      logger.info(
        `Max requests: ${limit.toString()}, Remaining: ${remaining.toString()}, Reset: ${timeUntilReset.toString()} seconds`
      );

      // If the request is over the limit, return a 429 status code
      if (!success) {
        const res = NextResponse.json(
          { message: "Rate limit exceeded. Try again later" },
          { status: 429 }
        );
        return await applySecurityHeaders(res);
      }


    // **Extract password from request body**
    const { password } = await req.json();

    // **Validate input**
    if (!password || typeof password !== "string" || password.trim() === "") {
      const res = NextResponse.json(
        {
          success: false,
          message: "Invalid input: password must be a non-empty string.",
        },
        {
          status: 400,
        }
      );
      return await applySecurityHeaders(res);
    }

    // **Evaluate password strength**

    const { rating, score } = evaluatePasswordStrength(password);

    // **Return final response**
    const res = NextResponse.json(
      {
        success: true,
        PasswordStrength: rating,
        score: score,
      },
      {
        status: 200,
      }
    );

      logger.info({
        timeStamp: new Date().toISOString(),
        method: req.method,
        route: "/api/passwords/strength",
        ip,
        status: 200,
        executionTime: `${Date.now() - startTime}ms`,
      })

    return await applySecurityHeaders(res);
  } catch (error) {
    logger.error("[ERROR] Failed to analyze password strength:", error);
    const res = NextResponse.json(
      {
        succes: false,
        message: "Internal Server Error",
      },
      {
        status: 500,
      }
    );
    return await applySecurityHeaders(res);
  }
}
