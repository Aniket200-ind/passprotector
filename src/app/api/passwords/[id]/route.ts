import { auth } from "@/auth";
import { decryptAESGCM, encryptAESGCM } from "@/lib/passwords/encryption";
import { prisma } from "@/lib/prisma";
import { PasswordUpdateSchema } from "@/lib/validation";
import { NextRequest, NextResponse } from "next/server";

/**
 * API route to fetch a specific password by ID.
 * @param {Object} params - Route parameters (including password ID).
 * @returns {Promise<NextResponse>} - The response object.
 */
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  try {
    // Authenticate the user
    const session = await auth();
    if (!session || !session.user?.email) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    // Extract the password ID from route parameters
    const passwordId = (await params).id;
    if (!passwordId) {
      return NextResponse.json(
        { success: false, message: "Password ID is required" },
        { status: 400 }
      );
    }

    // Fund the password record in the database
    const password = await prisma.password.findUnique({
      where: { id: passwordId },
    });

    // If password is not found, return an error
    if (!password) {
      return NextResponse.json(
        { success: false, message: "Password not found" },
        { status: 404 }
      );
    }

    // Ensure the password belongs to the authenticated user
    const userEmail = session.user.email;
    const user = await prisma.user.findUnique({
      where: { email: userEmail },
      include: { passwords: true },
    });

    if (!user || !user.passwords.some((p) => p.id === passwordId)) {
      return NextResponse.json(
        { success: false, message: "Unauthorized access" },
        { status: 403 }
      );
    }

    // Decrypt the password
    const decryptedPassword = decryptAESGCM({
      encryptedText: password.encryptedPassword,
      iv: password.iv,
      authTag: password.authTag,
    });

    // Return the decrypted password along with other details
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
    console.error("Error in GET /api/passwords/[id]:", error);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}


