//! src/lib/middleware/securityHeaders.ts

import { NextResponse } from "next/server";

/**
 * ? Sets security headers for API routes responses.
 *
 * @param {NextRequest} response - The response object.
 * @returns {Promise<NextResponse>} - The response object with security headers applied.
 */
export async function applySecurityHeaders(
  response: NextResponse
): Promise<NextResponse> {
  response.headers.set("Strict-Transport-Security", "max-age=63072000; includeSubDomains; preload"); //* Enforce HTTPS for 2 years
  response.headers.set("X-DNS-Prefetch-Control", "off"); //* Disable DNS prefetching for browsers
  response.headers.set("X-Content-Type-Options", "nosniff"); //* Prevent browsers from MIME-sniffing a response away from the declared content-type
  response.headers.set("Referrer-Policy", "no-referrer"); //* Prevent browsers from sending the referrer header to origin
  response.headers.set(
    "Permissions-Policy",
    "accelerometer=(), camera=(), geolocation=(), gyroscope=(), magnetometer=(), microphone=(), payment=(), usb=()"
  ); //* Define a policy for browser permissions
  response.headers.set("X-Frame-Options", "DENY"); //* Prevent clickjacking attacks
  response.headers.set("X-XSS-Protection", "1; mode=block"); //* Enable XSS protection
  response.headers.set("Cache-Control", "no-store, max-age=0"); //* Prevent caching of sensitive data
  // response.headers.set("Cross-Origin-Opener-Policy", "same-origin"); //* Prevent the browser from opening a page in a different origin
  // response.headers.set("Cross-Origin-Embedder-Policy", "require-corp"); //* Prevent embedding of a page in a different origin
  // response.headers.set("Cross-Origin-Resource-Policy", "same-origin"); //* Prevent loading resources from a different origin

    // CORS
    const allowedOrigins = new Set([
      "https://www.passprotector.in",
      "https://passprotector.in",
    ]);
    const origin = response.headers.get("x-request-origin") || ""; // will be set by middleware below
  
    const allowOrigin = allowedOrigins.has(origin) ? origin : "https://www.passprotector.in";
    response.headers.set("Access-Control-Allow-Origin", allowOrigin);
    response.headers.set("Vary", "Origin");
    response.headers.set("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
    response.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
    response.headers.set("Access-Control-Allow-Credentials", "true");

  return response;
}
