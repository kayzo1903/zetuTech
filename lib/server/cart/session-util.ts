import { NextRequest } from 'next/server';
import { cookies } from 'next/headers';
import { v4 as uuidv4 } from 'uuid';

export async function getGuestSessionId(request?: NextRequest): Promise<string> {
  if (request) {
    // Server-side: get from cookies
    const cookieStore = cookies();
    let sessionId = (await cookieStore).get('guest_session_id')?.value;
    
    if (!sessionId) {
      sessionId = uuidv4();
      // Setting cookie should be handled in middleware/response
    }
    
    return sessionId;
  } else {
    // Client-side: get from localStorage
    if (typeof window !== 'undefined') {
      let sessionId = localStorage.getItem('guest_session_id');
      if (!sessionId) {
        sessionId = uuidv4();
        localStorage.setItem('guest_session_id', sessionId);
      }
      return sessionId;
    }
    return uuidv4();
  }
}
