import { NextRequest, NextResponse } from "next/server";
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

  // Note: Admin protection is enforced in `app/admin-dashboard/layout.tsx` on the server.

  return response;
}

export const config = {
  matcher: [
    "/admin-dashboard/:path*",
  ],
};