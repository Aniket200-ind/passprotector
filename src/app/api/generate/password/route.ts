//! src/app/api/generate/password/route.ts
// At the top of src/app/api/passwords/route.ts
export const runtime = "nodejs";

import { generateRandomPassword } from "@/lib/passwords/generator";
import { PasswordGeneratorSchema } from "@/lib/validation/generatorSchema";
import { NextRequest, NextResponse } from "next/server";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { RatelimitResponse } from "@/lib/types/ratelimit";
import { applySecurityHeaders } from "@/lib/middleware/securityHeaders";
import logger from "@/lib/logger";

//* Initialize the Upstash redis client
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

//* Rate limit setup (20 requests per minute per IP)
const ratelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(20, "60s"),
  prefix: "upstash/ratelimit",
  analytics: true,
  timeout: 60000,
});

/**
 *? API route to generate a secure random password.
 *
 * @param {NextRequest} req - The incoming request object.
 * @returns {Promise<NextResponse>} res - The outgoing response object.
 */
export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const startTime = Date.now(); //* Start time for measuring request duration

    // **Rate limit check**
    //* Extract IP address from request headers
    const ip =
      req.headers.get("x-real-ip") ||
      req.headers.get("x-forwarded-for")?.split(",")[0] ||
      "unknown";

    //* Apply rate limiting
    const { success, limit, remaining, reset }: RatelimitResponse =
      await ratelimit.limit(ip);

    const date = new Date(reset);
    const timeUntilReset = Math.floor((date.getTime() - Date.now()) / 1000);

    //* Log rate limit status
    logger.info("Rate limiter executed in /api/generate/password");
    logger.info(
      `Max requests: ${limit.toString()}, Remaining: ${remaining.toString()}, Reset: ${timeUntilReset.toString()} seconds`
    );

    //* If the request is over the limit, return a 429 status code
    if (!success) {
      const res = NextResponse.json(
        { message: "Rate limit exceeded. Try again later" },
        { status: 429 }
      );
      return await applySecurityHeaders(res);
    }

    //* Parse and validate request body
    const body = await req.json();
    const parsedData = PasswordGeneratorSchema.safeParse(body);

    if (!parsedData.success) {
      const res = NextResponse.json(
        {
          success: false,
          message: "Invalid input",
          errors: parsedData.error.format(),
        },
        { status: 400 }
      );
      return await applySecurityHeaders(res);
    }

    //* Ensure at least one character type is selected
    const {
      includeUppercase,
      includeLowercase,
      includeNumbers,
      includeSymbols,
    } = parsedData.data;
    if (
      !includeUppercase &&
      !includeLowercase &&
      !includeNumbers &&
      !includeSymbols
    ) {
      const res = NextResponse.json(
        {
          success: false,
          message: "At least one character type must be selected",
        },
        { status: 400 }
      );
      return await applySecurityHeaders(res);
    }

    //* Generate password
    const password = generateRandomPassword(parsedData.data);

    // **Final response**
    const res = NextResponse.json({ success: true, password }, { status: 200 });

    //* Log request
    logger.info({
      timeStamp: new Date().toISOString(),
      method: req.method,
      route: "/api/generate/password",
      ip,
      status: 200,
      executionTime: `${Date.now() - startTime}ms`,
    });

    return await applySecurityHeaders(res);
  } catch (error) {
    logger.error("[ERROR] Failed to generate password: ", error);

    const res = NextResponse.json(
      { success: false, message: "Internal Sever Error" },
      { status: 500 }
    );
    return await applySecurityHeaders(res);
  }
}
