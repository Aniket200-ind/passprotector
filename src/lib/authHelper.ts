//! app/lib/authHelper.ts

import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { Session } from "next-auth";

/**
 * Checks for a valid session before processing the request.
 * Returns the session object if valid.
 * If not authenticated, returns a NextResponse error response
 *
 * @returns {Promise<Session | NextResponse>} - The session object or NextResponse error response.
 */
export async function requireAuth(): Promise<Session | NextResponse> {
  try {
    const session = await auth();
    if (!session || !session.user?.email) {
      return NextResponse.json(
        { success: false, message: "Unauthorized access. Please sign in!!" },
        { status: 401 }
      );
    }
    return session;
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Internal Server Error", error },
      { status: 500 }
    );
  }
}
