import { NextRequest, NextResponse } from "next/server";
import { getSessionCookie } from "better-auth/cookies";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if the route is an admin route
  if (pathname.startsWith("/admin-dashboard")) {
    try {
      // Get the session from the request
      const sessionCookie = getSessionCookie(request);

      // Check if user is authenticated and has admin role
      if (!sessionCookie) {
        // Redirect to home page if not admin
        return NextResponse.redirect(new URL("/", request.url));
      }
    } catch (error) {
      // If there's an error getting the session, redirect to home
      console.error("Middleware auth error:", error);
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin-dashboard/:path*",
  ],
};
