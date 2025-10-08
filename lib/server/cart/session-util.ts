// lib/cart/server/session-util.ts
import { cookies } from 'next/headers';

// Server-side only - for use in API routes
export async function getOrCreateGuestSessionId(): Promise<string> {
  const cookieStore = await cookies();
  let sessionId = cookieStore.get('guest_session_id')?.value;

  if (!sessionId) {
    sessionId = crypto.randomUUID();
    // Set cookie for 30 days
    cookieStore.set('guest_session_id', sessionId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 30, // 30 days
      path: '/',
    });
  }

  return sessionId;
}

// Extract guest session ID from request cookies
export function getGuestSessionIdFromRequest(request: Request): string | null {
  const cookieHeader = request.headers.get('cookie');
  if (!cookieHeader) return null;
  
  const match = cookieHeader.match(/guest_session_id=([^;]+)/);
  return match ? match[1] : null;
}

// Alternative: Get session ID from request with fallback to creating new one
export async function getSessionIdFromRequest(request: Request): Promise<string> {
  const existingSessionId = getGuestSessionIdFromRequest(request);
  if (existingSessionId) {
    return existingSessionId;
  }
  
  return await getOrCreateGuestSessionId();
}