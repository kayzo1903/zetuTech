// utils/session/cart-session.ts
import { cookies } from 'next/headers';

export async function getGuestSessionId(): Promise<string> {
  const cookieStore = await cookies();
  let sessionId = cookieStore.get('guest_session_id')?.value;

  if (!sessionId) {
    sessionId = crypto.randomUUID();
    // Note: In Next.js App Router, cookies are set in Server Actions or Route Handlers
  }

  return sessionId;
}

export function createGuestSessionId(): string {
  return crypto.randomUUID();
}