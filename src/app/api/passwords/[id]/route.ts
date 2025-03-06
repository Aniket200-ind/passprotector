//! src/app/api/passwords/[id]/route.ts

import { requireAuth } from "@/lib/authHelper";
import logger from "@/lib/logger";
import { decryptAESGCM, encryptAESGCM } from "@/lib/passwords/encryption";
import { hashPassword } from "@/lib/passwords/hash";
import { prisma } from "@/lib/prisma";
import { PasswordUpdateSchema } from "@/lib/validation";
import { NextRequest, NextResponse } from "next/server";

/**
 *? API route to fetch a specific password by ID.
 * @param {Object} params - Route parameters (including password ID).
 * @returns {Promise<NextResponse>} - The response object.
 */
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  try {
    const startTime = Date.now(); //* Start time for measuring request duration

    //* Use the helper function to check for authentication status
    const authResult = await requireAuth();
    if (authResult instanceof NextResponse) return authResult; //* Return the response if not authenticated

    const session = authResult;

    //* Extract the password ID from route parameters
    const passwordId = (await params).id;
    if (!passwordId) {
      return NextResponse.json(
        { success: false, message: "Password ID is required" },
        { status: 400 }
      );
    }

    //* Ensure the password belongs to the authenticated user
    const userEmail = session.user?.email;
    if (!userEmail) {
      return NextResponse.json(
        { success: false, message: "Unauthorized access: Missing email" },
        { status: 401 }
      );
    }
    const password = await prisma.password.findUnique({
      where: {
        id: passwordId,
        user: { email: userEmail }, //* Ensures only the owner's password is retrieved
      },
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
    });

    //* Check if password exists
    if (!password) {
      return NextResponse.json(
        { success: false, message: "Password not found or unauthorized" },
        { status: 404 }
      );
    }

    //* Decrypt the password
    const decryptedPassword = decryptAESGCM({
      encryptedText: password.encryptedPassword,
      iv: password.iv,
      authTag: password.authTag,
    });

    //* Log the request details
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

    //* Return the decrypted password along with other details
    return NextResponse.json(
      {
        success: true,
        password: {
          id: password.id,
          siteName: password.siteName,
          siteUrl: password.siteUrl,
          decryptedPassword,
          category: password.category,
          strength: password.strength,
          createdAt: password.createdAt,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    logger.error("Error in GET /api/passwords/[id]:", error);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

/**
 *? API route to update one or more fields of a password.
 ** - Ensures new password is not a duplicate
 ** - Encrypts the new password before storing
 ** - Updates the password in the database
 *
 * @param {Object} params - Route parameters (including password ID).
 * @returns {Promise<NextResponse>} - The response object.
 */
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  try {
    const startTime = Date.now(); //* Start time for measuring request duration

    //* Authenticate user
    const authResult = await requireAuth();
    if (authResult instanceof NextResponse) return authResult; //* Return if not authenticated

    const session = authResult;
    const sessionUserId = session.user?.id;

    if (!sessionUserId) {
      return NextResponse.json(
        { success: false, message: "Unauthorized: Missing user ID" },
        { status: 401 }
      );
    }

    //* Extract password ID from params
    const passwordId = (await params).id;
    if (!passwordId) {
      return NextResponse.json(
        { success: false, message: "Password ID is required" },
        { status: 400 }
      );
    }

    //* Find the password directly with its userId (reducing unnecessary queries)
    const existingPassword = await prisma.password.findUnique({
      where: { id: passwordId },
      select: { userId: true, hashedPassword: true }, //* Only fetch necessary fields
    });

    if (!existingPassword || existingPassword.userId !== sessionUserId) {
      return NextResponse.json(
        { success: false, message: "Password not found or access denied" },
        { status: 404 }
      );
    }

    //* Parse and validate request body
    const body = await req.json();
    const parsedData = PasswordUpdateSchema.safeParse(body);
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

    if (Object.keys(parsedData.data).length === 0) {
      return NextResponse.json(
        { success: false, message: "No fields to update" },
        { status: 400 }
      );
    }

    let updatedData = { ...parsedData.data };

    //* If a new password is provided, check for duplicates and encrypt
    if (parsedData.data.password) {
      const hashedPassword = await hashPassword(parsedData.data.password);

      //* Check if the new password (hashed) already exists for this user
      const duplicatePassword = await prisma.password.findFirst({
        where: { userId: sessionUserId, hashedPassword },
        select: { id: true }, //* Only fetch ID to minimize data transfer
      });

      if (duplicatePassword) {
        return NextResponse.json(
          { success: false, message: "Duplicate password detected" },
          { status: 409 }
        );
      }

      //* Encrypt the new password
      const { encryptedText, iv, authTag } = encryptAESGCM(
        parsedData.data.password
      );

      //* Prepare update data
      const { password, ...safeData } = parsedData.data;
      //* Use the password variable to avoid unused variable warning
      if (password) {
        //* Do nothing, just to use the variable
      }
      updatedData = {
        ...safeData,
        encryptedPassword: encryptedText,
        iv,
        authTag,
        hashedPassword,
      };
    }

    //* Remove undefined values early
    const filteredData = Object.fromEntries(
      Object.entries(updatedData).filter(([, v]) => v !== undefined)
    );

    //* Update password in database
    const updatedPassword = await prisma.password.update({
      where: { id: passwordId },
      data: filteredData,
    });

    let decryptedPassword: string | null = null;

    try {
      decryptedPassword = decryptAESGCM({
        iv: updatedPassword.iv,
        authTag: updatedPassword.authTag,
        encryptedText: updatedPassword.encryptedPassword,
      });
    } catch (error) {
      logger.error("Decryption failed in PATCH /api/passwords/[id]:", error);
      decryptedPassword = null; //* Set null to avoid exposing corrupted data
    }

    //* Log the request details
    logger.info({
      timeStamp: new Date().toISOString(),
      method: req.method,
      route: `/api/passwords/${passwordId}`,
      ip:
        req.headers.get("x-real-ip") ||
        req.headers.get("x-forwarded-for") ||
        "unknown",
      status: 200,
      userId: sessionUserId,
      executionTime: `${Date.now() - startTime}ms`,
    });

    const refinedResponseData = {
      id: updatedPassword.id,
      userId: updatedPassword.userId,
      siteName: updatedPassword.siteName,
      siteUrl: updatedPassword.siteUrl,
      password: decryptedPassword,
      category: updatedPassword.category,
      strength: updatedPassword.strength,
      createdAt: updatedPassword.createdAt,
    };

    return NextResponse.json(
      {
        success: true,
        message: "Password updated successfully",
        refinedResponseData,
      },
      { status: 200 }
    );
  } catch (error) {
    logger.error("Error in PATCH /api/passwords/[id]:", error);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

/**
 *? API route to delete a password by ID.
 * @param {Object} params - Route parameters (including password ID).
 * @returns {Promise<NextResponse>} - The response object.
 */
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  try {
    const startTime = Date.now(); //* Start request time

    //* Authenticate user
    const authResult = await requireAuth();
    if (authResult instanceof NextResponse) return authResult;

    const session = authResult;
    const userId = session.user?.id;

    if (!userId) {
      return NextResponse.json(
        { success: false, message: "Unauthorized access: Missing user ID" },
        { status: 401 }
      );
    }

    //* Extract password ID from params
    const passwordId = (await params).id;
    if (!passwordId) {
      return NextResponse.json(
        { success: false, message: "Password ID is required" },
        { status: 400 }
      );
    }

    //* Check if password exists and belongs to user
    const passwordExists = await prisma.password.count({
      where: { id: passwordId, userId },
    });

    if (!passwordExists) {
      return NextResponse.json(
        { success: false, message: "Password not found or access denied" },
        { status: 404 }
      );
    }

    //* Delete the password
    await prisma.password.delete({ where: { id: passwordId } });

    //* Log request
    logger.info({
      timeStamp: new Date().toISOString(),
      method: req.method,
      route: "/api/passwords/[id]",
      ip:
        req.headers.get("x-real-ip") ||
        req.headers.get("x-forwarded-for") ||
        "unknown",
      status: 200,
      userId,
      executionTime: `${Date.now() - startTime}ms`,
    });

    return NextResponse.json(
      { success: true, message: "Password deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    logger.error("Error in DELETE /api/passwords/[id]:", error);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
