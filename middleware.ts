import { NextRequest, NextResponse } from "next/server";
import { getSessionCookie } from "better-auth/cookies";
import { v4 as uuidv4 } from "uuid";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check for existing cookie
  const sessionCookie = request.cookies.get("guest_session_id");
  
  // Create response object
  const response = NextResponse.next();

  // Set guest session cookie if it doesn't exist
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

  return response;
}

export const config = {
  matcher: [
    "/admin-dashboard/:path*",
  ],
};