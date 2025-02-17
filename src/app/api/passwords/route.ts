//! app/api/passwords/route.ts

import { NextRequest, NextResponse } from "next/server";
import { encryptAESGCM, decryptAESGCM } from "@/lib/passwords/encryption";
import { prisma } from "@/lib/prisma";
import { PasswordCreateSchema } from "@/lib/validation";
import { hashPassword } from "@/lib/passwords/hash";
import { requireAuth } from "@/lib/authHelper";

/**
 * API route to handle password storage
 *
 * Ensures authentication before processing the requests.
 * Encrypts the password using AES-GCM encryption.
 * Hashes the password using PBKDF2 algorithm for duplicate detection.
 * Stores the password in the database.
 *
 * @param {NextRequest} req - The incoming request object.
 * @returns {Promise<NextResponse>} - The response object.
 */

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    // Use the helper function to check for authentication status
    const authResult = await requireAuth();
    if (authResult instanceof NextResponse) return authResult; // Return the response if not authenticated

    const session = authResult;

    const userEmail = session.user?.email;
    if (!userEmail) {
      return NextResponse.json(
        { success: false, message: "Unauthorized access: Missing email" },
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

    // Validate request body
    if (!siteName || !siteUrl || !password) {
      return NextResponse.json(
        { success: false, message: "Missing required fields" },
        { status: 400 }
      );
    }

    // Hash password using PBKDF2 algorithm (for duplicate detection)
    const hashedPassword = await hashPassword(password);

    // Check if the hashed password already exists in the database for the user
    const existingPassword = await prisma.password.findFirst({
      where: {
        userId: user.id,
        hashedPassword: hashedPassword,
      },
    });

    if (existingPassword) {
      return NextResponse.json(
        { success: false, message: "Duplicate password detected" },
        { status: 409 }
      );
    }

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
        hashedPassword,
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

/**
 * API route to retrieve all passwords for a user.
 * Ensures authentication before processing the requests.
 *
 * @param {NextRequest} req - The incoming request object.
 * @returns {Promise<NextResponse>} - The response object.
 */

export async function GET(): Promise<NextResponse> {
  try {
    // Use the helper function to check for authentication status
    const authResult = await requireAuth();
    if (authResult instanceof NextResponse) return authResult; // Return the response if not authenticated

    const session = authResult;

    const userEmail = session.user?.email;
    if (!userEmail) {
      return NextResponse.json(
        { success: false, message: "Unauthorized access: Missing email" },
        { status: 401 }
      );
    }

    // Find the user in the database
    const user = await prisma.user.findUnique({
      where: { email: userEmail },
      include: { passwords: true },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    // Decrypt passwords before sending response
    const decryptPasswords = user.passwords.map((password) => ({
      id: password.id,
      siteName: password.siteName,
      siteUrl: password.siteUrl,
      decryptedPassword: decryptAESGCM({
        encryptedText: password.encryptedPassword,
        iv: password.iv,
        authTag: password.authTag,
      }),
      hashedPassword: password.hashedPassword,
      category: password.category,
      strength: password.strength,
      createdAt: password.createdAt,
    }));

    return NextResponse.json(
      { success: true, passwords: decryptPasswords },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in GET /api/passwords:", error);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
