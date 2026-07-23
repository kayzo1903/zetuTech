// middleware.ts
import { NextRequest, NextResponse } from "next/server";
import { RateLimiterMemory } from "rate-limiter-flexible";
import { getMaintenanceFlag } from "./lib/maintananceFlag";

const rateLimiter = new RateLimiterMemory({
  points: 10,
  duration: 30,
});

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip static assets & maintenance page
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/images") ||
    pathname.startsWith("/icons") ||
    pathname === "/favicon.ico" ||
    pathname === "/api/admin" ||
    pathname === "/admin-dashboard" ||
    pathname === "/admin-dashboard/settings" ||
    pathname.startsWith("/api/admin/businessInfo") ||
    pathname.startsWith("/auth") ||
    pathname.startsWith("/api/auth") ||
    pathname === "/api/messages/submit" ||
    pathname === "/contact" ||
    pathname === "/support" ||
    pathname === "/about" ||
    pathname === "/services" ||
    pathname === "/maintenance"
  ) {
    return NextResponse.next();
  }

  // --- Maintenance mode (cached for 5 min) ---
  const maintenance = await getMaintenanceFlag();

  if (maintenance) {
    const maintenanceUrl = new URL("/maintenance", request.url);
    return NextResponse.redirect(maintenanceUrl);
  }

  // --- Normal behavior ---
  const response = NextResponse.next();

  // Rate limiting for sensitive routes
  const protectedRoutes = [
    "/api/auth",
    "/api/email",
    "api/messages/",
  ];
  const isProtected = protectedRoutes.some((r) => pathname.startsWith(r));

  if (isProtected) {
    const ip = request.headers.get("x-forwarded-for") || "127.0.0.1";
    try {
      await rateLimiter.consume(ip);
    } catch {
      return new NextResponse(
        JSON.stringify({ error: "Too many requests. Please slow down." }),
        { status: 429, headers: { "Content-Type": "application/json" } }
      );
    }
  }

  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|images|icons).*)"],
};
