//! api/generate/password/route.ts

import { generateRandomPassword } from "@/lib/passwords/generator";
import { PasswordGeneratorSchema } from "@/lib/validation/generatorSchema";
import { NextRequest, NextResponse } from "next/server";

/**
 * API route to generate a secure random password.
 *
 * @param {NextRequest} req - The incoming request object.
 * @returns {Promise<NextResponse>} res - The outgoing response object.
 */
export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    // Parse and validate request body
    const body = await req.json();
    const parsedData = PasswordGeneratorSchema.safeParse(body);

    if (!parsedData.success) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid input",
          errors: parsedData.error.format(),
        },
        { status: 400 }
      );
    }

    // Ensure at least one character type is selected
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
      return NextResponse.json(
        {
          success: false,
          message: "At least one character type must be selected",
        },
        { status: 400 }
      );
    }

    // Generate password
    const password = generateRandomPassword(parsedData.data);

    return NextResponse.json({ success: true, password }, { status: 200 });
  } catch (error) {
    console.error("[ERROR] Failed to generate password: ", error);

    return NextResponse.json(
      { success: false, message: "Internal Sever Error" },
      { status: 500 }
    );
  }
}
