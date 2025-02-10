// src/app/api/passwords/route.ts

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { encryptAESGCM, decryptAESGCM } from "@/lib/passwords/encryption";
import { prisma } from "@/lib/prisma";
import { PasswordCreateSchema } from "@/lib/validation";

/**
 * API route to handle password storage
 * Ensures authentication before processing the requests.
 *
 * @param {NextRequest} req - The incoming request object.
 * @returns {Promise<NextResponse>} - The response object.
 */

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    // Authenticate the user
    const session = await auth();
    if (!session || !session.user?.email) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    // Parse and validate the request body
    const body = await req.json();
    const parsedData = PasswordCreateSchema.safeParse(body);

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

    // Find the user in the database
    const userEmail = session.user.email;
    const user = await prisma.user.findUnique({
      where: { email: userEmail },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    // Encrypt the password
    const { siteName, siteUrl, password, category, strength } = parsedData.data;
    const { encryptedText, iv, authTag } = encryptAESGCM(password);

    // Store the password in the database
    const savedPassword = await prisma.password.create({
      data: {
        userId: user.id, // Foreign key linking to the User model
        siteName,
        siteUrl,
        encryptedPassword: encryptedText,
        iv,
        authTag,
        category: category,
        strength: strength,
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Password stored successfully!",
        passwordId: savedPassword.id,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error in POST /api/passwords:", error);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
