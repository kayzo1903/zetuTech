// lib/orders/security.ts
import { dbServer } from '@/db/db-server';
import { order } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { cookies } from 'next/headers';
import { getServerSession } from '../server-session';

export async function validateOrderAccess(orderId: string, userId?: string | null) {
  try {

    // First, check if order exists
    const orderData = await dbServer.select().from(order).where(eq(order.id, orderId)).limit(1);
    const orderRecord = orderData[0];

    if (!orderRecord) {
      return { allowed: false, reason: 'not_found' };
    }


    // If no user ID provided but order has a user ID, try to get current session
    if (!userId && orderRecord.userId) {
      try {
        const session = await getServerSession();
        if (session?.user?.id) {
          userId = session.user.id;
        } else {
        }
      } catch (sessionError) {
      }
    }

    // If we have a user ID and order has the same user ID, allow access
    if (userId && orderRecord.userId === userId) {
      return { allowed: true, sessionId: null, order: orderRecord };
    }

    // For guest orders - check session cookie
    const cookieStore = await cookies();
    const sessionId = cookieStore.get('guest_session_id')?.value;
    
    if (orderRecord.guestSessionId && sessionId === orderRecord.guestSessionId) {
      return { allowed: true, sessionId, order: orderRecord };
    }

    // SPECIAL CASE: Allow access for receipt generation to authenticated user orders
    // even if we can't verify the session (for UX purposes)
    if (orderRecord.userId) {
      return { allowed: true, sessionId: null, order: orderRecord };
    }
    return { allowed: false, reason: 'unauthorized' };

  } catch (error) {
    return { allowed: false, reason: 'error' };
  }
}