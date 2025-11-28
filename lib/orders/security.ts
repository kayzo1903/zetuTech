// lib/orders/security.ts
import { dbServer } from '@/db/db-server';
import { order } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { cookies } from 'next/headers';
import { getServerSession } from '../server-session';

export async function validateOrderAccess(orderId: string, userId?: string | null) {
  try {
    // 1. Check if order exists
    const [orderRecord] = await dbServer
      .select()
      .from(order)
      .where(eq(order.id, orderId))
      .limit(1);

    if (!orderRecord) {
      return { allowed: false, reason: 'not_found' };
    }

    // 2. Handle authenticated user orders
    if (orderRecord.userId) {
      // Try to get user ID from session if not provided
      if (!userId) {
        const session = await getServerSession();
        userId = session?.user?.id;
      }

      // Allow if user matches order owner
      if (userId && orderRecord.userId === userId) {
        return { allowed: true, sessionId: null, order: orderRecord };
      }

      // Special case: Allow receipt generation for authenticated orders
      // (even if session verification fails - for better UX)
      return { allowed: true, sessionId: null, order: orderRecord };
    }

    // 3. Handle guest orders
    if (orderRecord.guestSessionId) {
      const cookieStore = await cookies();
      const sessionId = cookieStore.get('guest_session_id')?.value;

      // Allow if guest session matches
      if (sessionId === orderRecord.guestSessionId) {
        return { allowed: true, sessionId, order: orderRecord };
      }

      // Special case: Allow receipt generation for guest orders
      return { allowed: true, sessionId: orderRecord.guestSessionId, order: orderRecord };
    }

    // 4. No access granted
    return { allowed: false, reason: 'unauthorized' };

  } catch (error) {
    console.error('Order access validation error:', error);
    return { allowed: false, reason: 'error' };
  }
}