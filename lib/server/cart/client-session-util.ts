// lib/client/cart/session-util.ts
// Client-side only - for use in components and hooks

export function getClientGuestSessionId(): string {
  if (typeof window === 'undefined') {
    throw new Error('This function can only be used on the client side');
  }

  let sessionId = localStorage.getItem('guest_session_id');
  
  if (!sessionId) {
    sessionId = crypto.randomUUID();
    localStorage.setItem('guest_session_id', sessionId);
    
    // Also set in cookies for server access
    document.cookie = `guest_session_id=${sessionId}; max-age=${60 * 60 * 24 * 30}; path=/; samesite=lax`;
  }
  
  return sessionId;
}

export function setClientGuestSessionId(sessionId: string): void {
  if (typeof window === 'undefined') {
    throw new Error('This function can only be used on the client side');
  }
  
  localStorage.setItem('guest_session_id', sessionId);
  document.cookie = `guest_session_id=${sessionId}; max-age=${60 * 60 * 24 * 30}; path=/; samesite=lax`;
}

export function clearClientGuestSessionId(): void {
  if (typeof window === 'undefined') {
    throw new Error('This function can only be used on the client side');
  }
  
  localStorage.removeItem('guest_session_id');
  document.cookie = 'guest_session_id=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
}