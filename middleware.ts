import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";

export async function middleware(request: NextRequest) {
  // Maintenance mode flag - set this to true to enable maintenance mode
  const MAINTENANCE_MODE = process.env.MAINTENANCE_MODE 
  
  // Paths that should be accessible during maintenance (optional)
  const MAINTENANCE_ALLOWED_PATHS = [
    '/maintenance', '/'
  ];

  // Check if maintenance mode is enabled and current path is not allowed
  if (MAINTENANCE_MODE && !MAINTENANCE_ALLOWED_PATHS.includes(request.nextUrl.pathname)) {
    // Redirect to maintenance page
    return NextResponse.redirect(new URL('/maintenance', request.url));
  }

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

  // Note: Admin protection is enforced in `app/admin-dashboard/layout.tsx` on the server.

  return response;
}

export const config = {
  matcher: [
    // Apply to all routes except specific files
    "/((?!_next/static|_next/image|favicon.ico|images|icons).*)",
  ],
};