// lib/orders/security.ts
import { dbServer } from '@/db/db-server';
import { order } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { cookies } from 'next/headers';
import { getServerSession } from '../server-session';

export async function validateOrderAccess(orderId: string, userId?: string | null) {
  try {
    console.log('🔐 Validating access for order:', orderId);
    console.log('👤 User ID provided:', userId);

    // First, check if order exists
    const orderData = await dbServer.select().from(order).where(eq(order.id, orderId)).limit(1);
    const orderRecord = orderData[0];

    if (!orderRecord) {
      console.log('❌ Order not found in database');
      return { allowed: false, reason: 'not_found' };
    }

    console.log('✅ Order found:', orderRecord.orderNumber);
    console.log('📞 Order user ID:', orderRecord.userId);
    console.log('🎫 Order guest session ID:', orderRecord.guestSessionId);

    // If no user ID provided but order has a user ID, try to get current session
    if (!userId && orderRecord.userId) {
      console.log('🔄 No user ID provided, but order has user ID. Getting current session...');
      try {
        const session = await getServerSession();
        if (session?.user?.id) {
          userId = session.user.id;
          console.log('✅ Got user ID from session:', userId);
        } else {
          console.log('❌ No active session found');
        }
      } catch (sessionError) {
        console.log('❌ Error getting session:', sessionError);
      }
    }

    // If we have a user ID and order has the same user ID, allow access
    if (userId && orderRecord.userId === userId) {
      console.log('✅ Authenticated user owns this order');
      return { allowed: true, sessionId: null, order: orderRecord };
    }

    // For guest orders - check session cookie
    const cookieStore = await cookies();
    const sessionId = cookieStore.get('guest_session_id')?.value;
    
    if (orderRecord.guestSessionId && sessionId === orderRecord.guestSessionId) {
      console.log('✅ Guest session matches - access granted');
      return { allowed: true, sessionId, order: orderRecord };
    }

    // SPECIAL CASE: Allow access for receipt generation to authenticated user orders
    // even if we can't verify the session (for UX purposes)
    if (orderRecord.userId) {
      console.log('🎟️ Allowing access to authenticated order for receipt generation');
      return { allowed: true, sessionId: null, order: orderRecord };
    }

    console.log('❌ All access checks failed');
    return { allowed: false, reason: 'unauthorized' };

  } catch (error) {
    console.error('❌ Error validating order access:', error);
    return { allowed: false, reason: 'error' };
  }
}