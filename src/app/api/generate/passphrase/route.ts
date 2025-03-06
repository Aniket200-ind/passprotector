//! src/app/api/generate/passphrase/route.ts
// At the top of src/app/api/passwords/route.ts
export const runtime = "nodejs";

import { generatePassphrase } from "@/lib/passwords/generator";
import { PassphraseGeneratorSchema } from "@/lib/validation/generatorSchema";
import { NextRequest, NextResponse } from "next/server";
import { applySecurityHeaders } from "@/lib/middleware/securityHeaders";
import logger from "@/lib/logger";

/**
 * @param {NextRequest} req - The incoming request object.
 * @returns {Promise<NextResponse>} res - The outgoing response object.
 */
export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const startTime = Date.now(); //* Start time for measuring request duration

    //* Parse request body
    const body = await req.json();
    const parsedData = PassphraseGeneratorSchema.safeParse(body);

    //* Validate request body
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

    const { wordCount, includeNumbers, includeSymbols, separator } =
      parsedData.data;

    //* Validate word count
    if (wordCount < 4 || wordCount > 12) {
      const res = NextResponse.json(
        {
          success: false,
          message: "[ERROR] Invalid word count. Must be between 4 and 12.",
        },
        { status: 400 }
      );
      return await applySecurityHeaders(res);
    }

    //* Generate passphrase
    const passphrase = await generatePassphrase(
      wordCount,
      includeNumbers,
      includeSymbols,
      separator
    );

    // **Return final response**
    const res = NextResponse.json(
      { success: true, passphrase },
      { status: 200 }
    );

    //* Log request
    logger.info({
      timestamp: new Date().toISOString(),
      method: req.method,
      route: "/api/generate/passphrase",
      ip:
        req.headers.get("x-real-ip") ||
        req.headers.get("x-forwaded-for")?.split(",")[0] ||
        "unknown",
      status: 200,
      responseTime: `${Date.now() - startTime}ms`,
    });

    return await applySecurityHeaders(res);
  } catch (error) {
    logger.error("[ERROR] Failed to generate passphrase: ", error);

    const res = NextResponse.json(
      { succes: false, message: "Internal Server Error" },
      { status: 500 }
    );
    return await applySecurityHeaders(res);
  }
}
