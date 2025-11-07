import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import { globalRateLimit, authRateLimit, orderRateLimit } from "@/lib/rate-limit";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Get client IP
  const ip = getClientIP(request);
  
  // Create response object
  const response = NextResponse.next();

  // Set guest session cookie if it doesn't exist
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

  // ========== GLOBAL RATE LIMITING ==========
  
  // Apply different rate limits based on route patterns
  if (pathname.startsWith('/api/auth/')) {
    // Authentication endpoints - stricter limits
    const rateLimitResult = authRateLimit.check(10, ip); // 10 requests per 15 minutes
    
    if (rateLimitResult.isRateLimited) {
      console.warn(`🔐 Auth rate limit exceeded for IP: ${ip}`);
      return new NextResponse(
        JSON.stringify({
          success: false,
          error: 'Too many authentication attempts. Please try again later.',
        }),
        {
          status: 429,
          headers: {
            'Content-Type': 'application/json',
            ...rateLimitResult.headers,
          },
        }
      );
    }
    
    // Add rate limit headers to successful auth requests
    Object.entries(rateLimitResult.headers).forEach(([key, value]) => {
      response.headers.set(key, value);
    });
  }
  else if (pathname.startsWith('/api/orders/')) {
    // Order endpoints - moderate limits
    const rateLimitResult = orderRateLimit.check(5, ip); // 5 orders per minute
    
    if (rateLimitResult.isRateLimited) {
      console.warn(`🛒 Order rate limit exceeded for IP: ${ip}`);
      return new NextResponse(
        JSON.stringify({
          success: false,
          error: 'Too many order attempts. Please try again in a minute.',
        }),
        {
          status: 429,
          headers: {
            'Content-Type': 'application/json',
            ...rateLimitResult.headers,
          },
        }
      );
    }
    
    Object.entries(rateLimitResult.headers).forEach(([key, value]) => {
      response.headers.set(key, value);
    });
  }
  else if (pathname.startsWith('/api/')) {
    // General API endpoints - more lenient limits
    const rateLimitResult = globalRateLimit.check(60, ip); // 60 requests per minute
    
    if (rateLimitResult.isRateLimited) {
      console.warn(`🌐 Global rate limit exceeded for IP: ${ip}`);
      return new NextResponse(
        JSON.stringify({
          success: false,
          error: 'Too many requests. Please slow down.',
        }),
        {
          status: 429,
          headers: {
            'Content-Type': 'application/json',
            ...rateLimitResult.headers,
          },
        }
      );
    }
    
    Object.entries(rateLimitResult.headers).forEach(([key, value]) => {
      response.headers.set(key, value);
    });
  }

  // Note: Admin protection is enforced in `app/admin-dashboard/layout.tsx` on the server.

  return response;
}

// Helper function to get client IP
function getClientIP(request: NextRequest): string {
  let ip = request.headers.get('x-forwarded-for');
  
  if (!ip) {
    const forwardedFor = request.headers.get('x-forwarded-for');
    if (forwardedFor) {
      ip = forwardedFor.split(',')[0].trim();
    }
  }
  
  // Fallback to a unique identifier for the request
  return ip || request.headers.get('user-agent') || 'anonymous';
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};