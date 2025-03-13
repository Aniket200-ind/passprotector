//! src/app/api/passwords/route.ts

import { NextRequest, NextResponse } from "next/server";
import { encryptAESGCM, decryptAESGCM } from "@/lib/passwords/encryption";
import { prisma } from "@/lib/prisma";
import { PasswordCreateSchema } from "@/lib/validation";
import { hashPassword } from "@/lib/passwords/hash";
import { requireAuth } from "@/lib/authHelper";
import logger from "@/lib/logger";

/**
 *? API route to handle password storage
 *
 ** Ensures authentication before processing the requests.
 ** Encrypts the password using AES-GCM encryption.
 ** Hashes the password using PBKDF2 algorithm for duplicate detection.
 ** Stores the password in the database.
 *
 * @param {NextRequest} req - The incoming request object.
 * @returns {Promise<NextResponse>} - The response object.
 */

export async function POST(req: NextRequest): Promise<NextResponse> {
  const startTime = Date.now(); // Start time for request execution

  try {
    //* ✅ Authenticate the user
    const authResult = await requireAuth();
    if (authResult instanceof NextResponse) return authResult;

    const session = authResult;
    const userEmail = session.user?.email;
    const userId = session.user?.id; //* Assuming `id` is available

    if (!userEmail || !userId) {
      return NextResponse.json(
        { success: false, message: "Unauthorized access" },
        { status: 401 }
      );
    }

    //* ✅ Parse and validate request body
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

    const { siteName, siteUrl, password, category, strength } = parsedData.data;

    //* ✅ Prevent storing weak passwords (Optional but recommended)
    if (strength === "VULNERABLE") {
      return NextResponse.json(
        { success: false, message: "Weak passwords are not allowed!" },
        { status: 400 }
      );
    }

    //* ✅ Hash password for duplicate detection
    const hashedPassword = await hashPassword(password);

    //* ✅ Encrypt password before storing
    const { encryptedText, iv, authTag } = encryptAESGCM(password);

    //* ✅ Combine duplicate check & insert in a single transaction
    const result = await prisma.$transaction(async (tx) => {
      //* Check for duplicate password in the same transaction
      const existingPassword = await tx.password.findFirst({
        where: { userId, hashedPassword },
        select: { id: true },
      });

      if (existingPassword) {
        throw new Error("DUPLICATE_PASSWORD"); //* Trigger a rollback
      }

      //* Store the password
      return await tx.password.create({
        data: {
          userId,
          siteName,
          siteUrl,
          encryptedPassword: encryptedText,
          iv,
          authTag,
          hashedPassword,
          category,
          strength,
        },
        select: { id: true }, //* Return only the necessary field
      });
    });

    //* ✅ Log the request with execution time
    logger.info({
      timeStamp: new Date().toISOString(),
      method: req.method,
      route: "/api/passwords",
      ip:
        req.headers.get("x-real-ip") ||
        req.headers.get("x-forwarded-for") ||
        "unknown",
      status: 201,
      userId,
      executionTime: `${Date.now() - startTime}ms`,
    });

    return NextResponse.json(
      {
        success: true,
        message: "Password stored successfully!",
        passwordId: result.id,
      },
      { status: 201 }
    );
  } catch (error) {
    //* Handle duplicate password case separately
    if (error instanceof Error && error.message === "DUPLICATE_PASSWORD") {
      return NextResponse.json(
        { success: false, message: "Duplicate password detected" },
        { status: 409 }
      );
    }

    logger.error("Error in POST /api/passwords:", error);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

/**
 *? API route to retrieve all passwords for a user.
 ** Ensures authentication before processing the requests.
 *
 * @param {NextRequest} req - The incoming request object.
 * @returns {Promise<NextResponse>} - The response object.
 */

export async function GET(req: NextRequest): Promise<NextResponse> {
  try {
    const startTime = Date.now(); //* Start time for measuring request duration

    //* Use the helper function to check for authentication status
    const authResult = await requireAuth();
    if (authResult instanceof NextResponse) return authResult; //* Return the response if not authenticated

    const session = authResult;

    const userEmail = session.user?.email;
    if (!userEmail) {
      return NextResponse.json(
        { success: false, message: "Unauthorized access: Missing email" },
        { status: 401 }
      );
    }

    const page = Number(req.nextUrl.searchParams.get("page")) || 1;
    const pageSize = 20;
    const skip = (page - 1) * pageSize;

    //* Find the user in the database
    const user = await prisma.user.findUnique({
      where: { email: userEmail },
      select: {
        id: true,
        passwords: {
          select: {
            id: true,
            siteName: true,
            siteUrl: true,
            encryptedPassword: true,
            iv: true,
            authTag: true,
            category: true,
            strength: true,
            createdAt: true,
          },
          orderBy: { createdAt: "desc" }, //* Ensure the latest passwords are returned first
          skip, //* Skip the first n passwords
          take: pageSize, //* Limit the number of passwords returned
        },
      },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    //* Decrypt passwords before sending response
    const decryptPasswords = user.passwords.map((password) => ({
      id: password.id,
      siteName: password.siteName,
      siteUrl: password.siteUrl,
      decryptedPassword: decryptAESGCM({
        encryptedText: password.encryptedPassword,
        iv: password.iv,
        authTag: password.authTag,
      }),
      category: password.category,
      strength: password.strength,
      createdAt: password.createdAt,
    }));

    //* Log the request
    logger.info({
      timeStamp: new Date().toISOString(),
      method: req.method,
      route: "/api/passwords",
      ip:
        req.headers.get("x-real-ip") ||
        req.headers.get("x-forwarded-for") ||
        "unknown",
      status: 200,
      userId: session.user?.id,
      executionTime: `${Date.now() - startTime}ms`,
    });

    return NextResponse.json(
      { success: true, passwords: decryptPasswords },
      { status: 200 }
    );
  } catch (error) {
    logger.error("Error in GET /api/passwords:", error);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
