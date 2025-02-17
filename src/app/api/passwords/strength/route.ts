//! app/api/passwords/strength/route.ts

import { evaluatePasswordStrength } from "@/lib/passwords/strength";
import { NextRequest, NextResponse } from "next/server";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { RatelimitResponse } from "@/lib/types/ratelimit";
import dotenv from "dotenv";

dotenv.config();

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
  timeout: 60,
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
    // **Rate limit check**

    // Extract IP address from request headers
    const ip =
      req.headers.get("x-real-ip") ||
      req.headers.get("x-forwarded-for")?.split(",")[0] ||
      "unknown";

      // Apply rate limiting
      const { success, limit, remaining, reset }: RatelimitResponse = await ratelimit.limit(ip);

      // Log rate limit status
      console.log("Rate limiter executed in /api/passwords/strength");
      console.log(
        `Max requests: ${limit.toString()}, Remaining: ${remaining.toString()}, Reset: ${reset.toString()}`
      );

      // If the request is over the limit, return a 429 status code
      if (!success) {
        return NextResponse.json(
          { message: "Rate limit exceeded. Try again later" },
          { status: 429 }
        );
      }


    // **Extract password from request body**
    const { password } = await req.json();

    // **Validate input**
    if (!password || typeof password !== "string" || password.trim() === "") {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid input: password must be a non-empty string.",
        },
        {
          status: 400,
        }
      );
    }

    // **Evaluate password strength**

    const { rating, score } = evaluatePasswordStrength(password);

    // **Return response**
    return NextResponse.json(
      {
        success: true,
        PasswordStrength: rating,
        score: score,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error("[ERROR] Failed to analyze password strength:", error);
    return NextResponse.json(
      {
        succes: false,
        message: "Internal Server Error",
      },
      {
        status: 500,
      }
    );
  }
}
