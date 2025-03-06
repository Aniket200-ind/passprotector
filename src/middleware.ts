//! src/middleware.ts

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { ratelimit } from "./lib/ratelimitConfig";

/**
 *? Middleware function to handle rate limiting for incoming requests.
 *
 * @param {NextRequest} req - The incoming request object.
 * @returns {Promise<NextResponse>} - The response object, either allowing the request to proceed or indicating rate limit exceeded.
 */
export async function middleware(req: NextRequest) {
  const res = NextResponse.next();

  //* Extract IP address from request headers
  const ip =
    req.headers.get("x-real-ip") ||
    req.headers.get("x-forwarded-for")?.split(",")[0] ||
    "unknown";

  //* Apply rate limiting
  const { success, pending, limit, remaining, reset } = await ratelimit.limit(
    ip
  );

  //* Log rate
  await pending;

  const date = new Date(reset);
  const timeUntilReset = Math.floor((date.getTime() - Date.now()) / 1000);

  //* Log rate limit status
  console.log(`Rate limiter executed in ${req.nextUrl.pathname}`);
  console.log(
    `Max requests: ${limit.toString()}, Remaining: ${remaining.toString()}, Reset: ${timeUntilReset.toString()} seconds`
  );

  //* If the request is over the limit, return a 429 status code
  if (!success) {
    return new NextResponse(
      JSON.stringify({ message: "Rate limit exceeded. Try again later" }),
      { status: 429, headers: { "Content-Type": "application/json" } }
    );
  }

  //! Security headers
  res.headers.set("X-DNS-Prefetch-Control", "off"); //* Disable DNS prefetching for browsers
  res.headers.set("X-Content-Type-Options", "nosniff"); //* Prevent browsers from MIME-sniffing a response away from the declared content-type
  res.headers.set("Referrer-Policy", "no-referrer"); //* Prevent browsers from sending the Referer header with requests initiated by third party websites
  res.headers.set(
    "Permissions-Policy",
    "accelerometer=(), camera=(), geolocation=(), gyroscope=(), magnetometer=(), microphone=(), payment=(), usb=()"
  ); //* Restrict access to certain browser features
  res.headers.set("X-Frame-Options", "DENY"); //* Prevent clickjacking attacks by ensuring that a browser can't render a page in a frame
  res.headers.set("X-XSS-Protection", "1; mode=block"); //* Enable the Cross-site scripting (XSS) filter built into most browsers
  res.headers.set("Cache-Control", "no-store, max-age=0"); //* Prevent caching of sensitive data
  // res.headers.set("Cross-Origin-Opener-Policy", "same-origin"); //* Prevent the browser from opening a page in a different origin
  // res.headers.set("Cross-Origin-Embedder-Policy", "require-corp"); //* Prevent the browser from embedding a page in a different origin
  // res.headers.set("Cross-Origin-Resource-Policy", "same-origin"); //* Prevent the browser from loading resources from a different origin
  res.headers.set("Strict-Transport-Security", "max-age=63072000; includeSubDomains; preload"); //* Enforce the use of HTTPS for 2 years

  return res;
}

export const config = {
  matcher: ["/api/passwords/:path((?!strength).)*"],
};
