//! api/generate/passphrase/route.ts

import { generatePassphrase } from "@/lib/passwords/generator";
import { PassphraseGeneratorSchema } from "@/lib/validation/generatorSchema";
import { NextRequest, NextResponse } from "next/server";
import { applySecurityHeaders } from "@/lib/middleware/securityHeaders";
/**
 * @param {NextRequest} req - The incoming request object.
 * @returns {Promise<NextResponse>} res - The outgoing response object.
 */
export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    // Parse request body
    const body = await req.json();
    const parsedData = PassphraseGeneratorSchema.safeParse(body);

    // Validate request body
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

    // Validate word count
    if (wordCount < 6 || wordCount > 8) {
      const res = NextResponse.json(
        {
          success: false,
          message: "[ERROR] Invalid word count. Must be between 6 and 8.",
        },
        { status: 400 }
      );
      return await applySecurityHeaders(res);
    }

    // Generate passphrase
    const passphrase = await generatePassphrase(
      wordCount,
      includeNumbers,
      includeSymbols,
      separator
    );

    // **Return final response**
    const res = NextResponse.json({ success: true, passphrase }, { status: 200 });
    return await applySecurityHeaders(res);
  } catch (error) {
    console.log("[ERROR] Failed to generate passphrase: ", error);

    const res = NextResponse.json(
      { succes: false, message: "Internal Server Error" },
      { status: 500 }
    );
    return await applySecurityHeaders(res);
  }
}
