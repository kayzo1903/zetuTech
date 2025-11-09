import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import { RateLimiterMemory } from "rate-limiter-flexible";

// --- Rate limiter setup ---
// 10 requests per 30 seconds per IP address
const rateLimiter = new RateLimiterMemory({
  points: 10, // number of requests allowed
  duration: 30, // per 30 seconds
});

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const response = NextResponse.next();

  // --- GUEST SESSION HANDLER ---
  const sessionCookie = request.cookies.get("guest_session_id");
  if (!sessionCookie) {
    const sessionId = uuidv4();
    response.cookies.set({
      name: "guest_session_id",
      value: sessionId,
      path: "/",
      httpOnly: true,
      maxAge: 60 * 60 * 24 * 30, // 30 days
    });
  }

  // --- RATE LIMITER for sensitive API routes ---
  const protectedRoutes = ["/api/auth", "/api/orders", "/api/email"];
  const isProtected = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  if (isProtected) {
    const ip = request.headers.get("x-forwarded-for") || "127.0.0.1";

    try {
      await rateLimiter.consume(ip);
    } catch {
      // Too many requests
      return new NextResponse(
        JSON.stringify({ error: "Too many requests. Please slow down." }),
        {
          status: 429,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }
  }

  // Admin protection handled separately in layout.tsx
  return response;
}

// --- Apply middleware globally except for static assets ---
export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|images|icons).*)",
  ],
};
