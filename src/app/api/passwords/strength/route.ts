//! app/api/passwords/strength/route.ts

import { evaluatePasswordStrength } from "@/lib/passwords/strength";
import { NextRequest, NextResponse } from "next/server";

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
