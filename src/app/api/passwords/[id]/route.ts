import { auth } from "@/auth";
import { decryptAESGCM, encryptAESGCM } from "@/lib/passwords/encryption";
import { hashPassword } from "@/lib/passwords/hash";
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

/**
 * API route to update one or more fields of a password.
 * - Ensures new password is not a duplicate
 * - Encrypts the new password before storing
 * - Updates the password in the database
 * 
 * @param {Object} params - Route parameters (including password ID).
 * @returns {Promise<NextResponse>} - The response object.
 */
export async function PATCH(
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

    // Validate user ownership
    const userEmail = session.user.email;
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

    const existingPassword = await prisma.password.findUnique({
      where: { id: passwordId },
    });

    if (!existingPassword || existingPassword.userId !== user.id) {
      return NextResponse.json(
        { success: false, message: "Password not found or access denied" },
        { status: 404 }
      );
    }

    // Parse and validate request body
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


    // Prepare data for updating
    let updatedData = { ...parsedData.data };

    // If a new password is provided, check for duplicates before encrypting
    if (parsedData.data.password) {

      // Generate hash of the new password
      const hashedPassword = await hashPassword(parsedData.data.password);

      // Check if the hashed password already exists for the user
      const duplicatePassword = await prisma.password.findFirst({
        where: {
          userId: session.user.id,
          hashedPassword,
          id: { not: passwordId },
        }
      })

      if (duplicatePassword) {
        return NextResponse.json(
          {
            success: false,
            message: "Duplicate password detected",
          },
          { status: 409 }
        );
      }

      // Encrypt the new password
      const { encryptedText, iv, authTag } = encryptAESGCM(
        parsedData.data.password
      );

      updatedData = {
        ...updatedData,
        encryptedPassword: encryptedText,
        iv,
        authTag,
        hashedPassword,
      };
    }

    // Remove undefined fields from the update payload
    const filteredData = Object.fromEntries(
      Object.entries(updatedData).filter(([, value]) => value !== undefined)
    );

    // Update password record in the database
    const updatedPassword = await prisma.password.update({
      where: { id: passwordId },
      data: filteredData,
    });

    return NextResponse.json(
      {
        success: true,
        message: "Password updated successfully",
        updatedPassword,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in PATCH /api/passwords/[id]:", error);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}


/**
 * API route to delete a password by ID.
 * @param {Object} params - Route parameters (including password ID).
 * @returns {Promise<NextResponse>} - The response object.
 */
export async function DELETE(
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

    // Find the password record in the database
    const password = await prisma.password.findUnique({
      where: { id: passwordId },
      include: {
        user: true,
      },
    });

    // Check if the password exists
    if (!password) {
      return NextResponse.json(
        { success: false, message: "Password not found" },
        { status: 404 }
      );
    }

    // Ensure the password belongs to the authenticated user
    if (password.user.email !== session.user.email) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Forbidden: You don't have permission to delete this password",
        },
        { status: 403 }
      );
    }

    // Delete the password from the database
    await prisma.password.delete({ where: { id: passwordId } });

    // Return success response
    return NextResponse.json(
      { success: true, message: "Password deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in DELETE /api/passwords/[id]:", error);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}